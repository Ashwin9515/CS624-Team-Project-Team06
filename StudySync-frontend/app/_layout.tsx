import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth, AuthProvider } from '../context/AuthContext';
import React from 'react';

function InnerLayout() {
  const { token } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer navigation until layout is mounted
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !token) {
      router.replace('/login');
    }
  }, [ready, token]);

  // Prevent premature Slot rendering
  if (!ready) return null;

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
