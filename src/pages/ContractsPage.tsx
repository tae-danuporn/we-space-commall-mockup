import { useState, useMemo } from 'react';
import { Search, X, Calendar, RefreshCw } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { contracts, tenants, units } from '../data/mockData';
import type { ContractStatus } from '../types';

const statusConfig: Record<ContractStatus, { label: string; bg: string; text: string; dot: string }> = {
  active:   { label: 'ใช้งานอยู่',      bg: 'bg-success-soft',  text: 'text-success',    dot: 'bg-success' },
  expiring: { label: 'ใกล้หมดอายุ',    bg: 'bg-warning-soft',  text: 'text-accent-ink', dot: 'bg-warning' },
  expired:  { label: 'หมดอายุแล้ว',    bg: 'bg-danger-soft',   text: 'text-danger',     dot: 'bg-danger' },
};

type FilterStatus = 'all' | ContractStatus;

export default function ContractsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewContract, setRenewContract] = useState<string | null>(null);

  const getTenant = (id: string) => tenants.find((t) => t.id === id);
  const getUnit = (id: string) => units.find((u) => u.id === id);

  const counts = {
    all: contracts.length,
    active: contracts.filter((c) => c.status === 'active').length,
    expiring: contracts.filter((c) => c.status === 'expiring').length,
    expired: contracts.filter((c) => c.status === 'expired').length,
  };

  const totalRent = contracts.reduce((sum, c) => sum + c.monthlyRent, 0);

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const tenant = getTenant(c.tenantId);
        const unit = getUnit(c.unitId);
        return (
          c.id.toLowerCase().includes(q) ||
          tenant?.shopName.toLowerCase().includes(q) ||
          unit?.code.toLowerCase().includes(q) ||
          false
        );
      }
      return true;
    });
  }, [filterStatus, search]);

  return (
    <>
      <Topbar title="สัญญา" subtitle="จัดการสัญญาเช่า" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">สัญญาทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{counts.all}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ใช้งานอยู่</div>
            <div className="text-[22px] font-extrabold text-success">{counts.active}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ใกล้หมดอายุ</div>
            <div className="text-[22px] font-extrabold text-accent-ink">{counts.expiring}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">หมดอายุแล้ว</div>
            <div className="text-[22px] font-extrabold text-danger">{counts.expired}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ค่าเช่ารวม/เดือน</div>
            <div className="text-[20px] font-extrabold text-accent-ink">฿{totalRent.toLocaleString()}</div>
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
              placeholder="ค้นหาสัญญา ร้านค้า ยูนิต..."
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
              { key: 'active' as FilterStatus, label: 'ใช้งานอยู่', count: counts.active },
              { key: 'expiring' as FilterStatus, label: 'ใกล้หมดอายุ', count: counts.expiring },
              { key: 'expired' as FilterStatus, label: 'หมดอายุแล้ว', count: counts.expired },
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
            <p className="text-ink-3 text-[14px]">ไม่พบสัญญาที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">เลขสัญญา</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ยูนิต</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ระยะเวลา</th>
                    <th className="text-right px-4 py-3 font-semibold text-ink-2">ค่าเช่า/เดือน</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">เงินมัดจำ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                    <th className="text-center px-4 py-3 font-semibold text-ink-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const tenant = getTenant(c.tenantId);
                    const unit = getUnit(c.unitId);
                    const cfg = statusConfig[c.status];
                    return (
                      <tr key={c.id} className="border-b border-border-soft hover:bg-bg transition-colors">
                        <td className="px-4 py-3 font-medium text-ink">{c.id.toUpperCase()}</td>
                        <td className="px-4 py-3 font-semibold text-ink">{tenant?.shopName || '—'}</td>
                        <td className="px-4 py-3 text-ink-2">{unit?.code || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-ink-2">
                            <Calendar size={12} className="text-ink-3 shrink-0" />
                            <span>{c.startDate}</span>
                            <span className="text-ink-3">—</span>
                            <span>{c.endDate}</span>
                          </div>
                          {/* Timeline bar */}
                          <ContractTimeline startDate={c.startDate} endDate={c.endDate} status={c.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-ink">฿{c.monthlyRent.toLocaleString()}</td>
                        <td className="px-4 py-3 text-ink-2">{c.depositMonths} เดือน</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {(c.status === 'expiring' || c.status === 'expired') && (
                            <button
                              onClick={() => { setRenewContract(c.id); setShowRenewModal(true); }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
                            >
                              <RefreshCw size={12} />
                              ต่อสัญญา
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

      {/* ── Renew Modal ── */}
      {showRenewModal && renewContract && (
        <RenewModal contractId={renewContract} onClose={() => { setShowRenewModal(false); setRenewContract(null); }} />
      )}
    </>
  );
}

/* ── Contract Timeline Bar ── */
function ContractTimeline({ startDate, endDate, status }: { startDate: string; endDate: string; status: ContractStatus }) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = Math.min(Math.max(now - start, 0), total);
  const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0;

  const barColor = status === 'active' ? 'bg-success' : status === 'expiring' ? 'bg-warning' : 'bg-danger';

  return (
    <div className="mt-1.5">
      <div className="h-1 rounded-full bg-border-soft overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[10px] text-ink-3 mt-0.5 text-right">{pct}% ผ่านไป</div>
    </div>
  );
}

/* ── Renew Modal ── */
function RenewModal({ contractId, onClose }: { contractId: string; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const contract = contracts.find((c) => c.id === contractId);
  const tenant = contract ? tenants.find((t) => t.id === contract.tenantId) : null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                <RefreshCw size={18} className="text-accent-ink" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-ink m-0">ต่อสัญญาเช่า</h2>
                <p className="text-[12px] text-ink-3 m-0">{tenant?.shopName} — {contractId.toUpperCase()}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            <div className="px-6 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-ink">ส่งคำขอต่อสัญญาเรียบร้อย</p>
              <p className="text-[13px] text-ink-3 mt-1">ระบบจะแจ้งผู้เช่าเพื่อนัดเซ็นสัญญาใหม่</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">ระยะเวลาต่อสัญญา</label>
                  <select className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent">
                    <option>6 เดือน</option>
                    <option selected>12 เดือน</option>
                    <option>24 เดือน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">ค่าเช่าใหม่ (บาท/เดือน)</label>
                  <input
                    type="number"
                    defaultValue={contract?.monthlyRent}
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">หมายเหตุ</label>
                  <textarea
                    rows={2}
                    placeholder="หมายเหตุเพิ่มเติม..."
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
                <button onClick={onClose} className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                  ยกเลิก
                </button>
                <button onClick={handleSubmit} className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white border-none rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                  <RefreshCw size={14} />
                  ยืนยันต่อสัญญา
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
