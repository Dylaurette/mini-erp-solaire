// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateQuote from "./pages/CreateQuote";
import CreateSolarQuote from "./pages/CreateSolarQuote";
import Forbidden from "./pages/Forbidden";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/quotes/create" element={<ProtectedRoute><CreateQuote/></ProtectedRoute>} />
          <Route path="/quotes/create-solar" element={<ProtectedRoute><CreateSolarQuote/></ProtectedRoute>} />
          <Route path="*" element={<Login/>} />
          <Route path="/forbidden" element={<Forbidden/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
