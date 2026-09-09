import { Save } from 'lucide-react';
import Topbar from '../components/layout/Topbar';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="ตั้งค่า" subtitle="ตั้งค่าระบบทั่วไป" />
      <main className="p-[26px_30px_50px]">

        <div className="max-w-[640px] space-y-5">

          {/* ── Project info ── */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-[14px] font-bold text-ink m-0 mb-4">ข้อมูลโครงการ</h3>
            <div className="space-y-3">
              <Field label="ชื่อโครงการ" defaultValue="We Space Community Mall Payap" />
              <Field label="ที่อยู่" defaultValue="123 ถ.เชียงใหม่-ลำพูน อ.เมือง จ.เชียงใหม่ 50000" />
              <Field label="เบอร์โทรศัพท์" defaultValue="053-123-456" />
              <Field label="อีเมล" defaultValue="info@wespace-payap.com" />
            </div>
          </div>

          {/* ── Billing settings ── */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-[14px] font-bold text-ink m-0 mb-4">การเรียกเก็บเงิน</h3>
            <div className="space-y-3">
              <Field label="วันกำหนดชำระ (ของทุกเดือน)" defaultValue="5" type="number" />
              <Field label="ค่าปรับล่าช้า (%/วัน)" defaultValue="2" type="number" />
              <div>
                <label className="block text-[12px] font-semibold text-ink-2 mb-1">สกุลเงิน</label>
                <select
                  defaultValue="THB"
                  className="bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink font-[inherit] outline-none focus:border-accent"
                >
                  <option value="THB">บาท (THB)</option>
                  <option value="USD">ดอลลาร์สหรัฐ (USD)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Notification settings ── */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-[14px] font-bold text-ink m-0 mb-4">การแจ้งเตือน</h3>
            <div className="space-y-3">
              <Toggle label="แจ้งเตือนสัญญาใกล้หมดอายุ (30 วันล่วงหน้า)" defaultChecked />
              <Toggle label="แจ้งเตือนค่าเช่าค้างชำระ" defaultChecked />
              <Toggle label="แจ้งเตือนแจ้งซ่อมใหม่" defaultChecked />
              <Toggle label="สรุปรายงานอัตโนมัติทุกสัปดาห์" defaultChecked={false} />
            </div>
          </div>

          {/* ── Save button ── */}
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 bg-accent text-white border-none px-5 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
              <Save size={15} />
              บันทึกการตั้งค่า
            </button>
          </div>

        </div>
      </main>
    </>
  );
}

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-2 mb-1">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink font-[inherit] outline-none focus:border-accent"
      />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-[13px] text-ink">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="w-4 h-4 accent-accent cursor-pointer" />
    </label>
  );
}
