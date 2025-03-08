import { SendResponseType } from "@repo/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { showErrorNotification } from "@repo/merchant";

const axiosInstance = axios.create({
  baseURL: process.env.baseURL || "http://localhost:6969/api/v1",
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user.authToken) {
    config.headers.Authorization = `Bearer ${session.user.authToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<SendResponseType<any>>) => {
    if (error.response?.status === 401) {
      signOut().then(() => {
        window.location.href = "/signin";
      });
    }
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    }

    return Promise.reject(error);
  },
);

const axiosGetRequest = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<SendResponseType<TResponse>> => {
  try {
    const response = await axiosInstance.get<SendResponseType<TResponse>>(
      url,
      config,
    );

    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      "Some thing is wrong";

    const statusCode = (error as AxiosError).status || 500;

    showErrorNotification(message, statusCode);
    throw error;
  }
};

const axiosPostRequest = async <TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig,
): Promise<SendResponseType<TResponse>> => {
  try {
    const response = await axiosInstance.post<SendResponseType<TResponse>>(
      url,
      data,
      config,
    );

    return response.data;
  } catch (error) {
    const message =
      (error as AxiosError<{ message: string }>).response?.data?.message ||
      "Some thing wrong";
    const statusCode = (error as AxiosError).status || 500;

    showErrorNotification(message, statusCode);

    throw error;
  }
};

export { axiosGetRequest, axiosPostRequest };
