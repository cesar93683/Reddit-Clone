import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: "",
  token: "",
  login: (uid: string, token: string, expirationDate: Date | null) => {},
  logout: () => {},
});
