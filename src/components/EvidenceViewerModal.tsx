import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Film,
  Download,
  CheckCircle2,
  Copy,
  Check,
  Building,
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { UploadedFileEvidence } from '../types';

export interface EvidenceModalData {
  title?: string;
  evidence: string;
  competitor?: string;
  topic?: string;
  date?: string;
  files?: UploadedFileEvidence[];
}

interface EvidenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvidenceModalData | null;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !data) return null;

  const { title, evidence, competitor, topic, date, files } = data;

  // Trích xuất các liên kết URL nếu có trong chuỗi bằng chứng
  const urlRegex = /(https?:\/\/[^\s),]+)/g;
  const urls = evidence.match(urlRegex) || [];

  // Trích xuất các tên tệp đính kèm (vd: .pdf, .jpg, .png, .mp4, .doc, v.v.)
  const fileMatches = evidence.match(/([a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]+\.(pdf|jpg|jpeg|png|mp4|docx?|xlsx?))/gi) || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(evidence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDossier = () => {
    const textContent = `=====================================================
VIETCOMBANK - HỒ SƠ BẰNG CHỨNG XÁC THỰC THỊ TRƯỜNG
Lưu hành nội bộ - Khối Bán Lẻ Vietcombank
=====================================================
Ngày trích xuất: ${new Date().toLocaleString('vi-VN')}
Tiêu đề tin tức: ${title || 'Bản ghi tình báo thị trường'}
Ngân hàng đối thủ: ${competitor || 'Không xác định'}
Chuyên đề bán lẻ: ${topic || 'Bán lẻ tổng hợp'}
Thời điểm ghi nhận: ${date || new Date().toLocaleDateString('vi-VN')}
Trạng thái: ĐÃ XÁC THỰC NGUỒN TIN NỘI BỘ VCB

NỘI DUNG BẰNG CHỨNG XÁC THỰC:
${evidence}

DANH MỤC TỆP ĐÍNH KÈM / LIÊN KẾT NGUỒN:
${urls.length > 0 ? urls.map((u, i) => `[Link ${i + 1}] ${u}`).join('\n') : 'Không có liên kết ngoài'}
${fileMatches.length > 0 ? fileMatches.map((f, i) => `[Tệp ${i + 1}] ${f} (Lưu trữ máy chủ VCB)`).join('\n') : ''}
${files && files.length > 0 ? files.map(f => `[Tệp người dùng tải lên] ${f.name} (${f.size} bytes)`).join('\n') : ''}

Ghi chú kiểm tra:
Nguồn bằng chứng được thu thập trực tiếp từ tài liệu thực địa, khảo sát thị trường và các nguồn báo chí chính thống. Không sử dụng dữ liệu từ website nội bộ vietcombank.com.vn để làm bằng chứng về đối thủ.
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bang-Chung-VCB-${(competitor || 'DoiThu').replace(/\s+/g, '_')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-700/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800/80 border border-emerald-500/30 text-emerald-300">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Chứng từ xác thực
                </span>
                <span className="text-xs text-emerald-200/80">• Khối Bán lẻ VCB</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Chi Tiết Bằng Chứng & Tài Liệu Đính Kèm
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Metadata Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            {title && (
              <div className="font-bold text-slate-900 text-sm leading-snug">
                {title}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 text-slate-600 pt-1 border-t border-slate-200/60">
              {competitor && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đối thủ: <strong className="text-slate-900">{competitor}</strong></span>
                </div>
              )}
              {topic && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Chuyên đề: <strong className="text-slate-900">{topic}</strong></span>
                </div>
              )}
              {date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Thời gian: <strong className="text-slate-900">{date}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Evidence Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Nội dung bằng chứng / Nguồn tài liệu đã xác thực:</span>
              </label>
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs sm:text-sm text-slate-900 font-medium leading-relaxed select-all">
              {evidence}
            </div>
          </div>

          {/* Phân tách và hiển thị Link Web (nếu có) */}
          {urls.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                <span>Đường dẫn báo chí / Website ngoài (Bấm để xem trực tiếp):</span>
              </label>
              <div className="space-y-2">
                {urls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200 text-blue-900 transition flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs truncate text-blue-950 group-hover:underline">
                          {url}
                        </div>
                        <div className="text-[11px] text-blue-700">
                          Bấm để mở nguồn tin trong tab mới (VnEconomy, CafeF, VietnamNet...)
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-700 text-white text-xs font-bold shrink-0 shadow-xs flex items-center gap-1">
                      <span>Mở xem</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Phân tách và hiển thị Tệp đính kèm thực tế / hồ sơ khảo sát */}
          {(fileMatches.length > 0 || (files && files.length > 0)) && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tài liệu đính kèm & Ảnh chụp thực địa:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* User uploaded files */}
                {files && files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        {file.type?.includes('image') ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs truncate text-slate-800">{file.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB • Tải lên lúc {file.uploadedAt}
                        </div>
                      </div>
                    </div>

                    {file.previewUrl && (
                      <a
                        href={file.previewUrl}
                        download={file.name}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-emerald-800 shrink-0 cursor-pointer"
                      >
                        Tải
                      </a>
                    )}
                  </div>
                ))}

                {/* Extracted file citations from field records */}
                {fileMatches.map((fname, idx) => {
                  const isImage = /\.(jpg|jpeg|png)$/i.test(fname);
                  const isVideo = /\.(mp4|mov)$/i.test(fname);
                  const isPdf = /\.pdf$/i.test(fname);

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isImage
                              ? 'bg-purple-100 text-purple-700'
                              : isVideo
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isImage ? (
                            <ImageIcon className="w-4 h-4" />
                          ) : isVideo ? (
                            <Film className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-xs truncate text-slate-900" title={fname}>
                            {fname}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {isPdf ? 'Văn bản / PDF Scan' : isImage ? 'Hình ảnh khảo sát thực tế' : isVideo ? 'Video tư liệu' : 'Tài liệu nghiệp vụ'} • Hồ sơ lưu trữ VCB
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleDownloadDossier}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shrink-0 cursor-pointer flex items-center gap-1"
                        title="Tải hồ sơ bằng chứng"
                      >
                        <Download className="w-3 h-3 text-slate-500" />
                        <span>Tải</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mô phỏng khung thẩm định nội bộ */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tiêu chuẩn bằng chứng xác thực của Vietcombank:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-900/90">
              Tất cả các tài liệu đính kèm, ảnh chụp quầy giao dịch đối thủ, tờ rơi biểu phí, hợp đồng liên kết và đường dẫn báo chí đều được đối chiếu trực tiếp từ mạng lưới cán bộ địa bàn hoặc kênh truyền thông độc lập; đảm bảo tính khách quan và tuyệt đối không dùng nguồn nội bộ VCB để chứng minh thông tin đối thủ.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDossier}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải hồ sơ bằng chứng (.txt)</span>
            </button>
            {downloadSuccess && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã tải về máy!</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
