import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css"; //core css
import "primeflex/primeflex.css";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
const queryClient = new QueryClient();

import { PrimeReactProvider } from "primereact/api";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <PrimeReactProvider>
          <App />
          <ToastContainer />
        </PrimeReactProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  </StrictMode>
);
