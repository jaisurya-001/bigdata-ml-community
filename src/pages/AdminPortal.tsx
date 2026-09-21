import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Lock, Unlock, Database, LogOut, UserCheck, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Problem {
  id: string;
  title: string;
  domain: string;
  description: string;
  requirements: string[];
  pipeline: string;
  expected_outcomes: { component: string; output: string }[];
}

interface Allocation {
  id: string;
  problem_id: string;
  problem_title?: string;
  leader_name: string;
  leader_email: string;
}

export const AdminPortal = () => {
  const { user, logout } = useAuth();
  const [isReleased, setIsReleased] = useState(false);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [viewProblem, setViewProblem] = useState<Problem | null>(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'portal_released')
        .maybeSingle();
      setIsReleased(Boolean(data?.value));
    } catch (err) {
      console.error('Error fetching release status:', err);
    }
  };

  const fetchProblems = async () => {
    try {
      const { data } = await supabase
        .from('problems')
        .select('*')
        .order('id', { ascending: true });
      if (data) {
        const formatted: Problem[] = data.map(p => ({
          ...p,
          requirements: Array.isArray(p.requirements) ? p.requirements : [],
          expected_outcomes: Array.isArray(p.expected_outcomes) ? p.expected_outcomes : []
        }));
        setAllProblems(formatted);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  };

  const fetchAllocations = async () => {
    try {
      const { data } = await supabase
        .from('allocations')
        .select('id, problem_id, leader_name, leader_email')
        .order('created_at', { ascending: true });
      setAllocations(data || []);
    } catch (err) {
      console.error('Error fetching allocations:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      Promise.all([fetchStatus(), fetchProblems(), fetchAllocations()]).then(() => setLoading(false));
      const interval = setInterval(fetchAllocations, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const handleRelease = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'portal_released', value: true });
      if (!error) {
        setIsReleased(true);
        setShowConfirm(false);
      } else {
        console.error('Failed to release problems:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemo = async () => {
    setResetting(true);
    setResetError(null);
    try {
      // 1. Delete ALL rows from allocations table with .select() to verify deleted rows
      const { data: deletedRows, error: allocError } = await supabase
        .from('allocations')
        .delete()
        .neq('leader_email', '')
        .select();

      if (allocError) {
        setResetError(`Failed to delete allocation locks: ${allocError.message}. Please ensure the RLS DELETE policy for admin is active on Supabase.`);
        setResetting(false);
        return;
      }

      console.log(`Successfully deleted ${deletedRows ? deletedRows.length : 0} allocation rows.`);

      // 2. Immediately verify that no allocation rows remain in database
      const { data: verifyAllocData, error: verifyErr } = await supabase
        .from('allocations')
        .select('id');

      if (verifyErr || (verifyAllocData && verifyAllocData.length > 0)) {
        setResetError(`Reset aborted: Database returned ${verifyAllocData?.length || 0} allocation locks still present in PostgreSQL. Please execute the updated RLS DELETE policy in your Supabase SQL Editor.`);
        setResetting(false);
        return;
      }

      // 3. Only after allocations are confirmed empty, set settings.portal_released = false
      const { error: settingsError } = await supabase
        .from('settings')
        .upsert({ key: 'portal_released', value: false });

      if (settingsError) {
        setResetError(`Allocations were deleted, but failed to update release setting: ${settingsError.message}`);
        setResetting(false);
        return;
      }

      // All operations succeeded & verified
      setIsReleased(false);
      setAllocations([]);
      setShowResetConfirm(false);
    } catch (err: any) {
      setResetError(err.message || 'An unexpected error occurred during demo reset.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Admin Portal...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <header style={{ backgroundColor: 'var(--primary-dark)', padding: '1rem 0', color: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <Database size={24} color="var(--primary-light)" />
            <span>Admin Portal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/leader" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <UserCheck size={16} /> Leader View
            </Link>
            <span>{user.name}</span>
            <button onClick={logout} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '3rem 0' }}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Problem Statement Management</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Release Status:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: isReleased ? '#10b981' : '#ef4444' }}>
                {isReleased ? <Unlock size={20} /> : <Lock size={20} />}
                <span style={{ fontWeight: 600 }}>{isReleased ? '🟢 RELEASED' : '🔴 PROBLEM STATEMENTS NOT RELEASED'}</span>
              </div>
            </div>
            {isReleased ? (
              <button onClick={() => { setShowResetConfirm(true); setResetError(null); }} className="btn" style={{ backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <RotateCcw size={18} /> RESET DEMO / REVOKE RELEASE
              </button>
            ) : (
              <button onClick={() => setShowConfirm(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Unlock size={18} /> RELEASE PROBLEM STATEMENTS
              </button>
            )}
          </div>

          {showConfirm && (
            <div style={{ marginTop: '1rem', padding: '1.5rem', border: '1px solid #ef4444', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
              <h4 style={{ color: '#ef4444', margin: '0 0 1rem 0' }}>Confirm Release</h4>
              <p>Are you sure you want to release all problem statements?<br/>Once released, leaders will be able to view and select them.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={handleRelease} style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}>RELEASE</button>
                <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>CANCEL</button>
              </div>
            </div>
          )}

          {showResetConfirm && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '2px solid #ef4444', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
              <h4 style={{ color: '#dc2626', margin: '0 0 1rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={20} /> Reset Hackathon Demo?
              </h4>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                This action will reset the demo state back to pre-release condition:
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <li>This will hide all problem statements from leaders.</li>
                <li>This will remove all current problem allocations/locks.</li>
                <li>The 50 problem statements will <strong>NOT</strong> be deleted.</li>
                <li>Authorized users will <strong>NOT</strong> be deleted.</li>
                <li>Google authentication will <strong>NOT</strong> be changed.</li>
              </ul>

              {resetError && (
                <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  ⚠️ {resetError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn" 
                  onClick={handleResetDemo} 
                  disabled={resetting}
                  style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.6rem 1.5rem', fontWeight: 700 }}
                >
                  {resetting ? 'RESETTING...' : 'RESET DEMO'}
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => { setShowResetConfirm(false); setResetError(null); }}
                  disabled={resetting}
                  style={{ padding: '0.6rem 1.5rem' }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Problem Statement Allocation</h2>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: '8px', flex: 1 }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Problems</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>50</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: '8px', flex: 1 }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Locked</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{allocations.length}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--surface)', borderRadius: '8px', flex: 1 }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Available</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{50 - allocations.length}</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Leader Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Problem ID</th>
                  <th style={{ padding: '1rem' }}>Problem Title</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No problems locked yet.</td>
                  </tr>
                ) : (
                  allocations.map((a, i) => {
                    const prob = allProblems.find(p => p.id === a.problem_id);
                    const title = prob?.title || a.problem_title || 'Loading title...';

                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{a.leader_name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{a.leader_email}</td>
                        <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{a.problem_id}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>{title}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
                            <Lock size={14} /> LOCKED
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {prob && (
                            <button 
                              className="btn btn-outline" 
                              onClick={() => setViewProblem(prob)}
                              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                            >
                              VIEW DETAILS
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Admin Problem Details Modal */}
      {viewProblem && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="modal-content card" style={{ position: 'relative', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--background)', padding: '2.5rem' }}>
            <button onClick={() => setViewProblem(null)} className="btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Close</button>
            
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-light)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              PROBLEM {viewProblem.id.replace('PS', '')} ({viewProblem.id})
            </div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', paddingRight: '4rem', fontSize: '1.75rem' }}>{viewProblem.title}</h2>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '2rem', display: 'inline-block', backgroundColor: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
              DOMAIN: {viewProblem.domain}
            </div>
            
            {viewProblem.description && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  PROBLEM STATEMENT / OVERVIEW
                </h4>
                <p style={{ lineHeight: 1.7, whiteSpace: 'pre-line', color: 'var(--text-main)' }}>{viewProblem.description}</p>
              </div>
            )}
            
            {viewProblem.requirements && viewProblem.requirements.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  REQUIREMENTS
                </h4>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8, listStyleType: 'disc' }}>
                  {viewProblem.requirements.map((req, idx) => (
                    <li key={idx} style={{ color: 'var(--text-main)' }}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {viewProblem.pipeline && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  WORKFLOW / PIPELINE
                </h4>
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--surface)', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border)', color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
                  {viewProblem.pipeline}
                </div>
              </div>
            )}
            
            {viewProblem.expected_outcomes && viewProblem.expected_outcomes.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  EXPECTED OUTCOME
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--surface)' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--secondary)' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', border: '1px solid var(--border)', color: 'var(--primary-dark)', fontWeight: 700 }}>Deliverable</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', border: '1px solid var(--border)', color: 'var(--primary-dark)', fontWeight: 700 }}>Expected Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewProblem.expected_outcomes.map((out, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-main)', width: '30%' }}>{out.component}</td>
                        <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{out.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


