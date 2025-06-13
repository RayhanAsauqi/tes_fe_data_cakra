import { Navigate, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";

import AuthPage from "@/app/auth";
import ArticlePage from "@/app/article";
import { ProtectedRoute } from "@/lib/middleware/route-protect";
import CommentPage from "@/app/comments";
import ArticleDetailPage from "./app/article/detail";
import NotFoundPage from "@/app/not-found";

function App() {
  const [cookies] = useCookies(["token"]);
  const isAuthenticated = Boolean(cookies.token);

  return (
    <Routes>
      {/* Public Route: hanya untuk user yang BELUM login */}
      <Route
        element={
          isAuthenticated ? (
            <Navigate to="/articles" replace />
          ) : (
            <ProtectedRoute
              allowAuthenticated={false}
              isAuthenticated={isAuthenticated}
            />
          )
        }
      >
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Private Route: hanya untuk user yang SUDAH login */}
      <Route
        path="/articles"
        element={
          <ProtectedRoute
            allowAuthenticated={true}
            isAuthenticated={isAuthenticated}
          />
        }
      >
        <Route index element={<ArticlePage />} />
        <Route path="detail/:id" element={<ArticleDetailPage />} />
        <Route path="comments" element={<CommentPage />} />
      </Route>

      {/* Fallback Route */}
      <Route
        path="*"
        element={
          isAuthenticated ? <NotFoundPage /> : <Navigate to="/auth" replace />
        }
      />
    </Routes>
  );
}

export default App;
