import { useState, useMemo } from 'react';
import { Search, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { payments, tenants, units } from '../data/mockData';
import type { PaymentStatus } from '../types';

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  paid:    { label: 'ชำระแล้ว',      bg: 'bg-success-soft',  text: 'text-success',    icon: <CheckCircle size={13} /> },
  overdue: { label: 'ค้างชำระ',      bg: 'bg-danger-soft',   text: 'text-danger',     icon: <AlertCircle size={13} /> },
  pending: { label: 'รอชำระ',        bg: 'bg-warning-soft',  text: 'text-accent-ink', icon: <AlertCircle size={13} /> },
};

type FilterStatus = 'all' | PaymentStatus;

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const getTenant = (id: string) => tenants.find((t) => t.id === id);
  const getUnit = (tenantId: string) => {
    const tenant = getTenant(tenantId);
    return tenant ? units.find((u) => u.id === tenant.unitId) : null;
  };

  const filtered = useMemo(() => {
    let result = payments;
    if (filterStatus !== 'all') result = result.filter((p) => p.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const tenant = getTenant(p.tenantId);
        return tenant?.shopName.toLowerCase().includes(q) || false;
      });
    }
    return result;
  }, [filterStatus, search]);

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const totalAll = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const overdueCount = payments.filter((p) => p.status === 'overdue').length;
  const collectionRate = Math.round((totalPaid / totalAll) * 100);

  return (
    <>
      <Topbar title="ค่าเช่าและการชำระเงิน" subtitle="ติดตามการชำระเงิน" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">รายรับรวมเดือนนี้</div>
            <div className="text-[20px] font-extrabold text-accent-ink">฿{totalPaid.toLocaleString()}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ชำระแล้ว</div>
            <div className="text-[22px] font-extrabold text-success">{paidCount} <span className="text-[13px] font-semibold">ร้าน</span></div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ยอดค้างชำระ</div>
            <div className="text-[20px] font-extrabold text-danger">฿{totalOverdue.toLocaleString()}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ค้างชำระ</div>
            <div className="text-[22px] font-extrabold text-danger">{overdueCount} <span className="text-[13px] font-semibold">ร้าน</span></div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">อัตราเก็บเงินได้</div>
            <div className="text-[22px] font-extrabold text-success">{collectionRate}%</div>
            <div className="h-1.5 rounded-full bg-border-soft mt-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${collectionRate}%` }} />
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-sm px-3 py-2 w-full max-w-[280px] text-[13px]">
            <Search size={15} className="text-ink-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาร้านค้า..."
              className="bg-transparent border-none outline-none w-full text-ink placeholder:text-ink-3 font-[inherit] text-[13px]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-ink-3 hover:text-ink cursor-pointer bg-transparent border-none p-0">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {([
              { key: 'all' as FilterStatus, label: 'ทั้งหมด' },
              { key: 'paid' as FilterStatus, label: 'ชำระแล้ว' },
              { key: 'overdue' as FilterStatus, label: 'ค้างชำระ' },
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
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        {filtered.length === 0 ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center">
            <p className="text-ink-3 text-[14px]">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ยูนิต</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">เดือน</th>
                    <th className="text-right px-4 py-3 font-semibold text-ink-2">จำนวนเงิน</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">กำหนดชำระ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">วันที่ชำระ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                    <th className="text-center px-4 py-3 font-semibold text-ink-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const tenant = getTenant(p.tenantId);
                    const unit = getUnit(p.tenantId);
                    const cfg = statusConfig[p.status];
                    return (
                      <tr key={p.id} className={`border-b border-border-soft hover:bg-bg transition-colors ${p.status === 'overdue' ? 'bg-danger-soft/20' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-ink">{tenant?.shopName || '—'}</td>
                        <td className="px-4 py-3 text-ink-2">{unit?.code || '—'}</td>
                        <td className="px-4 py-3 text-ink-2">{p.month}</td>
                        <td className="px-4 py-3 text-right font-medium text-ink">฿{p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-ink-2">{p.dueDate}</td>
                        <td className="px-4 py-3 text-ink-2">{p.paidDate || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.status === 'paid' && (
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-border text-ink-2 text-[12px] font-medium rounded-sm cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                              <FileText size={12} />
                              ใบเสร็จ
                            </button>
                          )}
                          {p.status === 'overdue' && (
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-danger text-white text-[12px] font-semibold rounded-sm border-none cursor-pointer font-[inherit] hover:bg-danger/80 transition-colors">
                              แจ้งเตือน
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
        )}

        {/* Summary footer */}
        <div className="bg-surface border border-border rounded-card px-5 py-3 mt-4 flex items-center justify-between text-[12.5px]">
          <span className="text-ink-2">แสดง <b className="text-ink">{filtered.length}</b> จาก {payments.length} รายการ</span>
          <span className="text-ink-2">
            ยอดรวมที่แสดง: <b className="text-accent-ink">฿{filtered.reduce((s, p) => s + p.amount, 0).toLocaleString()}</b>
          </span>
        </div>
      </main>
    </>
  );
}
