import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AdminActor, AuthorRole } from '../types';
import { fetchMe, getToken, logout as apiLogout } from '../api/adminClient';

export type Permission =
  | 'edit_content'
  | 'submit_for_review'
  | 'request_changes'
  | 'approve'
  | 'publish'
  | 'unpublish'
  | 'manage_pages'
  | 'manage_sections'
  | 'manage_permissions'
  | 'manage_users'
  | 'manage_keywords'
  | 'manage_topics'
  | 'submit_content'
  | 'approve_content'
  | 'publish_content';

interface AuthContextValue {
  actor:   AdminActor;
  setSession: (actor: AdminActor, permissions: Permission[]) => void;
  logout: () => Promise<void>;
  isReady: boolean;
  can:     (action: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [actor, setActor] = useState<AdminActor>({
    id: '',
    name: '',
    email: '',
    role: 'content.author' as AuthorRole,
  });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsReady(true);
      return;
    }

    fetchMe()
      .then((res) => {
        setActor(res.actor);
        setPermissions(res.permissions as Permission[]);
      })
      .finally(() => setIsReady(true));
  }, []);

  const can = (action: Permission): boolean => permissions.includes(action);
  const setSession = (newActor: AdminActor, newPermissions: Permission[]) => {
    setActor(newActor);
    setPermissions(newPermissions);
  };
  const logout = async () => {
    await apiLogout();
    setActor({ id: '', name: '', email: '', role: 'content.author' });
    setPermissions([]);
  };

  return (
    <AuthContext.Provider value={{ actor, setSession, logout, isReady, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
