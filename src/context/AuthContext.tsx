import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type Role = 'ADMIN' | 'LEADER' | 'UNAUTHORIZED';

export type User = {
  email: string;
  name: string;
  role: Role;
} | null;

interface AuthContextType {
  user: User;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (email: string, name: string) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const { data, error } = await supabase
        .from('allowed_users')
        .select('email, role, name')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error || !data) {
        setUser({
          email: normalizedEmail,
          name: name || normalizedEmail,
          role: 'UNAUTHORIZED'
        });
      } else {
        setUser({
          email: data.email,
          name: data.name || name || data.email,
          role: data.role as Role
        });
      }
    } catch (err) {
      console.error('Error verifying user role with Supabase:', err);
      setUser({ email: email.toLowerCase().trim(), name, role: 'UNAUTHORIZED' });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        fetchUserRole(session.user.email, session.user.user_metadata?.full_name || session.user.email)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        setLoading(true);
        fetchUserRole(session.user.email, session.user.user_metadata?.full_name || session.user.email)
          .finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

