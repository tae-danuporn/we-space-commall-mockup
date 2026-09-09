import { Search, Plus, Bell } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
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
        <button className="flex items-center gap-1.5 bg-accent text-white border-none px-3.5 py-[9px] rounded-sm text-[13px] font-semibold cursor-pointer hover:bg-accent-ink transition-colors font-[inherit]">
          <Plus size={15} />
          <span className="hidden md:inline">เพิ่มผู้สนใจเช่าใหม่</span>
        </button>

        <div className="relative w-9 h-9 rounded-sm flex items-center justify-center text-ink-2 border border-border bg-surface cursor-pointer hover:bg-bg transition-colors">
          <Bell size={17} />
          <span className="absolute top-[5px] right-[6px] w-[7px] h-[7px] rounded-full bg-danger border-[1.5px] border-surface" />
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
  );
}
