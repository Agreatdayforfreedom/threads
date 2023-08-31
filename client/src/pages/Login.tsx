import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({} as any);
  const [form, setform] = useState({} as any);
  const nav = useNavigate();
  function useForm({ target }: ChangeEvent<HTMLInputElement>) {
    const { name, value } = target;
    setform({ ...form, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = import.meta.env.VITE_BACK_URL;
    if (!form.password || !form.username) {
      setAlert({ message: "All fields are required" });
      return setTimeout(() => {
        setAlert({});
      }, 3000);
    }
    setLoading(true);
    const { data } = await axios.post(`${url}/login`, { ...form });
    if (data.token) {
      console.log("xd");
      localStorage.setItem("access_token", data.token);
      nav("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-w-full h-screen grid place-content-center">
      <form className="p-2 border w-96 " onSubmit={handleSubmit}>
        <div className="p-2">
          <label className="px-1" htmlFor="username">
            Username
          </label>
          <input type="text" name="username" id="username" onChange={useForm} />
        </div>
        <div className="p-2">
          <label className="px-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={useForm}
          />
        </div>
        <div>
          <button type="submit">
            {loading ? <Loading custom="h-8 w-8" /> : "Login"}
          </button>
        </div>
        <div className="flex justify-center text-sm text-slate-400">
          <span className="px-2">Don't have an acconut? </span>
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </div>
        {alert.message ? (
          <p className="text-red-700 font-bold">{alert.message}</p>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default Login;
