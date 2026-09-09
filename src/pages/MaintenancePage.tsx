import { useState, useMemo } from 'react';
import { Search, X, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { maintenanceRequests, tenants, units } from '../data/mockData';
import type { MaintenanceStatus } from '../types';

const statusConfig: Record<MaintenanceStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending:     { label: 'รอดำเนินการ',   bg: 'bg-danger-soft',          text: 'text-danger',     dot: 'bg-danger' },
  in_progress: { label: 'กำลังดำเนินการ', bg: 'bg-warning-soft',         text: 'text-accent-ink', dot: 'bg-warning' },
  done:        { label: 'เสร็จแล้ว',     bg: 'bg-success-soft',         text: 'text-success',    dot: 'bg-success' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  high:   { label: 'เร่งด่วน', bg: 'bg-danger-soft',          text: 'text-danger',     icon: <AlertTriangle size={12} /> },
  medium: { label: 'ปานกลาง', bg: 'bg-warning-soft',         text: 'text-accent-ink', icon: <Clock size={12} /> },
  low:    { label: 'ต่ำ',     bg: 'bg-neutral-status-soft',  text: 'text-ink-2',      icon: <CheckCircle size={12} /> },
};

type FilterStatus = 'all' | MaintenanceStatus;

export default function MaintenancePage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const getTenant = (id: string) => tenants.find((t) => t.id === id);
  const getUnit = (id: string) => units.find((u) => u.id === id);

  const counts = {
    all: maintenanceRequests.length,
    pending: maintenanceRequests.filter((m) => m.status === 'pending').length,
    in_progress: maintenanceRequests.filter((m) => m.status === 'in_progress').length,
    done: maintenanceRequests.filter((m) => m.status === 'done').length,
  };

  const highPriority = maintenanceRequests.filter((m) => m.priority === 'high' && m.status !== 'done').length;

  const filtered = useMemo(() => {
    return maintenanceRequests.filter((m) => {
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const tenant = getTenant(m.tenantId);
        const unit = getUnit(m.unitId);
        return (
          m.issue.toLowerCase().includes(q) ||
          tenant?.shopName.toLowerCase().includes(q) ||
          unit?.code.toLowerCase().includes(q) ||
          false
        );
      }
      return true;
    });
  }, [filterStatus, search]);

  const getDaysOpen = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <Topbar title="แจ้งซ่อม" subtitle="ระบบแจ้งซ่อมและติดตามงาน" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{counts.all}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">รอดำเนินการ</div>
            <div className="text-[22px] font-extrabold text-danger">{counts.pending}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">กำลังดำเนินการ</div>
            <div className="text-[22px] font-extrabold text-accent-ink">{counts.in_progress}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">เสร็จแล้ว</div>
            <div className="text-[22px] font-extrabold text-success">{counts.done}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">เร่งด่วนค้างอยู่</div>
            <div className="text-[22px] font-extrabold text-danger flex items-center gap-1.5">
              <AlertTriangle size={18} />
              {highPriority}
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-sm px-3 py-2 w-full max-w-[280px] text-[13px]">
            <Search size={15} className="text-ink-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาปัญหา ร้านค้า ยูนิต..."
              className="bg-transparent border-none outline-none w-full text-ink placeholder:text-ink-3 font-[inherit] text-[13px]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-ink-3 hover:text-ink cursor-pointer bg-transparent border-none p-0">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {([
              { key: 'all' as FilterStatus, label: 'ทั้งหมด', count: counts.all },
              { key: 'pending' as FilterStatus, label: 'รอดำเนินการ', count: counts.pending },
              { key: 'in_progress' as FilterStatus, label: 'กำลังดำเนินการ', count: counts.in_progress },
              { key: 'done' as FilterStatus, label: 'เสร็จแล้ว', count: counts.done },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`px-3 py-[6px] rounded-sm text-[12.5px] font-medium border cursor-pointer font-[inherit] transition-colors ${
                  filterStatus === f.key
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-ink-2 border-border hover:border-ink-3'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center">
            <p className="text-ink-3 text-[14px]">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ปัญหา</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ยูนิต</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ความเร่งด่วน</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">วันที่แจ้ง</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ระยะเวลา</th>
                    <th className="text-center px-4 py-3 font-semibold text-ink-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => {
                    const tenant = getTenant(m.tenantId);
                    const unit = getUnit(m.unitId);
                    const sCfg = statusConfig[m.status];
                    const pCfg = priorityConfig[m.priority];
                    const daysOpen = getDaysOpen(m.createdAt);
                    return (
                      <tr key={m.id} className={`border-b border-border-soft hover:bg-bg transition-colors ${m.priority === 'high' && m.status === 'pending' ? 'bg-danger-soft/20' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-ink">{m.issue}</div>
                        </td>
                        <td className="px-4 py-3 text-ink-2">{tenant?.shopName || '—'}</td>
                        <td className="px-4 py-3 text-ink-2">{unit?.code || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${pCfg.bg} ${pCfg.text}`}>
                            {pCfg.icon}
                            {pCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${sCfg.bg} ${sCfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                            {sCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-3">{m.createdAt}</td>
                        <td className="px-4 py-3">
                          {m.status === 'done' ? (
                            <span className="text-[12px] text-success font-medium">แก้ไขแล้ว {m.resolvedAt}</span>
                          ) : (
                            <span className={`text-[12px] font-medium ${daysOpen > 3 ? 'text-danger' : 'text-ink-2'}`}>
                              {daysOpen} วัน
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {m.status === 'pending' && (
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                              <User size={12} />
                              มอบหมาย
                            </button>
                          )}
                          {m.status === 'in_progress' && (
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-success text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-success/90 transition-colors">
                              <CheckCircle size={12} />
                              เสร็จแล้ว
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
