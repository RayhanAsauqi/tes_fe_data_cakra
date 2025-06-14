import { Navigate, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";

import AuthPage from "@/app/auth";
import { ProtectedRoute } from "@/lib/middleware/route-protect";

import ArticleDetailPage from "@/app/articles/detail";
import NotFoundPage from "@/app/not-found";
import "@/style/global.css";
import ArticlePage from "@/app/index";
import { AuthStore } from "./lib/store/auth-store";
import { useEffect } from "react";

function App() {
  const [cookies] = useCookies(["token"]);
  const setIsAuthenticated = AuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    setIsAuthenticated(!!cookies.token);
  }, [cookies.token, setIsAuthenticated]);

  const isAuthenticated = AuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Main route always accessible */}
      <Route path="/" element={<ArticlePage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="detail/:documentId" element={<ArticleDetailPage />} />
      </Route>

      {/* Auth route - only for unauthenticated users */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
