import { useContext } from "react";
import { AuthContext, AuthContextProps } from "../AuthContext";

const useAuth = () => useContext<AuthContextProps>(AuthContext);

export default useAuth;
