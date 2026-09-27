import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { storage, StorageKeys } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, studentId: string, pass: string) => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const DEFAULT_USER: User = {
  id: 'usr-shivam-01',
  name: 'Shivam Singh',
  email: 'shivam.singh@campus.edu',
  studentId: 'UE-2024-CS089',
  campus: 'North Campus Institute of Technology',
  department: 'Computer Science & Engineering',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  isGuest: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await storage.get<User | null>(StorageKeys.USER, DEFAULT_USER);
        setUser(storedUser);
      } catch (err) {
        console.warn('[AuthProvider] error loading user:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    const loggedInUser: User = {
      ...DEFAULT_USER,
      email: email.trim(),
      name: email.split('@')[0] ? email.split('@')[0].replace('.', ' ').toUpperCase() : 'Student User',
      isGuest: false,
    };
    setUser(loggedInUser);
    await storage.set(StorageKeys.USER, loggedInUser);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    studentId: string,
    _pass: string
  ): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      studentId: studentId.trim() || 'UE-2025-GEN',
      campus: 'North Campus Institute of Technology',
      department: 'General Sciences',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      isGuest: false,
    };
    setUser(newUser);
    await storage.set(StorageKeys.USER, newUser);
    return true;
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'usr-guest',
      name: 'Guest Student',
      email: 'guest@campus.edu',
      studentId: 'GUEST-USER',
      campus: 'North Campus',
      department: 'Visitor',
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      isGuest: true,
    };
    setUser(guestUser);
    storage.set(StorageKeys.USER, guestUser);
  };

  const logout = async () => {
    setUser(null);
    await storage.remove(StorageKeys.USER);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await storage.set(StorageKeys.USER, updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        continueAsGuest,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
