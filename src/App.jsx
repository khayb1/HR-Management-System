import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  HodDashboard,
  AdminDashboard,
  Login,
  EmployeeDashboard,
} from "./Pages/index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/hodDashboard" element={<HodDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
