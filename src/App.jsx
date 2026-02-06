import "./App.css";
import { Routes, Route } from "react-router-dom";
import {
  HodDashboard,
  AdminDashboard,
  Login,
  EmployeeDashboard,
  ApplyLeave,
  HodApproveLeave,
  AdminApproveLeave,
  ManageUsers,
} from "./Pages";
import ProtectedRoute from "./routes/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
function App() {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  return (
    <main className="flex">
      {/* Sidebar only when logged in */}
      {user && <Sidebar role={role} />}

      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/hodDashboard"
            element={
              <ProtectedRoute allowedRoles={["hod"]}>
                <HodDashboard />
              </ProtectedRoute>
            }
          />
          {/* hod approve leave  */}
          <Route
            path="/hod-approve-leaves"
            element={
              <ProtectedRoute allowedRoles={["hod"]}>
                <HodApproveLeave />
              </ProtectedRoute>
            }
          />

          {/* admin  */}

          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          {/* admin approve leave  */}
          <Route
            path="/admin-approve-leaves"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminApproveLeave />
              </ProtectedRoute>
            }
          />

          {/* employee  */}
          <Route
            path="/employeeDashboard"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          {/* all users  */}
          <Route
            path="/apply-leave"
            element={
              <ProtectedRoute allowedRoles={["employee", "hod", "admin"]}>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          {/* admin and hod only  */}

          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
