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
  TextInput,
  Toggle,
} from '@/components/ui';
import { useSpa } from '@/lib/spa';
import { supabase } from '@/lib/supabase';
import type { Member } from '@/lib/types';

const TIERS = ['trial', 'premium', 'elite'] as const;

export default function AdminMembersPage() {
  const { members, loading } = useSpa();
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  }, [members, query]);

  const expired = members.filter((m) => m.membership_end && m.membership_end < today);
  const inactive = members.filter((m) => !m.is_active);

  if (loading) return <Spinner label="Loading members" />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Members" value={members.length} />
        <Stat label="Active" value={members.filter((m) => m.is_active).length} />
        <Stat label="Inactive" value={inactive.length} hint="cannot request spots" />
        <Stat label="Expired dates" value={expired.length} hint="past end date" />
      </div>

      <SectionTitle
        title="Membership roster"
        hint="Active status and dates decide whether the app lets someone request a spot"
        action={
          <Button variant="primary" size="sm" onClick={() => setAdding(true)}>
            Add member
          </Button>
        }
      />

      <TextInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email…"
        type="search"
      />

      <ul className="space-y-2">
        {filtered.map((m) => (
          <MemberRow key={m.id} member={m} today={today} />
        ))}
      </ul>

      <AddMemberModal open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}

function MemberRow({ member, today }: { member: Member; today: string }) {
  const [error, setError] = useState<string | null>(null);

  async function patch(changes: Partial<Member>) {
    setError(null);
    const { error: err } = await supabase.from('rms_members').update(changes).eq('id', member.id);
    if (err) setError(err.message);
  }

  const lapsed = !!member.membership_end && member.membership_end < today;
  const notStarted = !!member.membership_start && member.membership_start > today;

  return (
    <li>
      <Card className={`p-4 ${!member.is_active || lapsed ? 'border-alert/25' : ''}`}>
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          <div className="min-w-45 grow">
            <p className="text-sm font-semibold tracking-tight">{member.full_name}</p>
            <p className="text-[11px] text-faint">
              {member.email}
              {member.phone ? ` · ${member.phone}` : ''}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge tone={member.is_active ? 'accent' : 'alert'}>
                {member.is_active ? 'active' : 'inactive'}
              </Badge>
              {lapsed ? <Badge tone="alert">expired</Badge> : null}
              {notStarted ? <Badge tone="warn">not started</Badge> : null}
              {member.location_opt_in ? <Badge tone="info">location on</Badge> : null}
            </div>
          </div>

          <label className="block w-28">
            <Label>Tier</Label>
            <Select value={member.tier} onChange={(e) => patch({ tier: e.target.value as Member['tier'] })}>
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </label>

          <label className="block w-40">
            <Label>Starts</Label>
            <TextInput
              type="date"
              value={member.membership_start ?? ''}
              onChange={(e) => patch({ membership_start: e.target.value || null })}
            />
          </label>

          <label className="block w-40">
            <Label>Ends</Label>
            <TextInput
              type="date"
              value={member.membership_end ?? ''}
              onChange={(e) => patch({ membership_end: e.target.value || null })}
            />
          </label>

          <div className="w-56">
            <Toggle
              checked={member.is_active}
              onChange={(next) => patch({ is_active: next })}
              label={member.is_active ? 'Active member' : 'Inactive'}
              hint={member.is_active ? 'Can request spots' : 'Requests blocked in the app'}
            />
          </div>
        </div>
        {error ? (
          <div className="mt-3">
            <Banner tone="alert">{error}</Banner>
          </div>
        ) : null}
      </Card>
    </li>
  );
}

/** ISO date `offsetDays` from today, for membership defaults. */
function isoDay(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function AddMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState(() => ({
    full_name: '',
    email: '',
    phone: '',
    tier: 'premium' as Member['tier'],
    membership_start: isoDay(0),
    membership_end: isoDay(365),
    is_active: true,
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from('rms_members').insert({
      ...form,
      phone: form.phone || null,
    });
    setBusy(false);
    if (err) setError(err.message);
    else {
      setForm({ ...form, full_name: '', email: '', phone: '' });
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a member"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={save}
            disabled={busy || !form.full_name.trim() || !form.email.trim()}
          >
            {busy ? 'Saving…' : 'Add member'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <label className="block">
          <Label>Full name</Label>
          <TextInput
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Jordan Blake"
          />
        </label>
        <label className="block">
          <Label>Email</Label>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jordan@example.com"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Label hint="optional">Phone</Label>
            <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="block">
            <Label>Tier</Label>
            <Select
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value as Member['tier'] })}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Label>Membership starts</Label>
            <TextInput
              type="date"
              value={form.membership_start}
              onChange={(e) => setForm({ ...form, membership_start: e.target.value })}
            />
          </label>
          <label className="block">
            <Label>Membership ends</Label>
            <TextInput
              type="date"
              value={form.membership_end}
              onChange={(e) => setForm({ ...form, membership_end: e.target.value })}
            />
          </label>
        </div>
        <Toggle
          checked={form.is_active}
          onChange={(next) => setForm({ ...form, is_active: next })}
          label="Active immediately"
          hint="Inactive members can sign in but cannot request a spot."
        />
        {error ? <Banner tone="alert">{error}</Banner> : null}
      </div>
    </Modal>
  );
}
