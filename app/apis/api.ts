import axios from "axios";
import { getFromLocalStorage } from "../libs";
import config from "../globals/env.config";
import { refreshToken } from "./auth/auth.apis";

const axiosInstance = axios.create({
  baseURL: config.be_server,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.headers["noAuth"]) {
      delete config.headers["noAuth"];
      return config;
    }

    const accessToken = getFromLocalStorage<string>("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      config.withCredentials = true;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(
          new Error("Token refresh in progress; request failed.")
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { access_token } = await refreshToken();
        if (access_token) {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access_token}`;
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          return axiosInstance(originalRequest);
        } else {
          return Promise.reject(
            new Error("No access token received after refresh")
          );
        }
      } catch (err: any) {
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
