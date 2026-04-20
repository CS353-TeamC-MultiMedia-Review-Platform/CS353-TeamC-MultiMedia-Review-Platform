"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl, API_ENDPOINTS } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email.includes("@")) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      console.log("[Login] Attempting login with:", form.email);
      const loginUrl = buildApiUrl(API_ENDPOINTS.LOGIN);
      console.log("[Login] Using endpoint:", loginUrl);

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("[Login] Response status:", res.status);

      const data = await res.json();
      console.log("[Login] Response data:", {
        token: data.token ? "exists" : "missing",
        uid: data.uid,
        error: data.error,
      });

      if (!res.ok) {
        console.error("[Login] Login failed:", data.error);
        setErrors({ general: data.error });
        setLoading(false);
        return;
      }

      // Validate token exists
      if (!data.token) {
        console.error("[Login] No token in response");
        setErrors({ general: "Login failed: No token received" });
        setLoading(false);
        return;
      }

      console.log("[Login] Login successful, saving auth data");

      // Also use the centralized utility
      login({
        token: data.token,
        uid: data.uid,
        userName: data.name,
      });

      console.log("[Login] Auth data saved, redirecting to dashboard");
      router.push("/dashboard");
    } catch (error) {
      console.error("[Login] Catch error:", error);
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Network error, please try again",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-0 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">★</span>
            </div>
            <span className="text-white font-bold text-2xl">Critiq</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Log in to your account</p>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
