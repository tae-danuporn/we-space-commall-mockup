import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import {
  Wrench, FileText, CreditCard, ChevronUp, UserPlus,
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import {
  dashboardKPI, revenueMonths, activities, expiringContractsList,
} from '../data/mockData';
import type { ActivityType } from '../types';

/* ── Activity icon mapping ── */
const activityIconConfig: Record<ActivityType, { bg: string; color: string }> = {
  contract: { bg: 'bg-warning-soft', color: 'text-accent-ink' },
  payment:  { bg: 'bg-success-soft', color: 'text-success' },
  repair:   { bg: 'bg-danger-soft',  color: 'text-danger' },
  lead:     { bg: 'bg-neutral-status-soft', color: 'text-ink-2' },
};

const activityIcons: Record<ActivityType, React.ReactNode> = {
  contract: <FileText size={15} />,
  payment:  <CreditCard size={15} />,
  repair:   <Wrench size={15} />,
  lead:     <UserPlus size={15} />,
};

/* ── Donut data ── */
const donutData = [
  { name: 'เช่าแล้ว', value: 45, fill: 'var(--color-success)' },
  { name: 'กำลังเจรจา', value: 17.5, fill: 'var(--color-warning)' },
  { name: 'ว่าง', value: 37.5, fill: 'var(--color-neutral-status)' },
];

/* ── Revenue chart tooltip ── */
function RevenueTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { month: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-sm px-3 py-2 text-[12px] shadow-sm">
      <p className="font-bold text-ink">{payload[0].payload.month}</p>
      <p className="text-accent-ink">฿{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function DashboardPage() {
  const kpi = dashboardKPI;

  return (
    <>
      <Topbar title="ภาพรวมโครงการ" subtitle="We Space Community Mall Payap — อัปเดตล่าสุดวันนี้ 08:00 น." />

      <main className="p-[26px_30px_50px]">

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr] gap-[18px] mb-[22px]">

          {/* KPI 1: Occupancy */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="flex items-baseline justify-between mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">สถานะพื้นที่เช่า</p>
              <span className="text-[11.5px] text-ink-3">รวม {kpi.totalUnits} ยูนิต</span>
            </div>
            <div className="text-[28px] font-extrabold tracking-tight">
              {kpi.rentedUnits} <span className="text-[13px] font-semibold text-ink-2 ml-1">ยูนิตมีผู้เช่าแล้ว</span>
            </div>
            {/* Stack bar */}
            <div className="flex h-[9px] rounded-[5px] overflow-hidden mt-[14px] mb-3 bg-border-soft">
              <div className="bg-success" style={{ width: `${(kpi.rentedUnits / kpi.totalUnits) * 100}%` }} />
              <div className="bg-warning" style={{ width: `${(kpi.negotiatingUnits / kpi.totalUnits) * 100}%` }} />
              <div className="bg-neutral-status" style={{ width: `${(kpi.vacantUnits / kpi.totalUnits) * 100}%` }} />
            </div>
            {/* Legend */}
            <div className="flex gap-[18px] flex-wrap">
              <LegendItem color="bg-success" label="เช่าแล้ว" value={kpi.rentedUnits} />
              <LegendItem color="bg-warning" label="กำลังเจรจา" value={kpi.negotiatingUnits} />
              <LegendItem color="bg-neutral-status" label="ว่าง" value={kpi.vacantUnits} />
            </div>
          </div>

          {/* KPI 2: Revenue */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">รายรับค่าเช่าเดือนนี้</p>
            </div>
            <div className="text-[25px] font-extrabold tracking-tight text-accent-ink mb-1.5">
              ฿{kpi.revenueThisMonth.toLocaleString()}
            </div>
            <div className="flex items-center gap-[5px] text-[12px] text-success font-semibold">
              <ChevronUp size={13} />
              เพิ่มขึ้น {kpi.revenueTrend} จากเดือนก่อน
            </div>
          </div>

          {/* KPI 3: Overdue */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">ยอดค้างชำระ</p>
            </div>
            <div className="text-[25px] font-extrabold tracking-tight text-danger mb-1.5">
              ฿{kpi.overdueAmount.toLocaleString()}
            </div>
            <div className="text-[12px] text-ink-3">
              จาก {kpi.overdueShops} ร้านค้าที่ยังไม่ชำระ
            </div>
          </div>

          {/* KPI 4: Tasks */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">งานที่ต้องติดตาม</p>
            </div>
            <TaskRow icon={<Wrench size={16} />} label="แจ้งซ่อมค้างดำเนินการ" count={`${kpi.pendingRepairs} รายการ`} variant="repair" />
            <TaskRow icon={<FileText size={16} />} label="สัญญาใกล้หมดอายุ" count={`${kpi.expiringContracts} สัญญา`} variant="contract" />
          </div>
        </div>

        {/* ── Chart Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px] mb-[22px]">

          {/* Revenue chart */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="flex items-baseline justify-between mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">แนวโน้มรายรับ 6 เดือนล่าสุด</p>
              <span className="text-[11.5px] text-ink-3">หน่วย: บาท</span>
            </div>
            <div className="h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueMonths} barSize={34}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11.5, fill: 'var(--color-ink-3)' }}
                  />
                  <YAxis hide />
                  <Tooltip content={<RevenueTooltip />} cursor={false} />
                  <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
                    {revenueMonths.map((entry, idx) => (
                      <Cell
                        key={entry.month}
                        fill={idx === revenueMonths.length - 1 ? 'var(--color-accent)' : 'var(--color-border-soft)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut chart */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">สรุปสถานะพื้นที่เช่า</p>
            </div>
            <div className="flex items-center gap-[18px]">
              <div className="w-[104px] h-[104px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={52}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {donutData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5">
                <LegendItem color="bg-success" label="เช่าแล้ว" value="45%" />
                <LegendItem color="bg-warning" label="กำลังเจรจา" value="17.5%" />
                <LegendItem color="bg-neutral-status" label="ว่าง" value="37.5%" />
              </div>
            </div>
          </div>
        </div>

        {/* ── List Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px]">

          {/* Activity feed */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">กิจกรรมล่าสุด</p>
            </div>
            {activities.map((act, idx) => {
              const cfg = activityIconConfig[act.type];
              return (
                <div
                  key={act.id}
                  className={`flex gap-3 py-[11px] ${idx < activities.length - 1 ? 'border-b border-border-soft' : ''} ${idx === 0 ? 'pt-0' : ''} ${idx === activities.length - 1 ? 'pb-0' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center ${cfg.bg} ${cfg.color}`}>
                    {activityIcons[act.type]}
                  </div>
                  <div>
                    <div className="text-[13px] text-ink leading-[1.5]">
                      <b className="font-bold">{act.highlight}</b> {act.text}
                    </div>
                    <div className="text-[11.5px] text-ink-3 mt-px">{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expiring contracts */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">สัญญาใกล้หมดอายุ</p>
            </div>
            {expiringContractsList.map((c, idx) => (
              <div
                key={c.shopName}
                className={`flex items-center justify-between py-[10px] ${idx < expiringContractsList.length - 1 ? 'border-b border-border-soft' : ''} ${idx === 0 ? 'pt-0' : ''} ${idx === expiringContractsList.length - 1 ? 'pb-0' : ''}`}
              >
                <div>
                  <div className="text-[13px] font-semibold text-ink">{c.shopName}</div>
                  <div className="text-[11.5px] text-ink-3 mt-px">ยูนิต {c.unitCode}</div>
                </div>
                <span
                  className={`text-[12px] font-bold px-[9px] py-[3px] rounded-[20px] whitespace-nowrap ${
                    c.urgency === 'urgent'
                      ? 'bg-danger-soft text-danger'
                      : 'bg-warning-soft text-accent-ink'
                  }`}
                >
                  เหลือ {c.daysLeft} วัน
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}

/* ── Sub-components ── */

function LegendItem({ color, label, value }: { color: string; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-[7px] text-[12.5px] text-ink-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
      {label} <b className="text-ink font-bold">{value}</b>
    </div>
  );
}

function TaskRow({ icon, label, count, variant }: { icon: React.ReactNode; label: string; count: string; variant: 'repair' | 'contract' }) {
  return (
    <div className="flex items-center justify-between py-[9px] border-b border-border-soft last:border-b-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-[9px] text-[13px] text-ink">
        <span className="text-ink-3">{icon}</span>
        {label}
      </div>
      <span
        className={`text-[12.5px] font-bold px-[9px] py-[2px] rounded-[20px] ${
          variant === 'repair'
            ? 'bg-danger-soft text-danger'
            : 'bg-warning-soft text-accent-ink'
        }`}
      >
        {count}
      </span>
    </div>
  );
}
