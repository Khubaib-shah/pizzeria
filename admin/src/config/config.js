import axios from "axios";
const URL =
  import.meta.env.VITE_API_BASE_URL_PRO ||
  import.meta.env.VITE_API_BASE_URL_DEV;
// Create an Axios instance with a base URL
export const baseUri = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});
