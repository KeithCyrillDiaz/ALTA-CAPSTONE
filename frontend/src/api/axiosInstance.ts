// Axios instance and interceptors
import axios from "axios";
import envConfig from "../config/env";
import { endpointAdmin} from "./endpoint";

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
    //INITIALIZE AUTHTOKEN VARIABLE TO STORE THE AUTHORIZATION TOKEN
    let authToken;

    //CHECK IF THE REQ IS FROM ADMIN OR USER
    const isAdminRequest = config.url?.includes("/admin");

    if(isAdminRequest) {
      //IF THE REQ IS FROM ADMIN THEN ACCESS THE TOKEN IN STORAGE
      authToken = localStorage.getItem('authToken');
    } else {
      //IF NOT THEN GET THE TOKEN FROM ENV
      authToken = envConfig.clientToken;
    }

    //IF TOKEN IS STORED STORED IT IN AUTHORIZATION IN HEADERS
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      console.warn("No token found for request:", config.url); // LOGGING FOR DEBUGGING
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

    // CHECK IF THE REQUEST IS FROM CLIENT 
    const requestUrl = error.config?.url;
    const isClientRequest = requestUrl.includes("/client");

    if(isClientRequest && !envConfig.clientToken) {
      // IF ITS CLIENT REQUEST AND NO TOKEN FOUND, REJECT THE REQUEST TO BACKEND
      console.error("Client request without a valid token.");
      return Promise.reject(error);
    }

    
    //IF REQUEST IS FROM ADMIN
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
          
          //CHECK IF THE REQUEST IS NOT FROM CLIENT
          if(!isClientRequest) {
            window.location.href = '/login'; //REDIRECT TO ADMIN LOGIN PAGE
          }
        }
      } else {
        // IF NO REFRESH TOKEN EXISTS, REDIRECT TO LOGIN

        //CHECK IF THE REQUEST IS NOT FROM CLIENT
        if(!isClientRequest) {
          window.location.href = '/login'; //REDIRECT TO ADMIN LOGIN PAGE
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
