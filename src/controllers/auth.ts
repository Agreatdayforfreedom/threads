import { Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../database";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  console.log(req.body);
  const userRepository = AppDataSource.getRepository(User);
  const user = new User();

  const exists = await userRepository.findOne({
    where: { username: req.body.username },
  });
  if (exists) {
    console.log(exists);
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  user.username = req.body.username;
  user.password = req.body.password;

  try {
    const userSaved = await userRepository.save(user);
    const token = jwt.sign(
      { username: userSaved.username, id: userSaved.id },
      process.env.JWT_SECRET as string
    );
    res.status(201).json({
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const login = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);

  const errorMessage = { message: "Username and/or password are incorrect" };

  const login = await userRepository.findOne({
    where: { username: req.body.username },
  });
  if (!login || req.body.password !== login.password)
    return res.status(401).json(errorMessage);

  try {
    const token = jwt.sign(
      { username: login.username, id: login.id },
      process.env.JWT_SECRET as string
    );
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const profile = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);

  const profile = await userRepository.findOne({
    where: { id: req.user.id },
  });

  if (!profile) {
  } // error;
  res.json({ user: profile });
};
