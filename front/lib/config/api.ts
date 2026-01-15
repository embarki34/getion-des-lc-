export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      ME: "/auth/me",
    },
    BANKS: "/swift/banks",
    CREDIT_LINES: "/credit-lines",
    COMPANIES: "/companies",
    BUSINESS_UNITS: "/business-units",
    SUPPLIERS: "/suppliers",
    USERS: "/users",
    ROLES: "/roles",
    GUARANTEES: "/guarantees",
    ENGAGEMENTS: "/engagements",
    SWIFT_MESSAGES: "/swift-messages",
    DOCUMENTS: "/documents",
  },
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  USER_KEY: "user_data",
} as const;
