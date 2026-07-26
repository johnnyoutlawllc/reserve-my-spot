'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, Empty, SectionTitle, Spinner, TextInput } from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import type { Faq } from '@/lib/types';

export default function FaqPage() {
  const { rows, loading } = useLiveTable<Faq>('rms_faqs', { order: { column: 'sort_order' } });
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const published = rows.filter(
      (f) =>
        f.is_published &&
        (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)),
    );
    const byCategory = new Map<string, Faq[]>();
    for (const f of published) {
      const list = byCategory.get(f.category) ?? [];
      list.push(f);
      byCategory.set(f.category, list);
    }
    return [...byCategory.entries()];
  }, [rows, query]);

  if (loading) return <Spinner label="Loading answers" />;

  return (
    <div className="space-y-5">
      <div>
        <SectionTitle title="Questions & answers" hint="Managed by the spa, updates show up here instantly" />
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the FAQ…"
          type="search"
        />
      </div>

      {groups.length === 0 ? (
        <Empty
          title="Nothing matches that"
          body="Try a different word, or send the front desk a question on the Ask tab."
        />
      ) : (
        groups.map(([category, items]) => (
          <section key={category}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">{category}</h3>
            <Card className="divide-y divide-line-soft overflow-hidden">
              {items.map((f) => {
                const isOpen = open === f.id;
                return (
                  <div key={f.id}>
                    <button
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="text-[13px] font-medium leading-snug">{f.question}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                        className={`mt-0.5 size-4 shrink-0 text-faint transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9.5l6 6 6-6" strokeLinecap="round" />
                      </svg>
                    </button>
                    {isOpen ? (
                      <p className="rms-rise px-4 pb-4 text-[13px] leading-relaxed text-muted">{f.answer}</p>
                    ) : null}
                  </div>
                );
              })}
            </Card>
          </section>
        ))
      )}

      <Card className="p-4">
        <p className="text-[13px] leading-relaxed text-muted">
          Still stuck? {' '}
          <Link href="/m/ask" className="font-medium text-accent underline decoration-accent/40">
            Message the front desk
          </Link>{' '}
          and someone will answer in the app.
        </p>
      </Card>
    </div>
  );
}
