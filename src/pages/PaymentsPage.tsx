import { useState, useMemo, useRef } from 'react';
import { Search, X, FileText, CheckCircle, AlertCircle, Download, Printer, Building } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { payments, tenants, units, contracts } from '../data/mockData';
import type { PaymentStatus, Payment } from '../types';

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  paid:    { label: 'ชำระแล้ว',      bg: 'bg-success-soft',  text: 'text-success',    icon: <CheckCircle size={13} /> },
  overdue: { label: 'ค้างชำระ',      bg: 'bg-danger-soft',   text: 'text-danger',     icon: <AlertCircle size={13} /> },
  pending: { label: 'รอชำระ',        bg: 'bg-warning-soft',  text: 'text-accent-ink', icon: <AlertCircle size={13} /> },
};

type FilterStatus = 'all' | PaymentStatus;

/* ── Receipt Modal ── */
function ReceiptModal({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const tenant = tenants.find((t) => t.id === payment.tenantId);
  const unit = tenant ? units.find((u) => u.id === tenant.unitId) : null;
  const contract = contracts.find((c) => c.id === payment.contractId);

  const receiptNo = `RC-${payment.month.replace('-', '')}-${payment.id.replace('p', '').padStart(3, '0')}`;
  const monthLabel = (() => {
    const [y, m] = payment.month.split('-');
    const thaiMonths = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${thaiMonths[parseInt(m)]} ${parseInt(y) + 543}`;
  })();

  const commonFee = unit?.commonFee || 0;
  const rent = payment.amount;
  const total = rent + commonFee;

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) return;
    win.document.write(`
      <html>
      <head>
        <title>ใบเสร็จรับเงิน ${receiptNo}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1a1a1a; }
          .receipt { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #333; padding-bottom: 16px; }
          .header h1 { font-size: 20px; margin: 0 0 4px; }
          .header p { font-size: 12px; color: #666; margin: 2px 0; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
          .meta-item { }
          .meta-label { color: #888; font-size: 11px; }
          .meta-value { font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { text-align: left; padding: 8px 12px; background: #f5f5f5; border: 1px solid #ddd; font-weight: 600; }
          td { padding: 8px 12px; border: 1px solid #ddd; }
          td.right { text-align: right; }
          .total-row td { font-weight: 700; background: #f0f9ff; font-size: 14px; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #888; }
          .signature { text-align: center; margin-top: 60px; }
          .signature .line { border-top: 1px solid #333; width: 200px; margin: 0 auto 4px; }
          .signature p { font-size: 12px; color: #666; }
          .stamp { display: inline-block; border: 2px solid #22c55e; color: #22c55e; padding: 4px 16px; border-radius: 4px; font-weight: 700; font-size: 14px; transform: rotate(-5deg); margin-top: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[640px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                <FileText size={18} className="text-accent-ink" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-ink m-0">ใบเสร็จรับเงิน</h2>
                <p className="text-[12px] text-ink-3 m-0">{receiptNo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 bg-accent text-white border-none rounded-sm text-[12px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
              >
                <Printer size={13} />
                พิมพ์ / PDF
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Receipt content */}
          <div className="overflow-y-auto flex-1 p-6">
            <div ref={receiptRef}>
              {/* Receipt header */}
              <div className="header" style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #e5e7eb', paddingBottom: 16 }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building size={20} className="text-accent" />
                  <h1 className="text-[18px] font-bold text-ink m-0">We Space Community Mall Payap</h1>
                </div>
                <p className="text-[12px] text-ink-3 m-0">123 ถ.เชียงใหม่-ลำพูน อ.เมือง จ.เชียงใหม่ 50000</p>
                <p className="text-[12px] text-ink-3 m-0">โทร. 053-123-456 | info@wespace-payap.com</p>
                <h2 className="text-[16px] font-bold text-ink mt-3 mb-0">ใบเสร็จรับเงิน / RECEIPT</h2>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4 mb-5 text-[13px]">
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">เลขที่ใบเสร็จ</div>
                  <div className="font-bold text-ink">{receiptNo}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-ink-3 mb-0.5">วันที่ชำระ</div>
                  <div className="font-bold text-ink">{payment.paidDate || '—'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-3 mb-0.5">ผู้เช่า</div>
                  <div className="font-semibold text-ink">{tenant?.shopName || '—'}</div>
                  <div className="text-[12px] text-ink-2">{tenant?.contactName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-ink-3 mb-0.5">ยูนิต</div>
                  <div className="font-semibold text-ink">{unit?.code || '—'}</div>
                  <div className="text-[12px] text-ink-2">{unit?.sizeSqm} ตร.ม.</div>
                </div>
              </div>

              {/* Items table */}
              <div className="border border-border rounded-sm overflow-hidden mb-5">
                <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="bg-bg">
                      <th className="text-left px-4 py-2.5 font-semibold text-ink-2 border-b border-border">รายการ</th>
                      <th className="text-center px-4 py-2.5 font-semibold text-ink-2 border-b border-border">ประจำเดือน</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-ink-2 border-b border-border">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-soft">
                      <td className="px-4 py-2.5 text-ink">ค่าเช่าพื้นที่</td>
                      <td className="px-4 py-2.5 text-center text-ink-2">{monthLabel}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-ink">{rent.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-border-soft">
                      <td className="px-4 py-2.5 text-ink">ค่าส่วนกลาง</td>
                      <td className="px-4 py-2.5 text-center text-ink-2">{monthLabel}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-ink">{commonFee.toLocaleString()}</td>
                    </tr>
                    {contract && (
                      <tr className="border-b border-border-soft">
                        <td className="px-4 py-2.5 text-ink-3 text-[12px]" colSpan={2}>สัญญาเลขที่ {contract.id.toUpperCase()} ({contract.startDate} ถึง {contract.endDate})</td>
                        <td className="px-4 py-2.5"></td>
                      </tr>
                    )}
                    <tr className="bg-accent-soft/30">
                      <td className="px-4 py-3 font-bold text-ink" colSpan={2}>รวมทั้งสิ้น</td>
                      <td className="px-4 py-3 text-right font-extrabold text-accent-ink text-[15px]">฿{total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment info */}
              <div className="bg-success-soft/30 border border-success/20 rounded-sm px-4 py-3 mb-5 flex items-center gap-3">
                <CheckCircle size={18} className="text-success shrink-0" />
                <div>
                  <div className="text-[13px] font-semibold text-success">ชำระเงินเรียบร้อยแล้ว</div>
                  <div className="text-[12px] text-ink-2">ชำระเมื่อ {payment.paidDate} | กำหนดชำระ {payment.dueDate}</div>
                </div>
              </div>

              {/* Signature area */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border-soft">
                <div className="text-center">
                  <div className="w-[180px] border-b border-ink-3 mb-1 pb-8"></div>
                  <div className="text-[12px] text-ink-3">ผู้ชำระเงิน</div>
                </div>
                <div className="text-center">
                  <div className="w-[180px] border-b border-ink-3 mb-1 pb-8"></div>
                  <div className="text-[12px] text-ink-3">ผู้รับเงิน</div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-[11px] text-ink-3">
                <p className="m-0">เอกสารนี้ออกโดยระบบ We Space Community Mall Payap Management System</p>
                <p className="m-0">หากมีข้อสงสัยกรุณาติดต่อ 053-123-456</p>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
            <span className="text-[11.5px] text-ink-3">กดปุ่ม "พิมพ์ / PDF" เพื่อบันทึกเป็น PDF หรือพิมพ์ใบเสร็จ</span>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-border text-ink rounded-sm text-[12.5px] font-medium cursor-pointer font-[inherit] hover:bg-bg transition-colors"
              >
                <Download size={13} />
                บันทึก PDF
              </button>
              <button onClick={onClose} className="px-4 py-2 bg-surface border border-border rounded-sm text-[12.5px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

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
                            <button
                              onClick={() => setReceiptPayment(p)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-border text-ink-2 text-[12px] font-medium rounded-sm cursor-pointer font-[inherit] hover:bg-bg transition-colors"
                            >
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

      {/* ── Receipt Modal ── */}
      {receiptPayment && (
        <ReceiptModal payment={receiptPayment} onClose={() => setReceiptPayment(null)} />
      )}
    </>
  );
}
