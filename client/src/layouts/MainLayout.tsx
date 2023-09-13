import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../context/hooks/useAuth";
import Loading from "../components/Loading";

const MainLayout = () => {
  const { auth, loading, logout } = useAuth();

  if (loading) return <Loading />;
  if (!auth.user) return <Navigate to="/login" />;
  return (
    <div>
      <header className="flex h-12 bg-slate-950 items-center">
        <div className="flex justify-between w-full h-fit">
          <span>Hello, {auth.user.username}</span>
          <button
            onClick={logout}
            className="bg-slate-800 mx-2 px-2 py-1 rounded"
          >
            Log out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default MainLayout;
