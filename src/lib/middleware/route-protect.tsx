import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  redirectWhenAuthenticated?: string;
  redirectWhenUnauthenticated?: string;
  allowAuthenticated?: boolean;
};

export const ProtectedRoute = ({
  isAuthenticated,
  redirectWhenAuthenticated = "/dashboard/about",
  redirectWhenUnauthenticated = "/auth",
  allowAuthenticated = true,
}: ProtectedRouteProps) => {
  if (allowAuthenticated && !isAuthenticated) {
    return <Navigate replace to={redirectWhenUnauthenticated} />;
  }

  if (!allowAuthenticated && isAuthenticated) {
    return <Navigate replace to={redirectWhenAuthenticated} />;
  }

  return <Outlet />;
};
