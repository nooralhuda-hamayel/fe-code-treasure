import { login, logout } from "../../../apis";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "../../../libs";

export function useAuth() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (response.access_token) {
        saveToLocalStorage("accessToken", response.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      // Here you could set an error state to show in the UI
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout API call failed, proceeding with client-side cleanup.",
        error
      );
    } finally {
      removeFromLocalStorage("accessToken");
    }
  };

  const isLoggedIn = () => {
    return !!getFromLocalStorage("accessToken");
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    //TODO
    return true;
  };

  return { handleLogin, handleLogout, isLoggedIn, handleSignup };
}
