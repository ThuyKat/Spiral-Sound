import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.isLoggedIn ? data.name : null);
    } catch (err) {
      console.log(err, 'Auth check failed');
      setUser(null);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, []);

  return { user, setUser, checkAuth };
}
