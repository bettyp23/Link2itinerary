import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ── Sample teaser data shown in the popup ─────────────────────────────────────
const SAMPLE_TEASER = {
  destination: "Paris, France",
  accommodation: "Charming apartment in Le Marais",
  dates: "May 1 – 3, 2026",
  vibeTags: ["cultural", "relaxed", "foodie", "scenic"],
  estimatedCost: { min: 400, max: 600, currency: "USD" },
  days: [
    {
      date: "May 1",
      theme: "Arrival & Local Exploration",
      highlights: [
        "Check in to Le Marais apartment",
        "Stroll along the Seine at golden hour",
        "Dinner at a classic French bistro",
        "Evening walk past Notre-Dame"
      ]
    },
    {
      date: "May 2",
      theme: "Museums & Culture",
      highlights: [
        "Morning at the Louvre (book in advance)",
        "Lunch in the Latin Quarter",
        "Musée d'Orsay in the afternoon",
        "Rooftop drinks at sunset"
      ]
    },
    {
      date: "May 3",
      theme: "Food Markets & Departure",
      highlights: [
        "Bastille market for fresh pastries",
        "Coffee and crepes by the canal",
        "Last-minute shopping on Rue de Rivoli",
        "Head to CDG with zero regrets"
      ]
    }
  ]
};

// ── Modal component ───────────────────────────────────────────────────────────
function SampleItineraryModal({ onClose }: { onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // Backdrop — click outside to close
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(2, 6, 23, 0.82)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
    >
      {/* Modal panel — stop propagation so clicking inside doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "radial-gradient(circle at top left, #1f2937 0, #020617 60%)",
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: "var(--border-radius-lg)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px 22px"
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Sample Teaser
              </span>
              <span className="chip" style={{ fontSize: 10 }}>3 days</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
              {SAMPLE_TEASER.destination}
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)" }}>
              {SAMPLE_TEASER.dates} · {SAMPLE_TEASER.accommodation}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              width: 32,
              height: 32,
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 16,
              cursor: "pointer",
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(15,23,42,0.8)",
              color: "var(--color-text-muted)"
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Vibe tags ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {SAMPLE_TEASER.vibeTags.map(tag => (
            <span key={tag} className="pill" style={{ fontSize: 11 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* ── Days ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SAMPLE_TEASER.days.map((day, i) => (
            <div
              key={day.date}
              style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(148,163,184,0.15)",
                borderRadius: "var(--border-radius-md)",
                padding: "14px 16px"
              }}
            >
              {/* Day header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{day.date}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{day.theme}</div>
                </div>
              </div>

              {/* Highlights */}
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {day.highlights.map(highlight => (
                  <li
                    key={highlight}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--color-text-muted)"
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "999px",
                        background: "#3b82f6",
                        marginTop: 6,
                        flexShrink: 0
                      }}
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Estimated cost footer ── */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(148,163,184,0.15)",
            borderRadius: "var(--border-radius-md)"
          }}
        >
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            Estimated trip cost
          </span>
          <span className="badge-cost">
            ${SAMPLE_TEASER.estimatedCost.min} – ${SAMPLE_TEASER.estimatedCost.max} {SAMPLE_TEASER.estimatedCost.currency}
          </span>
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Link
            to="/create/seed"
            className="btn"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={onClose}
          >
            Start from your own link
          </Link>
          <p style={{ marginTop: 10, fontSize: 11, color: "var(--color-text-muted)" }}>
            No login required for the teaser
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Landing page ──────────────────────────────────────────────────────────────
export const LandingPage = () => {
  const [showSample, setShowSample] = useState(false);

  return (
    <>
      {showSample && <SampleItineraryModal onClose={() => setShowSample(false)} />}

      <div className="stack-lg">
        <section className="card">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.4)",
                width: "fit-content",
                fontSize: 11
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "999px",
                  background:
                    "radial-gradient(circle at 30% 0%, #4ade80, #22c55e)"
                }}
              />
              Paste a link, get a trip plan
            </div>

            <div>
              <h2
                style={{
                  fontSize: 26,
                  lineHeight: 1.15,
                  margin: 0,
                  letterSpacing: 0.02
                }}
              >
                Turn travel videos and links into{" "}
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, #38bdf8, #22c55e, #f97316)",
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  ready-to-go itineraries
                </span>
                .
              </h2>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "var(--color-text-muted)",
                  maxWidth: 520
                }}
              >
                Paste a link to a travel video or listing, add one line about your
                trip, and get a 3-day teaser plan in seconds. Then layer on your
                preferences to see a full day-by-day itinerary with costs.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center"
              }}
            >
              <Link to="/create/seed" className="btn">
                Start from a link
              </Link>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: 13, paddingInline: 14 }}
                onClick={() => setShowSample(true)}
              >
                View sample itinerary
              </button>
            </div>

            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)"
              }}
            >
              No login required for teaser. Full flow: link → teaser → preferences
              → full itinerary.
            </div>
          </div>
        </section>

        <section id="how-it-works" className="card">
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
            }}
          >
            <div className="stack">
              <div className="chip">01 · Seed</div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Paste a link + summary</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                Drop in a YouTube travel vlog, TikTok, Airbnb, or hotel link, and
                add a short line like "Relaxed girls trip to Tulum in June".
              </p>
            </div>
            <div className="stack">
              <div className="chip">02 · Teaser</div>
              <h3 style={{ margin: 0, fontSize: 16 }}>See a 3‑day teaser</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                We turn your link into a quick 3-day outline with vibes, highlights,
                and a rough cost range to check the fit.
              </p>
            </div>
            <div className="stack">
              <div className="chip">03 · Personalize</div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Add your preferences</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                Tell us your pace, budget tier, and interests. We&apos;ll use that
                plus the video content to build a full schedule.
              </p>
            </div>
            <div className="stack">
              <div className="chip">04 · Itinerary</div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Get a full itinerary</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                View a clean, vertical day‑by‑day timeline with time blocks,
                activities, and transparent cost estimates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
