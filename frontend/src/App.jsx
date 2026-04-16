import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Route.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import {interviewProvider} from "./features/interview/interview.context.jsx";

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
