import { Request, Response, Router } from "express";
import { AppDataSource } from "../database";
import { Thread } from "../models/Thread";
import { Likes } from "../models/Likes";
import { User } from "../models/User";
import { isAuth } from "../middlewares/isAuth";

const likesRouter = Router();

likesRouter.get("/likes/:threadid", async (req: Request, res: Response) => {
  const qb = AppDataSource.getRepository(Likes).createQueryBuilder("l");

  const likes = await qb
    .leftJoin("l.thread", "t")
    .where("t.id = :threadid", { threadid: req.params.threadid })
    .getCount();

  res.json(likes);
});

likesRouter.put(
  "/like/:threadid",
  isAuth,
  async (req: Request, res: Response) => {
    const { threadid } = req.params;

    const threadRepo = AppDataSource.getRepository(Thread);
    const userRepo = AppDataSource.getRepository(User);

    const thread = await threadRepo.findOne({
      where: { id: parseInt(threadid, 10) },
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const user = await userRepo.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [liked] = await AppDataSource.query(
      ` SELECT ltt.*, l.* FROM likes_thread_thread ltt LEFT JOIN likes l ON l.id = ltt."likesId" WHERE ltt."threadId" = $2  AND l."userId" = $1;`,
      [req.user.id, req.params.threadid]
    );

    if (liked) {
      const response = await AppDataSource.getRepository(Likes)
        .createQueryBuilder("likes")
        .delete()
        .from(Likes)
        .where("likes.id = :id", { id: liked.likesId })
        .execute();
      if (response) {
        res.json({ liked: false, thread: liked.threadId });
      }
      return;
    }

    const like = new Likes();

    like.thread = [thread];
    like.user = user;
    const data = await AppDataSource.manager.save(like);

    if (data) {
      res.json({ liked: true, thread: data.thread[0].id });
    }
  }
);

likesRouter.put(
  "/dislike/:threadid",
  isAuth,
  async (req: Request, res: Response) => {
    //find like id
  }
);

export default likesRouter;
