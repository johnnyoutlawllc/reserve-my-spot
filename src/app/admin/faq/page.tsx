'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Banner,
  Button,
  Card,
  Label,
  Modal,
  SectionTitle,
  Select,
  Spinner,
  Stat,
  TextArea,
  TextInput,
  Toggle,
} from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import type { Faq } from '@/lib/types';

const DEFAULT_CATEGORIES = ['General', 'Waitlist', 'Location', 'Hours', 'Services', 'Membership'];

type Draft = {
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
};

export default function AdminFaqPage() {
  const { rows, loading } = useLiveTable<Faq>('rms_faqs', { order: { column: 'sort_order' } });
  const [editing, setEditing] = useState<Faq | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = useMemo(() => {
    const found = new Set([...DEFAULT_CATEGORIES, ...rows.map((r) => r.category)]);
    return [...found];
  }, [rows]);

  const visible = filter === 'all' ? rows : rows.filter((r) => r.category === filter);

  async function patch(faq: Faq, changes: Partial<Faq>) {
    setError(null);
    const { error: err } = await supabase.from('rms_faqs').update(changes).eq('id', faq.id);
    if (err) setError(err.message);
  }

  if (loading) return <Spinner label="Loading FAQ" />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Entries" value={rows.length} />
        <Stat label="Published" value={rows.filter((r) => r.is_published).length} hint="visible to members" />
        <Stat label="Categories" value={new Set(rows.map((r) => r.category)).size} />
      </div>

      <SectionTitle
        title="FAQ management"
        hint="Publishing is instant; the member app has no cache to bust"
        action={
          <Button variant="primary" size="sm" onClick={() => setEditing('new')}>
            Add entry
          </Button>
        }
      />

      {error ? <Banner tone="alert">{error}</Banner> : null}

      <div className="flex flex-wrap gap-1.5">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
              filter === c
                ? 'border-accent/40 bg-accent-wash text-accent'
                : 'border-line bg-surface text-muted hover:border-faint'
            }`}
          >
            {c}
            {c !== 'all' ? (
              <span className="ml-1.5 text-faint">{rows.filter((r) => r.category === c).length}</span>
            ) : null}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {visible.map((f) => (
          <li key={f.id}>
            <Card className={`p-4 ${f.is_published ? '' : 'border-line-soft opacity-70'}`}>
              <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                <div className="min-w-60 grow">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="info">{f.category}</Badge>
                    <Badge>order {f.sort_order}</Badge>
                    {!f.is_published ? <Badge tone="alert">draft</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-snug tracking-tight">{f.question}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">{f.answer}</p>
                </div>

                <div className="w-48">
                  <Toggle
                    checked={f.is_published}
                    onChange={(next) => patch(f, { is_published: next })}
                    label={f.is_published ? 'Published' : 'Draft'}
                  />
                </div>

                <Button size="sm" onClick={() => setEditing(f)}>
                  Edit
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <FaqModal
        target={editing}
        categories={categories}
        nextOrder={(rows.at(-1)?.sort_order ?? 0) + 10}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}

function FaqModal({
  target,
  categories,
  nextOrder,
  onClose,
}: {
  target: Faq | 'new' | null;
  categories: string[];
  nextOrder: number;
  onClose: () => void;
}) {
  const faq = target && target !== 'new' ? target : null;
  const blank: Draft = {
    question: '',
    answer: '',
    category: 'General',
    sort_order: nextOrder,
    is_published: true,
  };
  const [draft, setDraft] = useState<Draft>(blank);
  const [seededFor, setSeededFor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = faq?.id ?? (target === 'new' ? 'new' : null);
  if (key && key !== seededFor) {
    setSeededFor(key);
    setDraft(
      faq
        ? {
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            sort_order: faq.sort_order,
            is_published: faq.is_published,
          }
        : blank,
    );
    setError(null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    const { error: err } = faq
      ? await supabase.from('rms_faqs').update(draft).eq('id', faq.id)
      : await supabase.from('rms_faqs').insert(draft);
    setBusy(false);
    if (err) setError(err.message);
    else onClose();
  }

  async function remove() {
    if (!faq) return;
    setBusy(true);
    const { error: err } = await supabase.from('rms_faqs').delete().eq('id', faq.id);
    setBusy(false);
    if (err) setError(err.message);
    else onClose();
  }

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title={faq ? 'Edit FAQ entry' : 'Add FAQ entry'}
      footer={
        <>
          {faq ? (
            <Button variant="ghost" onClick={remove} disabled={busy} className="mr-auto text-alert">
              Delete
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={save}
            disabled={busy || !draft.question.trim() || !draft.answer.trim()}
          >
            {busy ? 'Saving…' : faq ? 'Save changes' : 'Add entry'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <label className="block">
          <Label>Question</Label>
          <TextInput
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            placeholder="How far ahead can I request a spot?"
          />
        </label>

        <label className="block">
          <Label hint="written for members">Answer</Label>
          <TextArea
            rows={5}
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            placeholder="Requests open a set number of minutes before you plan to arrive…"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Label>Category</Label>
            <Select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <Label hint="lower shows first">Order</Label>
            <TextInput
              type="number"
              value={String(draft.sort_order)}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </label>
        </div>

        <Toggle
          checked={draft.is_published}
          onChange={(next) => setDraft({ ...draft, is_published: next })}
          label="Published to members"
          hint="Drafts stay here until you're happy with the wording."
        />

        {error ? <Banner tone="alert">{error}</Banner> : null}
      </div>
    </Modal>
  );
}
