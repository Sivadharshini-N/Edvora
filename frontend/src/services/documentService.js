import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);  
    return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while fetching documents." };
    }
};
const uploadDocument = async (formData) => {
    try {
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while uploading the document." };
    }
};

const deleteDocument = async (documentId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(documentId));
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while deleting the document." };
    }
};

const getDocumentById = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(documentId));
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "An unknown error occurred while fetching the document." };
    }
};

const documentService = {
    getDocuments,
    uploadDocument,
    deleteDocument,
    getDocumentById,
};

export default documentService;