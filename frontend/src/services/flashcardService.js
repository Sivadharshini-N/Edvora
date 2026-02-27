import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";
//we can also export const <>= {}
const getAllFlashcards = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An unknown error occurred while fetching flashcards." };
  }
};

const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));  
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An unknown error occurred while fetching flashcards for the document." };
  }     
};

const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
        return response.data;
    } catch (error) {        
        throw error.response?.data || { message: "An unknown error occurred while reviewing the flashcard." };
    }   
};

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));    
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while toggling the star status of the flashcard." };
    }
};

const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while deleting the flashcard set." };
    }
};
const flashcardService = {
  getAllFlashcards,
  getFlashcardsForDocument,
  reviewFlashcard,
  toggleStar,
  deleteFlashcardSet
};

export default flashcardService;