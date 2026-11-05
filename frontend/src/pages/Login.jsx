import { useState } from "react";
import { GraduationCap, AlertCircle, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email")?.trim();
    const password = data.get("password");

    if (!email || !password) {
      setError("Error: Email address and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      // Handle backend Joi / ApiError messages
      setError(
        `Error: ${err.response?.data?.message || "Invalid email or password."}`,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="login-brand">
          <span className="brand-symbol">
            <GraduationCap size={26} />
          </span>
          <span>SMRS</span>
        </div>
        <div className="intro-copy">
          <p className="eyebrow">STUDENT MANAGEMENT & REGISTRATION SYSTEM</p>
          <h1>Your academic journey, organised in one place.</h1>
          <p>
            Register for courses, keep track of your academic progress and
            manage your student profile with ease.
          </p>
        </div>
        <div className="intro-footer">
          A simpler way to manage your studies.
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit} noValidate>
          <div className="mobile-login-brand">
            <GraduationCap /> SMRS
          </div>
          <p className="eyebrow blue-text">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="muted">Enter your credentials to access the portal.</p>

          {error && (
            <div className="alert error" role="alert">
              <AlertCircle size={20} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="username"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <button
            className="primary-btn full-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"} <ChevronRight size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
