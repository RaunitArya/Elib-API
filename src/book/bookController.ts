import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import bookModel from "./bookModel.ts";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";
import fs from "node:fs";
import type { AuthRequest } from "../middlewares/authenticate.ts";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
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

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw", //for pdfs
        filename_override: BookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp files
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      return next(createHttpError(500, "Error while deleting temp files"));
    }

    res.status(201).json({ id: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading the files"));
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // todo: Add Pagination
    const book = await bookModel.find();
    res.json({ book });
  } catch (err) {
    return next(createHttpError(500, "Error while fetching books"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.bookId;
    const book = await bookModel.findOne({ _id: id });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    res.json({ book });
  } catch (err) {
    return next(createHttpError(500, "Error while getting the book"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // Check Access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "No access"));
  }

  // Check if image file exists
  const files = req.files as { [filename: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  if (files.coverImage && files.coverImage[0]) {
    const filename = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    // send files to cloudinary
    const filePath = path.join(
      path.dirname(" ../../public/data/uploads"),
      filename
    );
    completeCoverImage = filename as string;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // Check if file field exists
  let completeFileName = "";

  if (files.file && files.file[0]) {
    const bookFilePath = path.join(
      path.dirname(" ../../public/data/uploads"),
      files.file[0].filename
    );
    const bookfileName = files.file[0].filename;
    completeFileName = bookfileName;

    const uploadResultPDF = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
      format: "pdf",
    });

    completeFileName = uploadResultPDF.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.bookId;
    const book = await bookModel.findOne({ _id: id });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // Check Access
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "No access"));
    }

    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);

    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
    bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);

    // Delete files from cloudinary
    try {
      await cloudinary.uploader.destroy(coverImagePublicId);
      await cloudinary.uploader.destroy(bookFilePublicId, {
        resource_type: "raw",
      });
    } catch (err) {
      return next(createHttpError(500, "Error while deleting file & cover image"));
    }

    // Delete book from db
    await bookModel.deleteOne({_id: id});
    res.sendStatus(204);    
  } catch (err) {
    return next(createHttpError(500, "Error while deleting the book"));
  }
};

export { createBook, listBooks, getSingleBook, updateBook, deleteBook };
