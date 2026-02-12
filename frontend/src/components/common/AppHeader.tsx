import { Link, NavLink, useLocation } from "react-router-dom";

const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCKS === "true";

export const AppHeader = () => {
  const { pathname } = useLocation();

  const isLanding = pathname === "/";

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        background:
          "linear-gradient(to right, rgba(15,23,42,0.96), rgba(15,23,42,0.92))",
        backdropFilter: "blur(12px)"
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "14px 16px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 20% 0%, #38bdf8, #3b82f6 40%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)"
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0b1120"
              }}
            >
              L
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 0.04
              }}
            >
              Link2Itinerary
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)"
              }}
            >
              From link to trip in seconds
            </span>
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          {IS_MOCK_MODE ? (
            <span
              style={{
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(34,197,94,0.6)",
                background: "rgba(22,163,74,0.12)",
                color: "#bbf7d0",
                textTransform: "uppercase",
                letterSpacing: 0.08
              }}
            >
              Mock data
            </span>
          ) : null}

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13
            }}
          >
            <NavLink
              to="/create/seed"
              style={({ isActive }) => ({
                padding: "6px 10px",
                borderRadius: 999,
                color: isActive
                  ? "var(--color-text)"
                  : "var(--color-text-muted)",
                background: isActive ? "rgba(15, 23, 42, 0.9)" : "transparent",
                border: "1px solid transparent"
              })}
            >
              New trip
            </NavLink>

            {isLanding ? (
              <a
                href="#how-it-works"
                className="btn-ghost"
                style={{ fontSize: 13, padding: "6px 10px" }}
              >
                How it works
              </a>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};

