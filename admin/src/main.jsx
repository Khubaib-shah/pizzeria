import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NotificationsProvider } from "./hooks/useNotifications.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </StrictMode>
);
