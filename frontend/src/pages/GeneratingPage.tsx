import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTripContext } from "../context/TripContext";
import { generateFullItinerary, updateTripPreferences } from "../services/api";
import type { BudgetTier, Pace } from "../types/api";
import { ErrorState } from "../components/common/ErrorState";

type GeneratingState = {
  preferences: {
    interests: string[];
    budget: BudgetTier;
    pace: Pace;
    dietary: string[];
    accessibility: string[];
  };
};

const LOADING_MESSAGES = [
  "Reviewing your trip details…",
  "Crafting day-by-day activities…",
  "Finding the best local spots…",
  "Matching your pace and interests…",
  "Calculating costs and timing…",
  "Putting the final touches on your plan…"
];

export const GeneratingPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setTrip, setFullItinerary } = useTripContext();

  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Prevent double-firing in React strict mode
  const hasFired = useRef(false);

  const state = location.state as GeneratingState | undefined;
  const preferences = state?.preferences;

  // Cycle through loading messages every 2.5 s
  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [error]);

  // Fire the API call once on mount
  useEffect(() => {
    if (!tripId || hasFired.current) return;
    hasFired.current = true;

    if (!preferences) {
      setError("Preferences were not passed through. Please go back and try again.");
      return;
    }

    const generate = async () => {
      try {
        const updatedTrip = await updateTripPreferences({ id: tripId, preferences });
        setTrip(updatedTrip);

        const itinerary = await generateFullItinerary({ tripId, preferences });
        setFullItinerary(itinerary);

        navigate(`/trips/${encodeURIComponent(tripId)}/itinerary`, { replace: true });
      } catch (err) {
        console.error(err);
        setError("We couldn't generate your full itinerary. Please go back and try again.");
      }
    };

    void generate();
  }, [tripId]);

  if (error) {
    return (
      <div className="stack-lg">
        <section className="card">
          <div className="stack-lg" style={{ alignItems: "center", textAlign: "center", padding: "32px 0" }}>
            <ErrorState message={error} />
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: 13, paddingInline: 18 }}
              onClick={() => navigate(-1)}
            >
              ← Go back to preferences
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <section className="card">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "48px 24px",
            gap: 32
          }}
        >
          {/* Spinner */}
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "3px solid rgba(148,163,184,0.15)",
                borderTopColor: "#3b82f6",
                animation: "spin 0.9s linear infinite"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                border: "3px solid rgba(148,163,184,0.08)",
                borderBottomColor: "#a855f7",
                animation: "spin 1.4s linear infinite reverse"
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

          {/* Title */}
          <div className="stack" style={{ gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Building your itinerary</h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "var(--color-text-muted)",
                minHeight: 22,
                transition: "opacity 0.3s ease"
              }}
            >
              {LOADING_MESSAGES[messageIndex]}
            </p>
          </div>

          {/* Step indicators */}
          <div style={{ display: "flex", gap: 8 }}>
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === messageIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === messageIndex
                    ? "linear-gradient(90deg, #3b82f6, #a855f7)"
                    : "rgba(148,163,184,0.25)",
                  transition: "width 0.3s ease, background 0.3s ease"
                }}
              />
            ))}
          </div>

          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)" }}>
            This usually takes 15–30 seconds. Don't close the tab.
          </p>
        </div>
      </section>
    </div>
  );
};
