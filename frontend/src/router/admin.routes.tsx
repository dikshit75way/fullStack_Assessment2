import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProtectedRoute } from "../components/ProtectedRoute";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const Tracking = lazy(() => import("../pages/Tracking").then(module => ({ default: module.Tracking })));
const AddEditVehicle = lazy(() => import("../pages/AddEditVehicle").then(module => ({ default: module.AddEditVehicle })));

export const adminRoutes: RouteObject = {
  element: <ProtectedRoute roles={['admin']} />,
  children: [
    { 
        path: "/admin", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        ) 
    },
    { 
        path: "/admin/vehicles/new", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AddEditVehicle />
          </Suspense>
        ) 
    },
    { 
        path: "/admin/vehicles/edit/:id", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AddEditVehicle />
          </Suspense>
        ) 
    },
    { 
        path: "/admin/tracking/:id", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Tracking />
          </Suspense>
        ) 
    },
  ]
};
