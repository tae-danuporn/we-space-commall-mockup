import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import {
  Wrench, FileText, CreditCard, ChevronUp, UserPlus,
  MapPin, Users, AlertTriangle, TrendingUp, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Topbar from '../components/layout/Topbar';
import {
  dashboardKPI, revenueMonths, activities, expiringContractsList,
  maintenanceRequests, tenants, payments,
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

/* ── Top overdue tenants ── */
const overdueList = payments
  .filter((p) => p.status === 'overdue')
  .map((p) => ({
    ...p,
    tenant: tenants.find((t) => t.id === p.tenantId),
  }))
  .slice(0, 3);

/* ── Recent maintenance ── */
const recentMaintenance = maintenanceRequests
  .filter((m) => m.status !== 'done')
  .slice(0, 3);

export default function DashboardPage() {
  const kpi = dashboardKPI;

  return (
    <>
      <Topbar title="ภาพรวมโครงการ" subtitle="We Space Community Mall Payap — อัปเดตล่าสุดวันนี้ 08:00 น." />

      <main className="p-[26px_30px_50px]">

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <QuickAction to="/units" icon={<MapPin size={18} />} label="ดูแผนผังพื้นที่" color="bg-accent-soft text-accent-ink" />
          <QuickAction to="/leads" icon={<UserPlus size={18} />} label="ผู้สนใจเช่าใหม่" color="bg-success-soft text-success" />
          <QuickAction to="/payments" icon={<CreditCard size={18} />} label="ติดตามค่าเช่า" color="bg-warning-soft text-accent-ink" />
          <QuickAction to="/maintenance" icon={<Wrench size={18} />} label="แจ้งซ่อมค้าง" color="bg-danger-soft text-danger" />
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr] gap-[18px] mb-[22px]">

          {/* KPI 1: Occupancy */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="flex items-baseline justify-between mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">สถานะพื้นที่เช่า</p>
              <Link to="/units" className="text-[11.5px] text-accent font-medium hover:text-accent-ink no-underline flex items-center gap-1">
                ดูทั้งหมด <ArrowRight size={11} />
              </Link>
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
            <div className="mt-3 pt-3 border-t border-border-soft">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-ink-3">อัตราการเก็บเงินได้</span>
                <span className="font-bold text-success">72%</span>
              </div>
              <div className="h-1.5 rounded-full bg-border-soft mt-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-success" style={{ width: '72%' }} />
              </div>
            </div>
          </div>

          {/* KPI 3: Overdue */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px] flex items-baseline justify-between">
              <p className="text-[13.5px] font-bold text-ink m-0">ยอดค้างชำระ</p>
              <Link to="/payments" className="text-[11.5px] text-accent font-medium hover:text-accent-ink no-underline flex items-center gap-1">
                ดู <ArrowRight size={11} />
              </Link>
            </div>
            <div className="text-[25px] font-extrabold tracking-tight text-danger mb-1.5">
              ฿{kpi.overdueAmount.toLocaleString()}
            </div>
            <div className="text-[12px] text-ink-3 flex items-center gap-1">
              <AlertTriangle size={12} className="text-danger" />
              จาก {kpi.overdueShops} ร้านค้าที่ยังไม่ชำระ
            </div>
          </div>

          {/* KPI 4: Tasks */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">งานที่ต้องติดตาม</p>
            </div>
            <TaskRow icon={<Wrench size={16} />} label="แจ้งซ่อมค้างดำเนินการ" count={`${kpi.pendingRepairs} รายการ`} variant="repair" to="/maintenance" />
            <TaskRow icon={<FileText size={16} />} label="สัญญาใกล้หมดอายุ" count={`${kpi.expiringContracts} สัญญา`} variant="contract" to="/contracts" />
            <TaskRow icon={<Users size={16} />} label="ผู้สนใจเช่าใหม่" count="7 ราย" variant="contract" to="/leads" />
          </div>
        </div>

        {/* ── Chart Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px] mb-[22px]">

          {/* Revenue chart */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="flex items-baseline justify-between mb-[14px]">
              <p className="text-[13.5px] font-bold text-ink m-0">แนวโน้มรายรับ 6 เดือนล่าสุด</p>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11.5px] text-success font-medium">
                  <TrendingUp size={12} /> ขาขึ้น
                </span>
                <span className="text-[11.5px] text-ink-3">หน่วย: บาท</span>
              </div>
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
              <div className="w-[104px] h-[104px] shrink-0 relative">
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
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[16px] font-extrabold text-ink leading-none">40</span>
                  <span className="text-[9px] text-ink-3">ยูนิต</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <LegendItem color="bg-success" label="เช่าแล้ว" value="45%" />
                <LegendItem color="bg-warning" label="กำลังเจรจา" value="17.5%" />
                <LegendItem color="bg-neutral-status" label="ว่าง" value="37.5%" />
              </div>
            </div>
          </div>
        </div>

        {/* ── List Row: 3 columns ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-[18px]">

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
            <div className="mb-[14px] flex items-baseline justify-between">
              <p className="text-[13.5px] font-bold text-ink m-0">สัญญาใกล้หมดอายุ</p>
              <Link to="/contracts" className="text-[11.5px] text-accent font-medium hover:text-accent-ink no-underline flex items-center gap-1">
                ดูทั้งหมด <ArrowRight size={11} />
              </Link>
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

          {/* Overdue payments + Recent repairs */}
          <div className="space-y-[18px]">
            {/* Top overdue */}
            <div className="bg-surface border border-border rounded-card p-[19px_20px]">
              <div className="mb-[14px] flex items-baseline justify-between">
                <p className="text-[13.5px] font-bold text-ink m-0">ค้างชำระล่าสุด</p>
                <Link to="/payments" className="text-[11.5px] text-accent font-medium hover:text-accent-ink no-underline flex items-center gap-1">
                  ดู <ArrowRight size={11} />
                </Link>
              </div>
              {overdueList.map((item, idx) => (
                <div key={item.id} className={`flex items-center justify-between py-[8px] ${idx < overdueList.length - 1 ? 'border-b border-border-soft' : ''} ${idx === 0 ? 'pt-0' : ''}`}>
                  <span className="text-[13px] font-medium text-ink">{item.tenant?.shopName}</span>
                  <span className="text-[12.5px] font-bold text-danger">฿{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Recent maintenance */}
            <div className="bg-surface border border-border rounded-card p-[19px_20px]">
              <div className="mb-[14px] flex items-baseline justify-between">
                <p className="text-[13.5px] font-bold text-ink m-0">แจ้งซ่อมล่าสุด</p>
                <Link to="/maintenance" className="text-[11.5px] text-accent font-medium hover:text-accent-ink no-underline flex items-center gap-1">
                  ดู <ArrowRight size={11} />
                </Link>
              </div>
              {recentMaintenance.map((m, idx) => (
                <div key={m.id} className={`flex items-center justify-between py-[8px] ${idx < recentMaintenance.length - 1 ? 'border-b border-border-soft' : ''} ${idx === 0 ? 'pt-0' : ''}`}>
                  <div>
                    <div className="text-[12.5px] font-medium text-ink">{m.issue}</div>
                    <div className="text-[11px] text-ink-3">{m.createdAt}</div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    m.priority === 'high' ? 'bg-danger-soft text-danger' :
                    m.priority === 'medium' ? 'bg-warning-soft text-accent-ink' :
                    'bg-neutral-status-soft text-ink-2'
                  }`}>
                    {m.priority === 'high' ? 'เร่งด่วน' : m.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

/* ── Sub-components ── */

function QuickAction({ to, icon, label, color }: { to: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link to={to} className="no-underline">
      <div className={`flex items-center gap-3 bg-surface border border-border rounded-card px-4 py-3 cursor-pointer hover:shadow-sm transition-shadow`}>
        <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        <span className="text-[13px] font-semibold text-ink">{label}</span>
      </div>
    </Link>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-[7px] text-[12.5px] text-ink-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
      {label} <b className="text-ink font-bold">{value}</b>
    </div>
  );
}

function TaskRow({ icon, label, count, variant, to }: { icon: React.ReactNode; label: string; count: string; variant: 'repair' | 'contract'; to: string }) {
  return (
    <Link to={to} className="no-underline">
      <div className="flex items-center justify-between py-[9px] border-b border-border-soft last:border-b-0 last:pb-0 first:pt-0 hover:bg-bg/50 transition-colors -mx-1 px-1 rounded-sm">
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
    </Link>
  );
}
