import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth";
import cors from "cors";
import threadRouter from "./routes/thread";
import likesRouter from "./routes/likes";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/", authRouter);
app.use("/thread", threadRouter);
app.use("/thread", likesRouter);

app.listen(4000, () => console.log("server on port 4000"));
