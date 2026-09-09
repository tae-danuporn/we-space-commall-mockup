import { useState } from 'react';
import { Megaphone, Plus, Send } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { announcements } from '../data/mockData';

export default function AnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Topbar title="ประกาศ" subtitle="ส่งประกาศถึงผู้เช่า" />
      <main className="p-[26px_30px_50px]">

        {/* ── New announcement button ── */}
        <div className="flex justify-end mb-5">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-accent text-white border-none px-3.5 py-[9px] rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
          >
            <Plus size={15} />
            สร้างประกาศใหม่
          </button>
        </div>

        {/* ── Create form (UI only) ── */}
        {showForm && (
          <div className="bg-surface border border-border rounded-card p-5 mb-5">
            <h3 className="text-[14px] font-bold text-ink m-0 mb-4">สร้างประกาศใหม่</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-ink-2 mb-1">หัวข้อ</label>
                <input
                  type="text"
                  placeholder="หัวข้อประกาศ..."
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-ink-2 mb-1">เนื้อหา</label>
                <textarea
                  rows={4}
                  placeholder="รายละเอียดประกาศ..."
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-ink-2 mb-1">กลุ่มเป้าหมาย</label>
                <select className="bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink font-[inherit] outline-none focus:border-accent">
                  <option value="all">ทุกคน</option>
                  <option value="tenants">ผู้เช่าเท่านั้น</option>
                  <option value="staff">พนักงานเท่านั้น</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors"
                >
                  ยกเลิก
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white border-none rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                  <Send size={13} />
                  ส่งประกาศ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Announcements list ── */}
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-surface border border-border rounded-card p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center shrink-0">
                  <Megaphone size={16} className="text-accent-ink" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-[14px] font-bold text-ink m-0">{a.title}</h3>
                    <span className="text-[11.5px] text-ink-3 shrink-0 ml-3">{a.createdAt}</span>
                  </div>
                  <p className="text-[13px] text-ink-2 m-0 leading-relaxed">{a.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11.5px] text-ink-3">โดย {a.createdBy}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      a.target === 'all' ? 'bg-accent-soft text-accent-ink' :
                      a.target === 'tenants' ? 'bg-success-soft text-success' :
                      'bg-neutral-status-soft text-ink-2'
                    }`}>
                      {a.target === 'all' ? 'ทุกคน' : a.target === 'tenants' ? 'ผู้เช่า' : 'พนักงาน'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
