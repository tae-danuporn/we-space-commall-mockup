import { useState } from 'react';
import { Megaphone, Plus, Send, Pin, Eye, Users, X } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { announcements } from '../data/mockData';

export default function AnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowForm(false);
    }, 1500);
  };

  return (
    <>
      <Topbar title="ประกาศ" subtitle="ส่งประกาศถึงผู้เช่า" />
      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ประกาศทั้งหมด</div>
            <div className="text-[22px] font-extrabold text-ink">{announcements.length}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ส่งถึงทุกคน</div>
            <div className="text-[22px] font-extrabold text-accent-ink">{announcements.filter(a => a.target === 'all').length}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">ส่งถึงผู้เช่า</div>
            <div className="text-[22px] font-extrabold text-success">{announcements.filter(a => a.target === 'tenants').length}</div>
          </div>
          <div className="bg-surface border border-border rounded-card px-4 py-3">
            <div className="text-[12px] text-ink-3 mb-1">เดือนนี้</div>
            <div className="text-[22px] font-extrabold text-ink">{announcements.length}</div>
          </div>
        </div>

        {/* ── New announcement button ── */}
        <div className="flex justify-end mb-5">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-accent text-white border-none px-3.5 py-[9px] rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors"
          >
            <Plus size={15} />
            สร้างประกาศใหม่
          </button>
        </div>

        {/* ── Announcements list ── */}
        <div className="space-y-3">
          {announcements.map((a, idx) => (
            <div key={a.id} className={`bg-surface border rounded-card p-5 transition-shadow hover:shadow-sm ${idx === 0 ? 'border-accent/30 ring-1 ring-accent/10' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-accent text-white' : 'bg-accent-soft'}`}>
                  {idx === 0 ? <Pin size={16} /> : <Megaphone size={16} className="text-accent-ink" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-bold text-ink m-0">{a.title}</h3>
                      {idx === 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent text-white">ล่าสุด</span>}
                    </div>
                    <span className="text-[11.5px] text-ink-3 shrink-0 ml-3">{a.createdAt}</span>
                  </div>
                  <p className="text-[13px] text-ink-2 m-0 leading-relaxed">{a.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[11.5px] text-ink-3">โดย {a.createdBy}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      a.target === 'all' ? 'bg-accent-soft text-accent-ink' :
                      a.target === 'tenants' ? 'bg-success-soft text-success' :
                      'bg-neutral-status-soft text-ink-2'
                    }`}>
                      <Users size={10} />
                      {a.target === 'all' ? 'ทุกคน' : a.target === 'tenants' ? 'ผู้เช่า' : 'พนักงาน'}
                    </span>
                    <span className="text-[11px] text-ink-3 flex items-center gap-1">
                      <Eye size={10} />
                      {idx === 0 ? '12 คนอ่านแล้ว' : idx === 1 ? '18 คนอ่านแล้ว' : '15 คนอ่านแล้ว'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Create Announcement Modal ── */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[520px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-accent-soft flex items-center justify-center">
                    <Megaphone size={18} className="text-accent-ink" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-ink m-0">สร้างประกาศใหม่</h2>
                    <p className="text-[12px] text-ink-3 m-0">ส่งข้อความถึงผู้เช่าหรือทุกคนในโครงการ</p>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
                  <X size={16} />
                </button>
              </div>

              {showSuccess ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-[15px] font-bold text-ink">ส่งประกาศเรียบร้อยแล้ว</p>
                  <p className="text-[13px] text-ink-3 mt-1">ระบบได้ส่งประกาศไปยังกลุ่มเป้าหมายแล้ว</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">หัวข้อ <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        placeholder="หัวข้อประกาศ..."
                        className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">เนื้อหา <span className="text-danger">*</span></label>
                      <textarea
                        rows={4}
                        placeholder="รายละเอียดประกาศ..."
                        className="w-full bg-bg border border-border rounded-sm px-3 py-2 text-[13px] text-ink placeholder:text-ink-3 font-[inherit] outline-none focus:border-accent resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-ink-2 mb-1.5">กลุ่มเป้าหมาย</label>
                      <select className="w-full bg-bg border border-border rounded-sm px-3 py-2.5 text-[13px] text-ink font-[inherit] outline-none focus:border-accent">
                        <option value="all">ทุกคน</option>
                        <option value="tenants">ผู้เช่าเท่านั้น</option>
                        <option value="staff">พนักงานเท่านั้น</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border">
                    <button onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
                      ยกเลิก
                    </button>
                    <button onClick={handleSend} className="flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white border-none rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                      <Send size={13} />
                      ส่งประกาศ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
