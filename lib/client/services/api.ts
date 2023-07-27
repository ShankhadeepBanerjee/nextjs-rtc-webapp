// axiosConfig.js

import axios from "axios";
import {
  ACESS_TOKEN_IDENTIFIER,
  API_BASE_URL,
  REFRESH_TOKEN_IDENTIFIER,
} from "../../common/utils";

// Function to create an Axios instance
const createAxiosInstance = (isPrivate = false) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });

  if (isPrivate) {
    // Add authorization header with access token for private requests
    instance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem(ACESS_TOKEN_IDENTIFIER);
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    });

    // Handle unauthorized (401) responses for private endpoints
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            // Attempt to refresh the access token
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_IDENTIFIER);
            if (!refreshToken) {
              throw new Error("No refresh token found.");
            }

            // Make a request to your server to refresh the access token
            const response = await axios.post("/refresh-token", {
              refresh_token: refreshToken,
            });

            // If refresh successful, store the new access token and retry the original request
            const newAccessToken = response.data.access_token;
            localStorage.setItem(ACESS_TOKEN_IDENTIFIER, newAccessToken);

            // Retry the original request with the updated access token
            const originalRequest = error.config;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails or an error occurs, log out the user or handle as needed
            console.error("Failed to refresh access token:", refreshError);
            // Logout or handle the error as needed
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return instance;
};

// Export both public and private Axios instances
export const publicAxios = createAxiosInstance();
export const privateAxios = createAxiosInstance(true);
