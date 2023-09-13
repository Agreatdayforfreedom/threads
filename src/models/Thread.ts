import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Likes } from "./Likes";

@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  threadparentid: number;

  @Column({ type: "ltree", nullable: true })
  node_path: number;

  @Column({ length: 999 })
  content: string;

  @ManyToOne(() => User, (user) => user.threads)
  user: User;

  @Column({ type: "timestamptz", default: () => "NOW()" })
  created_at: Date;

  @Column({ default: false })
  updated: boolean;

  @Column({ default: false })
  deleted: boolean;

  @ManyToMany(() => Likes, (likes) => likes.thread)
  likes: Likes[];
}
