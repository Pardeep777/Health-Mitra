import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Stethoscope,
  UserCheck,
  Users,
  MapPin,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Check
} from "lucide-react";
import logoImg from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const roles = [
    { id: "admin", label: "Admin", icon: Shield, defaultEmail: "admin@gmail.com", defaultPass: "admin123", path: "/admin" },
    { id: "partner", label: "Partner", icon: Stethoscope, defaultEmail: "partner@healthmitra.demo", defaultPass: "partner123", path: "/partner" },
    { id: "agent", label: "Field Agent", icon: UserCheck, defaultEmail: "agent@healthmitra.demo", defaultPass: "agent123", path: "/agent" },
    { id: "cardholder", label: "Cardholder", icon: Users, defaultEmail: "rahul.sharma@example.com", defaultPass: "card123", path: "/cardholder/card" },
    { id: "district", label: "District", icon: MapPin, defaultEmail: "coordinator.west@healthmitra.demo", defaultPass: "district123", path: "/district/dashboard" }
  ];

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj.id);
    setEmail(roleObj.defaultEmail);
    setPassword(roleObj.defaultPass);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      showToast("Please enter your email or user ID.", "error");
      return;
    }
    if (!password || !password.trim()) {
      showToast("Please enter your password.", "error");
      return;
    }

    setLoading(true);
    try {
      const user = await login(selectedRole, email, password);
      showToast(`Welcome back, ${user.name || "User"}!`, "success");
      const targetRole = roles.find((r) => r.id === selectedRole);
      navigate(targetRole?.path || "/admin");
    } catch (err) {
      showToast(err.message || "Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <img
              src={logoImg}
              alt="Health Mitra Logo"
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-navy-900">Operations Portal Login</h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your role to access your Health Mitra authenticated workspace.
            </p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 px-1.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  isSelected
                    ? "bg-white text-navy-900 shadow-sm font-bold border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-brand-500" : "text-slate-400"}`} />
                <span className="text-[10px] sm:text-xs truncate">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Demo Credentials Info Banner */}
        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-brand-900">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>1-Click Demo Credentials:</span>
          </div>
          <div className="flex flex-wrap items-center justify-between text-slate-600 pt-1">
            <span>Role: <strong className="text-navy-900 capitalize">{selectedRole}</strong></span>
            <span>ID: <code className="bg-white px-1.5 py-0.5 rounded border border-orange-200 font-mono text-[11px] text-brand-700">{email}</code></span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="User ID / Mobile / Email"
            type="text"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password / OTP"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" defaultChecked className="rounded text-brand-500 focus:ring-brand-400" />
              <span>Remember session</span>
            </label>
            <span className="text-brand-600 hover:underline cursor-pointer">Forgot access PIN?</span>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full shadow-orange-glow"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to {roles.find((r) => r.id === selectedRole)?.label} Workspace
            </Button>
          </div>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500 space-y-2">
          <p>
            Are you a healthcare outlet looking to partner?{" "}
            <Link to="/become-partner" className="text-brand-600 font-bold hover:underline">
              Apply to Partner
            </Link>
          </p>
          <p>
            Want to work as a field agent?{" "}
            <Link to="/join-us" className="text-brand-600 font-bold hover:underline">
              Join our Field Team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
