import { useState, useMemo } from 'react';
import { Search, X, Clock, CheckCircle, AlertTriangle, User, Wrench, Calendar } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { maintenanceRequests, tenants, units } from '../data/mockData';
import type { MaintenanceRequest, MaintenanceStatus } from '../types';

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

/* ── Mock staff list ── */
const staffList = [
  { id: 's01', name: 'ช่างสมบัติ ซ่อมดี', role: 'ช่างไฟฟ้า', phone: '081-999-1111' },
  { id: 's02', name: 'ช่างวิชัย ประปา', role: 'ช่างประปา', phone: '081-999-2222' },
  { id: 's03', name: 'ช่างอนันต์ ทั่วไป', role: 'ช่างทั่วไป', phone: '081-999-3333' },
  { id: 's04', name: 'ช่างประสิทธิ์ แอร์เย็น', role: 'ช่างแอร์', phone: '081-999-4444' },
  { id: 's05', name: 'ช่างสุรชัย กุญแจ', role: 'ช่างกุญแจ/ประตู', phone: '081-999-5555' },
];

type FilterStatus = 'all' | MaintenanceStatus;

/* ── Assign Modal ── */
function AssignModal({ request, onClose }: { request: MaintenanceRequest; onClose: () => void }) {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const tenant = tenants.find((t) => t.id === request.tenantId);
  const unit = units.find((u) => u.id === request.unitId);
  const pCfg = priorityConfig[request.priority];

  const getDaysOpen = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleAssign = () => {
    if (!selectedStaff) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[520px]" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                <Wrench size={18} className="text-accent-ink" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-ink m-0">มอบหมายงานซ่อม</h2>
                <p className="text-[12px] text-ink-3 m-0">เลือกช่างและกำหนดวันเข้าซ่อม</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>

          {showSuccess ? (
            <div className="px-6 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-ink">มอบหมายงานเรียบร้อยแล้ว</p>
              <p className="text-[13px] text-ink-3 mt-1">ระบบได้แจ้งเตือนช่างที่ได้รับมอบหมายแล้ว</p>
            </div>
          ) : (
            <>
              {/* Issue summary */}
              <div className="px-6 pt-5 pb-4">
                <div className="bg-bg border border-border rounded-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[13px] font-bold text-ink mb-1">{request.issue}</div>
                      <div className="text-[12px] text-ink-2">
                        {tenant?.shopName || '—'} — ยูนิต {unit?.code || '—'}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[20px] text-[11px] font-semibold ${pCfg.bg} ${pCfg.text}`}>
                      {pCfg.icon}
                      {pCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11.5px] text-ink-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      แจ้งเมื่อ {request.createdAt}
                    </span>
                    <span className={`font-medium ${getDaysOpen(request.createdAt) > 3 ? 'text-danger' : 'text-ink-2'}`}>
                      เปิดมาแล้ว {getDaysOpen(request.createdAt)} วัน
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 pb-5 space-y-4">
                {/* Staff selection */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-2">
                    เลือกช่างที่รับผิดชอบ <span className="text-danger">*</span>
                  </label>
                  <div className="space-y-1.5">
                    {staffList.map((staff) => (
                      <label
                        key={staff.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border cursor-pointer transition-colors ${
                          selectedStaff === staff.id
                            ? 'border-accent bg-accent-soft/30'
                            : 'border-border hover:border-ink-3 bg-surface'
                        }`}
                      >
                        <input
                          type="radio"
                          name="staff"
                          value={staff.id}
                          checked={selectedStaff === staff.id}
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          className="accent-[var(--color-accent)]"
                        />
                        <div className="w-7 h-7 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                          <User size={13} className="text-accent-ink" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold text-ink">{staff.name}</div>
                          <div className="text-[11.5px] text-ink-3">{staff.role} | {staff.phone}</div>
                        </div>
                        {selectedStaff === staff.id && (
                          <CheckCircle size={16} className="text-accent shrink-0" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scheduled date */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
                    กำหนดวันเข้าซ่อม
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
                    หมายเหตุ / คำสั่งเพิ่มเติม
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="รายละเอียดเพิ่มเติมสำหรับช่าง..."
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
                <button onClick={onClose} className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                  ยกเลิก
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedStaff}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none ${
                    selectedStaff
                      ? 'bg-accent text-white hover:bg-accent-ink'
                      : 'bg-border-soft text-ink-3 cursor-not-allowed'
                  }`}
                >
                  <User size={13} />
                  มอบหมายงาน
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function MaintenancePage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [assignRequest, setAssignRequest] = useState<MaintenanceRequest | null>(null);

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
                            <button
                              onClick={() => setAssignRequest(m)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
                            >
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

      {/* ── Assign Modal ── */}
      {assignRequest && (
        <AssignModal request={assignRequest} onClose={() => setAssignRequest(null)} />
      )}
    </>
  );
}
