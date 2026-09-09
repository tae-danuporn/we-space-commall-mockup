import { useState } from 'react';
import { Search, Plus, Bell } from 'lucide-react';
import AddLeadModal from '../ui/AddLeadModal';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [showAddLead, setShowAddLead] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <>
      <header className="h-[66px] bg-surface border-b border-border flex items-center justify-between px-7 sticky top-0 z-5">
        {/* Left: Title */}
        <div>
          <h1 className="text-[16.5px] font-bold m-0">{title}</h1>
          {subtitle && <p className="text-[12px] text-ink-2 mt-px">{subtitle}</p>}
        </div>

        {/* Center: Search */}
        <div className="search-box hidden lg:flex items-center gap-2 bg-bg border border-border rounded-sm px-3 py-2 w-[300px] text-ink-3 text-[13px]">
          <Search size={16} className="shrink-0" />
          <span>ค้นหาร้านค้า ผู้เช่า หรือสัญญา</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddLead(true)}
            className="flex items-center gap-1.5 bg-accent text-white border-none px-3.5 py-[9px] rounded-sm text-[13px] font-semibold cursor-pointer hover:bg-accent-ink transition-colors font-[inherit]"
          >
            <Plus size={15} />
            <span className="hidden md:inline">เพิ่มผู้สนใจเช่าใหม่</span>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative w-9 h-9 rounded-sm flex items-center justify-center text-ink-2 border border-border bg-surface cursor-pointer hover:bg-bg transition-colors"
            >
              <Bell size={17} />
              <span className="absolute top-[5px] right-[6px] w-[7px] h-[7px] rounded-full bg-danger border-[1.5px] border-surface" />
            </button>

            {/* Notification dropdown */}
            {showNotif && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 top-11 w-[340px] bg-surface border border-border rounded-card shadow-lg z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-[13px] font-bold text-ink">แจ้งเตือน</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-danger-soft text-danger">3 ใหม่</span>
                  </div>
                  <NotifItem
                    color="bg-danger-soft"
                    textColor="text-danger"
                    title="แจ้งซ่อมใหม่"
                    desc="DEF Pharmacy แจ้งซ่อมระบบไฟฟ้า"
                    time="10 นาทีที่แล้ว"
                  />
                  <NotifItem
                    color="bg-warning-soft"
                    textColor="text-accent-ink"
                    title="สัญญาใกล้หมดอายุ"
                    desc="ABC Cafe เหลืออีก 12 วัน"
                    time="1 ชั่วโมงที่แล้ว"
                  />
                  <NotifItem
                    color="bg-success-soft"
                    textColor="text-success"
                    title="ชำระเงินสำเร็จ"
                    desc="XYZ Fashion ชำระค่าเช่าเดือน ก.ย."
                    time="2 ชั่วโมงที่แล้ว"
                    isLast
                  />
                  <div className="px-4 py-2.5 border-t border-border text-center">
                    <button className="text-[12px] font-semibold text-accent cursor-pointer bg-transparent border-none font-[inherit] hover:text-accent-ink">
                      ดูทั้งหมด
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-[9px] pl-1.5 border-l border-border">
            <div className="w-[34px] h-[34px] rounded-full bg-sidebar-bg text-white font-bold text-[13px] flex items-center justify-center">
              ส
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-semibold leading-tight">คุณสมชาย ใจดี</div>
              <div className="text-[11.5px] text-ink-2">ผู้จัดการโครงการ</div>
            </div>
          </div>
        </div>
      </header>

      <AddLeadModal isOpen={showAddLead} onClose={() => setShowAddLead(false)} />
    </>
  );
}

function NotifItem({ color, textColor, title, desc, time, isLast }: {
  color: string; textColor: string; title: string; desc: string; time: string; isLast?: boolean;
}) {
  return (
    <div className={`px-4 py-3 hover:bg-bg transition-colors cursor-pointer ${!isLast ? 'border-b border-border-soft' : ''}`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${color.replace('-soft', '')}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-[12.5px] font-semibold ${textColor}`}>{title}</div>
          <div className="text-[12px] text-ink truncate">{desc}</div>
          <div className="text-[11px] text-ink-3 mt-0.5">{time}</div>
        </div>
      </div>
    </div>
  );
}
