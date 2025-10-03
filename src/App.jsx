import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProductAccessProvider, useProductAccess } from './contexts/ProductAccessContext'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/LandingPage'
import WorkspacePage from './pages/WorkspacePage'
import LoginPage from './pages/LoginPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AccountPage from './pages/AccountPage'
import AdminDashboard from './pages/AdminDashboardEnhanced'
import ProductInfoPage from './pages/ProductInfoPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

function ProductAccessRoute({ children }) {
  const { user, loading } = useAuth()
  const { hasAccess, checking } = useProductAccess()

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (!hasAccess) {
    return <Navigate to="/product-info" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <ProductAccessProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/product-info" element={<ProductInfoPage />} />
              <Route
                path="/workspace"
                element={
                  <ProductAccessRoute>
                    <WorkspacePage />
                  </ProductAccessRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppLayout>
        </Router>
      </ProductAccessProvider>
    </AuthProvider>
  )
}

export default App
