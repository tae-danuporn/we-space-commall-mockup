import Topbar from '../components/layout/Topbar';
import { contracts, tenants, units } from '../data/mockData';
import type { ContractStatus } from '../types';

const statusConfig: Record<ContractStatus, { label: string; bg: string; text: string }> = {
  active:   { label: 'ใช้งานอยู่',      bg: 'bg-success-soft',  text: 'text-success' },
  expiring: { label: 'ใกล้หมดอายุ',    bg: 'bg-warning-soft',  text: 'text-accent-ink' },
  expired:  { label: 'หมดอายุแล้ว',    bg: 'bg-danger-soft',   text: 'text-danger' },
};

export default function ContractsPage() {
  const getTenant = (id: string) => tenants.find((t) => t.id === id);
  const getUnit = (id: string) => units.find((u) => u.id === id);

  const counts = {
    active: contracts.filter((c) => c.status === 'active').length,
    expiring: contracts.filter((c) => c.status === 'expiring').length,
    expired: contracts.filter((c) => c.status === 'expired').length,
  };

  return (
    <>
      <Topbar title="สัญญา" subtitle="จัดการสัญญาเช่า" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">สัญญาทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{contracts.length}</div>
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
        </div>

        {/* ── Table ── */}
        <div className="bg-surface border border-border rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">เลขสัญญา</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">ยูนิต</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">เริ่มต้น</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">สิ้นสุด</th>
                  <th className="text-right px-4 py-3 font-semibold text-ink-2">ค่าเช่า/เดือน</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                  <th className="text-center px-4 py-3 font-semibold text-ink-2"></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => {
                  const tenant = getTenant(c.tenantId);
                  const unit = getUnit(c.unitId);
                  const cfg = statusConfig[c.status];
                  return (
                    <tr key={c.id} className="border-b border-border-soft hover:bg-bg transition-colors">
                      <td className="px-4 py-3 font-medium text-ink">{c.id.toUpperCase()}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{tenant?.shopName || '—'}</td>
                      <td className="px-4 py-3 text-ink-2">{unit?.code || '—'}</td>
                      <td className="px-4 py-3 text-ink-2">{c.startDate}</td>
                      <td className="px-4 py-3 text-ink-2">{c.endDate}</td>
                      <td className="px-4 py-3 text-right font-medium text-ink">฿{c.monthlyRent.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(c.status === 'expiring' || c.status === 'expired') && (
                          <button className="px-3 py-1.5 bg-accent text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
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
      </main>
    </>
  );
}
