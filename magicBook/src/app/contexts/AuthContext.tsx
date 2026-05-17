import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { userApi } from '@/api/user';
import type { User } from '@/types';
import {
  getToken,
  setToken,
  removeToken,
  setUser as setStoredUser,
  removeUser,
  decodeTokenPayload,
} from '@/utils/storage';

interface AuthState {
  token: string | null;
  user: User;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; username: string; nickname: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { nickname?: string; avatar?: string; intro?: string; privacy?: number; password?: string }) => Promise<void>;
  refreshUser: (user: Partial<User>) => void;
}

const defaultUser: User = {
  email: '',
  username: '',
  nickname: '',
  avatar: '',
  status: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeAndSetUser(tokenStr: string): User {
  const payload = decodeTokenPayload(tokenStr);
  if (payload) {
    const user: User = {
      email: (payload.email as string) || '',
      username: (payload.username as string) || '',
      nickname: (payload.nickname as string) || '',
      avatar: (payload.avatar as string) || '',
      status: (payload.status as number) ?? null,
    };
    setStoredUser(user);
    return user;
  }
  return { ...defaultUser };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = getToken();
    if (token) {
      const user = decodeAndSetUser(token);
      return { token, user, isAuthenticated: true };
    }
    return { token: null, user: { ...defaultUser }, isAuthenticated: false };
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await userApi.login(email, password);
    const jwt = res.data as unknown as string;
    setToken(jwt);
    const user = decodeAndSetUser(jwt);
    setState({ token: jwt, user, isAuthenticated: true });
  }, []);

  const register = useCallback(async (data: { email: string; password: string; username: string; nickname: string }) => {
    await userApi.register(data);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setState({ token: null, user: { ...defaultUser }, isAuthenticated: false });
  }, []);

  const updateProfile = useCallback(async (data: { nickname?: string; avatar?: string; intro?: string; privacy?: number; password?: string }) => {
    await userApi.updateProfile({
      email: state.user.email,
      ...data,
    });
    setState((prev) => {
      const updated = { ...prev.user };
      if (data.nickname) updated.nickname = data.nickname;
      if (data.avatar) updated.avatar = data.avatar;
      if (data.intro !== undefined) (updated as any).intro = data.intro;
      setStoredUser(updated);
      return { ...prev, user: updated };
    });
  }, [state.user.email]);

  const refreshUser = useCallback((partial: Partial<User>) => {
    setState((prev) => {
      const updated = { ...prev.user, ...partial };
      setStoredUser(updated);
      return { ...prev, user: updated };
    });
  }, []);

  // Re-hydrate on storage change (for multi-tab)
  useEffect(() => {
    const onStorage = () => {
      const token = getToken();
      if (!token && state.isAuthenticated) {
        setState({ token: null, user: { ...defaultUser }, isAuthenticated: false });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
