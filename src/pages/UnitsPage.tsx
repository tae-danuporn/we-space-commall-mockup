import { useState, useMemo } from 'react';
import { LayoutGrid, List, Search, X, Maximize2 } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { units, tenants } from '../data/mockData';
import type { Unit, UnitStatus } from '../types';

/* ── Status config ── */
const statusConfig: Record<UnitStatus, { label: string; dot: string; bg: string; text: string }> = {
  rented:      { label: 'เช่าแล้ว',     dot: 'bg-success',        bg: 'bg-success-soft',        text: 'text-success' },
  negotiating: { label: 'กำลังเจรจา',   dot: 'bg-warning',        bg: 'bg-warning-soft',        text: 'text-accent-ink' },
  vacant:      { label: 'ว่าง',         dot: 'bg-neutral-status', bg: 'bg-neutral-status-soft', text: 'text-ink-2' },
};

type ViewMode = 'grid' | 'table';
type FilterStatus = 'all' | UnitStatus;

export default function UnitsPage() {
  const [view, setView] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  /* ── Filtered units ── */
  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (filterStatus !== 'all' && u.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const tenant = u.tenantId ? tenants.find((t) => t.id === u.tenantId) : null;
        return (
          u.code.toLowerCase().includes(q) ||
          tenant?.shopName.toLowerCase().includes(q) ||
          false
        );
      }
      return true;
    });
  }, [filterStatus, search]);

  /* ── Counts ── */
  const counts = useMemo(() => ({
    all: units.length,
    rented: units.filter((u) => u.status === 'rented').length,
    negotiating: units.filter((u) => u.status === 'negotiating').length,
    vacant: units.filter((u) => u.status === 'vacant').length,
  }), []);

  const getTenant = (tenantId?: string) => tenantId ? tenants.find((t) => t.id === tenantId) : null;

  return (
    <>
      <Topbar title="พื้นที่เช่า" subtitle="จัดการยูนิตเช่าทั้งหมด" />

      <main className="p-[26px_30px_50px]">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <SummaryCard label="ยูนิตทั้งหมด" value={counts.all} />
          <SummaryCard label="เช่าแล้ว" value={counts.rented} color="text-success" />
          <SummaryCard label="กำลังเจรจา" value={counts.negotiating} color="text-accent-ink" />
          <SummaryCard label="ว่าง" value={counts.vacant} color="text-ink-2" />
        </div>

        {/* ── Toolbar: Search + Filter + View toggle ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="flex items-center gap-2 bg-surface border border-border rounded-sm px-3 py-2 w-full max-w-[280px] text-[13px]">
            <Search size={15} className="text-ink-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหายูนิตหรือร้านค้า..."
              className="bg-transparent border-none outline-none w-full text-ink placeholder:text-ink-3 font-[inherit] text-[13px]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-ink-3 hover:text-ink cursor-pointer bg-transparent border-none p-0">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5">
            {([
              { key: 'all' as FilterStatus, label: 'ทั้งหมด', count: counts.all },
              { key: 'rented' as FilterStatus, label: 'เช่าแล้ว', count: counts.rented },
              { key: 'negotiating' as FilterStatus, label: 'กำลังเจรจา', count: counts.negotiating },
              { key: 'vacant' as FilterStatus, label: 'ว่าง', count: counts.vacant },
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'grid' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'table' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center">
            <p className="text-ink-3 text-[14px]">ไม่พบยูนิตที่ตรงกับเงื่อนไข</p>
          </div>
        ) : view === 'grid' ? (
          /* ── Grid View ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((unit) => {
              const tenant = getTenant(unit.tenantId);
              const cfg = statusConfig[unit.status];
              return (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className={`bg-surface border rounded-card p-4 text-left cursor-pointer transition-all hover:shadow-sm font-[inherit] ${
                    selectedUnit?.id === unit.id ? 'border-accent ring-1 ring-accent/30' : 'border-border hover:border-ink-3'
                  }`}
                >
                  {/* Status dot + code */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[15px] font-bold text-ink">{unit.code}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  </div>
                  {/* Size */}
                  <div className="text-[12px] text-ink-3 mb-1">
                    <Maximize2 size={11} className="inline mr-1 -mt-px" />
                    {unit.sizeSqm} ตร.ม.
                  </div>
                  {/* Tenant or status */}
                  {tenant ? (
                    <div className="text-[12.5px] font-medium text-ink truncate">{tenant.shopName}</div>
                  ) : (
                    <div className={`text-[12px] font-semibold ${cfg.text}`}>{cfg.label}</div>
                  )}
                  {/* Rent */}
                  {unit.monthlyRent && (
                    <div className="text-[12px] text-ink-2 mt-1">฿{unit.monthlyRent.toLocaleString()}/เดือน</div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* ── Table View ── */
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ยูนิต</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">โซน</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ขนาด</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                    <th className="text-right px-4 py-3 font-semibold text-ink-2">ค่าเช่า/เดือน</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((unit) => {
                    const tenant = getTenant(unit.tenantId);
                    const cfg = statusConfig[unit.status];
                    return (
                      <tr
                        key={unit.id}
                        onClick={() => setSelectedUnit(unit)}
                        className={`border-b border-border-soft cursor-pointer transition-colors ${
                          selectedUnit?.id === unit.id ? 'bg-accent-soft/40' : 'hover:bg-bg'
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-ink">{unit.code}</td>
                        <td className="px-4 py-3 text-ink-2">โซน {unit.zone}</td>
                        <td className="px-4 py-3 text-ink-2">{unit.sizeSqm} ตร.ม.</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink">{tenant?.shopName || '—'}</td>
                        <td className="px-4 py-3 text-right text-ink font-medium">
                          {unit.monthlyRent ? `฿${unit.monthlyRent.toLocaleString()}` : '—'}
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

      {/* ── Side Panel (Unit Detail) ── */}
      {selectedUnit && (
        <UnitDetailPanel
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}
    </>
  );
}

/* ── Summary Card ── */
function SummaryCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-surface border border-border rounded-card px-4 py-3">
      <div className="text-[12px] text-ink-3 mb-1">{label}</div>
      <div className={`text-[22px] font-extrabold ${color || 'text-ink'}`}>{value}</div>
    </div>
  );
}

/* ── Unit Detail Side Panel ── */
function UnitDetailPanel({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const tenant = unit.tenantId ? tenants.find((t) => t.id === unit.tenantId) : null;
  const cfg = statusConfig[unit.status];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-surface border-l border-border z-50 overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-[18px] font-bold text-ink m-0">ยูนิต {unit.code}</h2>
            <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info rows */}
        <div className="px-6 py-5">
          <h3 className="text-[12px] font-semibold text-ink-2 uppercase tracking-wide mb-3">ข้อมูลยูนิต</h3>
          <div className="space-y-3">
            <InfoRow label="โซน" value={`โซน ${unit.zone}`} />
            <InfoRow label="ชั้น" value={`ชั้น ${unit.floor}`} />
            <InfoRow label="ขนาดพื้นที่" value={`${unit.sizeSqm} ตร.ม.`} />
            <InfoRow label="ค่าเช่า/เดือน" value={unit.monthlyRent ? `฿${unit.monthlyRent.toLocaleString()}` : '—'} />
            <InfoRow label="ค่าส่วนกลาง/เดือน" value={unit.commonFee ? `฿${unit.commonFee.toLocaleString()}` : '—'} />
          </div>
        </div>

        {/* Tenant info (if rented) */}
        {tenant && (
          <div className="px-6 py-5 border-t border-border">
            <h3 className="text-[12px] font-semibold text-ink-2 uppercase tracking-wide mb-3">ผู้เช่าปัจจุบัน</h3>
            <div className="space-y-3">
              <InfoRow label="ชื่อร้าน" value={tenant.shopName} />
              <InfoRow label="ประเภท" value={tenant.shopCategory} />
              <InfoRow label="ผู้ติดต่อ" value={tenant.contactName} />
              <InfoRow label="โทรศัพท์" value={tenant.phone} />
              {tenant.email && <InfoRow label="อีเมล" value={tenant.email} />}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-5 border-t border-border">
          {unit.status === 'vacant' && (
            <button className="w-full bg-accent text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
              เพิ่มผู้สนใจเช่า
            </button>
          )}
          {unit.status === 'negotiating' && (
            <button className="w-full bg-warning text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
              ดูข้อมูลการเจรจา
            </button>
          )}
          {unit.status === 'rented' && (
            <button className="w-full bg-success text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-success/90 transition-colors">
              ดูสัญญาเช่า
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Info Row ── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[13px] text-ink-3">{label}</span>
      <span className="text-[13px] font-medium text-ink">{value}</span>
    </div>
  );
}
