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
import { fileURLToPath } from "node:url";

const bookRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"), 
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
