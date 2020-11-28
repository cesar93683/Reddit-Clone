import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: -1,
  token: "",
  login: (uid: number, token: string, expirationDate: Date | null) => {},
  logout: () => {},
});
