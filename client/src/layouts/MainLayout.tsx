import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/hooks/useAuth";
import Loading from "../components/Loading";

const MainLayout = () => {
  const { auth, loading, logout } = useAuth();

  if (loading) return <Loading />;
  if (!auth.user) return <Navigate to="/login" />;
  return (
    <div>
      <header className="flex h-12">
        <div>Hello, {auth.user.username}</div>
        <button onClick={logout}>Log out</button>
      </header>
      <Outlet />
    </div>
  );
};

export default MainLayout;
