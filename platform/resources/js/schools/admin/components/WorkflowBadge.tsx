import React from 'react';
import type { WorkflowStatus } from '../types';

interface Props {
  status: WorkflowStatus;
  size?:  'sm' | 'md';
}

const LABELS: Record<WorkflowStatus, string> = {
  draft:     'Draft',
  in_review: 'In Review',
  approved:  'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  archived:  'Archived',
  hidden:    'Hidden',
};

export default function WorkflowBadge({ status, size = 'md' }: Props) {
  const label = LABELS[status] ?? status;
  const slug  = status.replace(/_/g, '_');

  return (
    <span className={`wf-badge wf-badge--${size} wf-badge--${slug}`}>
      <span className="wf-badge__dot" />
      {label}
    </span>
  );
}
