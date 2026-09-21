import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-in.');
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="modal-content card" style={{ position: 'relative', width: '90%', maxWidth: '400px', backgroundColor: 'var(--background)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X color="var(--text-main)" />
        </button>
        
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Portal Login</h3>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Please sign in with your authorized Google account to access the Hackathon Portal.
        </p>
        
        {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
        
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-primary" 
          disabled={isLoading} 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
        >
          <LogIn size={18} />
          {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Real Google OAuth Authentication (Powered by Supabase)
        </div>
      </div>
    </div>
  );
};
