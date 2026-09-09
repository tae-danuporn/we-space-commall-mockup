import { useState, useMemo } from 'react';
import { LayoutGrid, List, Search, X, Maximize2, Map, Phone, Mail, FileText, DollarSign } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { units, tenants, contracts } from '../data/mockData';
import type { Unit, UnitStatus } from '../types';

/* ── Status config ── */
const statusConfig: Record<UnitStatus, { label: string; dot: string; bg: string; text: string; mapBg: string; mapBorder: string }> = {
  rented:      { label: 'เช่าแล้ว',     dot: 'bg-success',        bg: 'bg-success-soft',        text: 'text-success',    mapBg: 'bg-success/15',    mapBorder: 'border-success/40' },
  negotiating: { label: 'กำลังเจรจา',   dot: 'bg-warning',        bg: 'bg-warning-soft',        text: 'text-accent-ink', mapBg: 'bg-warning/15',    mapBorder: 'border-warning/40' },
  vacant:      { label: 'ว่าง',         dot: 'bg-neutral-status', bg: 'bg-neutral-status-soft', text: 'text-ink-2',      mapBg: 'bg-neutral-status/10', mapBorder: 'border-neutral-status/30' },
};

type ViewMode = 'map' | 'grid' | 'table';
type FilterStatus = 'all' | UnitStatus;

