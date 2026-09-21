import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Lock, LogOut, CheckCircle, Clock, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Problem {
  id: string;
  title: string;
  domain: string;
  description: string;
  requirements: string[];
  pipeline: string;
  expected_outcomes: { component: string; output: string }[];
  is_locked: boolean;
}

export const LeaderPortal = () => {
  const { user, logout } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  
  const [viewProblem, setViewProblem] = useState<Problem | null>(null);
  const [locking, setLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);

  const fetchMySelection = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('allocations')
        .select('problem_id')
        .eq('leader_email', user.email.toLowerCase())
        .maybeSingle();

      if (data?.problem_id) {
        setSelectedProblemId(data.problem_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProblems = async () => {
    try {
      // Check release status
      const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'portal_released')
        .maybeSingle();

      const released = Boolean(settingsData?.value);

      if (!released && user?.role !== 'ADMIN') {
        setError('Problem statements have not been released yet. Please wait for the admin.');
        setProblems([]);
        return;
      }

      setError(null);

      // Fetch problems
      const { data: problemsData, error: probError } = await supabase
        .from('problems')
        .select('*')
        .order('id', { ascending: true });

      if (probError) {
        setError(probError.message);
        return;
      }

      // Fetch allocations to check locked status
      const { data: allocationsData } = await supabase
        .from('allocations')
        .select('problem_id');

      const lockedSet = new Set((allocationsData || []).map(a => a.problem_id));

      const combined: Problem[] = (problemsData || []).map(p => ({
        ...p,
        requirements: Array.isArray(p.requirements) ? p.requirements : [],
        expected_outcomes: Array.isArray(p.expected_outcomes) ? p.expected_outcomes : [],
        is_locked: lockedSet.has(p.id)
      }));

      setProblems(combined);
    } catch (err) {
      setError('Failed to fetch data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'LEADER' || user.role === 'ADMIN')) {
      fetchMySelection().then(() => fetchProblems());
    }
  }, [user]);

  if (!user || (user.role !== 'LEADER' && user.role !== 'ADMIN')) {
    return <Navigate to="/" />;
  }

  const handleLock = async (problemId: string) => {
    if (!user) return;
    setLocking(true);
    setLockError(null);
    try {
      const { error } = await supabase
        .from('allocations')
        .insert({
          problem_id: problemId,
          leader_email: user.email.toLowerCase(),
          leader_name: user.name
        });

      if (error) {
        if (error.code === '23505') {
          setLockError('This problem statement is already locked by another team or you have already locked a problem.');
        } else {
          setLockError(error.message || 'Failed to lock problem statement.');
        }
      } else {
        setSelectedProblemId(problemId);
        setViewProblem(null);
        fetchProblems();
      }
    } catch (err) {
      setLockError('Failed to communicate with database.');
    } finally {
      setLocking(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Portal...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <header style={{ backgroundColor: 'var(--primary-dark)', padding: '1rem 0', color: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <span>Leader Portal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Shield size={16} /> Admin Portal
              </Link>
            )}
            <span>{user.name}</span>
            <button onClick={logout} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '3rem 0' }}>
        {error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Clock size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ color: 'var(--text-secondary)' }}>Please Wait</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginTop: '1rem' }}>
              Problem statements have not been released yet.<br/>
              Please wait for the admin.
            </p>
            <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => { setLoading(true); fetchProblems(); }}>
              Refresh
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-dark)' }}>Problem Statements</h2>
            
            {selectedProblemId && (
              <div className="card" style={{ marginBottom: '3rem', border: '2px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold', marginBottom: '1rem' }}>
                  <CheckCircle size={24} />
                  <span>YOUR SELECTED PROBLEM</span>
                </div>
                {problems.filter(p => p.id === selectedProblemId).map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-dark)', fontSize: '1.3rem' }}>{p.id} - {p.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{p.domain}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>
                        <Lock size={16} /> PERMANENTLY LOCKED
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setViewProblem(p)}
                      style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid-2">
              {problems.map(p => {
                const isMyProblem = p.id === selectedProblemId;
                const isLocked = p.is_locked && !isMyProblem;
                
                // If a user has selected a problem, hide everything else
                if (selectedProblemId && !isMyProblem) return null;

                return (
                  <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', opacity: isLocked ? 0.7 : 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>{p.domain}</div>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{p.id}: {p.title}</h3>
                    
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                      {p.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      {isMyProblem ? (
                        <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                          <Lock size={16} /> PERMANENTLY LOCKED
                        </span>
                      ) : isLocked ? (
                        <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                          <Lock size={16} /> LOCKED <span style={{fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>(by another team)</span>
                        </span>
                      ) : (
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>🟢 AVAILABLE</span>
                      )}
                      
                      {!isMyProblem && (
                        <button 
                          className={`btn ${isLocked ? 'btn-outline' : 'btn-primary'}`} 
                          onClick={() => setViewProblem(p)}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                        >
                          {isLocked ? 'VIEW DETAILS' : 'VIEW PROBLEM'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Problem Details Modal */}
      {viewProblem && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="modal-content card" style={{ position: 'relative', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--background)', padding: '2.5rem' }}>
            <button onClick={() => { setViewProblem(null); setLockError(null); }} className="btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Close</button>
            
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

            {lockError && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 600 }}>
                {lockError}
              </div>
            )}

            {viewProblem.id === selectedProblemId ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle size={22} />
                THIS IS YOUR SELECTED PROBLEM STATEMENT (PERMANENTLY LOCKED)
              </div>
            ) : viewProblem.is_locked ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Lock size={22} />
                THIS PROBLEM STATEMENT HAS ALREADY BEEN LOCKED BY ANOTHER TEAM.
              </div>
            ) : !selectedProblemId && (
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-dark)', fontSize: '1.1rem' }}>Are you sure you want to select this problem?</h4>
                <p style={{ color: '#ef4444', fontSize: '0.88rem', marginBottom: '1.5rem', fontWeight: 600 }}>WARNING: Once selected, this choice is permanent. You cannot change it later.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleLock(viewProblem.id)}
                    disabled={locking}
                    style={{ padding: '0.75rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}
                  >
                    {locking ? 'LOCKING...' : 'LOCK THIS PROBLEM'}
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => { setViewProblem(null); setLockError(null); }}
                    disabled={locking}
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

