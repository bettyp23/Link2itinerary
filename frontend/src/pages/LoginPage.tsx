import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

type LocationState = {
  from?: { pathname?: string };
  message?: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuthContext();

  const state = location.state as LocationState | undefined;
  const targetPath = state?.from?.pathname ?? "/";
  const redirectMessage = state?.message;

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) return;

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="stack-lg">
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>
              {mode === "login" ? "Log in" : "Create account"}
            </h2>
            {redirectMessage ? (
              <p
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#93c5fd",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  borderRadius: 6,
                  padding: "8px 12px"
                }}
              >
                {redirectMessage}
              </p>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="stack">
            <div>
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="input"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={30}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {mode === "register" ? (
              <div>
                <label className="field-label" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            ) : null}

            {error ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#fca5a5",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 6,
                  padding: "8px 12px"
                }}
              >
                {error}
              </p>
            ) : null}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginTop: 6
              }}
            >
              <button type="submit" className="btn" disabled={loading}>
                {loading
                  ? mode === "login"
                    ? "Logging in…"
                    : "Creating account…"
                  : mode === "login"
                  ? "Log in"
                  : "Create account"}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={toggleMode}
                style={{ fontSize: 13 }}
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Log in"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
