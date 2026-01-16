import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_CONFIG } from "@/lib/config/api";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseURL: string = API_CONFIG.BASE_URL || "") {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          // Check if we are calling our own BFF (relative URL) or external Backend
          // For BFF calls (starting with /api), browser sends cookies automatically.
          // For Backend calls (absolute URL), we might need Bearer IF tokens are in localStorage or similar.
          // But currently we use HttpOnly cookies, so even Client -> Backend direct calls (if any) might fail unless we extract token from cookie manually.
          // The previous implementation extracted token from cookie manually.
          // Let's keep that logic for backward compatibility if baseURL is NOT empty (i.e. external backend).

          if (config.baseURL?.startsWith("http") || config.url?.startsWith("http")) {
            const token = this.getTokenFromCookie();
            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push(() => {
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Call Next.js BFF Refresh Route
            // We use a fresh axios instance to avoid circular dependency or interceptors loop
            const response = await axios.post("/api/auth/refresh");

            if (response.status === 200) {
              // Cookies are set by BFF response automatically
              this.onRefreshed(""); // Resolve queue
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            if (typeof window !== "undefined") {
              // Clear cookies explicitly if possible, though mostly done by BFF failure response hook or login redirect
              document.cookie = "auth_token=; Max-Age=0; path=/;";
              document.cookie = "refresh_token=; Max-Age=0; path=/;";
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }

    return null;
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Instance for Direct Backend calls
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Instance for BFF calls (Relative paths)
export const bffClient = new ApiClient("");
