import { Route, Routes } from "react-router-dom";
import { TripProvider } from "./context/TripContext";
import { LandingPage } from "./pages/LandingPage";
import { TripSeedPage } from "./pages/TripSeedPage";
import { TeaserPage } from "./pages/TeaserPage";
import { PreferencesPage } from "./pages/PreferencesPage";
import { ItineraryPage } from "./pages/ItineraryPage";
import { AppHeader } from "./components/common/AppHeader";
import { AppFooter } from "./components/common/AppFooter";

function App() {
  return (
    <TripProvider>
      <div className="app-shell">
        <AppHeader />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create/seed" element={<TripSeedPage />} />
            <Route path="/trips/:tripId/teaser" element={<TeaserPage />} />
            <Route
              path="/trips/:tripId/preferences"
              element={<PreferencesPage />}
            />
            <Route
              path="/trips/:tripId/itinerary"
              element={<ItineraryPage />}
            />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </TripProvider>
  );
}

export default App;

