import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database";
import { User } from "../models/User";

interface IUser {
  id: number;
  username: string;
  password?: string;
}

interface IPayload {
  // user: IUser;
  id: number;
  username: number;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepo = AppDataSource.getRepository(User);
  let token: string = "";
  const simple = req.headers.authorization as string;
  console.log(simple);
  if (simple && simple.startsWith("Bearer") && simple.length > 20) {
    try {
      token = simple.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as IPayload;
      console.log(decoded);

      const user = (await userRepo.findOne({
        where: { id: decoded.id },
      })) as IUser;
      const { password, ...rest } = user;
      req.user = rest;

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(401).json({ message: "Invalid Access token" });
  }
};
