import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  HodDashboard,
  AdminDashboard,
  Login,
  EmployeeDashboard,
} from "./Pages/index";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <main className="flex ">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <AuthProvider>
            <BrowserRouter>
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

                <Route
                  path="/adminDashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employeeDashboard"
                  element={
                    <ProtectedRoute allowedRoles={["employee"]}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </div>
      </main>
    </>
  );
}

export default App;
