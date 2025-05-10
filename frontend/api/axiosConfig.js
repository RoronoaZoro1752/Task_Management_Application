// // src/api/axiosConfig.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000/api', // update to your backend URL
//   withCredentials: true, // needed for cookie-based auth
// });

// export default axiosInstance;


//_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+__+_+_+_+_+_

// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to your backend URL
  withCredentials: true, // Needed for cookie-based auth if applicable
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return config; // Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Add a response interceptor (optional, for handling errors globally)
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return the response if successful
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Optionally, you can redirect to login or show a message
      console.error("Unauthorized access - please log in again.");
    }
    return Promise.reject(error); // Return the error
  }
);

export default axiosInstance;
