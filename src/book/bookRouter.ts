import express from 'express';
import path from 'node:path';
import { createBook, readBook, updateBook, deleteBook } from './bookController.ts';
import multer from 'multer';

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, ' ../../public/data/uploads'),
    limits: {fileSize: 3e7} 
})

// Routes
bookRouter.post('/', upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "file", maxCount:1},
]), createBook); 
bookRouter.post('/read', readBook);
bookRouter.post('/update', updateBook);
bookRouter.post('/delete', deleteBook);


export default bookRouter;