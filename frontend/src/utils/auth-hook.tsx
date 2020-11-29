import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  ReactNode,
} from "react";

const AuthContext = React.createContext({
  userId: "",
  token: "",
  login: (uid: string, token: string) => {},
  logout: () => {},
});

interface AuthProviderInterface {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderInterface) {
  const [loading, setIsLoading] = useState(true);

  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  const login = useCallback((uid: string, token: string) => {
    setToken(token);
    setUserId(uid);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
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

export function useAuth() {
  return useContext(AuthContext);
}
