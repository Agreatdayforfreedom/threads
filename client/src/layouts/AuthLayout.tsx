import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../context/hooks/useAuth";
import Loading from "../components/Loading";

const AuthLayout = () => {
  const { auth, loading } = useAuth();
  if (loading) return <Loading />;
  if (auth) return <Navigate to="/" />;
  return <Outlet />;
};

export default AuthLayout;
