import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (lead: { shopName: string; contactName: string; phone: string; email: string; note: string }) => void;
}

export default function AddLeadModal({ isOpen, onClose, onAdd }: AddLeadModalProps) {
  const [form, setForm] = useState({ shopName: '', contactName: '', phone: '', email: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.shopName || !form.contactName || !form.phone) return;
    onAdd?.(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ shopName: '', contactName: '', phone: '', email: '', note: '' });
      onClose();
    }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                <UserPlus size={18} className="text-accent-ink" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-ink m-0">เพิ่มผู้สนใจเช่าใหม่</h2>
                <p className="text-[12px] text-ink-3 m-0">กรอกข้อมูลร้านค้าที่สนใจเช่าพื้นที่</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            /* ── Success state ── */
            <div className="px-6 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-ink">เพิ่มผู้สนใจเช่าเรียบร้อยแล้ว</p>
              <p className="text-[13px] text-ink-3 mt-1">ระบบบันทึกข้อมูลร้าน "{form.shopName}" แล้ว</p>
            </div>
          ) : (
            /* ── Form ── */
            <div className="px-6 py-5 space-y-4">
              <FormField
                label="ชื่อร้านค้า"
                required
                value={form.shopName}
                onChange={(v) => setForm({ ...form, shopName: v })}
                placeholder="เช่น Sweet Bake House"
              />
              <FormField
                label="ชื่อผู้ติดต่อ"
                required
                value={form.contactName}
                onChange={(v) => setForm({ ...form, contactName: v })}
                placeholder="ชื่อ-นามสกุล"
              />
              <FormField
                label="เบอร์โทรศัพท์"
                required
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="0xx-xxx-xxxx"
              />
              <FormField
                label="อีเมล"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="email@example.com"
              />
              <div>
                <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
                  หมายเหตุ
                </label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="รายละเอียดเพิ่มเติม เช่น ยูนิตที่สนใจ ประเภทร้านค้า..."
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          {!submitted && (
            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.shopName || !form.contactName || !form.phone}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white border-none rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <UserPlus size={14} />
                บันทึก
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FormField({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
