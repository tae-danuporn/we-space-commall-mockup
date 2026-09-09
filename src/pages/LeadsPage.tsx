import { useState, useMemo } from 'react';
import { Phone, Calendar, LayoutGrid, List } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { leads } from '../data/mockData';
import type { LeadStage } from '../types';

/* ── Stage config ── */
const stageConfig: Record<LeadStage, { label: string; color: string; bg: string; border: string }> = {
  contacted:        { label: 'ติดต่อแล้ว',     color: 'text-ink-2',      bg: 'bg-neutral-status-soft', border: 'border-neutral-status/30' },
  site_visit:       { label: 'นัดชมพื้นที่',    color: 'text-accent-ink', bg: 'bg-accent-soft',         border: 'border-accent/30' },
  negotiating:      { label: 'เจรจา',          color: 'text-warning',    bg: 'bg-warning-soft',        border: 'border-warning/30' },
  contract_pending: { label: 'รอเซ็นสัญญา',   color: 'text-success',    bg: 'bg-success-soft',        border: 'border-success/30' },
};

const stageOrder: LeadStage[] = ['contacted', 'site_visit', 'negotiating', 'contract_pending'];

type ViewMode = 'kanban' | 'table';

export default function LeadsPage() {
  const [view, setView] = useState<ViewMode>('kanban');

  const grouped = useMemo(() => {
    const map: Record<LeadStage, typeof leads> = {
      contacted: [], site_visit: [], negotiating: [], contract_pending: [],
    };
    leads.forEach((l) => map[l.stage].push(l));
    return map;
  }, []);

  return (
    <>
      <Topbar title="ผู้สนใจเช่า" subtitle="Pipeline ติดตามลูกค้าเป้าหมาย" />

      <main className="p-[26px_30px_50px]">

        {/* ── Summary ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-5">
          {stageOrder.map((stage) => {
            const cfg = stageConfig[stage];
            return (
              <div key={stage} className="bg-surface border border-border rounded-card px-4 py-3">
                <div className="text-[12px] text-ink-3 mb-1">{cfg.label}</div>
                <div className={`text-[22px] font-extrabold ${cfg.color}`}>{grouped[stage].length}</div>
              </div>
            );
          })}
        </div>

        {/* ── View toggle ── */}
        <div className="flex justify-end mb-4">
          <div className="flex border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'kanban' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 cursor-pointer border-none font-[inherit] transition-colors ${view === 'table' ? 'bg-accent text-white' : 'bg-surface text-ink-2 hover:bg-bg'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {view === 'kanban' ? (
          /* ── Kanban View ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stageOrder.map((stage) => {
              const cfg = stageConfig[stage];
              const items = grouped[stage];
              return (
                <div key={stage} className={`rounded-card border ${cfg.border} ${cfg.bg} p-3`}>
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className={`text-[13px] font-bold ${cfg.color}`}>{cfg.label}</span>
                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full bg-surface ${cfg.color}`}>
                      {items.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="space-y-2.5">
                    {items.map((lead) => (
                      <div key={lead.id} className="bg-surface border border-border rounded-sm p-3.5 hover:shadow-sm transition-shadow">
                        <div className="text-[13.5px] font-bold text-ink mb-1">{lead.shopName}</div>
                        <div className="text-[12px] text-ink-2 flex items-center gap-1.5 mb-1">
                          <Phone size={12} className="shrink-0" />
                          {lead.contactName}
                        </div>
                        <div className="text-[11.5px] text-ink-3 flex items-center gap-1.5">
                          <Calendar size={11} className="shrink-0" />
                          {lead.createdAt}
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="text-center text-[12px] text-ink-3 py-6">ไม่มีรายการ</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Table View ── */
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg">
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ร้านค้า</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">ผู้ติดต่อ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">โทรศัพท์</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">สถานะ</th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-2">วันที่ติดต่อ</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const cfg = stageConfig[lead.stage];
                    return (
                      <tr key={lead.id} className="border-b border-border-soft hover:bg-bg transition-colors">
                        <td className="px-4 py-3 font-semibold text-ink">{lead.shopName}</td>
                        <td className="px-4 py-3 text-ink-2">{lead.contactName}</td>
                        <td className="px-4 py-3 text-ink-2">{lead.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-3">{lead.createdAt}</td>
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
