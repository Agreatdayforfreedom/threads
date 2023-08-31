import { useContext } from "react";
import { ThreadContext, ThreadContextProps } from "../ThreadContext";

const useThread = () => useContext<ThreadContextProps>(ThreadContext);

export default useThread;
