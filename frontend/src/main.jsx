import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Route.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import App from "./App.jsx";
import "./style.scss";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
