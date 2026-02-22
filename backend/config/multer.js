import  multer from 'multer'; //a third party package (lib/middleware) - import it from node_modules
import path from 'path'; //provided by node.js no need to install 1st party mdules - diff os have diff filepath format - path handles path normalization, directory joining, os safe seperator
import { fileURLToPath } from 'url'; //ES6 modules does not  support __dirname, so this will change the file url to  absolute path.
import fs from 'fs'; //provided by node.js no need to install

// JS cannot access fs directly like node.js does just by importing fs. Because node.js = js engine + c/cc++ native code + windows system calls. if filesystem has to be handled then node will switch to c++   

const __filename = fileURLToPath(import.meta.url); //meta.url contains fileurl of multer.js which is simplified to get the path that we are working in. eg: /project/src/middleware/multer.js
const __dirname = path.dirname(__filename);// we are removing the filename(multer.js) from__filename => __dirname = /project/src/middleware


const uploadDir = path.join(__dirname,'../uploads/documents'); //a kinda string that represents upload directory - reason for using {path} - normalizes slashes, resolves .., ensure os compatability
if(!fs.existsSync(uploadDir)){ //existsSync is a synchronous system call - which means node waits and blocks event loop 
    fs.mkdirSync(uploadDir,{recursive:true}); // recursive true - which will create parent directories if not present - if not given it will throw error
}

//configure storage
const storage = multer.diskStorage({ //multer supports two storage engines 1. diskStorage 2. memoryStorage(ram)
    destination: (req,file,cb) => { //when client sends file , the file arrives as a stream, the multer intercepts  it and asks where to store at one point. Before saving it ask for desti and name and we are answer it by call back(cb)
        cb(null,uploadDir); //answering to multer - null => no error, uploadDir=> save here
    },
    filename:(req,file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        cb(null,`${uniqueSuffix}-${file.originalname}`);
    }
});

//file filter - only pdfs
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'application/pdf') { // file.mimetype => "content-type": "application/pdf" dont confuse this with req.content-type="multipart/"
        cb(null,true);
    }
    else {
        cb(new Error(`Only PDF files are allowed!`),false);
    }
};

//configure multer 
const upload = multer({
    storage: storage,
    fileFilter:fileFilter,
    limits: {
        fileSize:parseInt(process.env.MAX_FILE_SIZE) || 10485760 //10MB default
    }

});

export default upload;


// Browser
//   ↓
// multipart/form-data request
//   ↓
// Express receives req
//   ↓
// Multer intercepts req stream
//   ↓
// Multer sees file PART
//   ↓
// Creates file metadata object
//   ↓
// Multer calls:
//      fileFilter(req, file, cb)
//   ↓
// YOU respond via cb
//   ↓
// If allowed → disk write
//   ↓
// After completion → req.file created
//   ↓
// Controller runs
