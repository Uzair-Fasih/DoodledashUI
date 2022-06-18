import axios from "axios";

const config = {
  baseUrl: "https://blacklineapi.bothook.com/api",
};

const baseApi = axios.create({
  baseURL: config.baseUrl,
});
baseApi.interceptors.response.use(function ({ data }) {
  return data;
});

export default baseApi;
