import express from 'express';
import { createBook, readBook, updateBook, deleteBook } from './bookController.ts';

const bookRouter = express.Router();

// Routes
bookRouter.post('/', createBook); 
bookRouter.post('/read', readBook);
bookRouter.post('/update', updateBook);
bookRouter.post('/delete', deleteBook);


export default bookRouter;