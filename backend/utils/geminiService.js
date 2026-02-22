import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();


if(!process.env.GEMINI_API_KEY){
    console.error("Gemini API key is not set. Please set the GEMINI_API_KEY environment variable.");
    process.exit(1);
}
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: String, answer: string, difficulty:string}>>}
 * 
 */


export const generateFlashcards = async (text, count) => {
    const prompt = `Generate exactly ${count} educational flashcards from the following text.
    Format each flashcard as:
    Q:[Clear, specific question]
    A:[Concise, accurate answer]
    D:[Difficulty level: easy, medium, hard]
    
    Seperate each flashcard with "---"
    Text:
    ${text.substring(0,15000)}`;

    try{
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        const generatedText = response.text;

        //parse the response
        const flashcards = [];

        const cards = generatedText.split('---').filter(c=>c.trim());

        for(const card of cards){
            const lines = card.trim().split('\n');
            let question = '', answer = '', difficulty = 'medium';;

            for(const line of lines){
                if(line.startsWith('Q:')){
                    question = line.substring(2).trim();//Give me the string starting from index 2 to the end
                }
                else if(line.startsWith('A:')){
                    answer = line.substring(2).trim();
                }
                else if(line.startsWith('D:')){
                    const diff = line.substring(2).trim().toLowerCase();
                    if(['easy','medium','hard'].includes(diff)){
                        difficulty = diff;
                    }
                }
            }

            if(question && answer){
                flashcards.push({question,answer,difficulty});
            }
        }
        return flashcards;
    }
    catch(error){
        console.error("Gemini Api Error:", error.message || error);
        throw new Error(`Failed to generate flashcards: ${error.message || error}`);
    }
};



/**
 * Generate quiz from questions
 * @param {string} text - document text
 * @param {number} numQuestions - number of quiz questions to generate
 * @returns {Promise<Array<{question: string, options: Array,correctAnwer: string, explanation: string, difficulty: string}}
 */

export const generateQuiz = async (text, numQuestions =5 ) => {
    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
    Format each question as:
    Q: [Question]
    O1: [Option 1]
    O2: [Option 2]
    O3: [Option 3]
    O4: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explanation]
    D: [Difficulty: easy, medium, hard]

    Seperate each question with "---"
    
    Text:
    ${text.substring(0,15000)}`;
    
    try{
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash-lite',
             contents: prompt,
        });

        const generatedText = response.text;

        const questions = [];
        const questionBlocks = generatedText.split('---').filter(q=>q.trim());

        for(const block of questionBlocks){
            const lines = block.trim().split('\n');
            let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';

            for(const line of lines){
                const trimmed = line.trim();
                if(trimmed.startsWith('Q:')){
                    question = trimmed.substring(2).trim();
                }
                else if(trimmed.match(/^O\d:/)){
                    options.push(trimmed.substring(3).trim());
                }
                else if(trimmed.startsWith('C:')){
                    correctAnswer = trimmed.substring(2).trim();
                }
                else if(trimmed.startsWith('E:')){
                    explanation = trimmed.substring(2).trim();
                }
                else if(trimmed.startsWith('D:')){
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if(['easy','medium','hard'].includes(diff)){
                        difficulty = diff;
                    }
                }


            }
            if(question && options.length === 4 && correctAnswer){
                questions.push({question, options, correctAnswer, explanation, difficulty});
            }
        }
        return questions;

    }
    catch(error){
        console.error("Gemini Api error: ", error.message || error);
        throw new Error(`Failed to generate quiz: ${error.message || error}`);
    }
};


/**
 * @param {String} text - document text
 * @returns {Promise<String>}
 */

export const generateSummary = async (text) => {
    const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important points.
    Keep the summary clear and structured.

    Text: 
    ${text.substring(0,20000)}`;

    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        })

        const generatedText = response.text;
        return generatedText.trim();
    }
    catch(error){
        console.error("Gemini api error: ", error.message || error);
        throw new Error(`Failed to generate summary: ${error.message || error}`);
    }
};


/**
 * chat with document context
 * @param {string} question -user question
 * @param {Array<Object>} chunks - relevant documet chunks
 * @returns {Promise<string>}
 */

export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c,i) => `[Chunk ${i+1}]: ${c.content}`).join('\n\n'); //    const context = chunks.map((c,i) => `[Chunk ${i+1}]: ${c.text}`).join('\n\n');


    console.log("context____", context);

    const prompt = `Based on the following context from a document, Analyse the context and answer the user's question
    If the answer is not in the context, say so.
    
    context:
    ${context}
    Question:
    ${question}
    Answer:`;

    try{
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        const generatedText = response.text;
        return generatedText.trim();
    }
    catch(error){
        console.error('Gemini API error:', error.message || error);
        throw new Error(`Failed to generate answer: ${error.message || error}`);
    }
};


/**
 * Explain a specific concept from the document
 * @param {string} concept - concept to explain
 * @param {string} context - relevant document context
 * @returns {Promise<string>}
 */

export const explainConcept = async (concept, context) => {
    const prompt = `Explain the concept of "${concept}" based on the following context.
    Provide a clear, educational explanation that's easy to understand.
    Include examples if relevant.
    
    Context:
    ${context.substring(0,10000)}`;

    try{
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        const generatedText = response.text;
        return generatedText.trim();
    }
    catch(error){
        console.error('Gemini API error:', error.message || error);
        throw new Error(`Failed to explain concept: ${error.message || error}`);
    }
}
