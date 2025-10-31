import { type NextFunction, type Request, type Response } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "User created" });
};

export { createUser };