export default function UnitsPage() {
  const [view, setView] = useState<ViewMode>('map');
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

  const occupancyRate = Math.round((counts.rented / counts.all) * 100);
  const totalRent = units.filter(u => u.status === 'rented').reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

  const getTenant = (tenantId?: string) => tenantId ? tenants.find((t) => t.id === tenantId) : null;

  /* ── Group by zone for map view ── */
  const zoneGroups = useMemo(() => {
    const zones = ['A', 'B', 'C'];
    return zones.map((zone) => {
      const zoneUnits = filtered.filter((u) => u.zone === zone);
      const allZoneUnits = units.filter((u) => u.zone === zone);
      const zoneRented = allZoneUnits.filter((u) => u.status === 'rented').length;
      return {
        zone,
        label: zone === 'A' ? 'โซน A — ชั้น 1 (ฝั่งหน้า)' : zone === 'B' ? 'โซน B — ชั้น 2' : 'โซน C — ชั้น 1 (ฝั่งหลัง)',
        units: zoneUnits,
        total: allZoneUnits.length,
        rented: zoneRented,
        occupancy: Math.round((zoneRented / allZoneUnits.length) * 100),
      };
    });
  }, [filtered]);

  return (
    <>
      <Topbar title="พื้นที่เช่า" subtitle="จัดการยูนิตเช่าทั้งหมด" />

      <main className="p-[26px_30px_50px]">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ยูนิตทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{counts.all}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">เช่าแล้ว</div>
            <div className="text-[22px] font-extrabold text-success">{counts.rented}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">กำลังเจรจา</div>
            <div className="text-[22px] font-extrabold text-accent-ink">{counts.negotiating}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ว่าง</div>
            <div className="text-[22px] font-extrabold text-ink-2">{counts.vacant}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">อัตราการเช่า</div>
            <div className="text-[22px] font-extrabold text-accent-ink">{occupancyRate}%</div>
            <div className="h-1.5 rounded-full bg-border-soft mt-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${occupancyRate}%` }} />
            </div>
          </div>
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

          {/* Revenue summary */}
          <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-ink-3 mr-2">
            <DollarSign size={13} />
            รายรับค่าเช่า: <span className="font-bold text-ink">฿{totalRent.toLocaleString()}</span>/เดือน
          </div>

          {/* View toggle */}
          <div className="flex border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setView('map')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'map' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
              title="แผนผัง"
            >
              <Map size={16} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'grid' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
              title="กริด"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'table' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
              title="ตาราง"
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
        ) : view === 'map' ? (
          /* ══════════ Floor Map View ══════════ */
          <div className="space-y-5">
            {/* Legend */}
            <div className="flex items-center gap-5 text-[12px] text-ink-2">
              <span className="font-semibold text-ink">สัญลักษณ์:</span>
              {(['rented', 'negotiating', 'vacant'] as UnitStatus[]).map((s) => {
                const cfg = statusConfig[s];
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-[3px] border ${cfg.mapBg} ${cfg.mapBorder}`} />
                    <span>{cfg.label}</span>
                  </div>
                );
              })}
            </div>

            {zoneGroups.map((zg) => (
              <div key={zg.zone} className="bg-surface border border-border rounded-card overflow-hidden">
                {/* Zone header */}
                <div className="px-5 py-3.5 border-b border-border bg-bg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-sm bg-accent text-white text-[14px] font-bold flex items-center justify-center">
                      {zg.zone}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-bold text-ink">{zg.label}</div>
                      <div className="text-[11.5px] text-ink-3">{zg.total} ยูนิต</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <div className="text-[12px] text-ink-3">อัตราการเช่า</div>
                      <div className="text-[14px] font-bold text-success">{zg.occupancy}%</div>
                    </div>
                    <div className="w-[100px] h-2 rounded-full bg-border-soft overflow-hidden">
                      <div className="h-full rounded-full bg-success transition-all" style={{ width: `${zg.occupancy}%` }} />
                    </div>
                  </div>
                </div>

                {/* Unit blocks */}
                <div className="p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
                    {zg.units.map((unit) => {
                      const tenant = getTenant(unit.tenantId);
                      const cfg = statusConfig[unit.status];
                      const isSelected = selectedUnit?.id === unit.id;
                      return (
                        <button
                          key={unit.id}
                          onClick={() => setSelectedUnit(unit)}
                          className={`relative group rounded-[6px] border-[1.5px] p-2.5 text-left cursor-pointer font-[inherit] transition-all hover:scale-[1.04] hover:shadow-md ${cfg.mapBg} ${cfg.mapBorder} ${
                            isSelected ? 'ring-2 ring-accent ring-offset-1 scale-[1.04] shadow-md' : ''
                          }`}
                          title={tenant ? `${unit.code} — ${tenant.shopName}` : `${unit.code} — ${cfg.label}`}
                        >
                          <div className="text-[13px] font-bold text-ink leading-tight">{unit.code}</div>
                          <div className="text-[10.5px] text-ink-3 mt-0.5">{unit.sizeSqm} ตร.ม.</div>
                          {tenant ? (
                            <div className="text-[10px] font-medium text-ink-2 mt-1 truncate">{tenant.shopName}</div>
                          ) : (
                            <div className={`text-[10px] font-semibold mt-1 ${cfg.text}`}>{cfg.label}</div>
                          )}
                          {/* Status dot */}
                          <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${cfg.dot}`} />
                        </button>
                      );
                    })}
                  </div>
                  {zg.units.length === 0 && (
                    <div className="text-center text-[12px] text-ink-3 py-8">ไม่มียูนิตตรงกับตัวกรอง</div>
                  )}
                </div>
              </div>
            ))}

            {/* Summary bar */}
            <div className="bg-surface border border-border rounded-card px-5 py-3 flex items-center justify-between text-[12.5px]">
              <span className="text-ink-2">แสดง <b className="text-ink">{filtered.length}</b> จาก {units.length} ยูนิต</span>
              <span className="text-ink-2">
                พื้นที่รวม <b className="text-ink">{filtered.reduce((s, u) => s + u.sizeSqm, 0).toLocaleString()}</b> ตร.ม.
                &nbsp;|&nbsp;
                ค่าเช่ารวม <b className="text-accent-ink">฿{filtered.reduce((s, u) => s + (u.monthlyRent || 0), 0).toLocaleString()}</b>/เดือน
              </span>
            </div>
          </div>
        ) : view === 'grid' ? (
          /* ══════════ Grid View ══════════ */
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
          /* ══════════ Table View ══════════ */
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
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ประเภท</th>
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
                        <td className="px-4 py-3 text-ink-2">
                          {tenant ? (
                            <span className="text-[12px] px-2 py-0.5 rounded-[20px] bg-accent-soft text-accent-ink font-medium">
                              {tenant.shopCategory}
                            </span>
                          ) : '—'}
                        </td>
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

/* ── Unit Detail Side Panel ── */
function UnitDetailPanel({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const tenant = unit.tenantId ? tenants.find((t) => t.id === unit.tenantId) : null;
  const contract = contracts.find((c) => c.unitId === unit.id);
  const cfg = statusConfig[unit.status];
  const totalCost = (unit.monthlyRent || 0) + (unit.commonFee || 0);

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
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
              <span className="text-[11.5px] text-ink-3">โซน {unit.zone} | ชั้น {unit.floor}</span>
            </div>
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
            <InfoRow label="รหัสยูนิต" value={unit.code} />
            <InfoRow label="โซน" value={`โซน ${unit.zone}`} />
            <InfoRow label="ชั้น" value={`ชั้น ${unit.floor}`} />
            <InfoRow label="ขนาดพื้นที่" value={`${unit.sizeSqm} ตร.ม.`} />
            <InfoRow label="ค่าเช่า/เดือน" value={unit.monthlyRent ? `฿${unit.monthlyRent.toLocaleString()}` : '—'} />
            <InfoRow label="ค่าส่วนกลาง/เดือน" value={unit.commonFee ? `฿${unit.commonFee.toLocaleString()}` : '—'} />
            <div className="flex justify-between items-baseline pt-2 border-t border-border-soft">
              <span className="text-[13px] font-semibold text-ink">รวมค่าใช้จ่าย/เดือน</span>
              <span className="text-[14px] font-bold text-accent-ink">฿{totalCost.toLocaleString()}</span>
            </div>
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
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-ink-3">โทรศัพท์</span>
                <span className="text-[13px] font-medium text-ink flex items-center gap-1.5">
                  <Phone size={12} className="text-ink-3" />
                  {tenant.phone}
                </span>
              </div>
              {tenant.email && (
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink-3">อีเมล</span>
                  <span className="text-[13px] font-medium text-accent flex items-center gap-1.5">
                    <Mail size={12} />
                    {tenant.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contract info */}
        {contract && (
          <div className="px-6 py-5 border-t border-border">
            <h3 className="text-[12px] font-semibold text-ink-2 uppercase tracking-wide mb-3">ข้อมูลสัญญา</h3>
            <div className="space-y-3">
              <InfoRow label="เลขที่สัญญา" value={contract.id.toUpperCase()} />
              <InfoRow label="เริ่มต้น" value={contract.startDate} />
              <InfoRow label="สิ้นสุด" value={contract.endDate} />
              <InfoRow label="เงินประกัน" value={`${contract.depositMonths} เดือน`} />
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-ink-3">สถานะ</span>
                <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-[20px] ${
                  contract.status === 'active' ? 'bg-success-soft text-success' :
                  contract.status === 'expiring' ? 'bg-warning-soft text-accent-ink' :
                  'bg-danger-soft text-danger'
                }`}>
                  {contract.status === 'active' ? 'ใช้งานอยู่' : contract.status === 'expiring' ? 'ใกล้หมดอายุ' : 'หมดอายุ'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-5 border-t border-border space-y-2.5">
          {unit.status === 'vacant' && (
            <>
              <button className="w-full flex items-center justify-center gap-1.5 bg-accent text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                <FileText size={14} />
                เพิ่มผู้สนใจเช่า
              </button>
              <button className="w-full bg-surface text-ink border border-border px-4 py-2.5 rounded-sm text-[13px] font-medium cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                แก้ไขข้อมูลยูนิต
              </button>
            </>
          )}
          {unit.status === 'negotiating' && (
            <>
              <button className="w-full flex items-center justify-center gap-1.5 bg-warning text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                <FileText size={14} />
                ดูข้อมูลการเจรจา
              </button>
              <button className="w-full bg-surface text-ink border border-border px-4 py-2.5 rounded-sm text-[13px] font-medium cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                แก้ไขข้อมูลยูนิต
              </button>
            </>
          )}
          {unit.status === 'rented' && (
            <>
              <button className="w-full flex items-center justify-center gap-1.5 bg-success text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-success/90 transition-colors">
                <FileText size={14} />
                ดูสัญญาเช่า
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 bg-surface text-ink border border-border px-4 py-2.5 rounded-sm text-[13px] font-medium cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                <Phone size={14} />
                ติดต่อผู้เช่า
              </button>
            </>
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
