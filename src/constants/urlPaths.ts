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
    POPULAR_LIST: "/api/v1/products/popular/list",
  },
  INGREDIENTS: {
    GET_ALL: "/api/v1/ingredients/",
    DELETE: (ingredientId: string) => `/api/v1/ingredients/${ingredientId}`,
    UPDATE: (ingredientId: string) => `/api/v1/ingredients/${ingredientId}`,
    LOW_STOCK: "/api/v1/ingredients/low-stock",
  },
  ORDERS: {
    GET_ALL: "/api/v1/orders/",
    DELETE: (orderId: string) => `/api/v1/orders/${orderId}`,
    UPDATE_STATUS: (orderId: string) => `/api/v1/orders/${orderId}/status`,
  },
};
