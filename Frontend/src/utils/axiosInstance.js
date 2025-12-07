import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("✅ Response received:", response.status, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status outside 2xx
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                console.error("❌ 400 Bad Request:", data);
                break;
            case 401:
                console.error("❌ 401 Unauthorized: Please login or refresh your token.", data);
                break;
            case 403:
                console.error("❌ 403 Forbidden: You do not have permission.", data);
                break;
            case 404:
                console.error("❌ 404 Not Found: Endpoint does not exist.", data);
                break;
            case 500:
                console.error("❌ 500 Internal Server Error: Something went wrong on the server.", data);
                break;
            default:
                console.error(`❌ ${status} Error:`, data);
        }
    } else if (error.request) {
        // Request made but no response received
        console.error("❌ No response received from server:", error.request);
    } else {
        // Other errors
        console.error("❌ Axios error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;