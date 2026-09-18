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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const roles = [
    { id: "admin", label: "Admin", icon: Shield, path: "/admin" },
    { id: "partner", label: "Partner", icon: Stethoscope, path: "/partner" },
    { id: "agent", label: "Field Agent", icon: UserCheck, path: "/agent" },
    { id: "cardholder", label: "Cardholder", icon: Users, path: "/cardholder/card" },
    { id: "district", label: "District", icon: MapPin, path: "/district/dashboard" }
  ];

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj.id);
    setEmail("");
    setPassword("");
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
              Enter your credentials to access your Health Mitra authenticated workspace.
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label={
              selectedRole === "partner"
                ? "Partner Mobile / Registered Email *"
                : selectedRole === "admin"
                ? "Admin Email / Username *"
                : "User ID / Mobile / Email *"
            }
            type="text"
            icon={Mail}
            placeholder={
              selectedRole === "partner"
                ? "e.g. 9436145001 or mitrapharmacy@healthmitra.demo"
                : selectedRole === "admin"
                ? "e.g. admin@gmail.com"
                : "e.g. user@healthmitra.demo"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={
              selectedRole === "partner"
                ? "6-Digit OTP / Access PIN *"
                : "Password / Access PIN *"
            }
            type="password"
            icon={Lock}
            placeholder={
              selectedRole === "partner"
                ? "e.g. 123456"
                : "Enter your password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Quick Demo Credentials Helper */}
          {selectedRole === "partner" && (
            <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-3 text-xs flex items-center justify-between gap-2">
              <div className="text-navy-900 leading-tight">
                <span className="font-bold text-brand-700">Quick Partner Demo:</span>
                <span className="text-slate-600 block sm:inline sm:ml-1">Mobile: <b>9436145001</b> • OTP: <b>123456</b></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail("9436145001");
                  setPassword("123456");
                }}
                className="px-2.5 py-1 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg text-[11px] shrink-0 transition shadow-2xs"
              >
                Auto Fill
              </button>
            </div>
          )}

          {selectedRole === "admin" && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs flex items-center justify-between gap-2">
              <div className="text-navy-900 leading-tight">
                <span className="font-bold text-slate-700">Admin Demo:</span>
                <span className="text-slate-600 block sm:inline sm:ml-1">Email: <b>admin@gmail.com</b> • Pass: <b>admin</b></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@gmail.com");
                  setPassword("admin");
                }}
                className="px-2.5 py-1 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg text-[11px] shrink-0 transition shadow-2xs"
              >
                Auto Fill
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" defaultChecked className="rounded text-brand-500 focus:ring-brand-400" />
              <span>Remember session</span>
            </label>
            <span className="text-brand-600 hover:underline cursor-pointer">Forgot access PIN / OTP?</span>
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
