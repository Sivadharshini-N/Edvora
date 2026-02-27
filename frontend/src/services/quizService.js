import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const getQuizzesForDocuments = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES_FOR_DOC, { documentId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An unknown error occurred while fetching quizzes for the document." };
  }
};

const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while fetching the quiz." };
    }
};

const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), { answers });
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while submitting the quiz." };
    }
};

const getQuizResults = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
        return response.data;
    }
    catch (error) {        
        throw error.response?.data || { message: "An unknown error occurred while fetching quiz results." };
    }
};

const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while deleting the quiz." };
    }
};

export const quizService = {
  getQuizzesForDocuments,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz
};

export default quizService;