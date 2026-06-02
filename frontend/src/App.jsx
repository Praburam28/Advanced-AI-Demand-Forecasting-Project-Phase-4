import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Datasets from "./pages/Datasets";
import Forecast from "./pages/Forecast";
import AIInsights from "./pages/AIInsights";
import Automation from "./pages/Automation";
import Integrations from "./pages/Integrations";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AlertSettings from "./pages/AlertSettings";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const ProtectedPage = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
      <Route path="/datasets" element={<ProtectedPage><Datasets /></ProtectedPage>} />
      <Route path="/forecast" element={<ProtectedPage><Forecast /></ProtectedPage>} />
      <Route path="/ai-insights" element={<ProtectedPage><AIInsights /></ProtectedPage>} />
      <Route path="/automation" element={<ProtectedPage><Automation /></ProtectedPage>} />
      <Route path="/integrations" element={<ProtectedPage><Integrations /></ProtectedPage>} />
      <Route path="/notifications" element={<ProtectedPage><Notifications /></ProtectedPage>} />
      <Route path="/reports" element={<ProtectedPage><Reports /></ProtectedPage>} />
      <Route path="/users" element={<ProtectedPage><Users /></ProtectedPage>} />
      <Route path="/audit" element={<ProtectedPage><AuditLogs /></ProtectedPage>} />
      <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
      <Route path="/alerts"  element={<ProtectedPage><AlertSettings /></ProtectedPage>}/>
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;