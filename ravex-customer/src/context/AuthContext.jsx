import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ravex_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLoginDrawer, setShowLoginDrawer] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const login = (userData) => {
    // Keep existing profile data if logging in with same mobile
    const existingUser = JSON.parse(localStorage.getItem('ravex_user') || 'null');
    const newUser = existingUser && existingUser.mobile === userData.mobile 
      ? { ...existingUser, ...userData }
      : userData;
    
    setUser(newUser);
    localStorage.setItem('ravex_user', JSON.stringify(newUser));
    setShowLoginDrawer(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ravex_user');
  };

  const updateUser = (data) => {
    const newUser = { ...user, ...data };
    setUser(newUser);
    localStorage.setItem('ravex_user', JSON.stringify(newUser));
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem('ravex_user', JSON.stringify(userData));
    setShowLoginDrawer(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      updateUser,
      showLoginDrawer, 
      setShowLoginDrawer,
      isQuickViewOpen,
      setIsQuickViewOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};
