import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, CartesianGrid,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';
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

type Period = '6m' | '12m' | 'ytd';

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('6m');
  const [showExportToast, setShowExportToast] = useState(false);

  const totalRevenue = revenueMonths.reduce((sum, r) => sum + r.amount, 0);
  const avgRevenue = Math.round(totalRevenue / revenueMonths.length);
  const growth = ((revenueMonths[revenueMonths.length - 1].amount - revenueMonths[0].amount) / revenueMonths[0].amount * 100).toFixed(1);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 2000);
  };

  return (
    <>
      <Topbar title="รายงาน" subtitle="สรุปข้อมูลและกราฟ" />
      <main className="p-[26px_30px_50px]">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-ink-3" />
            <div className="flex border border-border rounded-sm overflow-hidden">
              {([
                { key: '6m' as Period, label: '6 เดือน' },
                { key: '12m' as Period, label: '12 เดือน' },
                { key: 'ytd' as Period, label: 'ปีนี้' },
              ]).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 py-[6px] text-[12.5px] font-medium border-none cursor-pointer font-[inherit] transition-colors ${
                    period === p.key
                      ? 'bg-accent text-white'
                      : 'bg-surface text-ink-2 hover:bg-bg'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-surface border border-border text-ink px-3.5 py-[8px] rounded-sm text-[13px] font-medium cursor-pointer font-[inherit] hover:bg-bg transition-colors"
          >
            <Download size={14} />
            ส่งออก PDF
          </button>
        </div>

        {/* ── KPI summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">รายรับรวม ({period === '6m' ? '6 เดือน' : period === '12m' ? '12 เดือน' : 'ปีนี้'})</div>
            <div className="text-[20px] font-extrabold text-accent-ink">฿{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">เฉลี่ย/เดือน</div>
            <div className="text-[20px] font-extrabold text-ink">฿{avgRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">การเติบโต</div>
            <div className="text-[20px] font-extrabold text-success">+{growth}%</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">อัตราการเช่า (ล่าสุด)</div>
            <div className="text-[20px] font-extrabold text-success">{occupancyTrend[occupancyTrend.length - 1].rate}%</div>
          </div>
        </div>

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
              <div className="w-[160px] h-[160px] shrink-0 relative">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[14px] font-extrabold text-ink leading-none">{categoryRevenue.length}</span>
                  <span className="text-[9px] text-ink-3">ประเภท</span>
                </div>
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

      {/* ── Export toast ── */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border rounded-card shadow-lg px-5 py-3 flex items-center gap-3 animate-in">
          <div className="w-8 h-8 rounded-full bg-success-soft flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">กำลังจัดเตรียมรายงาน</div>
            <div className="text-[11.5px] text-ink-3">ระบบจะส่งไฟล์ PDF ทางอีเมล</div>
          </div>
        </div>
      )}
    </>
  );
}
