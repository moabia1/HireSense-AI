import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Route.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
