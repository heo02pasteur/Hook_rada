import React from 'react';
import {
  X,
  Mail,
  Building2,
  FileText,
  AlertTriangle,
  Paperclip,
  CheckCircle2,
  Send,
  Save,
  Printer,
  Calendar,
  ShieldAlert,
  Tag,
  Webhook,
  Loader2
} from 'lucide-react';
import { RetailPillar, ImpactSeverity, UploadedFileEvidence } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';
import { getMakeWebhookUrl } from '../services/webhookService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitUpdate: () => void;
  onSaveDraft: () => void;
  data: {
    id?: string;
    submitterEmail: string;
    competitor: string;
    content: string;
    impactOnVcb: string;
    evidenceFiles: UploadedFileEvidence[];
    pillarCategory: RetailPillar;
    impactLevel: ImpactSeverity;
  };
  isEditingExisting: boolean;
  isSubmittingWebhook?: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitUpdate,
  onSaveDraft,
  data,
  isEditingExisting,
  isSubmittingWebhook = false,
}) => {
  if (!isOpen) return null;

  const pillarInfo = PILLAR_LABELS[data.pillarCategory || 'khac'];

  const getSeverityBadge = (level: ImpactSeverity) => {
    switch (level) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            Khẩn cấp / Tác động trực tiếp
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Đáng chú ý (Cao)
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            Mức độ trung bình
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
            Mức độ thấp / Theo dõi
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-700/80 border border-emerald-500/40">
              <FileText className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                XEM LẠI PHIẾU THU THẬP THÔNG TIN ĐỐI THỦ
              </h3>
              <p className="text-xs text-emerald-300">
                Kiểm tra thông tin 5 tiêu chí trước khi cập nhật vào cơ sở dữ liệu VCB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Preview Sheet */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          {/* Top Banner with Submitter info and date */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Mail người nhập báo cáo
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>{data.submitterEmail || <span className="text-rose-500 italic font-normal">Chưa nhập email</span>}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Thời điểm: {new Date().toLocaleString('vi-VN')}</span>
            </div>
          </div>

          {/* Competitor & Category block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                2. Từ đối thủ nào
              </div>
              <div className="flex items-center gap-2 text-base font-bold text-emerald-900">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>{data.competitor || <span className="text-rose-500 italic font-normal text-sm">Chưa nhập tên đối thủ</span>}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chuyên đề trọng tâm 2026
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${pillarInfo.badgeColor}`}>
                  {pillarInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Ô 3: Thông tin cần nhập */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              3. Thông tin chi tiết thu thập
            </div>
            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200">
              {data.content || <span className="text-rose-500 italic">Chưa nhập nội dung thông tin</span>}
            </div>
          </div>

          {/* Ô 4: Tác động gì đến VCB */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                4. Đánh giá tác động đến Vietcombank
              </div>
              {getSeverityBadge(data.impactLevel)}
            </div>
            <div className="text-sm text-slate-900 font-medium leading-relaxed bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
              {data.impactOnVcb || <span className="text-rose-500 italic">Chưa nhập phân tích tác động tới VCB</span>}
            </div>
          </div>

          {/* Ô 5: Bằng chứng upload */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>5. Bằng chứng đính kèm ({data.evidenceFiles.length} tệp)</span>
            </div>
            {data.evidenceFiles.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có tài liệu hoặc hình ảnh bằng chứng đính kèm.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    {file.previewUrl ? (
                      <img
                        src={file.previewUrl}
                        alt="preview"
                        className="w-10 h-10 rounded object-cover border border-slate-300 shrink-0"
                      />
                    ) : (
                      <Paperclip className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {file.uploadedAt} • {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 space-y-3">
          {/* Webhook notification banner */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
            <div className="flex items-center gap-1.5 truncate">
              <Webhook className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">
                Dữ liệu sẽ được tự động đồng bộ sang Webhook <strong>Make.com</strong>:
              </span>
              <code className="bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-800 truncate max-w-[200px] sm:max-w-[280px]">
                {getMakeWebhookUrl()}
              </code>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase shrink-0">
              Auto POST
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isSubmittingWebhook}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In / Xuất PDF</span>
            </button>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  onSaveDraft();
                  onClose();
                }}
                disabled={isSubmittingWebhook}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Lưu tạm bản nháp</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await onSubmitUpdate();
                  onClose();
                }}
                disabled={isSubmittingWebhook}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white shadow transition cursor-pointer border border-emerald-800"
              >
                {isSubmittingWebhook ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Đang gửi Make.com...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isEditingExisting ? 'Lưu cập nhật' : 'Xác nhận & Cập nhật'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
