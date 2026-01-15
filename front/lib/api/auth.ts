import { apiClient } from "./client";
import { API_CONFIG } from "@/lib/config/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthUser,
} from "@/lib/types/api";

export const authApi = {
  /**
   * Login user and store token in cookies
   * Uses Next.js API route to avoid CORS issues
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Call Next.js API route instead of backend directly
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Store token in client-side cookie as backup
      if (data.data.accessToken) {
        this.setAuthCookie(data.data.accessToken);
      }

      // Store user data in localStorage
      if (data.user) {
        localStorage.setItem("user_data", JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const responseData: LoginResponse = await response.json();

      if (responseData.data.accessToken) {
        this.setAuthCookie(responseData.data.accessToken);
      }

      if (responseData.user) {
        localStorage.setItem("user_data", JSON.stringify(responseData.user));
      }

      return responseData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  },

  /**
   * Logout user and clear auth data
   */
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API error:", error);
    } finally {
      this.clearAuthData();
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser> {
    try {
      return await apiClient.get<AuthUser>(API_CONFIG.ENDPOINTS.AUTH.ME);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = this.getAuthToken();
    return !!token;
  },

  /**
   * Get auth token from cookie
   */
  getAuthToken(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }

    return null;
  },

  /**
   * Get user data from localStorage
   */
  getUserData(): AuthUser | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }

    return null;
  },

  /**
   * Set auth token in cookie
   */
  setAuthCookie(token: string, expiryDays: number = 7): void {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + expiryDays * 24 * 60 * 60 * 1000);

    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  },

  /**
   * Clear all auth data
   */
  clearAuthData(): void {
    if (typeof window === "undefined") return;

    // Clear cookie
    document.cookie = "auth_token=; Max-Age=0; path=/;";

    // Clear localStorage
    localStorage.removeItem("user_data");
    localStorage.removeItem("refresh_token");
  },

  /**
   * Handle authentication errors
   */
  handleAuthError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || "Authentication failed";
      return new Error(message);
    }

    if (error.request) {
      return new Error(
        "No response from server. Please check your connection."
      );
    }

    return new Error(error.message || "An unexpected error occurred");
  },
};
