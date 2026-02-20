import React, { createContext, useContext, useState } from "react";
import type {
  Trip,
  PlannerTeaser,
  PlannerFullItinerary,
  CostEstimate
} from "../types/api";

type TripContextValue = {
  currentTripId: string | null;
  setCurrentTripId: (id: string | null) => void;
  trip: Trip | null;
  setTrip: (trip: Trip | null) => void;
  teaser: PlannerTeaser | null;
  setTeaser: (teaser: PlannerTeaser | null) => void;
  fullItinerary: PlannerFullItinerary | null;
  setFullItinerary: (itinerary: PlannerFullItinerary | null) => void;
  costEstimate: CostEstimate | null;
  setCostEstimate: (estimate: CostEstimate | null) => void;
};

const TripContext = createContext<TripContextValue | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [teaser, setTeaser] = useState<PlannerTeaser | null>(null);
  const [fullItinerary, setFullItinerary] =
    useState<PlannerFullItinerary | null>(null);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);

  return (
    <TripContext.Provider
      value={{
        currentTripId,
        setCurrentTripId,
        trip,
        setTrip,
        teaser,
        setTeaser,
        fullItinerary,
        setFullItinerary,
        costEstimate,
        setCostEstimate
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return ctx;
}

