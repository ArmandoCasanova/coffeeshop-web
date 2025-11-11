import axios, {
  AxiosError,
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const TOKEN_KEY = "accessToken";

const onRequest = (config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  console.log("🔑 Interceptor: Token enviado:", accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};


const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error);

const onResponse = (response: AxiosResponse): AxiosResponse => response;

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError); 
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

export const HTTP = setupInterceptorsTo(
  axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: false,
  }),
);