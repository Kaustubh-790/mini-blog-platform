import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "./layout/layout";
import Home from "./pages/Home";

import "./index.css";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: "/", element: <Home /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
