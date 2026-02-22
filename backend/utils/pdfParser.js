import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

/**
 * Extract text from pdf file
 * @param {string} filePath - path to pdf file
 * @returns {Promise<{text: string, numPages:number}>}
 */

export const extractTextFromPDF = async (filePath) => {
    try{
        const dataBuffer = await fs.readFile(filePath); // node takes complex binary data from file into this buffer
       
        //pdf-parse expects a Uint8Array, not a Buffer, so we are changing 
        const parser = new PDFParse(new Uint8Array(dataBuffer)); // reads the dataBuffer and understands its structure - parsing
        const data = await parser.getText(); // converting into text would take some time so we are returning a promise here
        

        return {
            text: data.text,
            numPages: data.numpages,
            info:data.info,
        };
    }
    catch (error){
        console.error("pdf parsing error:",error);
        throw new Error("Failed to extract text from PDF");
    }
}
 