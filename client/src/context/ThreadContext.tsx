import { ReactNode, createContext, useState } from "react";
import { IThread } from "../components/ThreadSection";

export interface ThreadContextProps {
  threads: IThread[];
  handleThreadsState: (state: IThread[]) => void;
}

interface Props {
  children: ReactNode;
}

export const ThreadContext = createContext<ThreadContextProps>(
  {} as ThreadContextProps
);

export const ThreadProvider = ({ children }: Props) => {
  const [threads, setThreads] = useState<IThread[]>([]); //should be on a global

  function handleThreadsState(state: IThread[]) {
    setThreads(state);
  }

  return (
    <ThreadContext.Provider
      value={{
        threads,
        handleThreadsState,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
};
