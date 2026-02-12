import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTripContext } from "../context/TripContext";
import { generateFullItinerary, updateTripPreferences } from "../services/api";
import type { BudgetTier, Pace } from "../types/api";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";

type InterestsMap = Record<string, string>;

const INTERESTS: InterestsMap = {
  museums: "Museums & Art",
  food: "Food & Dining",
  architecture: "Architecture",
  nightlife: "Nightlife",
  nature: "Nature & Parks",
  shopping: "Shopping",
  history: "History & Culture"
};

const DIETARY = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "nut-free"
] as const;

const ACCESSIBILITY = [
  "wheelchair-accessible",
  "family-friendly",
  "low-walking",
  "step-free"
] as const;

export const PreferencesPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trip, setTrip, setFullItinerary } = useTripContext();

  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>(
    trip?.preferences?.interests ?? []
  );
  const [budget, setBudget] = useState<BudgetTier>(
    trip?.preferences?.budget ?? "moderate"
  );
  const [pace, setPace] = useState<Pace>(trip?.preferences?.pace ?? "relaxed");
  const [dietary, setDietary] = useState<string[]>(
    trip?.preferences?.dietary ?? []
  );
  const [accessibility, setAccessibility] = useState<string[]>(
    trip?.preferences?.accessibility ?? []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!tripId) {
    return (
      <ErrorState
        title="Missing trip"
        message="We couldn't find this trip. Start again from the landing page."
      />
    );
  }

  const toggleInArray = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const preferences = {
      interests,
      budget,
      pace,
      dietary,
      accessibility
    };

    try {
      const updatedTrip = await updateTripPreferences({
        id: tripId,
        preferences
      });
      setTrip(updatedTrip);
      const itinerary = await generateFullItinerary({
        tripId,
        preferences
      });
      setFullItinerary(itinerary);
      navigate(`/trips/${encodeURIComponent(tripId)}/itinerary`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(
        "We couldn’t generate your full itinerary. Please try again in a moment."
      );
      setLoading(false);
    }
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div className="stack-lg">
      <section className="card">
        <form onSubmit={handleSubmit} className="stack-lg">
          <div className="stack">
            <div className="chip">Step {step} of 4 · Preferences</div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Tune this trip to you</h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--color-text-muted)"
              }}
            >
              We&apos;ll combine these answers with the content from your link to
              build a schedule that matches your energy, budget, and interests.
            </p>
            <div
              style={{
                width: "100%",
                height: 4,
                borderRadius: 999,
                background: "rgba(15,23,42,0.9)",
                overflow: "hidden",
                marginTop: 6
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7)",
                  transition: "width 0.18s ease"
                }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="stack">
              <h3 style={{ margin: 0, fontSize: 16 }}>What are you into?</h3>
              <p
                style={{
                  margin: "4px 0 10px",
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                We&apos;ll prioritize activities that align with these themes.
              </p>
              <div className="stack-row">
                {Object.entries(INTERESTS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={interests.includes(key) ? "btn" : "btn-secondary"}
                    style={{
                      fontSize: 13,
                      padding: "6px 12px",
                      background: interests.includes(key)
                        ? undefined
                        : "rgba(15,23,42,0.9)"
                    }}
                    onClick={() =>
                      setInterests((prev) => toggleInArray(prev, key))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="stack">
              <h3 style={{ margin: 0, fontSize: 16 }}>Budget comfort zone</h3>
              <p
                style={{
                  margin: "4px 0 10px",
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                Roughly how do you want this trip to feel cost-wise?
              </p>
              <div className="stack">
                <label className="field-label">Budget tier</label>
                <div className="stack">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13
                    }}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value="budget"
                      checked={budget === "budget"}
                      onChange={() => setBudget("budget")}
                    />
                    <span>
                      Budget ·{" "}
                      <span style={{ color: "var(--color-text-muted)" }}>
                        prioritize savings, free/cheap activities
                      </span>
                    </span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13
                    }}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value="moderate"
                      checked={budget === "moderate"}
                      onChange={() => setBudget("moderate")}
                    />
                    <span>
                      Moderate ·{" "}
                      <span style={{ color: "var(--color-text-muted)" }}>
                        balanced quality and value
                      </span>
                    </span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13
                    }}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value="luxury"
                      checked={budget === "luxury"}
                      onChange={() => setBudget("luxury")}
                    />
                    <span>
                      Luxury ·{" "}
                      <span style={{ color: "var(--color-text-muted)" }}>
                        splurge-friendly experiences
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="stack">
              <h3 style={{ margin: 0, fontSize: 16 }}>How fast do you like days?</h3>
              <p
                style={{
                  margin: "4px 0 10px",
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                We&apos;ll space out activities and breaks based on this.
              </p>
              <div className="stack">
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 13
                  }}
                >
                  <input
                    type="radio"
                    name="pace"
                    value="relaxed"
                    checked={pace === "relaxed"}
                    onChange={() => setPace("relaxed")}
                  />
                  <span>
                    Relaxed ·{" "}
                    <span style={{ color: "var(--color-text-muted)" }}>
                      2–3 activities per day, lots of downtime
                    </span>
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 13
                  }}
                >
                  <input
                    type="radio"
                    name="pace"
                    value="moderate"
                    checked={pace === "moderate"}
                    onChange={() => setPace("moderate")}
                  />
                  <span>
                    Moderate ·{" "}
                    <span style={{ color: "var(--color-text-muted)" }}>
                      3–4 activities, balanced schedule
                    </span>
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 13
                  }}
                >
                  <input
                    type="radio"
                    name="pace"
                    value="packed"
                    checked={pace === "packed"}
                    onChange={() => setPace("packed")}
                  />
                  <span>
                    Packed ·{" "}
                    <span style={{ color: "var(--color-text-muted)" }}>
                      5+ activities, maximize every moment
                    </span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="stack">
              <h3 style={{ margin: 0, fontSize: 16 }}>
                Dietary and accessibility needs
              </h3>
              <p
                style={{
                  margin: "4px 0 10px",
                  fontSize: 13,
                  color: "var(--color-text-muted)"
                }}
              >
                We&apos;ll avoid suggesting anything that obviously conflicts with
                these.
              </p>

              <div className="stack">
                <label className="field-label">Dietary preferences</label>
                <div className="stack-row">
                  {DIETARY.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        dietary.includes(item) ? "btn" : "btn-secondary"
                      }
                      style={{
                        fontSize: 13,
                        padding: "6px 12px",
                        background: dietary.includes(item)
                          ? undefined
                          : "rgba(15,23,42,0.9)"
                      }}
                      onClick={() =>
                        setDietary((prev) => toggleInArray(prev, item))
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="stack">
                <label className="field-label">Accessibility</label>
                <div className="stack-row">
                  {ACCESSIBILITY.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        accessibility.includes(item) ? "btn" : "btn-secondary"
                      }
                      style={{
                        fontSize: 13,
                        padding: "6px 12px",
                        background: accessibility.includes(item)
                          ? undefined
                          : "rgba(15,23,42,0.9)"
                      }}
                      onClick={() =>
                        setAccessibility((prev) => toggleInArray(prev, item))
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error ? <ErrorState message={error} /> : null}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap"
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              disabled={step === 1 || loading}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              style={{ fontSize: 13, paddingInline: 14 }}
            >
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                className="btn"
                disabled={loading}
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                style={{ fontSize: 13, paddingInline: 18 }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn"
                disabled={loading}
                style={{ fontSize: 13, paddingInline: 18 }}
              >
                {loading ? "Generating itinerary…" : "Generate itinerary"}
              </button>
            )}
          </div>

          {loading ? (
            <LoadingState label="Building your full itinerary and estimating costs…" />
          ) : null}
        </form>
      </section>
    </div>
  );
};

