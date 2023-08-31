import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { getAxiosConfig } from "../axios_config";
import { access } from "fs";
import { useNavigate } from "react-router-dom";

export interface AuthContextProps {
  auth: Auth;
  loading: boolean;
  logout: () => void;
}

interface Props {
  children: ReactNode;
}

interface Auth {
  user: any;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState({} as Auth);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    const config = getAxiosConfig();
    async function profile() {
      try {
        const url = import.meta.env.VITE_BACK_URL;
        if (config) {
          const { data } = await axios(`${url}/profile`, config);

          setAuth(data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    profile();
  }, []);

  const logout = () => {
    setAuth({} as Auth);
    localStorage.removeItem("access_token");
    nav("/login");
  };
  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
