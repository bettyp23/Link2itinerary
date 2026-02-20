import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
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
            >
              Watch sample itinerary
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
              add a short line like “Relaxed girls trip to Tulum in June”.
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
  );
};

