'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Banner, Button, Card, Empty, Label, SectionTitle, TextArea, TextInput } from '@/components/ui';
import { markThreadRead, sendMemberMessage } from '@/lib/actions';
import { useLiveTable, useNow } from '@/lib/db';
import { useSession } from '@/lib/session';
import type { ChatMessage, ChatThread } from '@/lib/types';
import { sinceLabel } from '@/lib/wait';

export default function AskPage() {
  const { member } = useSession();
  const now = useNow(20_000);
  const { rows: threads } = useLiveTable<ChatThread>('rms_chat_threads', {
    order: { column: 'last_message_at', ascending: false },
  });
  const { rows: messages } = useLiveTable<ChatMessage>('rms_chat_messages', {
    order: { column: 'created_at' },
  });

  const memberId = member?.id;
  const mine = useMemo(() => threads.filter((t) => t.member_id === memberId), [threads, memberId]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

  // With a single conversation there is nothing to choose from, so open it.
  const activeId = openId ?? (mine.length === 1 ? mine[0].id : null);
  const active = mine.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    if (active && active.unread_member > 0) void markThreadRead(active.id, 'member');
  }, [active]);

  if (composing || (mine.length === 0 && !active)) {
    return (
      <NewQuestion
        onCancel={mine.length > 0 ? () => setComposing(false) : undefined}
        onSent={(id) => {
          setComposing(false);
          setOpenId(id);
        }}
      />
    );
  }

  if (!active) {
    return (
      <div className="space-y-4">
        <SectionTitle
          title="Your conversations"
          action={
            <Button size="sm" variant="primary" onClick={() => setComposing(true)}>
              New question
            </Button>
          }
        />
        <ul className="space-y-2">
          {mine.map((t) => {
            const last = messages.filter((m) => m.thread_id === t.id).at(-1);
            return (
              <li key={t.id}>
                <button
                  onClick={() => setOpenId(t.id)}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-faint"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-semibold tracking-tight">{t.subject}</p>
                    {t.unread_member > 0 ? <Badge tone="accent">{t.unread_member} new</Badge> : null}
                  </div>
                  {last ? (
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
                      {last.sender_role === 'staff' ? `${last.sender_name}: ` : ''}
                      {last.body}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-[11px] text-faint">{sinceLabel(t.last_message_at, now)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <Thread
      thread={active}
      messages={messages.filter((m) => m.thread_id === active.id)}
      onBack={mine.length > 1 ? () => setOpenId(null) : undefined}
      onNew={() => {
        setOpenId(null);
        setComposing(true);
      }}
    />
  );
}

function Thread({
  thread,
  messages,
  onBack,
  onNew,
}: {
  thread: ChatThread;
  messages: ChatMessage[];
  onBack?: () => void;
  onNew: () => void;
}) {
  const { member } = useSession();
  const now = useNow(20_000);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  async function send() {
    if (!member || !draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await sendMemberMessage({ member, threadId: thread.id, subject: thread.subject, body: draft });
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Message failed to send.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-13rem)] flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {onBack ? (
            <button onClick={onBack} className="mb-1 text-[11px] text-faint hover:text-muted">
              ← All conversations
            </button>
          ) : null}
          <h2 className="truncate text-[15px] font-semibold tracking-tight">{thread.subject}</h2>
          <p className="text-[11px] text-faint">
            {thread.status === 'closed' ? 'Closed by the front desk' : 'Front desk usually replies in a few minutes'}
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={onNew}>
          New
        </Button>
      </div>

      <div className="grow space-y-2.5 pb-3">
        {messages.map((m) => {
          const isMe = m.sender_role === 'member';
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${isMe ? 'text-right' : ''}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    isMe
                      ? 'rounded-br-md bg-accent text-ink'
                      : m.sender_role === 'system'
                        ? 'rounded-bl-md border border-line bg-surface-2 text-muted'
                        : 'rounded-bl-md border border-line bg-surface text-text'
                  }`}
                >
                  {m.body}
                </div>
                <p className="mt-1 px-1 text-[10px] text-faint">
                  {isMe ? 'You' : m.sender_name} · {sinceLabel(m.created_at, now)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {error ? <Banner tone="alert">{error}</Banner> : null}

      <div className="sticky bottom-24 flex items-end gap-2">
        <TextArea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message to the front desk…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <Button variant="primary" disabled={busy || !draft.trim()} onClick={send} className="shrink-0">
          {busy ? '…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}

function NewQuestion({ onCancel, onSent }: { onCancel?: () => void; onSent: (threadId: string) => void }) {
  const { member } = useSession();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!member || !body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const id = await sendMemberMessage({ member, threadId: null, subject, body });
      onSent(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Message failed to send.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Empty
        title="Ask the front desk anything"
        body="Your message goes to whoever is at the desk right now, and their reply lands back in this tab."
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-8">
            <path
              d="M20 12.5c0 3.9-3.6 7-8 7-.9 0-1.8-.1-2.6-.4L4.5 21l1.2-3.4A6.7 6.7 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z"
              strokeLinecap="round"
            />
          </svg>
        }
      />

      <Card className="space-y-3 p-4">
        <label className="block">
          <Label hint="optional">Subject</Label>
          <TextInput
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Question for the front desk"
          />
        </label>
        <label className="block">
          <Label>Your question</Label>
          <TextArea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Is the salt room open today? Can I stack cryo after red light?"
          />
        </label>
        {error ? <Banner tone="alert">{error}</Banner> : null}
        <div className="flex gap-2">
          <Button variant="primary" block disabled={busy || !body.trim()} onClick={send}>
            {busy ? 'Sending…' : 'Send to front desk'}
          </Button>
          {onCancel ? (
            <Button variant="ghost" onClick={onCancel} disabled={busy}>
              Cancel
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
