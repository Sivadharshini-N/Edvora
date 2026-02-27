import axiosInstance from "../utils/axiosinstance.js";

import { API_PATHS } from "../utils/apiPaths";

const login = async (email, password) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email,
            password
        });
        return response.data;

    }
    catch(error){
        throw error.response?.data || {message: "An unknown error occurred during login."};
    }
};

const register = async (username, email, password) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            username, 
            email,
            password
        });
        return response.data;
    }
    catch(error){
        throw error.response?.data || {message: "An unknown error occurred during registration."};
    }
};


const getProfile = async () => {
    try{
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        return response.data;
    }
    catch(error){
        throw error.response?.data || {message: "An unknown error occurred while fetching profile."};
    }
};

const updateProfile = async (userData) => {
    try{
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
        return response.data;
    }
    catch(error){
        throw error.response?.data || {message: "An unknown error occurred while updating profile."};
    }
};

const changePassword = async (Passwords) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, Passwords);
        return response.data;
    }
    catch(error){
        throw error.response?.data || {message: "An unknown error occurred while changing password."};
    }
};

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword
};

export default authService;