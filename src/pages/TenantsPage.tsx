import { useState, useMemo } from 'react';
import { Search, X, Phone } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { tenants, units } from '../data/mockData';

export default function TenantsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return tenants;
    const q = search.toLowerCase();
    return tenants.filter(
      (t) =>
        t.shopName.toLowerCase().includes(q) ||
        t.contactName.toLowerCase().includes(q) ||
        t.phone.includes(q)
    );
  }, [search]);

  const getUnit = (unitId: string) => units.find((u) => u.id === unitId);

  return (
    <>
      <Topbar title="ผู้เช่า" subtitle="รายชื่อผู้เช่าปัจจุบัน" />

      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ผู้เช่าทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{tenants.length}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ประเภทร้านค้า</div>
            <div className="text-[22px] font-extrabold text-accent-ink">
              {new Set(tenants.map((t) => t.shopCategory)).size}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ยูนิตที่เช่า</div>
            <div className="text-[22px] font-extrabold text-success">{tenants.length}</div>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="flex items-center gap-2 bg-surface border border-border rounded-sm px-3 py-2 w-full max-w-[320px] text-[13px] mb-5">
          <Search size={15} className="text-ink-3 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาร้านค้า, ผู้ติดต่อ, เบอร์โทร..."
            className="bg-transparent border-none outline-none w-full text-ink placeholder:text-ink-3 font-[inherit] text-[13px]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-ink-3 hover:text-ink cursor-pointer bg-transparent border-none p-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Table ── */}
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center">
            <p className="text-ink-3 text-[14px]">ไม่พบผู้เช่าที่ตรงกับคำค้นหา</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ประเภท</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ผู้ติดต่อ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">โทรศัพท์</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ยูนิต</th>
                    <th className="text-right px-4 py-3 font-semibold text-ink-2">ค่าเช่า/เดือน</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const unit = getUnit(t.unitId);
                    return (
                      <tr key={t.id} className="border-b border-border-soft hover:bg-bg transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-ink">{t.shopName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] px-2 py-0.5 rounded-[20px] bg-accent-soft text-accent-ink font-medium">
                            {t.shopCategory}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-2">{t.contactName}</td>
                        <td className="px-4 py-3 text-ink-2">
                          <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-ink-3" />
                            {t.phone}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">{unit?.code || '—'}</td>
                        <td className="px-4 py-3 text-right font-medium text-ink">
                          {unit?.monthlyRent ? `฿${unit.monthlyRent.toLocaleString()}` : '—'}
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
    </>
  );
}
