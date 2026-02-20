import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTripSeed } from "../services/api";
import { useTripContext } from "../context/TripContext";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

export const TripSeedPage = () => {
  const navigate = useNavigate();
  const { setCurrentTripId, setTrip, setTeaser, setFullItinerary, setCostEstimate } =
    useTripContext();

  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!summary.trim()) {
      setError("Add a one-line summary so we understand your trip.");
      return;
    }

    setIsSubmitting(true);
    setTeaser(null);
    setFullItinerary(null);
    setCostEstimate(null);

    try {
      const trip = await createTripSeed({
        url: url.trim() || undefined,
        summary: summary.trim()
      });
      setTrip(trip);
      setCurrentTripId(trip.id);
      navigate(`/trips/${encodeURIComponent(trip.id)}/teaser`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(
        "We couldn’t create a trip from that input. Double-check the link or try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="stack-lg">
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Seed your trip</h2>
            <p
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "var(--color-text-muted)"
              }}
            >
              Paste a travel video or listing link and add one sentence about
              what you&apos;re hoping this trip feels like.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="stack">
            <div>
              <label className="field-label" htmlFor="url">
                Link to video or listing (optional)
              </label>
              <input
                id="url"
                className="input"
                placeholder="https://youtube.com/... or https://airbnb.com/rooms/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoComplete="off"
              />
              <p
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: "var(--color-text-muted)"
                }}
              >
                We&apos;ll eventually extract the transcript and visuals from
                this. For now, it helps us anchor your itinerary.
              </p>
            </div>

            <div>
              <label className="field-label" htmlFor="summary">
                Short trip summary (required)
              </label>
              <textarea
                id="summary"
                className="textarea"
                placeholder="e.g. 4-day chill friends trip to Tulum in May, mostly beach and food, nothing too rushed."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {error ? (
              <div className="field-error" style={{ marginTop: 2 }}>
                {error}
              </div>
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
              <button
                type="submit"
                className="btn"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? "Generating teaser..." : "Generate teaser"}
              </button>
            </div>
          </form>

          {isSubmitting ? (
            <LoadingState label="Creating your trip seed and teaser…" />
          ) : null}
        </div>
      </section>
    </div>
  );
};

