import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AssessmentProvider } from "./lib/AssessmentContext";
import DashboardPage from "./routes/dashboard";
import UploadPage from "./routes/index";

export default function App() {
  return (
    <AssessmentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AssessmentProvider>
  );
}
