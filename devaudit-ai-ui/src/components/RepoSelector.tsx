import React, { useEffect, useState } from 'react';
import { apiClient } from '../api';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setSelectedRepo } from '../store/uiSlice';
import { getAuthHeaders } from '../utils/auth';

export default function RepoSelector() {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.ui.selectedRepoId);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const headers = await getAuthHeaders(getToken);
        const resp = await apiClient.get('/api/repos', { headers });
        setRepos(resp.data.repos || []);
        if (!selected && (resp.data.repos || []).length > 0) {
          dispatch(setSelectedRepo(resp.data.repos[0].id));
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [getToken, dispatch, selected]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-textmuted uppercase tracking-wider">Repository</label>
      <select
        value={selected || ''}
        onChange={(e) => dispatch(setSelectedRepo(e.target.value || null))}
        className="bg-surface border border-bordermuted text-textmain rounded px-3 py-2 text-sm"
      >
        <option value="">Select repository</option>
        {repos.map((r) => (
          <option key={r.id} value={r.id}>{r.repoName}</option>
        ))}
      </select>
    </div>
  );
}
