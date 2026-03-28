import { createContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext();
export { AuthContext };
export default function AuthContextProvider({ children }) {
  const [isLoggedin, checkAuth, login, logout] = useAuth();
  return (
    <AuthContext.Provider value={{ isLoggedin, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
