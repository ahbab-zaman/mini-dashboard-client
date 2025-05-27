import { createBrowserRouter } from "react-router";
import App from "./App";
import Task from "./Pages/Task";
import Goals from "./Pages/Goals";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Task />,
      },
      {
        path: "/goals",
        element: <Goals />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/register",
    element:<Register />
  }
]);

export default router;
