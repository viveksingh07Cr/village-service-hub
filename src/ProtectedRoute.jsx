import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({
  children,
  type = "customer",
}) {
  const location = useLocation();

  let isAuthenticated = false;
  let loginPath = "/login";

  // =========================================
  // CUSTOMER
  // =========================================
  if (type === "customer") {
    const token =
      localStorage.getItem("vshToken");

    const savedUser = JSON.parse(
      localStorage.getItem("vshUser") ||
        "null"
    );

    isAuthenticated =
      Boolean(token) &&
      Boolean(savedUser?.id);

    loginPath = "/login";
  }

  // =========================================
  // PROFESSIONAL
  // =========================================
  if (type === "professional") {
    const token =
      localStorage.getItem(
        "vshProfessionalToken"
      );

    const professional =
      JSON.parse(
        localStorage.getItem(
          "vshProfessional"
        ) || "null"
      );

    isAuthenticated =
      Boolean(token) &&
      Boolean(professional);

    loginPath =
      "/professional-login";
  }

  // =========================================
  // ADMIN
  // =========================================
  if (type === "admin") {
    const token =
      localStorage.getItem(
        "vshAdminToken"
      );

    isAuthenticated =
      Boolean(token);

    loginPath =
      "/admin-login";
  }

  // =========================================
  // NOT AUTHENTICATED
  // =========================================
  if (!isAuthenticated) {
    return (
      <Navigate
        to={loginPath}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================
  // AUTHENTICATED
  // =========================================
  return children;
}

export default ProtectedRoute;