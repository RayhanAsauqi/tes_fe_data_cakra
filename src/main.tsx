import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CookiesProvider } from "react-cookie";

import App from "@/App.tsx";
import "@/index.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <App />
        <Toaster />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
