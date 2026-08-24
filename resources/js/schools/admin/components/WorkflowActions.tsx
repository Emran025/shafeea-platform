import React, { useState } from 'react';
import type { WorkflowStatus, ObjectType } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  workflowSubmit,
  workflowRequestChanges,
  workflowApprove,
  workflowPublish,
  workflowUnpublish,
} from '../api/adminClient';

interface Props {
  type:      ObjectType;
  id:        string;
  status:    WorkflowStatus;
  onSuccess: (newStatus: string) => void;
}

type BtnVariant = 'submit' | 'approve' | 'request' | 'publish' | 'unpublish';

function WfBtn({
  label, variant, onClick, loading,
}: {
  label: string; variant: BtnVariant;
  onClick: () => void; loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`adm-wf-btn adm-wf-btn--${variant}`}
    >
      {loading ? '…' : label}
    </button>
  );
}

export default function WorkflowActions({ type, id, status, onSuccess }: Props) {
  const { can }   = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  async function run(action: string, fn: () => Promise<{ status: string }>) {
    setLoading(action);
    setError(null);
    try {
      const result = await fn();
      onSuccess(result.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setLoading(null);
    }
  }

  const actions: React.ReactNode[] = [];

  if (status === 'draft' && can('submit_for_review')) {
    actions.push(
      <WfBtn key="submit" label="Submit for Review" variant="submit"
        loading={loading === 'submit'}
        onClick={() => run('submit', () => workflowSubmit(type, id))} />
    );
  }
  if (status === 'in_review' && can('request_changes')) {
    actions.push(
      <WfBtn key="request" label="Request Changes" variant="request"
        loading={loading === 'request'}
        onClick={() => run('request', () => workflowRequestChanges(type, id, 'Changes requested.'))} />
    );
  }
  if (status === 'in_review' && can('approve')) {
    actions.push(
      <WfBtn key="approve" label="Approve" variant="approve"
        loading={loading === 'approve'}
        onClick={() => run('approve', () => workflowApprove(type, id))} />
    );
  }
  if (status === 'approved' && can('publish')) {
    actions.push(
      <WfBtn key="publish" label="Publish" variant="publish"
        loading={loading === 'publish'}
        onClick={() => run('publish', () => workflowPublish(type, id))} />
    );
  }
  if (status === 'published' && can('unpublish')) {
    actions.push(
      <WfBtn key="unpublish" label="Unpublish" variant="unpublish"
        loading={loading === 'unpublish'}
        onClick={() => run('unpublish', () => workflowUnpublish(type, id, 'revert_to_draft'))} />
    );
  }

  if (actions.length === 0) return null;

  return (
    <div>
      <div className="adm-wf-actions">{actions}</div>
      {error && <p className="adm-wf-error">{error}</p>}
    </div>
  );
}
