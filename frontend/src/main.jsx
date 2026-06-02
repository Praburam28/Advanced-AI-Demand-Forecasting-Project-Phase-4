import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App";

import "./index.css";

import {
  AuthProvider
} from "./context/AuthContext";

import {
  ThemeProvider
} from "./context/ThemeContext";


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,

              style: {
                background: "#0f172a",
                color: "#fff",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
              },

              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },

              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);