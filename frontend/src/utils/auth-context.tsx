import React, { ReactNode, useCallback, useEffect, useState } from "react";

export const AuthContext = React.createContext({
  userId: "",
  token: "",
  login: (userId: string, token: string) => {},
  logout: () => {},
});

interface AuthProviderInterface {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderInterface) {
  const [loading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  const login = useCallback((userId: string, token: string) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUserId("");
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
    setIsLoading(false);
  }, [login]);

  const value = { token, login, logout, userId };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}
