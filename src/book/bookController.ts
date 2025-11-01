import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import bookModel from "./bookModel.ts";
import { type Book } from "./bookTypes.ts";

const createBook = async(req: Request, res:Response, next: NextFunction) => {
    res.json({});
};

const readBook = async(req: Request, res:Response, next: NextFunction) => {
    res.json({});
};

const updateBook = async(req: Request, res:Response, next: NextFunction) => {
    res.json({});
};

const deleteBook = async(req: Request, res:Response, next: NextFunction) => {
    res.json({});
};

export {createBook, readBook, updateBook, deleteBook};