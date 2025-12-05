// Authentication utility functions

/**
 * Get auth tokens from localStorage
 */
export const getAuthTokens = () => {
  try {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error("Error getting auth tokens:", error);
    return null;
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Save auth tokens
 */
export const saveAuthTokens = (tokens) => {
  try {
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    localStorage.setItem("isAuthenticated", "true");
  } catch (e) {
    console.error("Error saving tokens:", e);
  }
};

/**
 * Save user data
 */
export const saveUserData = (user) => {
  try {
    localStorage.setItem("userData", JSON.stringify(user));
  } catch (e) {}
};

/**
 * Check if user authenticated
 */
export const isAuthenticated = () => {
  const tokens = getAuthTokens();
  return !!(tokens && tokens.access);
};

/**
 * Clear auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem("authTokens");
  localStorage.removeItem("userData");
  localStorage.removeItem("isAuthenticated");
};

/**
 * Check token expiry
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};
