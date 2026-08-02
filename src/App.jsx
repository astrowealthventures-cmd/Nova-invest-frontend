import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/dashboard/Dashboard";
import Overview from "@/pages/dashboard/Overview";
import Plans from "@/pages/dashboard/Plans";
import Deposit from "@/pages/dashboard/Deposit";
import Withdraw from "@/pages/dashboard/Withdraw";
import Transactions from "@/pages/dashboard/Transactions";
import Investments from "@/pages/dashboard/Investments";
import AdminPanel from "@/pages/dashboard/AdminPanel";
import VerifyEmailPending from "@/context/VerifyEmailPending";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Disclosures from "@/pages/Disclosures";
import About from "@/pages/About";
import Security from "@/pages/Security"
import Partners from "@/pages/Partners"
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function Protected({ children }) {
  const { user } = useAuth();
  if (user === null)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="font-mono text-sm text-zinc-500 pulse-glow">Loading…</div>
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <div className="App grain">
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" theme="dark" richColors />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmailPending />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/about" element={<About />} />
            <Route path="/security" element={<Security />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/disclosures" element={<Disclosures />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              }
            >
              <Route index element={<Overview />} />
              <Route path="plans" element={<Plans />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="investments" element={<Investments />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
