export const URL_PATHS = {
  AUTH: {
    VERIFY_CODE: "/api/v1/auth/verification-code",
    LOGIN_WEB: "/api/v1/auth/signin",
    SIGN_UP: "/api/v1/auth/signup",
    CHANGE_PASSWORD: "/api/v1/auth/password-change-request", // Para "Olvidé mi contraseña"
    RESEND_VERIFICATION_CODE: "/api/v1/auth/resend-verification-code",
    // La ruta de cambiar contraseña se movió a USERS
  },
  DASHBOARD: {
    STATS: "/api/v1/dashboard/stats",
  },
  PRODUCTS: {
    GET_ALL: "/api/v1/products/",
    SEARCH: "/api/v1/products/search",
    CREATE: "/api/v1/products/",
    GET_POPULAR: "/api/v1/products/popular/list",
    GET_BY_ID: (productId) => `/api/v1/products/${productId}`,
    UPDATE: (productId) => `/api/v1/products/${productId}`,
    DELETE: (productId) => `/api/v1/products/${productId}`,
  },
  INGREDIENTS: {
    GET_ALL: "/api/v1/ingredients/",
    DELETE: (ingredientId) => `/api/v1/ingredients/${ingredientId}`,
    UPDATE: (ingredientId) => `/api/v1/ingredients/${ingredientId}`,
    LOW_STOCK: "/api/v1/ingredients/low-stock",
  },
  PROMOTIONS: {
    GET_ALL: "/api/v1/promotions/",
    DELETE: (ingredientId: string) => `/api/v1/promotions/${ingredientId}`,
    UPDATE: (ingredientId: string) => `/api/v1/promotions/${ingredientId}`,
    LOW_STOCK: "/api/v1/promotions/low-stock",
  },
  ORDERS: {
    GET_ALL: "/api/v1/orders/",
    DELETE: (orderId) => `/api/v1/orders/${orderId}`,
    UPDATE_STATUS: (orderId) => `/api/v1/orders/${orderId}/status`,
  },
  GET_CATEGORIES: "/api/v1/categories/",

  USERS: {
    GET_PROFILE: (userId: string) => `/api/v1/users/${userId}/profile`,
    UPDATE_PROFILE: (userId: string) => `/api/v1/users/${userId}/profile`,
    CHANGE_PASSWORD: (userId: string) => `/api/v1/users/${userId}/change-password`,
  },
};