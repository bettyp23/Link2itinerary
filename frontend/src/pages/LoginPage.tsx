import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const LoginPage = () => {
  type RedirectState = { from?: { pathname?: string } };

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  const targetPath =
    (location.state as RedirectState | undefined)?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    //keeping it quiet: letting the form be a no-op until both fields are present
    if (!email.trim() || !password.trim()) return;

    login(email.trim(), password);
    navigate(targetPath);
  };

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="stack-lg">
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Log in</h2>
            <p
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "var(--color-text-muted)"
              }}
            >
              This is a frontend-only mock login for now.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="stack">
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginTop: 6
              }}
            >
              <button type="submit" className="btn">
                Log in
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

