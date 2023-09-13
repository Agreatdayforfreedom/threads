import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Thread } from "./Thread";
import { User } from "./User";

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToMany(() => Thread, (thread) => thread.likes)
  @JoinTable()
  thread: Thread[];
}
