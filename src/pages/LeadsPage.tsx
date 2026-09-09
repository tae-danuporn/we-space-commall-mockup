import { useState, useMemo } from 'react';
import { Phone, Calendar, LayoutGrid, List, X, ArrowRight, Clock, User } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { leads } from '../data/mockData';
import type { LeadStage, Lead } from '../types';

/* ── Stage config ── */
const stageConfig: Record<LeadStage, { label: string; color: string; bg: string; border: string; step: number }> = {
  contacted:        { label: 'ติดต่อแล้ว',     color: 'text-ink-2',      bg: 'bg-neutral-status-soft', border: 'border-neutral-status/30', step: 1 },
  site_visit:       { label: 'นัดชมพื้นที่',    color: 'text-accent-ink', bg: 'bg-accent-soft',         border: 'border-accent/30', step: 2 },
  negotiating:      { label: 'เจรจา',          color: 'text-warning',    bg: 'bg-warning-soft',        border: 'border-warning/30', step: 3 },
  contract_pending: { label: 'รอเซ็นสัญญา',   color: 'text-success',    bg: 'bg-success-soft',        border: 'border-success/30', step: 4 },
};

const stageOrder: LeadStage[] = ['contacted', 'site_visit', 'negotiating', 'contract_pending'];

type ViewMode = 'kanban' | 'table';

export default function LeadsPage() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

        {/* ── Conversion funnel ── */}
        <div className="bg-surface border border-border rounded-card p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12.5px] font-bold text-ink">Conversion Funnel</span>
            <span className="text-[11.5px] text-ink-3">ทั้งหมด {leads.length} ราย</span>
          </div>
          <div className="flex items-center gap-1">
            {stageOrder.map((stage, idx) => {
              const cfg = stageConfig[stage];
              const count = grouped[stage].length;
              const pct = Math.round((count / leads.length) * 100);
              return (
                <div key={stage} className="flex items-center gap-1 flex-1">
                  <div className={`flex-1 rounded-sm ${cfg.bg} px-3 py-2 text-center`}>
                    <div className={`text-[14px] font-extrabold ${cfg.color}`}>{count}</div>
                    <div className="text-[10px] text-ink-3">{cfg.label} ({pct}%)</div>
                  </div>
                  {idx < stageOrder.length - 1 && (
                    <ArrowRight size={14} className="text-ink-3 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
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
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="w-full bg-surface border border-border rounded-sm p-3.5 hover:shadow-sm transition-shadow text-left cursor-pointer font-[inherit]"
                      >
                        <div className="text-[13.5px] font-bold text-ink mb-1">{lead.shopName}</div>
                        <div className="text-[12px] text-ink-2 flex items-center gap-1.5 mb-1">
                          <User size={12} className="shrink-0" />
                          {lead.contactName}
                        </div>
                        <div className="text-[12px] text-ink-2 flex items-center gap-1.5 mb-1">
                          <Phone size={12} className="shrink-0" />
                          {lead.phone}
                        </div>
                        <div className="text-[11.5px] text-ink-3 flex items-center gap-1.5">
                          <Calendar size={11} className="shrink-0" />
                          {lead.createdAt}
                        </div>
                      </button>
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
                    <th className="text-center px-4 py-3 font-semibold text-ink-2"></th>
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
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedLead(lead)}
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

      {/* ── Lead Detail Modal ── */}
      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </>
  );
}

/* ── Lead Detail Modal ── */
function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const cfg = stageConfig[lead.stage];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-border shadow-xl w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-[16px] font-bold text-ink m-0">{lead.shopName}</h2>
              <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-[20px] text-[12px] font-semibold ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-sm flex items-center justify-center text-ink-3 hover:text-ink hover:bg-bg border border-border cursor-pointer bg-surface transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Stage progress */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-1">
              {stageOrder.map((stage, idx) => {
                const sCfg = stageConfig[stage];
                const isActive = sCfg.step <= cfg.step;
                return (
                  <div key={stage} className="flex items-center gap-1 flex-1">
                    <div className={`flex-1 h-2 rounded-full ${isActive ? 'bg-accent' : 'bg-border-soft'}`} />
                    {idx < stageOrder.length - 1 && <div className="w-0.5" />}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-ink-3">
              {stageOrder.map((stage) => (
                <span key={stage}>{stageConfig[stage].label}</span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-ink-3">ผู้ติดต่อ</span>
              <span className="text-[13px] font-medium text-ink flex items-center gap-1.5">
                <User size={12} className="text-ink-3" />
                {lead.contactName}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-ink-3">โทรศัพท์</span>
              <span className="text-[13px] font-medium text-ink flex items-center gap-1.5">
                <Phone size={12} className="text-ink-3" />
                {lead.phone}
              </span>
            </div>
            {lead.email && (
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-ink-3">อีเมล</span>
                <span className="text-[13px] font-medium text-accent">{lead.email}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-ink-3">วันที่ติดต่อ</span>
              <span className="text-[13px] font-medium text-ink flex items-center gap-1.5">
                <Clock size={12} className="text-ink-3" />
                {lead.createdAt}
              </span>
            </div>
            {lead.note && (
              <div>
                <span className="text-[13px] text-ink-3 block mb-1">หมายเหตุ</span>
                <p className="text-[13px] text-ink bg-bg rounded-sm p-3 m-0">{lead.note}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-border flex gap-2.5">
            {lead.stage !== 'contract_pending' && (
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-accent-ink transition-colors">
                <ArrowRight size={14} />
                เลื่อนสถานะ
              </button>
            )}
            {lead.stage === 'contract_pending' && (
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-success text-white border-none px-4 py-2.5 rounded-sm text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-success/90 transition-colors">
                สร้างสัญญาเช่า
              </button>
            )}
            <button className="px-4 py-2.5 bg-surface border border-border rounded-sm text-[13px] font-medium text-ink-2 cursor-pointer font-[inherit] hover:bg-bg transition-colors">
              แก้ไข
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
