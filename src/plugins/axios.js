import axios from 'axios/index'

import { ErrorInterseptor } from "../interseptors/error.interseptor";
import { UrlInterseptor } from "../interseptors/url.interseptor";
import { TokenInterseptor } from "../interseptors/token.interseptor";
import { ResponseInterseptor } from "../interseptors/response.interseptor";

const createApi = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_HOST,
  });

  axiosInstance.interceptors.request.use(UrlInterseptor);
  axiosInstance.interceptors.request.use(TokenInterseptor);

  axiosInstance.interceptors.response.use(
      ResponseInterseptor,
      ErrorInterseptor
  );

  return axiosInstance;
};

export const $axios = createApi();
