import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, CartesianGrid,
} from 'recharts';
import Topbar from '../components/layout/Topbar';
import { revenueMonths, tenants, units } from '../data/mockData';

/* ── Occupancy trend (mock 6 months) ── */
const occupancyTrend = [
  { month: 'เม.ย.', rate: 35 },
  { month: 'พ.ค.', rate: 37.5 },
  { month: 'มิ.ย.', rate: 40 },
  { month: 'ก.ค.', rate: 40 },
  { month: 'ส.ค.', rate: 42.5 },
  { month: 'ก.ย.', rate: 45 },
];

/* ── Revenue by category ── */
const categoryRevenue = (() => {
  const map: Record<string, number> = {};
  tenants.forEach((t) => {
    const unit = units.find((u) => u.id === t.unitId);
    if (unit?.monthlyRent) {
      map[t.shopCategory] = (map[t.shopCategory] || 0) + unit.monthlyRent;
    }
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
})();

const COLORS = [
  'var(--color-accent)', 'var(--color-success)', 'var(--color-warning)',
  'var(--color-danger)', 'var(--color-neutral-status)', 'var(--color-accent-ink)',
  'var(--color-ink-3)',
];

export default function ReportsPage() {
  return (
    <>
      <Topbar title="รายงาน" subtitle="สรุปข้อมูลและกราฟ" />
      <main className="p-[26px_30px_50px]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px]">

          {/* ── Revenue trend ── */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-[13.5px] font-bold text-ink m-0">แนวโน้มรายรับ 6 เดือน</p>
              <span className="text-[11.5px] text-ink-3">หน่วย: บาท</span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueMonths} barSize={34}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: 'var(--color-ink-3)' }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'รายรับ']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }}
                  />
                  <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
                    {revenueMonths.map((_, idx) => (
                      <Cell key={idx} fill={idx === revenueMonths.length - 1 ? 'var(--color-accent)' : 'var(--color-border-soft)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Occupancy trend ── */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-[13.5px] font-bold text-ink m-0">อัตราการเช่าย้อนหลัง</p>
              <span className="text-[11.5px] text-ink-3">หน่วย: %</span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: 'var(--color-ink-3)' }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-ink-3)' }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'อัตราการเช่า']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="var(--color-success)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-success)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Revenue by category (Pie) ── */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-4">
              <p className="text-[13.5px] font-bold text-ink m-0">รายรับแยกตามประเภทร้านค้า</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-[160px] h-[160px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" stroke="none">
                      {categoryRevenue.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'รายรับ']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                {categoryRevenue.map((cat, idx) => (
                  <div key={cat.name} className="flex items-center gap-2 text-[12px]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[idx % COLORS.length] }} />
                    <span className="text-ink-2">{cat.name}</span>
                    <span className="font-bold text-ink ml-auto">฿{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Unit size distribution ── */}
          <div className="bg-surface border border-border rounded-card p-[19px_20px]">
            <div className="mb-4">
              <p className="text-[13.5px] font-bold text-ink m-0">การกระจายขนาดยูนิต</p>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(() => {
                  const ranges = [
                    { range: '20-24', min: 20, max: 24 },
                    { range: '25-29', min: 25, max: 29 },
                    { range: '30-34', min: 30, max: 34 },
                    { range: '35-39', min: 35, max: 39 },
                    { range: '40+', min: 40, max: 999 },
                  ];
                  return ranges.map((r) => ({
                    range: r.range,
                    count: units.filter((u) => u.sizeSqm >= r.min && u.sizeSqm <= r.max).length,
                  }));
                })()} barSize={40}>
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11.5, fill: 'var(--color-ink-3)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-ink-3)' }} />
                  <Tooltip
                    formatter={(value) => [`${value} ยูนิต`, 'จำนวน']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--color-border)' }}
                  />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]} fill="var(--color-accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
