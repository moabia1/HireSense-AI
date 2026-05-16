import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Route.jsx";
import App from "./App.jsx";
import "./style.scss";
import Navbar from "./components/Navbar/Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <App />
    </React.StrictMode>
);
