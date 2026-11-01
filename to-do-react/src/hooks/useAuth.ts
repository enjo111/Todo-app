import { useContext } from "react";
import { AuthContext, type AuthState } from "../context/authContext";

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
