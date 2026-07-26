'use client';

import { useState } from 'react';
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
  TextInput,
  Toggle,
} from '@/components/ui';
import { useLiveTable } from '@/lib/db';
import { useSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import type { Staff, StaffRole } from '@/lib/types';

export default function AdminStaffPage() {
  const { staff: me } = useSession();
  const { rows, loading } = useLiveTable<Staff>('rms_staff', { order: { column: 'full_name' } });
  const [adding, setAdding] = useState(false);

  if (loading) return <Spinner label="Loading staff" />;

  const admins = rows.filter((s) => s.role === 'admin' && s.is_active);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Staff & roles"
        hint="Support reps get the front desk portal. Admins get both."
        action={
          <Button variant="primary" size="sm" onClick={() => setAdding(true)}>
            Add staff
          </Button>
        }
      />

      <Card className="p-4">
        <p className="text-[12px] leading-relaxed text-muted">
          <span className="font-semibold text-text">Support</span> sees incoming requests, the room board,
          member locations, and member chat.
          <br />
          <span className="font-semibold text-text">Admin</span> gets everything above, plus memberships, the
          service menu, store hours, the booking window, and the FAQ.
        </p>
      </Card>

      <ul className="space-y-2">
        {rows.map((s) => (
          <StaffRow key={s.id} staff={s} isMe={s.id === me?.id} lastActiveAdmin={admins.length === 1 && admins[0]?.id === s.id} />
        ))}
      </ul>

      <AddStaffModal open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}

function StaffRow({
  staff,
  isMe,
  lastActiveAdmin,
}: {
  staff: Staff;
  isMe: boolean;
  lastActiveAdmin: boolean;
}) {
  const [error, setError] = useState<string | null>(null);

  async function patch(changes: Partial<Staff>) {
    setError(null);
    const { error: err } = await supabase.from('rms_staff').update(changes).eq('id', staff.id);
    if (err) setError(err.message);
  }

  // Locking yourself out of the console is the one mistake worth preventing outright.
  const guard = lastActiveAdmin
    ? 'This is the only active admin. Promote someone else before changing it.'
    : null;

  return (
    <li>
      <Card className={`p-4 ${staff.is_active ? '' : 'border-line-soft opacity-70'}`}>
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          <div className="min-w-45 grow">
            <p className="text-sm font-semibold tracking-tight">
              {staff.full_name}
              {isMe ? <span className="ml-2 text-[10px] uppercase tracking-wider text-accent">you</span> : null}
            </p>
            <p className="text-[11px] text-faint">{staff.email}</p>
            <div className="mt-1.5 flex gap-1.5">
              <Badge tone={staff.role === 'admin' ? 'accent' : 'info'}>{staff.role}</Badge>
              {!staff.is_active ? <Badge tone="alert">disabled</Badge> : null}
            </div>
          </div>

          <label className="block w-36">
            <Label>Role</Label>
            <Select
              value={staff.role}
              disabled={!!guard}
              onChange={(e) => patch({ role: e.target.value as StaffRole })}
            >
              <option value="support">support</option>
              <option value="admin">admin</option>
            </Select>
          </label>

          <div className="w-60">
            <Toggle
              checked={staff.is_active}
              disabled={!!guard}
              onChange={(next) => patch({ is_active: next })}
              label={staff.is_active ? 'Can sign in' : 'Disabled'}
              hint={guard ?? 'Disabled accounts keep their history but lose portal access.'}
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

function AddStaffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: '', email: '', role: 'support' as StaffRole });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from('rms_staff').insert(form);
    setBusy(false);
    if (err) setError(err.message);
    else {
      setForm({ full_name: '', email: '', role: 'support' });
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a staff account"
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
            {busy ? 'Saving…' : 'Add staff'}
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
            placeholder="Sam Ortiz"
          />
        </label>
        <label className="block">
          <Label>Email</Label>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="sam@yourspa.com"
          />
        </label>
        <label className="block">
          <Label>Role</Label>
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}>
            <option value="support">support (front desk portal)</option>
            <option value="admin">admin (front desk + console)</option>
          </Select>
        </label>
        {error ? <Banner tone="alert">{error}</Banner> : null}
      </div>
    </Modal>
  );
}
