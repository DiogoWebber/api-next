import { createContext, useContext, useState, useEffect } from "react";
import { checkAuth, setAuthHeader } from "../utils/auth"; // Suas funções de autenticação

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      const { isValid, userObj } = await checkAuth();
      if (isValid) {
        setUser(userObj);
      }
      setLoading(false);
    };
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
