import React, { useState } from 'react';
import {
  X,
  FileText,
  Trash2,
  Edit3,
  Download,
  Calendar,
  Building2,
  Mail,
  Paperclip,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Webhook,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { CompetitorRecord } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';

interface RecordsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: CompetitorRecord[];
  onSelectToEdit: (record: CompetitorRecord) => void;
  onDeleteRecord: (id: string) => void;
  onExportJSON: () => void;
  onResendWebhook?: (record: CompetitorRecord) => Promise<void>;
}

export const RecordsDrawer: React.FC<RecordsDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onSelectToEdit,
  onDeleteRecord,
  onExportJSON,
  onResendWebhook,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'submitted' | 'updated'>('all');
  const [search, setSearch] = useState('');
  const [resendingId, setResendingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResend = async (record: CompetitorRecord) => {
    if (!onResendWebhook) return;
    setResendingId(record.id);
    try {
      await onResendWebhook(record);
    } finally {
      setResendingId(null);
    }
  };

  const filtered = records.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const comp = (r.doithu || r.competitor || '').toLowerCase();
    const cont = (r.tintuc || r.content || '').toLowerCase();
    const email = (r.emailcb || r.submitterEmail || '').toLowerCase();
    const impact = (r.tacdong || r.impactOnVcb || '').toLowerCase();
    const matchesSearch =
      search === '' ||
      comp.includes(search.toLowerCase()) ||
      cont.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      impact.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide">
                KHO DỮ LIỆU TÌNH BÁO ĐỐI THỦ ĐÃ LƯU
              </h3>
              <p className="text-[11px] text-emerald-300">
                Tổng cộng {records.length} bản ghi (gồm bản nháp & bản ghi chính thức)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and search bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email, đối thủ, nội dung..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 text-xs"
            />
          </div>

          <div className="flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-1">
              {(['all', 'submitted', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer border ${
                    filterStatus === st
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st === 'all' && 'Tất cả'}
                  {st === 'submitted' && 'Đã cập nhật'}
                  {st === 'draft' && 'Bản nháp'}
                </button>
              ))}
            </div>

            <button
              onClick={onExportJSON}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 text-[11px] font-semibold transition cursor-pointer"
              title="Xuất cơ sở dữ liệu báo cáo ra tệp JSON"
            >
              <Download className="w-3 h-3 text-emerald-700" />
              <span>Xuất dữ liệu</span>
            </button>
          </div>
        </div>

        {/* List of records */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">Chưa có bản ghi nào phù hợp</p>
              <p className="mt-1">Hãy nhập thông tin ở biểu mẫu và nhấn "Lưu tạm" hoặc "Cập nhật".</p>
            </div>
          ) : (
            filtered.map((record) => {
              const pillar = PILLAR_LABELS[record.pillarCategory || 'khac'];
              const isDraft = record.status === 'draft';

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:border-emerald-300 transition"
                >
                  {/* Status & Competitor */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{record.competitor}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pillar.badgeColor}`}>
                        {pillar.short}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isDraft
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isDraft ? 'Bản nháp' : 'Đã nộp'}
                    </span>
                  </div>

                  {/* Submitter */}
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-700">{record.submitterEmail}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3 text-slate-400 ml-1" />
                    <span>{record.updatedAt}</span>
                  </div>

                  {/* Content snippet */}
                  <p className="text-xs text-slate-700 line-clamp-2 mb-2 leading-relaxed">
                    {record.content}
                  </p>

                  {/* Impact snippet */}
                  <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-950 font-medium line-clamp-2 mb-2">
                    <strong className="text-emerald-800">Tác động: </strong>
                    {record.impactOnVcb}
                  </div>

                  {/* Evidence tag */}
                  {record.evidenceFiles && record.evidenceFiles.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      <span>{record.evidenceFiles.length} tệp bằng chứng đính kèm</span>
                    </div>
                  )}

                  {/* Webhook Sync Status Pill */}
                  <div className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded border border-slate-200 mb-2 text-[10px]">
                    <div className="flex items-center gap-1 text-slate-600 truncate">
                      <Webhook className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>Trạng thái Webhook:</span>
                      {record.webhookSync?.sent ? (
                        <span className="font-semibold text-emerald-700">
                          Đã gửi (Mã {record.webhookSync.httpStatus}) - {record.webhookSync.at}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa đẩy sang Make.com</span>
                      )}
                    </div>

                    {onResendWebhook && (
                      <button
                        onClick={() => handleResend(record)}
                        disabled={resendingId === record.id}
                        className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 ml-2 shrink-0 cursor-pointer disabled:opacity-50"
                        title="Đẩy bản ghi này sang Make.com Webhook"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 ${resendingId === record.id ? 'animate-spin' : ''}`} />
                        <span>{resendingId === record.id ? 'Đang gửi...' : 'Đẩy ngay'}</span>
                      </button>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        onSelectToEdit(record);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold transition cursor-pointer border border-emerald-200"
                    >
                      <Edit3 className="w-3 h-3 text-emerald-700" />
                      <span>{isDraft ? 'Tiếp tục chỉnh sửa' : 'Tải lên để cập nhật'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                      title="Xóa bản ghi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
