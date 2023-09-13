import { ReactNode, createContext, useEffect, useState } from "react";
import { IThread } from "../components/ThreadSection";
import { getAxiosConfig } from "../axios_config";
import axios from "axios";

export type Type_SetSubThreadFn = (thread: IThread[]) => void;

export interface ThreadContextProps {
  threads: IThread[];
  // loading: boolean;
  handleThreadsState: (state: IThread[]) => void;
  updateThread: (
    thread: IThread,
    type: number,
    like?: { liked: boolean; thread: number }
  ) => void;
}

interface Props {
  children: ReactNode;
}

export const ThreadContext = createContext<ThreadContextProps>(
  {} as ThreadContextProps
);

export const ThreadProvider = ({ children }: Props) => {
  const [threads, setThreads] = useState<IThread[]>([]);

  useEffect(() => {
    console.log("xd");
  }, []);
  function handleThreadsState(state: IThread[]) {
    setThreads([...threads, ...state]);
  }
  function updateThread(
    thread: IThread,
    type: number,
    like?: { liked: boolean; thread: number }
  ) {
    //1: create, 2: french, 2: update, 3: delete, 4: like
    if (type === 1) {
      handleThreadsState([thread, ...threads]);
    } else if (type === 2) {
      const updateThread = threads.map((item) => {
        if (item.id === thread.id) {
          return thread;
        }
        return item;
      });
      setThreads([...updateThread]);
    } else if (type === 3) {
      handleThreadsState([...threads.filter((t) => t.id !== thread.id)]);
    } else if (type === 4 && like) {
      const likedThread = threads.map((item) => {
        if (item.id === like.thread) {
          if (like.liked) {
            // +1
          } else {
            // -1
          }
          item.liked = like.liked;
          return item;
        }
        return item;
      });
      setThreads([...likedThread]);
    } else {
      console.log(`Error invalid ${type} type`);
    }
  }

  return (
    <ThreadContext.Provider
      value={{
        threads,
        updateThread,
        // loading,
        handleThreadsState,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
