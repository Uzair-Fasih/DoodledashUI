import axios from "axios";

const config = {
  baseUrl: "https://blacklineapi.bothook.com/api",
};

const baseApi = axios.create({
  baseURL: config.baseUrl,
});

export default baseApi;
