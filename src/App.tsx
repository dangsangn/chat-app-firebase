import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAuthContext } from "./context/auth/AuthContext";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";

function App() {
  const { state } = useAuthContext();

  const ProtectRoute = ({
    children,
  }: {
    children: React.ReactElement;
  }): JSX.Element => {
    if (!state.userProfile) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          }
        />
      </Routes>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
