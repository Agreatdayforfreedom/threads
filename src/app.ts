import express, { Request, Response } from "express";
import "dotenv/config";
import authRouter from "./routes/auth";
import cors from "cors";
import threadRouter from "./routes/thread";
import likesRouter from "./routes/likes";
import { AppDataSource } from "./database";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/ping", async (req: Request, res: Response) => {
  const dbpong = await AppDataSource.query("SELECT NOW()");
  res.send(`pong, ${dbpong[0] ? dbpong[0].now : "database unavailable"}`);
});

app.use("/", authRouter);
app.use("/thread", threadRouter);
app.use("/thread", likesRouter);

app.listen(4000, () => console.log("server on port 4000"));
