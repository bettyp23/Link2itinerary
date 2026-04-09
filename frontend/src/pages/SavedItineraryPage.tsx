import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSavedItinerary } from "../services/api";
import type { SavedItineraryDetail } from "../types/api";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export const SavedItineraryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<SavedItineraryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!id || loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSavedItinerary(id);
        setDetail(data);
      } catch (err) {
        console.error(err);
        setError("Couldn't load this itinerary. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const itinerary = detail?.payload ?? null;
  const trip = detail?.tripSeed ?? null;

  const location = trip?.location;
  const dateRange =
    trip?.checkIn && trip?.checkOut
      ? `${String(trip.checkIn)} – ${String(trip.checkOut)}`
      : null;

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="layout-grid layout-grid--two">
          <div className="stack-lg">
            <div className="stack">
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div className="chip">Full itinerary</div>
                <Link to="/my-itineraries" className="btn-ghost" style={{ fontSize: 12, padding: "4px 8px" }}>
                  ← My Itineraries
                </Link>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>
                  {location ?? "Saved itinerary"}
                </h2>
                {dateRange ? (
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-muted)" }}>
                    {dateRange}
                  </p>
                ) : null}
              </div>

              {/* Preferences */}
              {detail?.preferences && Object.keys(detail.preferences).length > 0 ? (
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                  {[
                    detail.preferences.budget && `Budget: ${detail.preferences.budget}`,
                    detail.preferences.pace && `Pace: ${detail.preferences.pace}`,
                    detail.preferences.interests?.length && `Interests: ${detail.preferences.interests.join(", ")}`,
                  ].filter(Boolean).join(" · ")}
                </div>
              ) : null}
            </div>

            {loading ? <LoadingState label="Loading your itinerary…" /> : null}
            {error ? <ErrorState message={error} /> : null}

            {itinerary ? (
              <div className="timeline stack-lg">
                {itinerary.days.map((day, index) => (
                  <div
                    key={day.date}
                    className="timeline-day stack"
                    style={{ paddingTop: index === 0 ? 0 : 10 }}
                  >
                    <div className="timeline-dot" />
                    <div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.08 }}>
                        Day {index + 1} · {day.date}
                      </div>
                      {day.dailyTotal != null ? (
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
                          Daily total: ${day.dailyTotal.toLocaleString()}
                        </div>
                      ) : null}
                    </div>

                    <div className="stack">
                      {day.activities.map((activity) => (
                        <article
                          key={activity.id}
                          className="card"
                          style={{ padding: 14, background: "#f7f9fb" }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
                            <div className="stack">
                              <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                                {activity.time ?? "Anytime"}
                                {activity.duration ? ` • ${activity.duration} min` : ""}
                              </div>
                              <h3 style={{ margin: 0, fontSize: 15 }}>{activity.title}</h3>
                            </div>
                            {activity.estimatedCost != null ? (
                              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                                ~${activity.estimatedCost.toLocaleString()}
                              </span>
                            ) : null}
                          </div>

                          {activity.location ? (
                            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 4 }}>
                              <span style={{ color: "var(--color-text)" }}>{activity.location.name}</span>
                              {activity.location.address ? ` · ${activity.location.address}` : null}
                            </div>
                          ) : null}

                          {activity.description ? (
                            <p style={{ margin: "4px 0 6px", fontSize: 13, color: "var(--color-text-muted)" }}>
                              {activity.description}
                            </p>
                          ) : null}

                          {activity.tips && activity.tips.length > 0 ? (
                            <ul style={{ margin: "0 0 6px", paddingLeft: 16, fontSize: 12, color: "var(--color-text-muted)" }}>
                              {activity.tips.map((tip) => (
                                <li key={tip}>{tip}</li>
                              ))}
                            </ul>
                          ) : null}

                          {activity.bookingUrl ? (
                            <a
                              href={activity.bookingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary"
                              style={{ display: "inline-flex", fontSize: 12, padding: "5px 10px", marginTop: 4 }}
                            >
                              Open booking link
                            </a>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="stack">
            {detail?.costEstimate ? (
              <div className="card">
                <div className="stack">
                  <h3 style={{ margin: 0, fontSize: 15 }}>Cost snapshot</h3>
                  <div className="stack">
                    <div className="badge-cost">
                      <span>
                        ${detail.costEstimate.totalCost.min.toLocaleString()}–$
                        {detail.costEstimate.totalCost.max.toLocaleString()}
                      </span>
                      <span className="badge-tier">total est.</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      Avg per day: ${detail.costEstimate.perDayAverage.toLocaleString()}
                    </div>
                  </div>

                  {detail.costEstimate.breakdown ? (
                    <div className="stack">
                      <h4 style={{ margin: "8px 0 0", fontSize: 13 }}>Category breakdown</h4>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 12, color: "var(--color-text-muted)" }}>
                        {Object.entries(detail.costEstimate.breakdown).map(([category, value]) => (
                          <li key={category} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "3px 0" }}>
                            <span style={{ textTransform: "capitalize" }}>{category}</span>
                            <span>
                              ${(value as any).min?.toLocaleString() ?? 0}–$
                              {(value as any).max?.toLocaleString() ?? 0}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Trip details */}
            {trip ? (
              <div className="card">
                <div className="stack">
                  <h3 style={{ margin: 0, fontSize: 15 }}>Trip details</h3>
                  {trip.accommodationName ? (
                    <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                      {trip.accommodationName}
                      {trip.accommodationType ? ` (${trip.accommodationType})` : ""}
                    </div>
                  ) : null}
                  {trip.summary ? (
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)" }}>
                      {trip.summary}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
};
