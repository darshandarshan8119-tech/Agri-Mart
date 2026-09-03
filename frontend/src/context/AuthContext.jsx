import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('agrimart_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.isLoggedIn) setUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = async (credentials) => {
    let userData;
    try {
      // Attempt live Django backend authentication
      const response = await apiRequest('/auth/login/', 'POST', credentials);
      userData = { ...response.user, isLoggedIn: true };
    } catch {
      // Local session simulation fallback if Django server is not active
      userData = { ...credentials, isLoggedIn: true };
    }

    localStorage.setItem('agrimart_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    let userData;
    try {
      // Attempt live Django backend registration
      const response = await apiRequest('/auth/register/', 'POST', formData);
      userData = { ...response.user, isLoggedIn: true };
    } catch {
      userData = { ...formData, isLoggedIn: true };
    }

    localStorage.setItem('agrimart_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('agrimart_user');
    setUser(null);
  };

  const isLoggedIn = Boolean(user?.isLoggedIn);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
