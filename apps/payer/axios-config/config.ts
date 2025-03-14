import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SendResponseType } from "@repo/api";

let globalErrorHandler: ((message: string, statusCode: number) => void) | null =
  null;

const setGlobalErrorHandler = (handler: typeof globalErrorHandler) => {
  globalErrorHandler = handler;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_baseURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error); // If error is not AxiosError, just reject it
    }

    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      return Promise.reject(error);
    }

    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      "Some thing is wrong";
    const statusCode = (error as AxiosError).status || 500;

    console.log("message", message);

    if (globalErrorHandler) {
      globalErrorHandler(message, statusCode);
    }

    return Promise.reject(error);
  },
);

const axiosGetRequest = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<SendResponseType<TResponse>> => {
  const response = await axiosInstance.get<SendResponseType<TResponse>>(
    url,
    config,
  );
  return response.data;
};

const axiosPostRequest = async <TRequest, TResponse>(
  url: string,
  data?: TRequest,
  config?: AxiosRequestConfig,
): Promise<SendResponseType<TResponse>> => {
  const response = await axiosInstance.post<SendResponseType<TResponse>>(
    url,
    data,
    config,
  );
  return response.data;
};

export { axiosGetRequest, axiosPostRequest, setGlobalErrorHandler };
