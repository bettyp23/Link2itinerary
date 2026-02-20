import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTripContext } from "../context/TripContext";
import { getTrip, generateTeaser } from "../services/api";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export const TeaserPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const {
    currentTripId,
    setCurrentTripId,
    trip,
    setTrip,
    teaser,
    setTeaser
  } = useTripContext();

  const [loading, setLoading] = useState(!teaser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    setCurrentTripId(tripId);

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tripResp, teaserResp] = await Promise.all([
          trip ? Promise.resolve(trip) : getTrip(tripId),
          teaser ? Promise.resolve(teaser) : generateTeaser(tripId)
        ]);
        setTrip(tripResp);
        setTeaser(teaserResp);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError(
          "We couldn’t generate a teaser for this trip yet. Try again or start a new trip."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleRegenerate = async () => {
    if (!tripId) return;
    setError(null);
    setLoading(true);
    try {
      const newTeaser = await generateTeaser(tripId);
      setTeaser(newTeaser);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Couldn’t regenerate teaser. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanIt = () => {
    if (!tripId) return;
    navigate(`/trips/${encodeURIComponent(tripId)}/preferences`);
  };

  const location = trip?.metadata?.location;
  const dateRange =
    trip?.metadata?.checkIn && trip?.metadata?.checkOut
      ? `${trip.metadata.checkIn} – ${trip.metadata.checkOut}`
      : null;

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="stack-lg">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap"
            }}
          >
            <div className="stack">
              <span className="chip">
                Teaser itinerary
                {currentTripId ? (
                  <span style={{ opacity: 0.75 }}>· {currentTripId}</span>
                ) : null}
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>
                  {location ?? "Your trip teaser"}
                </h2>
                {dateRange ? (
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: "var(--color-text-muted)"
                    }}
                  >
                    {dateRange}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="stack" style={{ alignItems: "flex-end" }}>
              {teaser ? (
                <div className="badge-cost">
                  <span>
                    ${teaser.estimatedCost.min.toLocaleString()}–$
                    {teaser.estimatedCost.max.toLocaleString()}
                  </span>
                  <span className="badge-tier">range</span>
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap"
                }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={handlePlanIt}
                  disabled={!tripId || loading}
                  style={{ fontSize: 13, paddingInline: 16 }}
                >
                  Plan full trip
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleRegenerate}
                  disabled={loading || !tripId}
                  style={{ fontSize: 12, paddingInline: 12 }}
                >
                  Regenerate teaser
                </button>
              </div>
            </div>
          </div>

          {teaser && teaser.vibeTags && teaser.vibeTags.length > 0 ? (
            <div className="stack-row">
              {teaser.vibeTags.map((tag) => (
                <span key={tag} className="pill">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {teaser && teaser.bestTimeToGo ? (
            <div
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)"
              }}
            >
              Best time to go:{" "}
              <span style={{ color: "#e5e7eb" }}>{teaser.bestTimeToGo}</span>
            </div>
          ) : null}

          {loading ? (
            <LoadingState label="Drafting a 3‑day teaser for you…" />
          ) : null}

          {error ? <ErrorState message={error} onRetry={handleRegenerate} /> : null}

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: 4
            }}
          >
            {teaser
              ? teaser.days.map((day) => (
                  <article
                    key={day.date}
                    className="card"
                    style={{
                      padding: 16,
                      background:
                        "radial-gradient(circle at top left, #0f172a, #020617)"
                    }}
                  >
                    <div className="stack">
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: 0.08
                        }}
                      >
                        {day.date}
                      </div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 15
                        }}
                      >
                        {day.theme}
                      </h3>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: 16,
                          fontSize: 13,
                          color: "var(--color-text-muted)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4
                        }}
                      >
                        {day.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))
              : null}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)"
            }}
          >
            Not quite right?{" "}
            <button
              type="button"
              className="btn-ghost"
              onClick={handleRegenerate}
              disabled={loading || !tripId}
              style={{ padding: 0 }}
            >
              Regenerate a different teaser
            </button>{" "}
            or{" "}
            <Link to="/create/seed" className="btn-ghost" style={{ padding: 0 }}>
              start over from a new link
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  );
};

