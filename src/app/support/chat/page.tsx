'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Banner, Button, Card, Empty, Spinner, TextArea } from '@/components/ui';
import { markThreadRead, sendStaffMessage, setThreadStatus } from '@/lib/actions';
import { useLiveTable, useNow } from '@/lib/db';
import { useSession } from '@/lib/session';
import { useSpa } from '@/lib/spa';
import type { ChatMessage, ChatThread } from '@/lib/types';
import { LIVE_STATUSES } from '@/lib/types';
import { sinceLabel } from '@/lib/wait';

const QUICK_REPLIES = [
  'You’re all set — see you soon!',
  'That room is open right now, come on in.',
  'Give us about 20 minutes and we’ll have a bed free.',
  'Yes, you can stack those back to back. I’ll note it on your spot.',
];

export default function SupportChatPage() {
  const { staff } = useSession();
  const { memberById, waitlist, serviceById } = useSpa();
  const now = useNow(20_000);
  const { rows: threads, loading } = useLiveTable<ChatThread>('rms_chat_threads', {
    order: { column: 'last_message_at', ascending: false },
  });
  const { rows: messages } = useLiveTable<ChatMessage>('rms_chat_messages', {
    order: { column: 'created_at' },
  });

  const [openId, setOpenId] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => threads.filter((t) => showClosed || t.status === 'open'),
    [threads, showClosed],
  );

  // Default to the most recent conversation rather than an empty pane.
  const activeId = openId ?? visible[0]?.id ?? null;
  const active = threads.find((t) => t.id === activeId) ?? null;
  const thread = useMemo(
    () => (active ? messages.filter((m) => m.thread_id === active.id) : []),
    [messages, active],
  );

  useEffect(() => {
    if (active && active.unread_staff > 0) void markThreadRead(active.id, 'staff');
  }, [active]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [thread]);

  async function send(body: string) {
    if (!active || !staff || !body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await sendStaffMessage({ threadId: active.id, staffId: staff.id, staffName: staff.full_name, body });
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Message failed to send.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Spinner label="Loading the inbox" />;

  const activeMember = active ? memberById(active.member_id) : undefined;
  const memberSpots = active
    ? waitlist.filter((e) => e.member_id === active.member_id && LIVE_STATUSES.includes(e.status))
    : [];

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">Member chat</h2>
          <button
            onClick={() => setShowClosed(!showClosed)}
            className="text-[11px] text-faint hover:text-muted"
          >
            {showClosed ? 'Hide closed' : 'Show closed'}
          </button>
        </div>

        {visible.length === 0 ? (
          <Empty title="Inbox is clear" body="Member questions land here in real time." />
        ) : (
          <ul className="space-y-1.5">
            {visible.map((t) => {
              const member = memberById(t.member_id);
              const last = messages.filter((m) => m.thread_id === t.id).at(-1);
              const selected = t.id === activeId;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setOpenId(t.id)}
                    className={`w-full rounded-xl border px-3.5 py-3 text-left transition-colors ${
                      selected
                        ? 'border-accent/40 bg-accent-wash/40'
                        : 'border-line bg-surface hover:border-faint'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold tracking-tight">
                        {member?.full_name ?? 'Member'}
                      </p>
                      {t.unread_staff > 0 ? <Badge tone="accent">{t.unread_staff}</Badge> : null}
                    </div>
                    <p className="truncate text-[11px] text-faint">{t.subject}</p>
                    {last ? (
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">{last.body}</p>
                    ) : null}
                    <p className="mt-1 text-[10px] text-faint">
                      {sinceLabel(t.last_message_at, now)}
                      {t.status === 'closed' ? ' · closed' : ''}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {!active ? (
        <Empty title="Pick a conversation" body="Select a member on the left to read and reply." />
      ) : (
        <Card className="flex min-h-[70vh] flex-col overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-soft px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                {activeMember?.full_name ?? 'Member'}
              </p>
              <p className="truncate text-[11px] text-faint">
                {active.subject}
                {activeMember ? ` · ${activeMember.tier} · ${activeMember.phone ?? 'no phone'}` : ''}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {memberSpots.map((e) => (
                <Badge key={e.id} tone="info">
                  {serviceById(e.service_id)?.name}
                </Badge>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void setThreadStatus(active.id, active.status === 'open' ? 'closed' : 'open')}
              >
                {active.status === 'open' ? 'Close thread' : 'Reopen'}
              </Button>
            </div>
          </div>

          <div className="grow space-y-2.5 overflow-y-auto px-4 py-4">
            {thread.map((m) => {
              const isStaff = m.sender_role === 'staff';
              return (
                <div key={m.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isStaff ? 'text-right' : ''}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        isStaff
                          ? 'rounded-br-md bg-accent text-ink'
                          : 'rounded-bl-md border border-line bg-surface-2 text-text'
                      }`}
                    >
                      {m.body}
                    </div>
                    <p className="mt-1 px-1 text-[10px] text-faint">
                      {m.sender_name} · {sinceLabel(m.created_at, now)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <div className="space-y-2 border-t border-line-soft px-4 py-3">
            {error ? <Banner tone="alert">{error}</Banner> : null}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  disabled={busy}
                  onClick={() => void send(q)}
                  className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <TextArea
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Reply to ${activeMember?.full_name.split(' ')[0] ?? 'member'}…`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send(draft);
                  }
                }}
              />
              <Button
                variant="primary"
                disabled={busy || !draft.trim()}
                onClick={() => void send(draft)}
                className="shrink-0"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
