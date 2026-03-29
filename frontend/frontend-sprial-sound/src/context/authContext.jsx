import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext();
export { AuthContext };

export default function AuthContextProvider({ children }) {
  const { user, setUser, checkAuth } = useAuth(); // setUser used in logout
  const navigate = useNavigate();

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

  return (
    <AuthContext.Provider value={{ isLoggedin: user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
