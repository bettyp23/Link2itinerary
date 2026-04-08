import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTripSeed } from "../services/api";
import { useTripContext } from "../context/TripContext";
import { LoadingState } from "../components/common/LoadingState";

const ACCOMMODATION_TYPES = [
  { value: "", label: "Select type…" },
  { value: "airbnb", label: "Airbnb" },
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "resort", label: "Resort" },
  { value: "other", label: "Other" },
];

export const TripSeedPage = () => {
  const navigate = useNavigate();
  const { setCurrentTripId, setTrip, setTeaser, setFullItinerary, setCostEstimate } =
    useTripContext();

  // Core fields
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");

  // Optional detail fields
  const [showDetails, setShowDetails] = useState(false);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [accommodationName, setAccommodationName] = useState("");
  const [accommodationType, setAccommodationType] = useState("");

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!summary.trim()) {
      setError("Add a one-line summary so we understand your trip.");
      return;
    }

    if (checkIn && checkOut && checkOut < checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setIsSubmitting(true);
    setTeaser(null);
    setFullItinerary(null);
    setCostEstimate(null);

    try {
      const params: Parameters<typeof createTripSeed>[0] = {
        summary: summary.trim(),
      };
      if (url.trim())                 params.url               = url.trim();
      if (location.trim())            params.location          = location.trim();
      if (checkIn)                    params.checkIn           = checkIn;
      if (checkOut)                   params.checkOut          = checkOut;
      if (accommodationName.trim())   params.accommodationName = accommodationName.trim();
      if (accommodationType)          params.accommodationType = accommodationType;

      const trip = await createTripSeed(params);
      setTrip(trip);
      setCurrentTripId(trip.id);
      navigate(`/trips/${encodeURIComponent(trip.id)}/teaser`);
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't create a trip from that input. Double-check the link or try again."
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
            <p style={{ marginTop: 6, fontSize: 13, color: "var(--color-text-muted)" }}>
              Paste a travel video or listing link and add one sentence about
              what you&apos;re hoping this trip feels like.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="stack">

            {/* ── URL ── */}
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
              <p style={{ marginTop: 4, fontSize: 11, color: "var(--color-text-muted)" }}>
                We&apos;ll use this to anchor your itinerary to a real place or listing.
              </p>
            </div>

            {/* ── Summary ── */}
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

            {/* ── Optional details toggle ── */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails(v => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transition: "transform 0.18s ease",
                    transform: showDetails ? "rotate(90deg)" : "rotate(0deg)",
                    fontSize: 10,
                  }}
                >
                  ▶
                </span>
                Optional details
                {!showDetails && (location || checkIn || checkOut || accommodationName || accommodationType) && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "999px",
                      background: "#3b82f6",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>

              {/* ── Collapsible section ── */}
              {showDetails && (
                <div
                  className="stack"
                  style={{
                    marginTop: 14,
                    paddingLeft: 14,
                    borderLeft: "2px solid rgba(148,163,184,0.2)",
                  }}
                >
                  {/* Location */}
                  <div>
                    <label className="field-label" htmlFor="location">
                      Location
                    </label>
                    <input
                      id="location"
                      className="input"
                      placeholder="e.g. Paris, France"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  {/* Check-in / Check-out */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label className="field-label" htmlFor="checkIn">
                        Check-in
                      </label>
                      <input
                        id="checkIn"
                        type="date"
                        className="input"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="checkOut">
                        Check-out
                      </label>
                      <input
                        id="checkOut"
                        type="date"
                        className="input"
                        value={checkOut}
                        min={checkIn || undefined}
                        onChange={(e) => setCheckOut(e.target.value)}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  {/* Accommodation name */}
                  <div>
                    <label className="field-label" htmlFor="accommodationName">
                      Accommodation name
                    </label>
                    <input
                      id="accommodationName"
                      className="input"
                      placeholder="e.g. Charming apartment in Le Marais"
                      value={accommodationName}
                      onChange={(e) => setAccommodationName(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  {/* Accommodation type */}
                  <div>
                    <label className="field-label" htmlFor="accommodationType">
                      Accommodation type
                    </label>
                    <select
                      id="accommodationType"
                      className="select"
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
                      style={{ borderRadius: "var(--border-radius-sm)", cursor: "pointer" }}
                    >
                      {ACCOMMODATION_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="field-error" style={{ marginTop: 2 }}>
                {error}
              </div>
            )}

            {/* ── Submit ── */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 6 }}>
              <button
                type="submit"
                className="btn"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? "Generating teaser…" : "Generate teaser"}
              </button>
            </div>
          </form>

          {isSubmitting && (
            <LoadingState label="Creating your trip seed and teaser…" />
          )}
        </div>
      </section>
    </div>
  );
};
