import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  requestForgotPasswordOtp as requestForgotPasswordOtpService,
  requestSignupOtp as requestSignupOtpService,
  resetPassword as resetPasswordService,
  verifySignupOtp as verifySignupOtpService,
} from "../services/authService";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAuthStorage,
} from "../services/tokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => {
          clearAuthStorage();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const storeAuth = (payload) => {
    setAuthStorage({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
    setUser(payload.user);
  };

  const requestSignupOtp = async (payload) => {
    const response = await requestSignupOtpService(payload);
    return response.data;
  };

  const verifySignupOtp = async (payload) => {
    const response = await verifySignupOtpService(payload);
    storeAuth(response.data);
    return response.data;
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    storeAuth(response.data);
    return response.data;
  };

  const requestForgotPasswordOtp = async (payload) => {
    const response = await requestForgotPasswordOtpService(payload);
    return response.data;
  };

  const resetPassword = async (payload) => {
    const response = await resetPasswordService(payload);
    storeAuth(response.data);
    return response.data;
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutUser({ refreshToken });
      } catch (error) {
        console.error("Logout request failed", error);
      }
    }

    clearAuthStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requestSignupOtp,
        verifySignupOtp,
        login,
        requestForgotPasswordOtp,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
