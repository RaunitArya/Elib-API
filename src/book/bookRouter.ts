import express from "express";
import path from "node:path";
import {
  createBook,
  listBooks,
  getSingleBook,
  updateBook,
  deleteBook,
} from "./bookController.ts";
import multer from "multer";
import authenticate from "../middlewares/authenticate.ts";

const bookRouter = express.Router();

const upload = multer({
  dest: path.dirname(" ../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

const uploadMiddleware = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

// Routes
bookRouter.post("/", authenticate, uploadMiddleware, createBook);
bookRouter.patch("/:bookId", authenticate, uploadMiddleware, updateBook);
bookRouter.get("/", listBooks);
bookRouter.get("/:bookId", getSingleBook);
bookRouter.delete("/:bookId", authenticate, deleteBook);

export default bookRouter;
