import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth, AuthProvider } from '../context/AuthContext';

function InnerLayout() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token]);

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
