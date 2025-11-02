export const URL_PATHS = {
  AUTH: {
    VERIFY_CODE: "/api/v1/auth/verification-code",
    LOGIN_WEB: "/api/v1/auth/signin",
    SIGN_UP: "/api/v1/auth/signup",
    CHANGE_PASSWORD: "/api/v1/auth/password-change-request",
    RESEND_VERIFICATION_CODE: "/api/v1/auth/resend-verification-code",
  },
  DASHBOARD: {
    STATS: "/api/v1/dashboard/stats",
  },
  PRODUCTS: {
    GET_ALL: "/api/v1/products",
    SEARCH: "/api/v1/products/search", 
    CREATE: "/api/v1/products",
    GET_POPULAR: "/api/v1/products/popular/list", 
    GET_BY_ID: (productId: string) => `/api/v1/products/${productId}`,
    UPDATE: (productId: string) => `/api/v1/products/${productId}`,
    DELETE: (productId: string) => `/api/v1/products/${productId}`,
  },
  INGREDIENTS: {
    LOW_STOCK: "/api/v1/ingredients/low-stock",
  },
  ORDERS: {
    GET_ALL: "/api/v1/orders/",
    DELETE: (orderId: string) => `/api/v1/orders/${orderId}`,
    UPDATE_STATUS: (orderId: string) => `/api/v1/orders/${orderId}/status`,
  },
};