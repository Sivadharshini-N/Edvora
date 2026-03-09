import axios from 'axios'; // used to make HTTP requests to the backend API. It provides a simple and consistent API for handling requests and responses, including features like interceptors for adding authentication tokens and handling errors globally.
import {BASE_URL} from './apiPaths';
// axios is promise based, which means that it allows you to handle asynchronous operations using .then() and .catch() methods, making it easier to work with API calls and responses in a clean and organized way.
const axiosInstance = axios.create({ // this has the configuration for the axios instance, such as the base URL for the API, request timeout, and default headers. By creating an instance, you can reuse this configuration across all your API calls, ensuring consistency and reducing code duplication.
    baseURL: BASE_URL,
    timeout: 80000, // 80ms-  maximum time to wait for server res, if exceede it means req fails
    headers: {
        'Content-Type': 'application/json', // Specifies that the request body will be in JSON format.
        Accept: 'application/json', // expecting json res from server
    },
});

//Request Interceptor - interceptor is a funciton that runs  before every req is sent. It allows you to modify the request config, such as adding authentication tokens, logging requests, or handling errors globally. By using an interceptor, you can ensure that all your API calls include necessary headers or tokens without having to add them manually in each request.
axiosInstance.interceptors.request.use(
    (config)=>{ // whenever a req like axiosInstance.get(), axios create a internally req configuration obj that is 
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`; // adding authorization header with the access token to the request config. This is typically used for authenticated API calls, where the backend expects a token to verify the user's identity and permissions. By adding this header in the interceptor, you ensure that all requests made with this axios instance will include the necessary authentication token without having to add it manually in each request.
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) { // checking whether the server sends any kind of res
            if (error.response.status === 500) {
                console.error("Server error:", error.response.data);
            }
        }
        else if(error.code=== 'ECONNABORTED') { 
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;