import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTripContext } from "../context/TripContext";
import { calculateCostEstimate, getTrip } from "../services/api";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export const ItineraryPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const {
    setCurrentTripId,
    trip,
    setTrip,
    fullItinerary,
    setFullItinerary,
    costEstimate,
    setCostEstimate
  } = useTripContext();

  const [loading, setLoading] = useState(!fullItinerary);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    setCurrentTripId(tripId);

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseTrip = trip ?? (await getTrip(tripId));
        setTrip(baseTrip);

        const itineraryId =
          baseTrip.currentItinerary?.id ?? fullItinerary?.id ?? "";

        if (!fullItinerary && !itineraryId) {
          setError(
            "We don't have a generated itinerary yet for this trip. Go through preferences first."
          );
          setLoading(false);
          return;
        }

        if (!fullItinerary && itineraryId) {
          // In a full implementation you'd fetch /api/itineraries/:id here.
        }

        if (!costEstimate && itineraryId) {
          const estimate = await calculateCostEstimate(itineraryId);
          setCostEstimate(estimate);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError(
          "We couldn’t load your itinerary. Try refreshing or re-running preferences."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  if (!tripId) {
    return (
      <ErrorState
        title="Missing trip"
        message="We couldn't find this trip. Start again from the landing page."
      />
    );
  }

  const location = trip?.metadata?.location;
  const dateRange =
    trip?.metadata?.checkIn && trip?.metadata?.checkOut
      ? `${trip.metadata.checkIn} – ${trip.metadata.checkOut}`
      : null;

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="layout-grid layout-grid--two">
          <div className="stack-lg">
            <div className="stack">
              <div className="chip">Full itinerary</div>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>
                  {location ?? "Your itinerary"}
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

            {loading ? (
              <LoadingState label="Pulling together your day-by-day plan…" />
            ) : null}

            {error ? <ErrorState message={error} /> : null}

            {fullItinerary ? (
              <div className="timeline stack-lg">
                {fullItinerary.days.map((day, index) => (
                  <div
                    key={day.date}
                    className="timeline-day stack"
                    style={{ paddingTop: index === 0 ? 0 : 10 }}
                  >
                    <div className="timeline-dot" />
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: 0.08
                        }}
                      >
                        Day {index + 1} · {day.date}
                      </div>
                      {day.dailyTotal != null ? (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-muted)",
                            marginTop: 2
                          }}
                        >
                          Daily total: ${day.dailyTotal.toLocaleString()}
                        </div>
                      ) : null}
                    </div>

                    <div className="stack">
                      {day.activities.map((activity) => (
                        <article
                          key={activity.id}
                          className="card"
                          style={{
                            padding: 14,
                            background:
                              "radial-gradient(circle at top left, #020617, #020617)"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 10,
                              marginBottom: 4
                            }}
                          >
                            <div className="stack">
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "var(--color-text-muted)"
                                }}
                              >
                                {activity.time ?? "Anytime"}
                                {activity.duration
                                  ? ` • ${activity.duration} min`
                                  : ""}
                              </div>
                              <h3
                                style={{
                                  margin: 0,
                                  fontSize: 15
                                }}
                              >
                                {activity.title}
                              </h3>
                            </div>
                            {activity.estimatedCost != null ? (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--color-text-muted)"
                                }}
                              >
                                ~${activity.estimatedCost.toLocaleString()}
                              </span>
                            ) : null}
                          </div>

                          {activity.location ? (
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--color-text-muted)",
                                marginBottom: 4
                              }}
                            >
                              <span style={{ color: "#e5e7eb" }}>
                                {activity.location.name}
                              </span>
                              {activity.location.address
                                ? ` · ${activity.location.address}`
                                : null}
                            </div>
                          ) : null}

                          {activity.description ? (
                            <p
                              style={{
                                margin: "4px 0 6px",
                                fontSize: 13,
                                color: "var(--color-text-muted)"
                              }}
                            >
                              {activity.description}
                            </p>
                          ) : null}

                          {activity.tips && activity.tips.length > 0 ? (
                            <ul
                              style={{
                                margin: "0 0 6px",
                                paddingLeft: 16,
                                fontSize: 12,
                                color: "var(--color-text-muted)"
                              }}
                            >
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
                              style={{
                                display: "inline-flex",
                                fontSize: 12,
                                padding: "5px 10px",
                                marginTop: 4
                              }}
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
            {fullItinerary?.totalEstimatedCost ? (
              <div className="card">
                <div className="stack">
                  <h3 style={{ margin: 0, fontSize: 15 }}>Cost snapshot</h3>
                  <div className="stack">
                    <div className="badge-cost">
                      <span>
                        ${fullItinerary.totalEstimatedCost.min.toLocaleString()}
                        –
                        {fullItinerary.totalEstimatedCost.max.toLocaleString()}
                      </span>
                      <span className="badge-tier">
                        {fullItinerary.totalEstimatedCost.currency}
                      </span>
                    </div>
                    {costEstimate ? (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-muted)"
                        }}
                      >
                        Avg per day: $
                        {costEstimate.perDayAverage.toLocaleString()}
                      </div>
                    ) : null}
                  </div>

                  {costEstimate?.breakdown ? (
                    <div className="stack">
                      <h4
                        style={{
                          margin: "8px 0 0",
                          fontSize: 13
                        }}
                      >
                        Category breakdown
                      </h4>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          fontSize: 12,
                          color: "var(--color-text-muted)"
                        }}
                      >
                        {Object.entries(costEstimate.breakdown).map(
                          ([category, value]) => (
                            <li
                              key={category}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 12,
                                padding: "3px 0"
                              }}
                            >
                              <span
                                style={{
                                  textTransform: "capitalize"
                                }}
                              >
                                {category}
                              </span>
                              <span>
                                ${value.min.toLocaleString()}–$
                                {value.max.toLocaleString()}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
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

