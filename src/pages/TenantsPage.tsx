import { useState, useMemo } from 'react';
import { Search, X, Phone, Mail, MapPin, FileText, CreditCard } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { tenants, units, contracts, payments } from '../data/mockData';
import type { Tenant } from '../types';

export default function TenantsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const categories = useMemo(() => {
    const cats = [...new Set(tenants.map((t) => t.shopCategory))].sort();
    return cats;
  }, []);

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      if (categoryFilter !== 'all' && t.shopCategory !== categoryFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.shopName.toLowerCase().includes(q) ||
        t.contactName.toLowerCase().includes(q) ||
        t.phone.includes(q)
      );
    });
  }, [search, categoryFilter]);

  const getUnit = (unitId: string) => units.find((u) => u.id === unitId);

  return (
    <>
      <Topbar title="ผู้เช่า" subtitle="รายชื่อผู้เช่าปัจจุบัน" />

      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ผู้เช่าทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{tenants.length}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ประเภทร้านค้า</div>
            <div className="text-[22px] font-extrabold text-accent-ink">
              {categories.length}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">รายรับค่าเช่า/เดือน</div>
            <div className="text-[22px] font-extrabold text-success">
              ฿{tenants.reduce((sum, t) => {
                const u = getUnit(t.unitId);
                return sum + (u?.monthlyRent || 0);
              }, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ยูนิตที่เช่า</div>
            <div className="text-[22px] font-extrabold text-ink">{tenants.length}</div>
          </div>
        </div>

        {/* ── Toolbar: Search + Category Filter ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-sm px-3 py-2 w-full max-w-[320px] text-[13px]">
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

          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-[6px] rounded-sm text-[12.5px] font-medium border cursor-pointer font-[inherit] transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-ink-2 border-border hover:border-ink-3'
              }`}
            >
              ทั้งหมด ({tenants.length})
            </button>
            {categories.map((cat) => {
              const count = tenants.filter((t) => t.shopCategory === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-[6px] rounded-sm text-[12.5px] font-medium border cursor-pointer font-[inherit] transition-colors ${
                    categoryFilter === cat
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-ink-2 border-border hover:border-ink-3'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
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
                    <th className="text-center px-4 py-3 font-semibold text-ink-2"></th>
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
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedTenant(t)}
                            className="text-[12px] font-medium text-accent hover:text-accent-ink cursor-pointer bg-transparent border-none font-[inherit]"
                          >
                            ดูรายละเอียด
                          </button>
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

      {/* ── Tenant Detail Modal ── */}
      {selectedTenant && (
        <TenantDetailModal tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />
      )}
    </>
  );
}

function TenantDetailModal({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) {
  const unit = units.find((u) => u.id === tenant.unitId);
  const contract = contracts.find((c) => c.tenantId === tenant.id);
  const payment = payments.find((p) => p.tenantId === tenant.id);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-[16px] font-bold text-ink m-0">{tenant.shopName}</h2>
              <span className="text-[12px] px-2 py-0.5 rounded-[20px] bg-accent-soft text-accent-ink font-medium mt-1 inline-block">
                {tenant.shopCategory}
              </span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Contact info */}
          <div className="px-6 py-5">
            <h3 className="text-[12px] font-semibold text-ink-2 uppercase tracking-wide mb-3">ข้อมูลการติดต่อ</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-ink-3">ผู้ติดต่อ</span>
                <span className="text-[13px] font-medium text-ink">{tenant.contactName}</span>
              </div>
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

          {/* Unit info */}
          {unit && (
            <div className="px-6 py-5 border-t border-border">
              <h3 className="text-[12px] font-semibold text-ink-2 uppercase tracking-wide mb-3">ข้อมูลยูนิต</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink-3">ยูนิต</span>
                  <span className="text-[13px] font-medium text-ink flex items-center gap-1.5">
                    <MapPin size={12} className="text-ink-3" />
                    {unit.code} (โซน {unit.zone} ชั้น {unit.floor})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink-3">ขนาด</span>
                  <span className="text-[13px] font-medium text-ink">{unit.sizeSqm} ตร.ม.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink-3">ค่าเช่า/เดือน</span>
                  <span className="text-[13px] font-bold text-accent-ink">฿{(unit.monthlyRent || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink-3">ค่าส่วนกลาง</span>
                  <span className="text-[13px] font-medium text-ink">฿{(unit.commonFee || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contract & payment summary */}
          <div className="px-6 py-5 border-t border-border">
            <h3 className="text-[12px] font-semibold text-ink-2 uppercase tracking-wide mb-3">สถานะสัญญาและการชำระ</h3>
            <div className="space-y-3">
              {contract && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-ink-3">สัญญา</span>
                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-[20px] ${
                      contract.status === 'active' ? 'bg-success-soft text-success' :
                      contract.status === 'expiring' ? 'bg-warning-soft text-accent-ink' :
                      'bg-danger-soft text-danger'
                    }`}>
                      {contract.status === 'active' ? 'ใช้งานอยู่' : contract.status === 'expiring' ? 'ใกล้หมดอายุ' : 'หมดอายุ'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-ink-3">ระยะเวลา</span>
                    <span className="text-[13px] font-medium text-ink">{contract.startDate} — {contract.endDate}</span>
                  </div>
                </>
              )}
              {payment && (
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-ink-3">การชำระเดือนนี้</span>
                  <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-[20px] ${
                    payment.status === 'paid' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
                  }`}>
                    {payment.status === 'paid' ? 'ชำระแล้ว' : 'ค้างชำระ'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-border flex gap-2.5">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
              <FileText size={14} />
              ดูสัญญา
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-surface text-ink border border-border px-4 py-2.5 rounded-sm text-[13px] font-medium cursor-pointer font-[inherit] hover:bg-bg transition-colors">
              <CreditCard size={14} />
              ดูการชำระ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
