import { useState, useEffect, useCallback, useMemo } from "react";
import config from "./../config";

// INITIAL STATES OF USEAUTH
const useAuth = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    username: "",
    entity: "",
    role: "",
    showDashboard: false,
    loading: true,
    userId: null,
    token: null,
  });

  const fetchUserDataAndRole = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // FETCHING DATA STORED FROM LOCAL STORAGE
      const authData = JSON.parse(localStorage.getItem("authData"));
      if (!authData || !authData.token) {
        throw new Error("No valid auth data found");
      }

      const { userName, entity, token, id, role } = authData;

      let userRole = role;
      // IF THERE IS NO DATA IN LOCAL STORAGE, FETCH DATA FROM THE SERVER
      if (!userRole) {
        const response = await fetch(config.auth.getUserRole, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // THROW ERROR TO THE CONSOLE WHEN THERE IS ERROR FOUND
        if (!response.ok) {
          throw new Error("Failed to fetch user role");
        }

        const data = await response.json();
        userRole = data.role;

        localStorage.setItem(
          "authData",
          JSON.stringify({ ...authData, role: userRole })
        );
      }

      setAuthState({
        isLoggedIn: true,
        username: userName || "",
        entity: entity || "",
        role: userRole,
        showDashboard: userRole === "admin" || userRole === "developer",
        loading: false,
        userId: id || null,
        token,
      });
    } catch (error) {
      clearAuthData();
    }
  }, []);

  useEffect(() => {
    fetchUserDataAndRole();
  }, [fetchUserDataAndRole]);

  // CLEARING AUTH DATA
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("authData");
    setAuthState({
      isLoggedIn: false,
      username: "",
      entity: "",
      role: "",
      showDashboard: false,
      loading: false,
      userId: null,
      token: null,
    });
  }, []);

  const login = useCallback(async (loginData) => {
    try {
      const response = await fetch(config.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const authData = await response.json();
      localStorage.setItem("authData", JSON.stringify(authData));
      await fetchUserDataAndRole();
    } catch (error) {
      clearAuthData();
      throw error;
    }
  }, [fetchUserDataAndRole, clearAuthData]);

  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  const authActions = useMemo(() => ({
    login,
    logout,
    refreshAuth: fetchUserDataAndRole,
  }), [login, logout, fetchUserDataAndRole]);

  return { ...authState, ...authActions };
};

export default useAuth;
