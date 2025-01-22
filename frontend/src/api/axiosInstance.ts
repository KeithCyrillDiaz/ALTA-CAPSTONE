// Axios instance and interceptors
import axios from "axios";
import envConfig from "../config/env";
import { endpointAdmin} from "./endpoint";

console.log("envConfig.apiBaseUrl: ", envConfig.apiBaseUrl);
const axiosInstance = axios.create({
    baseURL: envConfig.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // THIS ENSURES COOKIES (INCLUDING REFRESH TOKENS) ARE SENT WITH REQUESTS
})

// ADD REQUEST INTERCEPTOR TO ATTACH TOKEN TO REQUEST
axiosInstance.interceptors.request.use(
  (config) => {
    //ACCESS THE TOKEN IN STORAGE
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR FOR ERROR HANDLING AND TOKEN REFRESH LOGIC
axiosInstance.interceptors.response.use(
  (response) => {
    //RETURN THE RESPONSE IF API CALL IS SUCCESSFUL
    return response;
  },
  async (error) => {
    // HANDLE UNAUTHORIZED ERROR (AUTH TOKEN EXPIRED)
    if (error.response?.status === 401) {
      //  FETCH THE REFRESH TOKEN AND CHECK IF EXIST
      const refreshToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('refreshToken='));
      if (refreshToken) {
        //IF REFRESH TOKEN IS EXISTING
        try {
          // REQUEST TO REFRESH THE ACCESS TOKEN USING THE REFRESH TOKEN
          const apiURL = endpointAdmin.token.GET_ACCESS_TOKEN;
          const refreshResponse = await axiosInstance.post(apiURL, {}, {
            withCredentials: true // ENSURE REFRESH TOKEN IS SENT WITH THE REQUEST
          });   
          const newAccessToken = refreshResponse.data.token;

          // SAVE THE NEW ACCESS TOKEN TO LOCAL STORAGE OR COOKIES
          localStorage.setItem('authToken', newAccessToken);

          // RETRY THE ORIGINAL REQUEST WITH THE NEW ACCESS TOKEN
          const originalRequest = error.config;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch {
          // HANDLE REFRESH TOKEN FAILURE, REDIRECT TO LOGIN PAGE
          localStorage.clear(); // CLEARS THE LOCAL STORAGE INCLUDING THE TOKENS
          window.location.href = '/login'; //REDIRECT TO LOGIN PAGE
        }
      } else {
        // IF NO REFRESH TOKEN EXISTS, REDIRECT TO LOGIN
        window.location.href = '/login'; //REDIRECT TO LOGIN PAGE
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
