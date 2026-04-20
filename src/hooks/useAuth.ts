import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { syncUserToFirestore } from '../lib/firestore';

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      syncUserToFirestore({
        id: user.id,
        fullName: user.fullName,
        primaryEmailAddress: user.primaryEmailAddress
          ? { emailAddress: user.primaryEmailAddress.emailAddress }
          : null,
        createdAt: user.createdAt ?? null,
      })
        .then((userRole) => {
          setRole(userRole);
          setRoleLoading(false);
        })
        .catch(() => setRoleLoading(false));
    } else {
      setRoleLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  return {
    user: isSignedIn && user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || user.username || 'User',
          role,
          createdAt: user.createdAt?.toISOString() || '',
        }
      : null,
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded || roleLoading,
    error: null,
    isAdmin: role === 'admin',
  };
};