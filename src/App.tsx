import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './utils/auth/useAuth';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import Personas from './pages/Personas';
import Templates from './pages/Templates';
import Schedules from './pages/Schedules';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/app/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="sites" element={<Sites />} />
                  <Route path="personas" element={<Personas />} />
                  <Route path="templates" element={<Templates />} />
                  <Route path="schedules" element={<Schedules />} />
                  <Route path="settings/*" element={<Settings />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}