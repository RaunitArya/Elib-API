import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import bookModel from "./bookModel.ts";
import { type Book } from "./bookTypes.ts";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  if (!files.coverImage || !files.coverImage[0]) {
    return next(createHttpError(400, "Cover image is required"));
  }
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

  // Cover Image's file name
  const fileName = files.coverImage[0].filename;
  const filePath = path.join(
    path.dirname(" ../../public/data/uploads"),
    fileName
  );

  try {
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: "book-covers",
    ...(coverImageMimeType && { format: coverImageMimeType }),
  });

  // Book's file name 
  if (!files.file || !files.file[0]) {
    return next(createHttpError(400, "File is required"));
  }
  const BookFileName = files.file[0].filename;
  const bookFilePath = path.join(
    path.dirname(" ../../public/data/uploads"),
    BookFileName
  );

  const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
    resource_type: "raw",  //for pdfs
    filename_override: BookFileName,
    folder: "book-pdfs",
    format: "pdf",
  });

  console.log("bookFileUploadResult", bookFileUploadResult);
  console.log("uploadResult", uploadResult);
  res.json({});
  } catch(err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading the files"));
  }
};

const readBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({});
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({});
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({});
};

export { createBook, readBook, updateBook, deleteBook };
