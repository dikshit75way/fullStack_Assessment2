import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { adminRoutes } from "./admin.routes";

// Lazy load pages
const Home = lazy(() => import("../pages/Home").then(module => ({ default: module.Home })));
const Vehicles = lazy(() => import("../pages/Vehicles").then(module => ({ default: module.Vehicles })));
const VehicleDetails = lazy(() => import("../pages/VehicleDetails").then(module => ({ default: module.VehicleDetails })));
const UserDashboard = lazy(() => import("../pages/UserDashboard").then(module => ({ default: module.UserDashboard })));
const Login = lazy(() => import("../pages/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("../pages/Register").then(module => ({ default: module.Register })));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        path: "/", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ) 
      },
      { 
        path: "/vehicles", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Vehicles /> 
          </Suspense>
        )
      },
      // Protected Routes for Authenticated Users
      {
        element: <ProtectedRoute />,
        children: [
             { 
                path: "/vehicles/:id", 
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <VehicleDetails />
                  </Suspense>
                ) 
             },
             { 
                path: "/dashboard", 
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <UserDashboard />
                  </Suspense>
                ) 
             },
        ]
      },
      adminRoutes
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { 
        path: "login", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        ) 
      },
      { 
        path: "register", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        ) 
      },
    ],
  },
]);
