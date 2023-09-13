import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Thread } from "./models/Thread";
import { Likes } from "./models/Likes";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "secret",
  database: "postgres",
  entities: [User, Thread, Likes],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database working");
  })
  .catch((error) => console.log(error));

export { AppDataSource };
