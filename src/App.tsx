import { Navigate, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";

import AuthPage from "@/app/auth";
import { ProtectedRoute } from "@/lib/middleware/route-protect";

import ArticleDetailPage from "@/app/articles/detail";
import NotFoundPage from "@/app/not-found";
import "@/style/global.css";
import ArticlePage from "@/app/index";
import { AuthStore } from "./lib/store/auth-store";
import { useEffect, useState } from "react";
import CategoryPage from "./app/category";

function App() {
  const [cookies] = useCookies(["token"]);
  const setIsAuthenticated = AuthStore((state) => state.setIsAuthenticated);
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!cookies.token);
    setAuthReady(true);
  }, [cookies.token, setIsAuthenticated]);
  if (!authReady) {
    return <div className="p-4">Checking authentication...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<ArticlePage />} />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="detail/:documentId" element={<ArticleDetailPage />} />
        <Route path="category" element={<CategoryPage />} />
      </Route>

      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default App;
