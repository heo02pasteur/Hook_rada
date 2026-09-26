import React from 'react';
import { ExternalLink, FileText, Image as ImageIcon, Clock, Eye } from 'lucide-react';
import { EvidenceModalData } from './EvidenceViewerModal';
import { UploadedFileEvidence } from '../types';

interface EvidenceBadgeProps {
  evidence: string;
  onViewDetails: (data: EvidenceModalData) => void;
  title?: string;
  competitor?: string;
  topic?: string;
  date?: string;
  files?: UploadedFileEvidence[];
  theme?: 'emerald' | 'cyan';
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  evidence,
  onViewDetails,
  title,
  competitor,
  topic,
  date,
  files,
  theme = 'emerald',
}) => {
  const isPending = !evidence || evidence.trim() === 'Thông tin CHỜ thu thập';

  if (isPending) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 font-semibold w-fit">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Thông tin CHỜ thu thập (Mạng lưới đang khảo sát)</span>
      </div>
    );
  }

  // Check for URLs
  const urlMatch = evidence.match(/https?:\/\/[^\s),]+/);
  const detectedUrl = urlMatch ? urlMatch[0] : null;

  const isImage = /\.(jpg|jpeg|png)/i.test(evidence);
  const isPdf = /\.pdf/i.test(evidence);

  const handleClickDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails({
      title,
      evidence,
      competitor,
      topic,
      date,
      files,
    });
  };

  const bgBorder =
    theme === 'emerald'
      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70 hover:border-emerald-300'
      : 'bg-cyan-50/70 border-cyan-200 text-cyan-950 hover:bg-cyan-100/70 hover:border-cyan-300';

  const accentColor = theme === 'emerald' ? 'text-emerald-700' : 'text-cyan-700';

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {/* Clickable Evidence Box that triggers Viewer Modal */}
      <button
        type="button"
        onClick={handleClickDetails}
        className={`flex-1 min-w-[200px] text-left p-2 rounded-lg border transition cursor-pointer flex items-center justify-between gap-2 shadow-2xs group ${bgBorder}`}
        title="Bấm để xem chi tiết bằng chứng và tài liệu đính kèm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`p-1 rounded bg-white shrink-0 shadow-2xs ${accentColor}`}>
            {isImage ? (
              <ImageIcon className="w-3.5 h-3.5" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-[11px] font-semibold truncate group-hover:underline">
            {evidence}
          </span>
        </div>

        <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition">
          <Eye className="w-3 h-3" />
          <span>Xem tài liệu</span>
        </span>
      </button>

      {/* Direct external URL button if web link is detected */}
      {detectedUrl && (
        <a
          href={detectedUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="px-2.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer shadow-2xs hover:underline"
          title={`Mở trực tiếp liên kết ngoài: ${detectedUrl}`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span>Mở nguồn tin ↗</span>
        </a>
      )}
    </div>
  );
};
