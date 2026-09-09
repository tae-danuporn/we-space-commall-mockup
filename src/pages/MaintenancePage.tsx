import Topbar from '../components/layout/Topbar';
import { maintenanceRequests, tenants, units } from '../data/mockData';
import type { MaintenanceStatus } from '../types';

const statusConfig: Record<MaintenanceStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending:     { label: 'รอดำเนินการ',   bg: 'bg-danger-soft',          text: 'text-danger',     dot: 'bg-danger' },
  in_progress: { label: 'กำลังดำเนินการ', bg: 'bg-warning-soft',         text: 'text-accent-ink', dot: 'bg-warning' },
  done:        { label: 'เสร็จแล้ว',     bg: 'bg-success-soft',         text: 'text-success',    dot: 'bg-success' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
  high:   { label: 'สูง',   bg: 'bg-danger-soft',          text: 'text-danger' },
  medium: { label: 'กลาง',  bg: 'bg-warning-soft',         text: 'text-accent-ink' },
  low:    { label: 'ต่ำ',   bg: 'bg-neutral-status-soft',  text: 'text-ink-2' },
};

export default function MaintenancePage() {
  const getTenant = (id: string) => tenants.find((t) => t.id === id);
  const getUnit = (id: string) => units.find((u) => u.id === id);

  const counts = {
    pending: maintenanceRequests.filter((m) => m.status === 'pending').length,
    in_progress: maintenanceRequests.filter((m) => m.status === 'in_progress').length,
    done: maintenanceRequests.filter((m) => m.status === 'done').length,
  };

  return (
    <>
      <Topbar title="แจ้งซ่อม" subtitle="ระบบแจ้งซ่อมและติดตามงาน" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{maintenanceRequests.length}</div>
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
        </div>

        {/* ── Table ── */}
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
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map((m) => {
                  const tenant = getTenant(m.tenantId);
                  const unit = getUnit(m.unitId);
                  const sCfg = statusConfig[m.status];
                  const pCfg = priorityConfig[m.priority];
                  return (
                    <tr key={m.id} className="border-b border-border-soft hover:bg-bg transition-colors">
                      <td className="px-4 py-3 font-semibold text-ink">{m.issue}</td>
                      <td className="px-4 py-3 text-ink-2">{tenant?.shopName || '—'}</td>
                      <td className="px-4 py-3 text-ink-2">{unit?.code || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${pCfg.bg} ${pCfg.text}`}>
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
