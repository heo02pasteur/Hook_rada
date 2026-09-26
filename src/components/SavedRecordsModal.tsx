import React, { useState } from 'react';
import {
  FileText,
  Search,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Tag,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { CompetitorRecord, RetailPillar } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';

interface SavedRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: CompetitorRecord[];
  onSelectToEdit: (record: CompetitorRecord) => void;
  onDeleteRecord?: (id: string) => void;
}

export const SavedRecordsModal: React.FC<SavedRecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectToEdit,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'draft'>('all');

  if (!isOpen) return null;

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    const competitor = (r.doithu || r.competitor || '').toLowerCase();
    const content = (r.tintuc || r.content || '').toLowerCase();
    const email = (r.emailcb || r.submitterEmail || '').toLowerCase();
    const matchQ = competitor.includes(q) || content.includes(q) || email.includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchQ && matchStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00523d] via-[#005a43] to-[#00523d] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Danh Sách Bản Lưu & Bản Nháp ({records.length})
              </h3>
              <p className="text-xs text-emerald-200/80">
                Chọn một bản ghi để nạp lại vào biểu mẫu, sửa đổi nội dung và Cập nhật
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo ngân hàng đối thủ, nội dung hoặc email cán bộ..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-300">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({records.length})
            </button>
            <button
              onClick={() => setStatusFilter('submitted')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                statusFilter === 'submitted'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã nộp ({records.filter((r) => r.status === 'submitted' || r.status === 'updated').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bản nháp ({records.filter((r) => r.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-100">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl p-8 border border-slate-200">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">Không tìm thấy bản lưu nào phù hợp</p>
              <p className="text-xs mt-1 text-slate-400">
                Hãy nhập thông tin mới hoặc thay đổi từ khóa tìm kiếm.
              </p>
            </div>
          ) : (
            filteredRecords.map((rec) => {
              const pillarKey = (rec.chude || rec.pillarCategory || 'khac') as RetailPillar;
              const pillarInfo = PILLAR_LABELS[pillarKey];
              const competitorName = rec.doithu || rec.competitor || 'Đối thủ';
              const contentText = rec.tintuc || rec.content || '';
              const impactText = rec.tacdong || rec.impactOnVcb || '';
              const officerEmail = rec.emailcb || rec.submitterEmail || '';
              const evidenceText = rec.bangchung || (rec.evidenceFiles?.length ? rec.evidenceFiles.map(f => f.name).join(', ') : 'Thông tin CHỜ thu thập');

              return (
                <div
                  key={rec.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            pillarInfo?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {pillarInfo?.label || 'Chuyên đề'}
                        </span>
                        <span className="font-bold text-sm text-slate-900">
                          {competitorName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {rec.status === 'draft' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Bản nháp
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Đã nộp
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.muctacdong === 'critical' || rec.impactLevel === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : rec.muctacdong === 'high' || rec.impactLevel === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {rec.muctacdong === 'critical' || rec.impactLevel === 'critical'
                            ? 'Khẩn cấp'
                            : rec.muctacdong === 'high' || rec.impactLevel === 'high'
                            ? 'Cao'
                            : 'Trung bình'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-xs text-slate-700 leading-relaxed mb-2 line-clamp-2">
                      {contentText}
                    </p>

                    {/* Impact & Evidence */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mb-3">
                      <div className="p-2 rounded bg-amber-50/80 border border-amber-200 text-amber-900">
                        <strong>Tác động VCB:</strong> {impactText || 'Đang đánh giá'}
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                        <strong>Bằng chứng:</strong>{' '}
                        <span className="text-emerald-700 truncate block">{evidenceText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      <span>Cán bộ: </span>
                      <strong className="text-slate-700">{officerEmail}</strong>
                      <span className="ml-2 text-slate-400">{rec.updatedAt || rec.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectToEdit(rec);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chọn & Sửa lại</span>
                      </button>
                      {onDeleteRecord && (
                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Xóa bản ghi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
