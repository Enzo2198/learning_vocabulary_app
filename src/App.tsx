import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import AddWordPage from "./pages/AddWordPage";
import StatisticsPage from "./pages/StatisticsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditWordPage from "./pages/EditWordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <StudyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-word"
          element={
            <ProtectedRoute>
              <AddWordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-word/:id"
          element={
            <ProtectedRoute>
              <EditWordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
