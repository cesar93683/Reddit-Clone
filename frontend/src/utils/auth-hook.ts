import { useState, useCallback, useEffect } from "react";

export const useAuth = () => {
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
  }, [login]);

  return { token, login, logout, userId };
};
