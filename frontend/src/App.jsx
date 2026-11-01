import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { PurchasesPage } from './pages/PurchasesPage.jsx';
import { AddPurchasePage } from './pages/AddPurchasePage.jsx';
import { EditPurchasePage } from './pages/EditPurchasePage.jsx';
import { PurchaseDetailsPage } from './pages/PurchaseDetailsPage.jsx';
import { WarrantyTrackerPage } from './pages/WarrantyTrackerPage.jsx';
import { ExpiringSoonPage } from './pages/ExpiringSoonPage.jsx';
import { ReceiptVaultPage } from './pages/ReceiptVaultPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { purchaseService } from './services/purchaseService.js';

export function App() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expiringCount, setExpiringCount] = useState(0);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Check expiring items count for navigation alert pill
  useEffect(() => {
    if (!isAuthenticated) return;

    async function checkExpiring() {
      try {
        const res = await purchaseService.getExpiringPurchases();
        if (res.success && Array.isArray(res.purchases)) {
          setExpiringCount(res.purchases.length);
        }
      } catch {
        // quiet fallback
      }
    }

    checkExpiring();
  }, [isAuthenticated, location.pathname]);

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Protected Application Shell */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <Navbar
                onMenuClick={() => setMobileMenuOpen(true)}
                expiringCount={expiringCount}
              />

              <Sidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                expiringCount={expiringCount}
              />

              <main className="content-container">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/purchases" element={<PurchasesPage />} />
                  <Route path="/purchases/new" element={<AddPurchasePage />} />
                  <Route path="/purchases/:id" element={<PurchaseDetailsPage />} />
                  <Route path="/purchases/:id/edit" element={<EditPurchasePage />} />
                  <Route path="/warranties" element={<WarrantyTrackerPage />} />
                  <Route path="/expiring" element={<ExpiringSoonPage />} />
                  <Route path="/receipts" element={<ReceiptVaultPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
