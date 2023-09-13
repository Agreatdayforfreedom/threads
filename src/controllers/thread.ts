import { Request, Response } from "express";
import { Thread } from "../models/Thread";
import { AppDataSource } from "../database";
import { User } from "../models/User";

interface ReqQuery {
  page?: string;
}

export const get_threads = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response
) => {
  const threadRepo = AppDataSource.getRepository(Thread);
  const page: number = req.query.page ? parseInt(req.query.page) : 1;

  const qb = threadRepo.createQueryBuilder("t");
  const threads = await qb
    .select('"t"."id"')
    .addSelect("t.content", "content")
    .addSelect("t.updated", "updated")
    .addSelect("t.deleted", "deleted")
    .addSelect("t.created_at", "created_at")
    .addSelect("user.id", "userid")
    .addSelect("st") //subthreads count
    .addSelect("user.username", "username")
    .addSelect(
      `EXISTS(SELECT * FROM likes_thread_thread ltt LEFT JOIN likes l ON l.id = ltt."likesId" WHERE l."userId" = :userId AND t.id = ltt."threadId")`,
      "liked"
    ) //param use in addselect
    // .addSelect("LEFT JOIN LATERAL thread AS st ON TRUE", "subthreads_count") // todo left lateral
    .leftJoin("t.user", "user")
    .leftJoin(
      (qb) => {
        qb.getQuery = () =>
          `LATERAL (SELECT COUNT(*)::INTEGER as st_count FROM thread st WHERE st.node_path <@ t.id::TEXT::LTREE AND st.node_path <> t.id::TEXT::LTREE)`;
        qb.setParameters({});
        return qb;
      },
      `st`,
      `TRUE`
    )
    .where("t.threadparentid IS NULL", { userId: req.user.id })
    .take(5)
    .skip(5 * (page - 1))
    // .orderBy("t.created_at", "DESC")
    .getRawMany();
  console.log(threads);
  const count = await qb.where("t.threadparentid IS NULL").getCount();
  const format = { count, threads };
  res.json(format);
};

export const get_subthreads = async (req: Request, res: Response) => {
  //parent id
  const { id } = req.params;
  const query = `SELECT 
  nlevel(t.node_path) as deep, t.threadparentid, t.deleted, t.updated, t.id, t.node_path, t.content, t.created_at, u.id as userid, u.username, u.avatar as avatar, EXISTS(SELECT * FROM likes_thread_thread ltt LEFT JOIN likes l ON l.id = ltt."likesId" WHERE l."userId" = $2 AND t.id = ltt."threadId") as liked FROM thread t 
  LEFT JOIN "user" u ON u.id = t."userId" 
  WHERE t.node_path <@ $1 AND t.node_path <> $1;`;

  // const query = `SELECT id from "user" u WHERE u.id = $1;`;
  const threads = await AppDataSource.query(query, [id, req.user.id]);
  res.json({ threads });
};

export const new_thread = async (req: Request, res: Response) => {
  const threadRepo = AppDataSource.getRepository(Thread);
  const userRepo = AppDataSource.getRepository(User);

  const thread = new Thread();

  const user = await userRepo.findOne({
    where: { id: req.user.id },
  });

  if (user) {
    thread.user = user;
  }
  thread.threadparentid = req.body.parentid;
  if (!req.body.content)
    return res.status(400).json({ message: "The content cannot be empty" });
  thread.content = req.body.content;

  const { user: userObj, ...rest } = await threadRepo.save(thread);
  const raw = {
    ...rest,
    username: userObj.username,
    userid: userObj.id,
  };
  res.status(201).send(raw);
};
export const update_thread = async (req: Request, res: Response) => {
  const threadRepo = AppDataSource.getRepository(Thread);
  const userRepo = AppDataSource.getRepository(User);
  const { id } = req.params;
  const thread = await threadRepo.findOne({
    relations: { user: true },
    where: { id: parseInt(id, 10) },
  });
  const user = await userRepo.findOne({ where: { id: req.user.id } });
  if (!user) return res.status(500).json({ message: "Internal server error" }); //it should be auth
  if (!thread) return res.status(404).json({ message: "Thread not found" });

  if (user.id !== thread.user.id)
    return res.status(401).json({ message: "Unauthorized" });
  thread.content = req.body.content;
  const updated = await threadRepo.save(thread);
  res.json({ ...updated });
};

//a subthread cannot be removed, just mark it as removed.
export const delete_subthread = async (req: Request, res: Response) => {
  const threadRepo = AppDataSource.getRepository(Thread);
  const userRepo = AppDataSource.getRepository(User);
  const [st] = await threadRepo.find({
    relations: {
      user: true,
    },
    where: { id: parseInt(req.params.id) },
  });
  if (!st) return res.status(404).json({ message: "Subthread not found" });

  const [user] = await userRepo.find({
    where: { id: req.user.id },
  });
  if (!user) return res.status(400).json({ message: "Invalid user" });

  if (user.id !== st.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  st.deleted = true;

  const deleted = await threadRepo.save(st);
  res.json(deleted);
};

export const delete_thread = (req: Request, res: Response) => {};

/*
  curl http://localhost:4000/thread/new \ 
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFzZCIsImlkIjo5LCJpYXQiOjE2OTEwNzM3ODF9.x6U7bVNjLwXjDfKQ3htbLUsof3EQuFQtKn2XZKO5dcw" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"content": "hello bro"}'

  curl http://localhost:4000/thread \ 
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFzZCIsImlkIjo5LCJpYXQiOjE2OTEwNzM3ODF9.x6U7bVNjLwXjDfKQ3htbLUsof3EQuFQtKn2XZKO5dcw" \
  -H "Content-Type: application/json" \
  -X GET 
  
  

 */
