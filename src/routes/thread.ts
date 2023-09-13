import { Router } from "express";
import {
  delete_subthread,
  delete_thread,
  get_subthreads,
  get_threads,
  new_thread,
  update_thread,
} from "../controllers/thread";
import { isAuth } from "../middlewares/isAuth";

const threadRouter = Router();

threadRouter.get("/", isAuth, get_threads);
threadRouter.get("/:id", isAuth, get_subthreads);
threadRouter.post("/new", isAuth, new_thread);
threadRouter.put("/update/:id", isAuth, update_thread);
threadRouter.delete("/delete/sub/:id", isAuth, delete_subthread);
threadRouter.post("/delete/:id", isAuth, delete_thread);

export default threadRouter;
