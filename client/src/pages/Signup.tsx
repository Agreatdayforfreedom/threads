import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import useAuth from "../context/hooks/useAuth";
import Loading from "../components/Loading";
import { Navigate, useNavigate } from "react-router-dom";

interface Form {
  username: string;
  password: string;
  rpassword: string;
}

const Signup = () => {
  const [form, setForm] = useState<Form>({} as Form);
  const [alert, setAlert] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  function useForm({ target }: ChangeEvent<HTMLInputElement>) {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.username || !form.password || !form.rpassword) {
      setAlert({ message: "All fields are required" });
      return setTimeout(() => {
        setAlert({});
      }, 3000);
    }
    setLoading(true);
    const url = import.meta.env.VITE_BACK_URL;
    const { data } = await axios.post(`${url}/signup`, { ...form });

    if (data.token) {
      localStorage.setItem("access_token", data.token);
      nav("/");
      setLoading(false);
    }
  }

  return (
    <div className="min-w-full h-screen grid place-content-center">
      <form className="p-2 border w-96" onSubmit={handleSubmit}>
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
        <div className="p-2 ">
          <label className="px-1 " htmlFor="rpassword">
            Repeat Password
          </label>
          <input
            type="password"
            name="rpassword"
            id="rpassword"
            onChange={useForm}
          />
        </div>
        <div>
          <button type="submit">
            {loading ? <Loading custom="w-8 h-8" /> : "Sign up"}
          </button>
        </div>
        {alert.message ? (
          <p className="font-bold text-red-700">{alert.message}</p>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default Signup;
