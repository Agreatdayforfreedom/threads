import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Thread } from "./Thread";
import { Likes } from "./Likes";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    default: `https://www.gravatar.com/avatar/${Math.floor(
      Math.random() * 100
    )}?d=robohash&f=y&s=128`,
  })
  avatar: string;
  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];

  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];
}
