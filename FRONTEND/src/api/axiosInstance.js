import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
  (config) => {
    const storedTokens = localStorage.getItem("authTokens");

    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      config.headers["Authorization"] = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 409 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
        const refreshToken = tokens.refresh;

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Refresh API call
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {
            refreshToken: refreshToken,
          }
        );

        const newAccessToken = response.data.access;
        console.log("New access token obtained:", newAccessToken);

        // Save the new access token
        localStorage.setItem(
          "authTokens",
          JSON.stringify({
            ...tokens,
            access: newAccessToken,
          })
        );

        // Update header for retry
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
