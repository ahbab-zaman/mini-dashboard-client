import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import router from "./router.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A2537",
            color: "#fff",
            zIndex: 9999, // ✅ Add your desired z-index here
          },
        }}
      />
    </RouterProvider>
  </StrictMode>
);
