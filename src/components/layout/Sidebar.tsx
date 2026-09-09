import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  UserPlus,
  Users,
  FileText,
  CreditCard,
  Wrench,
  Megaphone,
  BarChart3,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/units', label: 'พื้นที่เช่า', icon: Home },
  { to: '/leads', label: 'ผู้สนใจเช่า', icon: UserPlus },
  { to: '/tenants', label: 'ผู้เช่า', icon: Users },
  { to: '/contracts', label: 'สัญญา', icon: FileText },
  { to: '/payments', label: 'ค่าเช่าและการชำระเงิน', icon: CreditCard },
  { to: '/maintenance', label: 'แจ้งซ่อม', icon: Wrench },
  { to: '/announcements', label: 'ประกาศ', icon: Megaphone },
  { to: '/reports', label: 'รายงาน', icon: BarChart3 },
  { to: '/settings', label: 'ตั้งค่า', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="bg-sidebar-bg text-sidebar-text flex flex-col sticky top-0 h-screen overflow-y-auto sidebar-scroll">
      {/* Brand */}
      <div className="flex items-center gap-[11px] px-5 pt-[22px] pb-[18px] border-b border-white/8">
        <div className="w-[34px] h-[34px] rounded-sm bg-gradient-to-br from-accent to-accent-ink flex items-center justify-center text-white font-bold text-[15px] shrink-0">
          W
        </div>
        <div className="brand-text">
          <div className="text-white text-[13px] font-bold leading-tight">We Space Community Mall</div>
          <div className="text-[11.5px] text-sidebar-text mt-px">Management System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-[14px_12px] flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-[11px] px-3 py-[9px] mb-0.5 rounded-sm text-[14px] font-medium no-underline relative transition-colors ${
                isActive
                  ? 'bg-sidebar-bg-2 text-sidebar-text-active'
                  : 'text-sidebar-text hover:bg-sidebar-bg-2/50 hover:text-sidebar-text-active/80'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -left-3 top-2 bottom-2 w-[3px] bg-accent rounded-r-sm" />
                )}
                <item.icon
                  size={18}
                  className={`shrink-0 ${isActive ? 'text-accent opacity-100' : 'opacity-85'}`}
                />
                <span className="nav-label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-[14px] pb-[18px] border-t border-white/8 text-[11.5px] text-ink-3 sidebar-footer">
        MOCKUP - VERSION
      </div>
    </aside>
  );
}
