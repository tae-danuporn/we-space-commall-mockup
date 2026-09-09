import { useState, useMemo } from 'react';
import Topbar from '../components/layout/Topbar';
import { payments, tenants } from '../data/mockData';
import type { PaymentStatus } from '../types';

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
  paid:    { label: 'ชำระแล้ว',      bg: 'bg-success-soft',  text: 'text-success' },
  overdue: { label: 'ค้างชำระ',      bg: 'bg-danger-soft',   text: 'text-danger' },
  pending: { label: 'รอชำระ',        bg: 'bg-warning-soft',  text: 'text-accent-ink' },
};

type FilterStatus = 'all' | PaymentStatus;

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const getTenant = (id: string) => tenants.find((t) => t.id === id);

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return payments;
    return payments.filter((p) => p.status === filterStatus);
  }, [filterStatus]);

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const paidCount = payments.filter((p) => p.status === 'paid').length;
  const overdueCount = payments.filter((p) => p.status === 'overdue').length;

  return (
    <>
      <Topbar title="ค่าเช่าและการชำระเงิน" subtitle="ติดตามการชำระเงิน" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">รายรับรวมเดือนนี้</div>
            <div className="text-[22px] font-extrabold text-accent-ink">฿{totalPaid.toLocaleString()}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ชำระแล้ว</div>
            <div className="text-[22px] font-extrabold text-success">{paidCount} ร้าน</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ยอดค้างชำระ</div>
            <div className="text-[22px] font-extrabold text-danger">฿{totalOverdue.toLocaleString()}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ค้างชำระ</div>
            <div className="text-[22px] font-extrabold text-danger">{overdueCount} ร้าน</div>
          </div>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex gap-1.5 mb-5">
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

        {/* ── Table ── */}
        <div className="bg-surface border border-border rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">เดือน</th>
                  <th className="text-right px-4 py-3 font-semibold text-ink-2">จำนวนเงิน</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">กำหนดชำระ</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">วันที่ชำระ</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const tenant = getTenant(p.tenantId);
                  const cfg = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="border-b border-border-soft hover:bg-bg transition-colors">
                      <td className="px-4 py-3 font-semibold text-ink">{tenant?.shopName || '—'}</td>
                      <td className="px-4 py-3 text-ink-2">{p.month}</td>
                      <td className="px-4 py-3 text-right font-medium text-ink">฿{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-ink-2">{p.dueDate}</td>
                      <td className="px-4 py-3 text-ink-2">{p.paidDate || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
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
