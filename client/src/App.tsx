import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import { ThreadProvider } from "./context/ThreadContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThreadProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </ThreadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
