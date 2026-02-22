import express from 'express';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument
} from '../controllers/documentController.js';
import protect from '../middlewares/auth.js';
import upload from '../config/multer.js'; // Browsers send files as multipart/form-data. Node cannot read that by default — Multer helps.

//responsible for - delegates task to controller, middle ware usage, http methods  
const router = express.Router(); // defining router obj. mini express app - router

router.use(protect); //apply protect middleware to all routes - every time a endpoint is hitted the protect will run before processing

router.post('/upload',upload.single('file'),uploadDocument); // /document is already mounted in server.js  , single-> accepts one file and the the file field name should be 'file' in req  
router.get('/',getDocuments);
router.get('/:id',getDocument);
router.delete('/:id',deleteDocument);
// router.put('/:id',updateDocument);


export default router;
