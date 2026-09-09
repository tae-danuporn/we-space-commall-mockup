import { useState, useMemo } from 'react';
import { Search, X, Clock, CheckCircle, AlertTriangle, Plus, FileText, Wrench, Calendar, DollarSign } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { maintenanceRequests, tenants, units } from '../data/mockData';
import type { MaintenanceRequest, MaintenanceStatus } from '../types';

const statusConfig: Record<MaintenanceStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending:     { label: 'รอดำเนินการ',   bg: 'bg-danger-soft',  text: 'text-danger',     dot: 'bg-danger' },
  in_progress: { label: 'กำลังดำเนินการ', bg: 'bg-warning-soft', text: 'text-accent-ink', dot: 'bg-warning' },
  done:        { label: 'เสร็จแล้ว',     bg: 'bg-success-soft', text: 'text-success',    dot: 'bg-success' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  high:   { label: 'เร่งด่วน', bg: 'bg-danger-soft',         text: 'text-danger',     icon: <AlertTriangle size={12} /> },
  medium: { label: 'ปานกลาง', bg: 'bg-warning-soft',         text: 'text-accent-ink', icon: <Clock size={12} /> },
  low:    { label: 'ต่ำ',     bg: 'bg-neutral-status-soft',  text: 'text-ink-2',      icon: <CheckCircle size={12} /> },
};

type FilterStatus = 'all' | MaintenanceStatus;

