import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import UnitsPage from './pages/UnitsPage';
import LeadsPage from './pages/LeadsPage';
import TenantsPage from './pages/TenantsPage';
import ContractsPage from './pages/ContractsPage';
import PaymentsPage from './pages/PaymentsPage';
import MaintenancePage from './pages/MaintenancePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
