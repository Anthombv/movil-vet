import React, {createContext, useState, useContext} from 'react';

interface AuthContextProps {
  user: any;
  login: (user: any) => void;
  logout: () => void;
  setUser: (user: any) => void; // Permite actualizar directamente el estado del usuario
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState(null);
  
  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{user, login, logout, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
