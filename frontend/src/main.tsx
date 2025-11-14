import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Modules from "./module/Modules";
import Students from "./student/Students";
import StudentInspect from "./student/StudentInspect";
import Grades from "./grade/Grades";
import Registrations from "./registration/Registrations";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/modules", element: <Modules /> },
  { path: "/students", element: <Students /> },
  { path: "/students/:id", element: <StudentInspect /> },
  { path: "/grades", element: <Grades /> },
  { path: "/registrations", element: <Registrations /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
