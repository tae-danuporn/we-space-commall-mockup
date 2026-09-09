import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="units" element={<PlaceholderPage title="พื้นที่เช่า" subtitle="จัดการยูนิตเช่าทั้งหมด" />} />
          <Route path="leads" element={<PlaceholderPage title="ผู้สนใจเช่า" subtitle="Pipeline ติดตามลูกค้าเป้าหมาย" />} />
          <Route path="tenants" element={<PlaceholderPage title="ผู้เช่า" subtitle="รายชื่อผู้เช่าปัจจุบัน" />} />
          <Route path="contracts" element={<PlaceholderPage title="สัญญา" subtitle="จัดการสัญญาเช่า" />} />
          <Route path="payments" element={<PlaceholderPage title="ค่าเช่าและการชำระเงิน" subtitle="ติดตามการชำระเงิน" />} />
          <Route path="maintenance" element={<PlaceholderPage title="แจ้งซ่อม" subtitle="ระบบแจ้งซ่อมและติดตามงาน" />} />
          <Route path="announcements" element={<PlaceholderPage title="ประกาศ" subtitle="ส่งประกาศถึงผู้เช่า" />} />
          <Route path="reports" element={<PlaceholderPage title="รายงาน" subtitle="สรุปข้อมูลและกราฟ" />} />
          <Route path="settings" element={<PlaceholderPage title="ตั้งค่า" subtitle="ตั้งค่าระบบทั่วไป" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
