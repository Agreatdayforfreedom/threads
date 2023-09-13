import { ReactNode, createContext } from "react";

export interface SubThreadContextProps {}

export const SubThreadContext = createContext<SubThreadContextProps>(
  {} as SubThreadContextProps
);

interface Props {
  children: ReactNode;
}

export const SubThreadProvider = ({ children }: Props) => {
  return (
    <SubThreadContext.Provider value={{}}>{children}</SubThreadContext.Provider>
  );
};
