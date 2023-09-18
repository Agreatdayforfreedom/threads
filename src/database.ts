import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Thread } from "./models/Thread";
import { Likes } from "./models/Likes";

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Thread, Likes],
  synchronize: true,
  logging: false,
  ssl: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database working");
  })
  .catch((error) => console.log(error));

export { AppDataSource };
