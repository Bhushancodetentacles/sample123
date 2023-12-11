import { Navigate, Outlet } from "react-router-dom";

const LoginRedirect = () => {
  const isAuthenticated = localStorage.getItem("token") !== null || false;
  // const isAuthenticated = true
  return !isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default LoginRedirect;
