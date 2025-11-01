import { type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import { type User } from "./userTypes.ts";
import userRouter from "./userRouter.ts";
import { create } from "domain";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Database call
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }

  // Token generation JWT
  try {
    const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    // Response
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while signing JWT token"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  let user: User | null;
  try {
    user = await userModel.findOne({ email: email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    return next(createHttpError(400, "Error while getting user"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "User name and password incorrect"));
  }

  // Create access token
  try {
    const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    res.json({ accesToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while fetching JWT token"));
  }
};

export { createUser, loginUser };
