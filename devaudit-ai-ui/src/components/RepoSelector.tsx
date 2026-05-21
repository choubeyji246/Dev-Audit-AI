import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setSelectedRepo, setRepos } from '../store/uiSlice';
import { getAuthHeaders, getManualToken } from '../utils/auth';
import { apiClient } from '../api';

export default function RepoSelector() {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.ui.selectedRepoId);
  const repos = useSelector((state: RootState) => state.ui.repos || []);
  
  // 🔒 THE SHIELD: Keep track of both fetched state AND an active in-flight request lock
  const hasFetchedRepos = useRef(false);
  const isCurrentlyFetching = useRef(false);

  useEffect(() => {
    // 1. If repos already exist in Redux, select the first one if none selected, and exit.
    if (repos.length > 0) {
      if (!selected) {
        dispatch(setSelectedRepo(repos[0].id));
      }
      return;
    }

    // 2. Lock: If we already fetched successfully OR a request is currently mid-air, STOP.
    if (hasFetchedRepos.current || isCurrentlyFetching.current) {
      return;
    }

    // Activate the lock immediately before entering the async block
    isCurrentlyFetching.current = true;

    (async () => {
      try {
        let headers = {};
        const manualToken = getManualToken();
        
        if (manualToken) {
          headers = { Authorization: `Bearer ${manualToken}` };
        } else {
          headers = await getAuthHeaders(getToken);
        }

        const resp = await apiClient.get('/api/repos', { headers });
        const fetchedRepos = resp.data.repos || [];
        
        dispatch(setRepos(fetchedRepos));
        
        if (!selected && fetchedRepos.length > 0) {
          dispatch(setSelectedRepo(fetchedRepos[0].id));
        }
        
        // Mark as successfully completed
        hasFetchedRepos.current = true;
      } catch (e) {
        console.error('❌ Repo Ingestion Error:', e); 
        // Reset the lock on error so it can try again cleanly later if needed
        hasFetchedRepos.current = false;
      } finally {
        // Always release the mid-air request lock when done
        isCurrentlyFetching.current = false;
      }
    })();
  }, [getToken, dispatch, selected, repos]); 

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-textmuted uppercase tracking-wider">Repository</label>
      <select
        value={selected || ''}
        onChange={(e) => dispatch(setSelectedRepo(e.target.value || null))}
        className="bg-surface border border-bordermuted text-textmain rounded px-3 py-2 text-sm outline-none focus:border-accentblue transition-all"
      >
        <option value="">Select repository</option>
        {repos.map((r) => (
          <option key={r.id} value={r.id}>{r.repoName || r.name}</option>
        ))}
      </select>
    </div>
  );
}