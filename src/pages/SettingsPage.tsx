import { useState } from 'react';
import { Save, Building, CreditCard, Bell, Shield, Check } from 'lucide-react';
import Topbar from '../components/layout/Topbar';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Topbar title="ตั้งค่า" subtitle="ตั้งค่าระบบทั่วไป" />
      <main className="p-[26px_30px_50px]">

        <div className="max-w-[640px] space-y-5">

          {/* ── Project info ── */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-bg">
              <div className="w-8 h-8 rounded-sm bg-accent-soft flex items-center justify-center">
                <Building size={16} className="text-accent-ink" />
              </div>
              <h3 className="text-[14px] font-bold text-ink m-0">ข้อมูลโครงการ</h3>
            </div>
            <div className="p-5 space-y-3">
              <Field label="ชื่อโครงการ" defaultValue="We Space Community Mall Payap" />
              <Field label="ที่อยู่" defaultValue="123 ถ.เชียงใหม่-ลำพูน อ.เมือง จ.เชียงใหม่ 50000" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="เบอร์โทรศัพท์" defaultValue="053-123-456" />
                <Field label="อีเมล" defaultValue="info@wespace-payap.com" />
              </div>
              <Field label="เว็บไซต์" defaultValue="www.wespace-payap.com" />
            </div>
          </div>

          {/* ── Billing settings ── */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-bg">
              <div className="w-8 h-8 rounded-sm bg-success-soft flex items-center justify-center">
                <CreditCard size={16} className="text-success" />
              </div>
              <h3 className="text-[14px] font-bold text-ink m-0">การเรียกเก็บเงิน</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="วันกำหนดชำระ (ของทุกเดือน)" defaultValue="5" type="number" />
                <Field label="ค่าปรับล่าช้า (%/วัน)" defaultValue="2" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">สกุลเงิน</label>
                  <select
                    defaultValue="THB"
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
                  >
                    <option value="THB">บาท (THB)</option>
                    <option value="USD">ดอลลาร์สหรัฐ (USD)</option>
                  </select>
                </div>
                <Field label="เงินมัดจำ (เดือน)" defaultValue="2" type="number" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">บัญชีธนาคาร</label>
                <input
                  type="text"
                  defaultValue="ธ.กสิกรไทย 123-4-56789-0 บจก. วี สเปซ พายัพ"
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ── Notification settings ── */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-bg">
              <div className="w-8 h-8 rounded-sm bg-warning-soft flex items-center justify-center">
                <Bell size={16} className="text-accent-ink" />
              </div>
              <h3 className="text-[14px] font-bold text-ink m-0">การแจ้งเตือน</h3>
            </div>
            <div className="p-5 space-y-1">
              <Toggle label="แจ้งเตือนสัญญาใกล้หมดอายุ (30 วันล่วงหน้า)" defaultChecked />
              <Toggle label="แจ้งเตือนค่าเช่าค้างชำระ" defaultChecked />
              <Toggle label="แจ้งเตือนแจ้งซ่อมใหม่" defaultChecked />
              <Toggle label="แจ้งเตือนผู้สนใจเช่ารายใหม่" defaultChecked />
              <Toggle label="สรุปรายงานอัตโนมัติทุกสัปดาห์" defaultChecked={false} />
              <Toggle label="แจ้งเตือนทาง LINE Notify" defaultChecked={false} />
            </div>
          </div>

          {/* ── Security settings ── */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-bg">
              <div className="w-8 h-8 rounded-sm bg-danger-soft flex items-center justify-center">
                <Shield size={16} className="text-danger" />
              </div>
              <h3 className="text-[14px] font-bold text-ink m-0">ความปลอดภัย</h3>
            </div>
            <div className="p-5 space-y-1">
              <Toggle label="เปิดใช้งานการยืนยันตัวตนสองขั้นตอน (2FA)" defaultChecked={false} />
              <Toggle label="ล็อกเอาต์อัตโนมัติหลังไม่ใช้งาน 30 นาที" defaultChecked />
              <Toggle label="บันทึก Log การเข้าใช้งาน" defaultChecked />
            </div>
          </div>

          {/* ── Save button ── */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-ink-3">บันทึกล่าสุด: วันนี้ 08:00 น.</span>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-accent text-white border-none px-5 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
            >
              <Save size={15} />
              บันทึกการตั้งค่า
            </button>
          </div>

        </div>
      </main>

      {/* ── Save toast ── */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border rounded-card shadow-lg px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success-soft flex items-center justify-center">
            <Check size={16} className="text-success" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">บันทึกเรียบร้อยแล้ว</div>
            <div className="text-[11.5px] text-ink-3">การตั้งค่าทั้งหมดได้รับการบันทึกแล้ว</div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex items-center justify-between cursor-pointer py-2.5 border-b border-border-soft last:border-b-0">
      <span className="text-[13px] text-ink">{label}</span>
      <button
        type="button"
        onClick={() => setChecked(!checked)}
        className={`relative w-10 h-[22px] rounded-full border-none cursor-pointer transition-colors ${checked ? 'bg-accent' : 'bg-border-soft'}`}
      >
        <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'left-[21px]' : 'left-[3px]'}`} />
      </button>
    </label>
  );
}
