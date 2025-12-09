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
  
  CLIENTS:{
    GET_ALL: "/api/v1/clients/",
    DELETE: (clientId:string) => `/api/v1/clients/${clientId}`,
    UPDATE: (clientId:string) => `/api/v1/clients/${clientId}`,
  },
  PRODUCTS: {
    GET_ALL: "/api/v1/products/",
    SEARCH: "/api/v1/products/search",
    CREATE: "/api/v1/products/",
    GET_POPULAR: "/api/v1/products/popular/list",
    GET_BY_ID: (productId:string) => `/api/v1/products/${productId}`,
    UPDATE: (productId:string) => `/api/v1/products/${productId}`,
    DELETE: (productId:string) => `/api/v1/products/${productId}`,
  },
  INGREDIENTS: {
    // 💡 AÑADIDO (Basado en tu router)
    GET_ALL: "/api/v1/ingredients/", 
    DELETE: (ingredientId:string) => `/api/v1/ingredients/${ingredientId}`,
    UPDATE: (ingredientId:string) => `/api/v1/ingredients/${ingredientId}`,
    LOW_STOCK: "/api/v1/ingredients/low-stock",
  },
  PROMOTIONS: {
    GET_ALL: "/api/v1/promotionsweb/",
    DELETE: (ingredientId: string) => `/api/v1/promotionsweb/${ingredientId}`,
    UPDATE: (ingredientId: string) => `/api/v1/promotionsweb/${ingredientId}`,
    LOW_STOCK: "/api/v1/promotionsweb/low-stock",
  },
  REPORTS: {
    GET_ALL: "/api/v1/reports/",
    DELETE: (reportId) => `/api/v1/reports/${reportId}`,
    UPDATE_STATUS: (reportId) => `/api/v1/reports/${reportId}/status`,
    // --- RUTA AÑADIDA ---
    DOWNLOAD: (reportId) => `/api/v1/reports/${reportId}/download`,
  },
  ORDERS: {
    GET_ALL: "/api/v1/orders/",
    DELETE: (orderId:string) => `/api/v1/orders/${orderId}`,
    UPDATE_STATUS: (orderId:string) => `/api/v1/orders/${orderId}/status`,
  },
  
  // 💡 AÑADIDO (Basado en tu router de categorías)
  GET_CATEGORIES: "/api/v1/categories/", // Asumo que esta es la ruta de tu category_router

  // 💡 AÑADIDO (Ruta inventada, ¡DEBES CREARLA EN TU BACKEND!)
  CUSTOMIZATION_GROUPS: {
    GET_ALL: "/api/v1/customization-groups/", 
  },

  USERS: {
    GET_PROFILE: (userId:string) => `/api/v1/users/${userId}/profile`,
    UPDATE_PROFILE: (userId:string) => `/api/v1/users/${userId}/profile`,
    CHANGE_PASSWORD: (userId:string) => `/api/v1/users/${userId}/change-password`,
  },
};