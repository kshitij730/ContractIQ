"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface AuthPageProps {
  mode: "login" | "signup";
}

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";
  const title = isSignup ? "Create your secure legal workspace" : "Welcome back to ContractIQ";
  const subtitle = isSignup
    ? "Launch a client-ready contract intelligence workspace with secure access, exportable reports, and enterprise-style review flows."
    : "Sign in to access protected contract analysis, saved work history, and negotiation-ready reports.";

  const trustPoints = useMemo(
    () => [
      "Protected contract analysis endpoints",
      "Workspace-ready history and reporting",
      "Built for client demos and paid rollouts",
    ],
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signup({ full_name: fullName, email, company, password });
      } else {
        await login({ email, password });
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div className="bg-gradient-mesh" />
      <div className="auth-layout container">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel auth-panel auth-marketing"
        >
          <div className="hero-badge">
            <ShieldCheck style={{ width: 16, height: 16 }} />
            Secure Contract Intelligence Suite
          </div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>

          <div className="auth-feature-stack">
            {trustPoints.map((point) => (
              <div key={point} className="auth-feature-item">
                <CheckCircle2 style={{ width: 18, height: 18, color: "var(--accent-primary)" }} />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel auth-mini-card">
            <div className="auth-mini-card-header">
              <LockKeyhole style={{ width: 18, height: 18, color: "var(--accent-secondary)" }} />
              <span>Enterprise-ready positioning</span>
            </div>
            <p>
              Add secure accounts, audit-friendly exports, and DevSecOps checks so ContractIQ feels like a product clients can trust and teams can buy.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-panel auth-panel"
        >
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <p className="auth-eyebrow">{isSignup ? "Get Started" : "Sign In"}</p>
              <h2>{isSignup ? "Create account" : "Access workspace"}</h2>
              <p className="auth-form-copy">
                {isSignup ? "Set up your secure account and start reviewing contracts with a product-grade workflow." : "Continue with your email to open your protected analysis workspace."}
              </p>
            </div>

            {isSignup && (
              <div className="auth-grid">
                <label className="auth-label">
                  Full name
                  <input className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </label>
                <label className="auth-label">
                  Company
                  <input className="input-field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
                </label>
              </div>
            )}

            <label className="auth-label">
              Work email
              <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <label className="auth-label">
              Password
              <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </label>

            {isSignup && (
              <label className="auth-label">
                Confirm password
                <input className="input-field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} required />
              </label>
            )}

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: "100%" }}>
              <span>{isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}</span>
              <ArrowRight style={{ width: 18, height: 18 }} />
            </button>

            <p className="auth-switch-copy">
              {isSignup ? "Already have an account?" : "New to ContractIQ?"}{" "}
              <Link href={isSignup ? "/login" : "/signup"} className="auth-switch-link">
                {isSignup ? "Sign in" : "Create account"}
              </Link>
            </p>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
