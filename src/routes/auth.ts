import { Router } from "express";
import { login, profile, signup } from "../controllers/auth";
import { isAuth } from "../middlewares/isAuth";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/profile", isAuth, profile);

export default authRouter;
