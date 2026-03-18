import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TripProvider } from "./context/TripContext";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { TripSeedPage } from "./pages/TripSeedPage";
import { TeaserPage } from "./pages/TeaserPage";
import { PreferencesPage } from "./pages/PreferencesPage";
import { ItineraryPage } from "./pages/ItineraryPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppHeader } from "./components/common/AppHeader";
import { AppFooter } from "./components/common/AppFooter";

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <div className="app-shell">
          <AppHeader />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create/seed" element={<TripSeedPage />} />
              <Route path="/trips/:tripId/teaser" element={<TeaserPage />} />
              <Route
                path="/trips/:tripId/preferences"
                element={
                  <ProtectedRoute>
                    <PreferencesPage />
                  </ProtectedRoute>
                }
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
    </AuthProvider>
  );
}

export default App;