/* ── Modal: แจ้งซ่อมใหม่ ── */
function NewRepairModal({ onClose }: { onClose: () => void }) {
  const [tenantId, setTenantId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showSuccess, setShowSuccess] = useState(false);

  // auto-fill unit when tenant is selected
  const handleTenantChange = (tid: string) => {
    setTenantId(tid);
    const t = tenants.find((x) => x.id === tid);
    if (t) setUnitId(t.unitId);
  };

  const handleSubmit = () => {
    if (!issue || !tenantId) return;
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); onClose(); }, 1800);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                <Plus size={18} className="text-accent-ink" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-ink m-0">แจ้งซ่อมใหม่</h2>
                <p className="text-[12px] text-ink-3 m-0">บันทึกปัญหาที่ต้องการแจ้งซ่อม</p>
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
              <p className="text-[15px] font-bold text-ink">บันทึกการแจ้งซ่อมเรียบร้อย</p>
              <p className="text-[13px] text-ink-3 mt-1">รายการถูกเพิ่มในระบบแล้ว</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-5 space-y-4">
                {/* Tenant */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
                    ร้านค้า / ผู้เช่า <span className="text-danger">*</span>
                  </label>
                  <select
                    value={tenantId}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
                  >
                    <option value="">-- เลือกร้านค้า --</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>{t.shopName}</option>
                    ))}
                  </select>
                </div>

                {/* Unit (auto-fill) */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">ยูนิต</label>
                  <select
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
                  >
                    <option value="">-- เลือกยูนิต --</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.code} (โซน {u.zone} ชั้น {u.floor})</option>
                    ))}
                  </select>
                </div>

                {/* Issue */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
                    หัวข้อปัญหา <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="เช่น ท่อน้ำรั่ว, ไฟดับ, แอร์ไม่เย็น..."
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">รายละเอียดเพิ่มเติม</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="อธิบายอาการ ตำแหน่ง หรือรายละเอียดเพิ่มเติม..."
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y transition-colors"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-2">ความเร่งด่วน</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => {
                      const cfg = priorityConfig[p];
                      return (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-[12.5px] font-semibold border cursor-pointer font-[inherit] transition-colors ${
                            priority === p
                              ? `${cfg.bg} ${cfg.text} border-current`
                              : 'bg-surface text-ink-2 border-border hover:border-ink-3'
                          }`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
                <button onClick={onClose} className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!issue || !tenantId}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none ${
                    issue && tenantId
                      ? 'bg-accent text-white hover:bg-accent-ink'
                      : 'bg-border-soft text-ink-3 cursor-not-allowed'
                  }`}
                >
                  <Plus size={13} />
                  บันทึก
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Modal: บันทึกการแก้ไข ── */
function RepairLogModal({ request, onClose }: { request: MaintenanceRequest; onClose: () => void }) {
  const [repairMethod, setRepairMethod] = useState('');
  const [repairCost, setRepairCost] = useState('');
  const [repairer, setRepairer] = useState('');
  const [repairNote, setRepairNote] = useState('');
  const [repairDate, setRepairDate] = useState(new Date().toISOString().slice(0, 10));
  const [showSuccess, setShowSuccess] = useState(false);

  const tenant = tenants.find((t) => t.id === request.tenantId);
  const unit = units.find((u) => u.id === request.unitId);
  const pCfg = priorityConfig[request.priority];

  const handleSave = () => {
    if (!repairMethod) return;
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); onClose(); }, 1800);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-success-soft flex items-center justify-center">
                <Wrench size={18} className="text-success" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-ink m-0">บันทึกการแก้ไข</h2>
                <p className="text-[12px] text-ink-3 m-0">บันทึกวิธีแก้ไขและค่าใช้จ่าย</p>
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
              <p className="text-[15px] font-bold text-ink">บันทึกการแก้ไขเรียบร้อย</p>
              <p className="text-[13px] text-ink-3 mt-1">สถานะถูกเปลี่ยนเป็น "เสร็จแล้ว"</p>
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
                  {request.description && (
                    <p className="text-[12px] text-ink-3 mt-2 mb-0">{request.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-[11.5px] text-ink-3 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      แจ้งเมื่อ {request.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 pb-5 space-y-4">
                {/* Repair method */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
                    วิธีแก้ไข / สิ่งที่ดำเนินการ <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={repairMethod}
                    onChange={(e) => setRepairMethod(e.target.value)}
                    placeholder="เช่น เปลี่ยนท่อ PVC ขนาด 2 นิ้ว, ซ่อมรอยรั่วด้วยกาวซิลิโคน..."
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y transition-colors"
                  />
                </div>

                {/* Repairer */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">ช่าง / ผู้ดำเนินการ</label>
                  <input
                    type="text"
                    value={repairer}
                    onChange={(e) => setRepairer(e.target.value)}
                    placeholder="เช่น ช่างสมบัติ, ร้าน ABC ประปา, ช่างแอร์จากภายนอก..."
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Cost */}
                  <div>
                    <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">ค่าใช้จ่าย (บาท)</label>
                    <div className="flex items-center gap-2 bg-bg border border-border rounded-sm px-3 py-2.5 focus-within:border-accent transition-colors">
                      <DollarSign size={14} className="text-ink-3 shrink-0" />
                      <input
                        type="number"
                        value={repairCost}
                        onChange={(e) => setRepairCost(e.target.value)}
                        placeholder="0"
                        className="bg-transparent border-none outline-none w-full text-[13px] text-ink font-[inherit] placeholder:text-ink-3"
                      />
                    </div>
                  </div>

                  {/* Repair date */}
                  <div>
                    <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">วันที่แก้ไข</label>
                    <input
                      type="date"
                      value={repairDate}
                      onChange={(e) => setRepairDate(e.target.value)}
                      className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">หมายเหตุ</label>
                  <input
                    type="text"
                    value={repairNote}
                    onChange={(e) => setRepairNote(e.target.value)}
                    placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
                <button onClick={onClose} className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={!repairMethod}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none ${
                    repairMethod
                      ? 'bg-success text-white hover:bg-success/90'
                      : 'bg-border-soft text-ink-3 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle size={13} />
                  บันทึกเสร็จสิ้น
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Modal: ดูรายละเอียด ── */
function DetailModal({ request, onClose, onRepairLog }: { request: MaintenanceRequest; onClose: () => void; onRepairLog: () => void }) {
  const tenant = tenants.find((t) => t.id === request.tenantId);
  const unit = units.find((u) => u.id === request.unitId);
  const sCfg = statusConfig[request.status];
  const pCfg = priorityConfig[request.priority];

  const getDaysOpen = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                <FileText size={18} className="text-accent-ink" />
              </div>
              <h2 className="text-[15px] font-bold text-ink m-0">รายละเอียดการแจ้งซ่อม</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Status + Priority badges */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${sCfg.bg} ${sCfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                {sCfg.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${pCfg.bg} ${pCfg.text}`}>
                {pCfg.icon}
                {pCfg.label}
              </span>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-ink-3 mb-0.5">หัวข้อปัญหา</div>
                <div className="text-[14px] font-bold text-ink">{request.issue}</div>
              </div>
              {request.description && (
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">รายละเอียด</div>
                  <div className="text-[13px] text-ink">{request.description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">ร้านค้า</div>
                  <div className="text-[13px] text-ink font-medium">{tenant?.shopName || '—'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">ยูนิต</div>
                  <div className="text-[13px] text-ink font-medium">{unit?.code || '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">วันที่แจ้ง</div>
                  <div className="text-[13px] text-ink">{request.createdAt}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">ระยะเวลา</div>
                  {request.status === 'done' ? (
                    <div className="text-[13px] text-success font-medium">แก้ไขแล้ว {request.resolvedAt}</div>
                  ) : (
                    <div className={`text-[13px] font-medium ${getDaysOpen(request.createdAt) > 3 ? 'text-danger' : 'text-ink'}`}>
                      เปิดมาแล้ว {getDaysOpen(request.createdAt)} วัน
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
            <button onClick={onClose} className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
              ปิด
            </button>
            {request.status !== 'done' && (
              <button
                onClick={onRepairLog}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none bg-success text-white hover:bg-success/90"
              >
                <Wrench size={13} />
                บันทึกการแก้ไข
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MaintenancePage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [showNewRepair, setShowNewRepair] = useState(false);
  const [repairLogRequest, setRepairLogRequest] = useState<MaintenanceRequest | null>(null);
  const [detailRequest, setDetailRequest] = useState<MaintenanceRequest | null>(null);

  const getTenant = (id: string) => tenants.find((t) => t.id === id);
  const getUnit = (id: string) => units.find((u) => u.id === id);

  const counts = {
    all: maintenanceRequests.length,
    pending: maintenanceRequests.filter((m) => m.status === 'pending').length,
    in_progress: maintenanceRequests.filter((m) => m.status === 'in_progress').length,
    done: maintenanceRequests.filter((m) => m.status === 'done').length,
  };

  const highPriority = maintenanceRequests.filter((m) => m.priority === 'high' && m.status !== 'done').length;

  // calculate total repair cost (mock: only done items have cost)
  const totalCostThisMonth = maintenanceRequests
    .filter((m) => m.status === 'done')
    .length * 850; // mock average cost

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
      <Topbar title="แจ้ง / บันทึกซ่อมบำรุง" subtitle="บันทึกปัญหาและติดตามการซ่อมแซม" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">รายการทั้งหมด</div>
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
            <div className="text-[12px] text-ink-3 mb-1">ซ่อมเสร็จแล้ว</div>
            <div className="text-[22px] font-extrabold text-success">{counts.done}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ค่าซ่อมเดือนนี้</div>
            <div className="text-[22px] font-extrabold text-ink flex items-center gap-1">
              <DollarSign size={18} className="text-ink-3" />
              {totalCostThisMonth.toLocaleString()}
            </div>
          </div>
        </div>

        {/* ── Urgent banner ── */}
        {highPriority > 0 && (
          <div className="bg-danger-soft border border-danger/20 rounded-card px-4 py-3 mb-5 flex items-center gap-3">
            <AlertTriangle size={18} className="text-danger shrink-0" />
            <div className="text-[13px] text-danger font-semibold">
              มีรายการเร่งด่วนค้างอยู่ {highPriority} รายการ — กรุณาดำเนินการแก้ไข
            </div>
          </div>
        )}

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
          <div className="ml-auto">
            <button
              onClick={() => setShowNewRepair(true)}
              className="flex items-center gap-1.5 px-4 py-[7px] bg-accent text-white rounded-sm text-[13px] font-semibold border-none cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
            >
              <Plus size={14} />
              แจ้งซ่อมใหม่
            </button>
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
                    <th className="text-center px-4 py-3 font-semibold text-ink-2">จัดการ</th>
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
                          <button
                            onClick={() => setDetailRequest(m)}
                            className="font-semibold text-ink hover:text-accent cursor-pointer bg-transparent border-none p-0 font-[inherit] text-[13px] text-left transition-colors"
                          >
                            {m.issue}
                          </button>
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
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setDetailRequest(m)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-surface text-ink-2 text-[12px] font-medium rounded-sm border border-border cursor-pointer font-[inherit] hover:bg-bg transition-colors"
                            >
                              <FileText size={12} />
                              ดู
                            </button>
                            {m.status !== 'done' && (
                              <button
                                onClick={() => setRepairLogRequest(m)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-success text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-success/90 transition-colors"
                              >
                                <Wrench size={12} />
                                บันทึกแก้ไข
                              </button>
                            )}
                          </div>
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

      {/* ── Modals ── */}
      {showNewRepair && (
        <NewRepairModal onClose={() => setShowNewRepair(false)} />
      )}
      {repairLogRequest && (
        <RepairLogModal request={repairLogRequest} onClose={() => setRepairLogRequest(null)} />
      )}
      {detailRequest && (
        <DetailModal
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          onRepairLog={() => {
            const req = detailRequest;
            setDetailRequest(null);
            setRepairLogRequest(req);
          }}
        />
      )}
    </>
  );
}
