import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyItineraries } from "../services/api";
import type { SavedItinerary } from "../types/api";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

// ── Teaser popup modal ──────────────────────────────────────────────────────

type TeaserModalProps = {
  item: SavedItinerary;
  onClose: () => void;
  onShowFull: () => void;
};

const TeaserModal = ({ item, onClose, onShowFull }: TeaserModalProps) => {
  const teaser = item.teaser;
  const trip = item.tripSeed;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #020617)",
          border: "1px solid rgba(148,163,184,0.15)",
          borderRadius: 12,
          padding: 28,
          maxWidth: 600,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div className="stack">
            <span className="chip">Teaser itinerary</span>
            <h2 style={{ margin: 0, fontSize: 20 }}>
              {trip?.location ?? "Your trip"}
            </h2>
            {trip?.checkIn && trip?.checkOut ? (
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>
                {String(trip.checkIn)} – {String(trip.checkOut)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            style={{ fontSize: 18, padding: "4px 8px", lineHeight: 1, flexShrink: 0 }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Cost + vibe tags */}
        {teaser ? (
          <>
            {teaser.estimatedCost ? (
              <div className="badge-cost">
                <span>
                  ${teaser.estimatedCost.min.toLocaleString()}–$
                  {teaser.estimatedCost.max.toLocaleString()}
                </span>
                <span className="badge-tier">estimated range</span>
              </div>
            ) : null}

            {teaser.vibeTags && teaser.vibeTags.length > 0 ? (
              <div className="stack-row">
                {teaser.vibeTags.map((tag) => (
                  <span key={tag} className="pill">{tag}</span>
                ))}
              </div>
            ) : null}

            {teaser.bestTimeToGo ? (
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                Best time to go:{" "}
                <span style={{ color: "#e5e7eb" }}>{teaser.bestTimeToGo}</span>
              </div>
            ) : null}

            {/* Day cards */}
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              {teaser.days.map((day) => (
                <article
                  key={day.date}
                  className="card"
                  style={{ padding: 14, background: "radial-gradient(circle at top left, #0f172a, #020617)" }}
                >
                  <div className="stack">
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.08 }}>
                      {day.date}
                    </div>
                    <h3 style={{ margin: 0, fontSize: 14 }}>{day.theme}</h3>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: 3 }}>
                      {day.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>No teaser data available.</p>
        )}

        {/* Preferences summary */}
        {item.preferences && Object.keys(item.preferences).length > 0 ? (
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", borderTop: "1px solid rgba(148,163,184,0.1)", paddingTop: 12 }}>
            <strong style={{ color: "#e5e7eb" }}>Preferences: </strong>
            {[
              item.preferences.budget && `Budget: ${item.preferences.budget}`,
              item.preferences.pace && `Pace: ${item.preferences.pace}`,
              item.preferences.interests?.length && `Interests: ${item.preferences.interests.join(", ")}`,
            ].filter(Boolean).join(" · ")}
          </div>
        ) : null}

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button type="button" className="btn-ghost" onClick={onClose} style={{ fontSize: 13 }}>
            Close
          </button>
          <button type="button" className="btn" onClick={onShowFull} style={{ fontSize: 13, paddingInline: 18 }}>
            Show full itinerary →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main page ───────────────────────────────────────────────────────────────

export const MyItinerariesPage = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SavedItinerary | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listMyItineraries();
        setItineraries(data);
      } catch (err) {
        console.error(err);
        setError("Couldn't load your itineraries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleShowFull = (id: string) => {
    setSelected(null);
    navigate(`/itineraries/${encodeURIComponent(id)}`);
  };

  const formatDate = (val: string | null) => {
    if (!val) return null;
    try {
      return new Date(val).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return val;
    }
  };

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="stack-lg">
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>My Itineraries</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-muted)" }}>
              Your saved full itineraries. Click any card to view the teaser.
            </p>
          </div>

          {loading ? <LoadingState label="Loading your itineraries…" /> : null}
          {error ? <ErrorState message={error} /> : null}

          {!loading && !error && itineraries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-muted)", fontSize: 14 }}>
              No saved itineraries yet.{" "}
              <a href="/create/seed" style={{ color: "#93c5fd" }}>Plan a new trip</a> and click "Add to my itineraries" at the end.
            </div>
          ) : null}

          {!loading && itineraries.length > 0 ? (
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {itineraries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card"
                  onClick={() => setSelected(item)}
                  style={{
                    padding: 18,
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#e2e8f0",
                    background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
                    border: "1px solid rgba(148,163,184,0.15)",
                    transition: "border-color 0.2s, background 0.2s",
                    width: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.4)";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(15,23,42,1), rgba(30,41,59,1))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))";
                  }}
                >
                  <div className="stack">
                    {/* Title: summary text, then location, then fallback */}
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, color: "#f1f5f9", fontWeight: 600 }}>
                        {item.tripSeed?.summary || item.tripSeed?.location || "Trip"}
                      </h3>
                      {item.tripSeed?.location && item.tripSeed?.summary ? (
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
                          {item.tripSeed.location}
                        </p>
                      ) : null}
                      {item.tripSeed?.checkIn && item.tripSeed?.checkOut ? (
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94a3b8" }}>
                          {String(item.tripSeed.checkIn)} – {String(item.tripSeed.checkOut)}
                        </p>
                      ) : null}
                    </div>

                    {/* Cost estimate from teaser */}
                    {item.teaser?.estimatedCost ? (
                      <div className="badge-cost" style={{ alignSelf: "flex-start" }}>
                        <span>
                          ${item.teaser.estimatedCost.min.toLocaleString()}–$
                          {item.teaser.estimatedCost.max.toLocaleString()}
                        </span>
                        <span className="badge-tier">est.</span>
                      </div>
                    ) : null}

                    {/* Vibe tags */}
                    {item.teaser?.vibeTags && item.teaser.vibeTags.length > 0 ? (
                      <div className="stack-row" style={{ flexWrap: "wrap" }}>
                        {item.teaser.vibeTags.slice(0, 3).map((tag) => (
                          <span key={tag} className="pill" style={{ fontSize: 11 }}>{tag}</span>
                        ))}
                      </div>
                    ) : null}

                    {/* Preferences summary */}
                    {(item.preferences?.budget || item.preferences?.pace) ? (
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        {[
                          item.preferences?.budget,
                          item.preferences?.pace && `${item.preferences.pace} pace`,
                        ].filter(Boolean).join(" · ")}
                      </div>
                    ) : null}

                    {/* Accommodation */}
                    {item.tripSeed?.accommodationName ? (
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        {item.tripSeed.accommodationName}
                      </div>
                    ) : null}

                    {/* Saved date */}
                    <div style={{ fontSize: 11, color: "#64748b", borderTop: "1px solid rgba(148,163,184,0.12)", paddingTop: 8, marginTop: 4 }}>
                      Saved {formatDate(item.savedAt)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Teaser modal */}
      {selected ? (
        <TeaserModal
          item={selected}
          onClose={() => setSelected(null)}
          onShowFull={() => handleShowFull(selected.id)}
        />
      ) : null}
    </div>
  );
};
