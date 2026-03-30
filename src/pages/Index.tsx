import { Navigate } from "react-router-dom";

// Index redirects to dashboard (handled by router)
export default function Index() {
  return <Navigate to="/" replace />;
}
