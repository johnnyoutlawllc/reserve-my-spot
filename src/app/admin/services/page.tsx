'use client';

import { useState } from 'react';
import { ICON_KEYS, ServiceIcon } from '@/components/ServiceIcon';
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
  TextArea,
  TextInput,
  Toggle,
} from '@/components/ui';
import { useSpa } from '@/lib/spa';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types';

type Draft = {
  name: string;
  description: string;
  duration_minutes: number;
  capacity: number;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

const BLANK: Draft = {
  name: '',
  description: '',
  duration_minutes: 20,
  capacity: 1,
  icon: 'sparkle',
  sort_order: 100,
  is_active: true,
};

export default function AdminServicesPage() {
  const { services, queues, loading } = useSpa();
  const [editing, setEditing] = useState<Service | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patch(service: Service, changes: Partial<Service>) {
    setError(null);
    const { error: err } = await supabase.from('rms_services').update(changes).eq('id', service.id);
    if (err) setError(err.message);
  }

  if (loading) return <Spinner label="Loading services" />;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Service menu"
        hint="Duration and station count drive every wait estimate the member sees"
        action={
          <Button variant="primary" size="sm" onClick={() => setEditing('new')}>
            Add service
          </Button>
        }
      />

      {error ? <Banner tone="alert">{error}</Banner> : null}

      <Card className="p-4">
        <p className="text-[12px] leading-relaxed text-muted">
          A service with <span className="font-semibold text-text">3 stations</span> and a{' '}
          <span className="font-semibold text-text">20 minute</span> session drains its line three times faster
          than a single-station service. Get these two numbers right and the estimates take care of themselves.
        </p>
      </Card>

      <ul className="space-y-2">
        {services.map((s) => {
          const q = queues.find((x) => x.service.id === s.id);
          return (
            <li key={s.id}>
              <Card className={`p-4 ${s.is_active ? '' : 'border-line-soft opacity-70'}`}>
                <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-muted">
                    <ServiceIcon icon={s.icon} />
                  </span>

                  <div className="min-w-50 grow">
                    <p className="text-sm font-semibold tracking-tight">{s.name}</p>
                    {s.description ? (
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{s.description}</p>
                    ) : null}
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge>{s.duration_minutes} min</Badge>
                      <Badge>
                        {s.capacity} {s.capacity === 1 ? 'station' : 'stations'}
                      </Badge>
                      <Badge>order {s.sort_order}</Badge>
                      {q && s.is_active ? (
                        <Badge tone={q.slots.length ? 'info' : 'neutral'}>
                          {q.inService.length} in session · {q.slots.length} in line
                        </Badge>
                      ) : null}
                      {!s.is_active ? <Badge tone="alert">hidden from members</Badge> : null}
                    </div>
                  </div>

                  <div className="w-52">
                    <Toggle
                      checked={s.is_active}
                      onChange={(next) => patch(s, { is_active: next })}
                      label={s.is_active ? 'Bookable' : 'Hidden'}
                      hint={s.is_active ? 'Shows on the member menu' : 'Members cannot request this'}
                    />
                  </div>

                  <Button size="sm" onClick={() => setEditing(s)}>
                    Edit
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      <ServiceModal
        target={editing}
        onClose={() => setEditing(null)}
        nextOrder={(services.at(-1)?.sort_order ?? 0) + 10}
      />
    </div>
  );
}

function ServiceModal({
  target,
  onClose,
  nextOrder,
}: {
  target: Service | 'new' | null;
  onClose: () => void;
  nextOrder: number;
}) {
  const isNew = target === 'new';
  const service = target && target !== 'new' ? target : null;
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [seededFor, setSeededFor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reload the form when a different service is opened.
  const key = service?.id ?? (isNew ? 'new' : null);
  if (key && key !== seededFor) {
    setSeededFor(key);
    setDraft(
      service
        ? {
            name: service.name,
            description: service.description ?? '',
            duration_minutes: service.duration_minutes,
            capacity: service.capacity,
            icon: service.icon,
            sort_order: service.sort_order,
            is_active: service.is_active,
          }
        : { ...BLANK, sort_order: nextOrder },
    );
    setError(null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    const payload = { ...draft, description: draft.description.trim() || null };
    const { error: err } = service
      ? await supabase.from('rms_services').update(payload).eq('id', service.id)
      : await supabase.from('rms_services').insert(payload);
    setBusy(false);
    if (err) setError(err.message);
    else onClose();
  }

  async function remove() {
    if (!service) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from('rms_services').delete().eq('id', service.id);
    setBusy(false);
    if (err) {
      setError(
        `${err.message}. This service has waitlist history, so it can't be deleted. Switch it to Hidden instead.`,
      );
    } else onClose();
  }

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title={service ? `Edit ${service.name}` : 'Add a service'}
      footer={
        <>
          {service ? (
            <Button variant="ghost" onClick={remove} disabled={busy} className="mr-auto text-alert">
              Delete
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} disabled={busy || !draft.name.trim()}>
            {busy ? 'Saving…' : service ? 'Save changes' : 'Add service'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <label className="block">
          <Label>Service name</Label>
          <TextInput
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Red Light Therapy"
          />
        </label>

        <label className="block">
          <Label hint="shown on the member menu">Description</Label>
          <TextArea
            rows={2}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Full-body LED panel session for skin, recovery, and circulation."
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Label hint="minutes">Session length</Label>
            <TextInput
              type="number"
              min={1}
              max={240}
              value={draft.duration_minutes}
              onChange={(e) => setDraft({ ...draft, duration_minutes: Math.max(1, Number(e.target.value)) })}
            />
          </label>
          <label className="block">
            <Label hint="beds, rooms, chairs">Stations</Label>
            <TextInput
              type="number"
              min={1}
              max={50}
              value={draft.capacity}
              onChange={(e) => setDraft({ ...draft, capacity: Math.max(1, Number(e.target.value)) })}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Label>Icon</Label>
            <Select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
              {ICON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <Label hint="lower shows first">Menu order</Label>
            <TextInput
              type="number"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </label>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-3 py-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-accent/25 bg-accent-wash text-accent">
            <ServiceIcon icon={draft.icon} />
          </span>
          <div>
            <p className="text-sm font-medium">{draft.name || 'Service name'}</p>
            <p className="text-[11px] text-faint">
              {draft.duration_minutes} min · {draft.capacity} {draft.capacity === 1 ? 'station' : 'stations'}
            </p>
          </div>
        </div>

        <Toggle
          checked={draft.is_active}
          onChange={(next) => setDraft({ ...draft, is_active: next })}
          label="Bookable by members"
          hint="Turn off to pull it from the menu without losing history."
        />

        {error ? <Banner tone="alert">{error}</Banner> : null}
      </div>
    </Modal>
  );
}
