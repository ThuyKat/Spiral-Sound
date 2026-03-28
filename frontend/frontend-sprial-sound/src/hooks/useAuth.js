import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth(initialValue = null) {
  const [user, setUser] = useState(initialValue);
  const navigate = useNavigate();

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });

      if (!res.ok) {
        console.warn('Unexpected response:', res.status);
        setUser(null);
        return;
      }

      const user = await res.json();
      if (!user.isLoggedIn) {
        setUser(null);
        return;
      }
      setUser(user.name);
    } catch (err) {
      console.log(err, 'Auth check failed');
      setUser(null);
    }
  }
  async function login(username, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        await checkAuth();
        navigate('/');
      }
      return res;
    } catch (err) {
      console.error('Network error:', err);
      return null;
    }
  }
  async function logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) setUser(null);
    const json = await res.json();
    return json.message;
  }
  useEffect(() => {
    checkAuth();
  }, []);
  return [user, checkAuth, login, logout];
}
