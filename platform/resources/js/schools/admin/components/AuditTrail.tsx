import React, { useEffect, useState } from 'react';
import type { StatusTransition, ObjectType } from '../types';
import { fetchTransitions } from '../api/adminClient';

interface Props { type: ObjectType; id: string; }

const STATUS_COLOR: Record<string, string> = {
  draft:     '#94A3B8',
  in_review: '#F59E0B',
  approved:  '#10B981',
  scheduled: '#8B5CF6',
  published: '#3B82F6',
  archived:  '#9CA3AF',
  hidden:    '#EF4444',
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function shortId(id: string): string { return id.slice(0, 8) + '…'; }

export default function AuditTrail({ type, id }: Props) {
  const [transitions, setTransitions] = useState<StatusTransition[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error,   setError]           = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTransitions(type, id)
      .then(setTransitions)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load audit trail'))
      .finally(() => setLoading(false));
  }, [type, id]);

  if (loading) return <div className="adm-audit__loading">Loading audit trail…</div>;
  if (error)   return <div className="adm-audit__error">{error}</div>;
  if (transitions.length === 0) return <div className="adm-audit__empty">No transitions recorded yet.</div>;

  return (
    <div className="adm-audit">
      <div className="adm-audit__timeline-line" />
      <div className="adm-audit__list">
        {[...transitions].reverse().map(t => (
          <div key={t.id} className="adm-audit__entry">
            <div
              className="adm-audit__dot"
              style={{ background: STATUS_COLOR[t.to_status] ?? '#94A3B8' }}
            >
              <div className="adm-audit__dot-inner" />
            </div>
            <div className="adm-audit__body">
              <div className="adm-audit__headline">
                <span className="adm-audit__transition">
                  {t.from_status} → {t.to_status}
                </span>
                <span className="adm-audit__time">{fmt(t.transitioned_at)}</span>
              </div>
              <div className="adm-audit__actor">
                By <code className="adm-audit__actor-code">{shortId(t.transitioned_by)}</code>
              </div>
              {t.notes && (
                <div className="adm-audit__notes">{t.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
