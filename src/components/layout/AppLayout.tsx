import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="app-grid grid min-h-screen">
      <Sidebar />
      <div className="flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
