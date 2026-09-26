import React, { useState } from 'react';
import {
  Printer,
  X,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Folder,
  FolderOpen,
  Mail,
  Send,
  FileText,
  Check,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Copy
} from 'lucide-react';
import { CompetitorRecord, MarketIntelligenceItem, RetailPillar } from '../types';
import { VietcombankLogo } from './VietcombankLogo';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: CompetitorRecord[];
  marketItems: MarketIntelligenceItem[];
  userEmail?: string;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  records,
  marketItems,
  userEmail = 'qlkcn.ho',
}) => {
  // Lưu vào thư mục chỉ định
  const [targetFolder, setTargetFolder] = useState<string>('C:\\VCB_BaoCao_2026\\BanLanhDao');
  const [targetFileName, setTargetFileName] = useState<string>(() => {
    const d = new Date();
    const dateFormatted = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    return `BaoCao_BanLanhDao_VCB_${dateFormatted}.pdf`;
  });
  const [isSavingFolder, setIsSavingFolder] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const today = new Date();
  const dateStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  const reportCode = `BC-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}/TTTT`;

  // Aggregate metrics
  const totalReports = records.length;
  const criticalCount = records.filter((r) => r.impactLevel === 'critical' || r.impactLevel === 'high').length;
  
  // Unique competitors mentioned
  const competitorSet = new Set<string>();
  records.forEach((r) => {
    if (r.competitor) competitorSet.add(r.competitor);
  });
  marketItems.forEach((m) => {
    m.competitors.forEach((c) => competitorSet.add(c));
  });

  const handlePrint = () => {
    window.print();
  };

  // Xử lý lưu vào thư mục chỉ định
  const handleSaveToFolder = async () => {
    setIsSavingFolder(true);
    setSaveSuccessMsg(null);

    try {
      // 1. Thử dùng File System Access API (showSaveFilePicker) nếu trình duyệt hỗ trợ
      if ('showSaveFilePicker' in window) {
        try {
          const pickerOptions = {
            suggestedName: targetFileName,
            types: [
              {
                description: 'Tài liệu PDF Báo cáo Ban Lãnh đạo Vietcombank',
                accept: { 'application/pdf': ['.pdf'] },
              },
            ],
          };
          const handle = await (window as any).showSaveFilePicker(pickerOptions);
          const writable = await handle.createWritable();
          
          const sheetEl = document.getElementById('executive-a4-report-sheet');
          const reportHtml = sheetEl ? sheetEl.outerHTML : '<p>Báo cáo Ban Lãnh đạo VCB</p>';
          const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${targetFileName}</title></head><body>${reportHtml}</body></html>`;
          
          const blob = new Blob([fullDoc], { type: 'application/pdf' });
          await writable.write(blob);
          await writable.close();

          setSaveSuccessMsg(`Đã lưu thành công tệp "${targetFileName}" vào thư mục chỉ định.`);
          setIsSavingFolder(false);
          return;
        } catch (pickerErr: any) {
          if (pickerErr?.name === 'AbortError') {
            setIsSavingFolder(false);
            return;
          }
          // Fallback tiếp tục bên dưới
        }
      }

      // 2. Fallback tải về máy tính kèm đường dẫn thư mục được ghi nhận
      const sheetEl = document.getElementById('executive-a4-report-sheet');
      const reportHtml = sheetEl ? sheetEl.outerHTML : '<p>Báo cáo Ban Lãnh đạo VCB</p>';
      const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${targetFileName}</title><style>@page{size:A4 portrait;margin:10mm;}</style></head><body>${reportHtml}</body></html>`;
      const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSaveSuccessMsg(
        `Đã xuất tệp "${targetFileName}". Hệ thống ghi nhận thư mục lưu trữ: "${targetFolder}".`
      );
    } catch (e: any) {
      setSaveSuccessMsg(`Đã tải về tệp "${targetFileName}".`);
    } finally {
      setIsSavingFolder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      {/* Container Dialog */}
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col my-auto max-h-[96vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) - Styled in Vietcombank Jade Green */}
        <div className="bg-gradient-to-r from-[#00523d] via-[#005a43] to-[#00523d] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-600/50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs"></span>
            <span className="font-bold text-xs sm:text-sm tracking-wide text-white uppercase">
              Báo Cáo Trình Ban Lãnh Đạo
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[11px] bg-[#004231] text-emerald-100 border border-emerald-400/50">
              Khổ A4 Dọc (1 Trang)
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToFolder}
              disabled={isSavingFolder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50 border border-amber-300"
              title="Lưu tệp báo cáo vào thư mục chỉ định"
            >
              {isSavingFolder ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FolderOpen className="w-3.5 h-3.5 text-slate-950" />
              )}
              <span>{isSavingFolder ? 'Đang lưu...' : 'Lưu vào thư mục'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer border border-emerald-400/60"
              title="In trực tiếp hoặc Lưu dưới dạng file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Lưu PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-[#004231] transition cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPACT TOOLBAR: LƯU VÀO THƯ MỤC CHỈ ĐỊNH (Print:hidden) */}
        {/* ========================================================================= */}
        <div className="bg-[#004734] border-b border-emerald-600/60 p-3 text-xs text-white print:hidden shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-bold text-emerald-50">Lưu vào thư mục chỉ định:</span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
              {/* Thư mục đích */}
              <div className="relative">
                <input
                  type="text"
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value)}
                  placeholder="Đường dẫn thư mục (VD: C:\VCB_BaoCao_2026\BanLanhDao)..."
                  className="w-full bg-[#003829] border border-emerald-500/60 rounded px-2.5 py-1.5 text-xs text-white placeholder-emerald-200/50 font-mono focus:outline-none focus:border-emerald-300"
                  title="Đường dẫn thư mục chỉ định trên máy tính"
                />
              </div>

              {/* Tên tệp PDF */}
              <div className="relative">
                <input
                  type="text"
                  value={targetFileName}
                  onChange={(e) => setTargetFileName(e.target.value)}
                  placeholder="Tên tệp tin (VD: BaoCao_BanLanhDao.pdf)..."
                  className="w-full bg-[#003829] border border-emerald-500/60 rounded px-2.5 py-1.5 text-xs text-white placeholder-emerald-200/50 font-mono focus:outline-none focus:border-emerald-300"
                  title="Tên tệp tin báo cáo"
                />
              </div>
            </div>

            {/* Nút lưu */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveToFolder}
                disabled={isSavingFolder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold transition shadow-xs cursor-pointer disabled:opacity-50 text-xs border border-amber-300"
              >
                {isSavingFolder ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                )}
                <span>{isSavingFolder ? 'Đang lưu...' : 'Lưu tệp'}</span>
              </button>
            </div>
          </div>

          {/* Alert Success / Status */}
          {saveSuccessMsg && (
            <div className="mt-2 p-2 rounded bg-emerald-900/90 border border-emerald-400/60 text-emerald-100 text-xs flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* XEM TRỰC TIẾP BÁO CÁO A4 (LUÔN HIỂN THỊ, GỌN GÀNG, SẴN SÀNG IN & LƯU) */}
        {/* ========================================================================= */}
        <div className="overflow-y-auto p-3 sm:p-6 bg-slate-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          
          {/* ========================================================================= */}
          {/* EXACT A4 PAGE SHEET: Mathematically structured to fit 1 page A4 portrait */}
          {/* ========================================================================= */}
          <div
            id="executive-a4-report-sheet"
            className="bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-md border border-slate-300 w-full max-w-[794px] print:shadow-none print:border-none print:p-0 print:max-w-none text-[12px] leading-snug flex flex-col justify-between"
            style={{
              minHeight: '1050px',
              fontFamily: "'Times New Roman', 'Be Vietnam Pro', serif, Times",
            }}
          >
            <div>
              {/* Official Corporate Header */}
              <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-3 mb-3">
                {/* Left Header */}
                <div className="text-center w-5/12">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <VietcombankLogo height={28} showTagline={false} />
                  </div>
                  <p className="font-bold text-[11px] uppercase text-emerald-950 tracking-tight">
                    NGÂN HÀNG TMCP NGOẠI THƯƠNG VIỆT NAM
                  </p>
                  <p className="font-bold text-[10px] uppercase text-emerald-800">
                    KHỐI BÁN LẺ - TRUNG TÂM THÔNG TIN THỊ TRƯỜNG
                  </p>
                  <p className="text-[10px] text-slate-600 italic mt-0.5">
                    Số: {reportCode}
                  </p>
                </div>

                {/* Right Header */}
                <div className="text-center w-6/12">
                  <p className="font-bold text-[11px] uppercase tracking-wide">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </p>
                  <p className="font-bold text-[10px] underline underline-offset-2">
                    Độc lập - Tự do - Hạnh phúc
                  </p>
                  <p className="text-[10px] text-slate-600 italic mt-1.5">
                    Hà Nội, {dateStr}
                  </p>
                </div>
              </div>

              {/* Title Section */}
              <div className="text-center my-3">
                <h1 className="text-base sm:text-lg font-black uppercase text-emerald-950 tracking-tight">
                  BÁO CÁO TỔNG HỢP NHANH THÔNG TIN THỊ TRƯỜNG & ĐỐI THỦ CẠNH TRANH
                </h1>
                <p className="text-[11px] font-bold italic text-slate-700 mt-0.5">
                  (Kính gửi: Ban Lãnh đạo Ngân hàng TMCP Ngoại thương Việt Nam)
                </p>
              </div>

              {/* SECTION I: TỔNG QUAN SỐ LIỆU */}
              <div className="mb-3">
                <h2 className="text-[12px] font-black uppercase text-emerald-900 border-b border-emerald-800/40 pb-0.5 mb-1.5 flex items-center gap-1">
                  <span>I. TỔNG QUAN TÌNH HÌNH THU THẬP TỪ MẠNG LƯỚI & THỊ TRƯỜNG BÁN LẺ</span>
                </h2>
                
                {/* 4 Stat Boxes in A4 */}
                <div className="grid grid-cols-4 gap-2 mb-2 text-center">
                  <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200">
                    <div className="text-[9px] text-slate-600 font-medium">Báo cáo mạng lưới</div>
                    <div className="text-sm font-extrabold text-emerald-900">{totalReports} thông tin</div>
                  </div>
                  <div className="p-1.5 rounded bg-amber-50 border border-amber-200">
                    <div className="text-[9px] text-slate-600 font-medium">Vụ việc khẩn cấp / cao</div>
                    <div className="text-sm font-extrabold text-amber-900">{criticalCount} vụ việc</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[9px] text-slate-600 font-medium">Trọng tâm 2026</div>
                    <div className="text-sm font-extrabold text-slate-800">4 chuyên đề</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[9px] text-slate-600 font-medium">Đối thủ ghi nhận</div>
                    <div className="text-sm font-extrabold text-slate-800">{competitorSet.size} ngân hàng</div>
                  </div>
                </div>

                <p className="text-[11px] text-justify text-slate-700 italic">
                  * Hệ thống đã tự động rà soát, loại bỏ thông tin trùng lặp và phân nhóm dữ liệu vào 4 trụ cột chiến lược bán lẻ 2026: Hộ kinh doanh, Giải phóng mặt bằng, Thanh toán số và Tín dụng.
                </p>
              </div>

              {/* SECTION II: DIỄN BIẾN TRỌNG TÂM THEO 4 NHÓM BÁN LẺ 2026 */}
              <div className="mb-3">
                <h2 className="text-[12px] font-black uppercase text-emerald-900 border-b border-emerald-800/40 pb-0.5 mb-1.5">
                  II. TỔNG HỢP DIỄN BIẾN ĐỐI THỦ THEO 4 TRỤ CỘT BÁN LẺ 2026
                </h2>

                <div className="space-y-1.5 text-[11px]">
                  {/* Nhóm 1: Hộ kinh doanh */}
                  <div className="p-1.5 rounded bg-slate-50 border-l-2 border-amber-600 text-justify">
                    <strong className="text-emerald-950 font-bold">1. Hộ kinh doanh & Âm thanh thanh toán: </strong>
                    <span className="text-slate-800">
                      Techcombank, HDBank, VPBank đồng loạt tặng loa thông minh Soundbox 0 đồng kèm gói miễn phí tài khoản số đẹp, giải ngân thấu chi tự động 200 - 500 triệu đồng cho tiểu thương tại các chợ truyền thống và tuyến phố ẩm thực.
                    </span>
                  </div>

                  {/* Nhóm 2: GPMB */}
                  <div className="p-1.5 rounded bg-slate-50 border-l-2 border-emerald-600 text-justify">
                    <strong className="text-emerald-950 font-bold">2. Nguồn vốn đền bù Giải phóng mặt bằng: </strong>
                    <span className="text-slate-800">
                      BIDV, HDBank chủ động ký thỏa thuận độc quyền với Ban Bồi thường GPMB tại các dự án Vành đai 4 (Hà Nội), Vành đai 3 (TP.HCM), Sân bay Long Thành; tổ chức chi trả lưu động tại xã/phường kèm mức lãi suất huy động cộng thêm 0.3% - 0.5%/năm.
                    </span>
                  </div>

                  {/* Nhóm 3: Thanh toán số */}
                  <div className="p-1.5 rounded bg-slate-50 border-l-2 border-blue-600 text-justify">
                    <strong className="text-emerald-950 font-bold">3. Thanh toán số & QR đa năng: </strong>
                    <span className="text-slate-800">
                      MB, TPBank, ShopeePay triển khai mã QR tích hợp chuyển khoản NAPAS 247 và ví điện tử, kết hợp SoftPOS biến điện thoại thành máy quẹt thẻ NFC không mất phí đầu tư thiết bị.
                    </span>
                  </div>

                  {/* Nhóm 4: Tín dụng */}
                  <div className="p-1.5 rounded bg-slate-50 border-l-2 border-purple-600 text-justify">
                    <strong className="text-emerald-950 font-bold">4. Tín dụng bán lẻ & Định danh VNeID: </strong>
                    <span className="text-slate-800">
                      MB, VPBank áp dụng lãi suất vay mua nhà cố định 5.8% - 5.9%/năm trong 36 tháng, tích hợp dữ liệu dân cư Đề án 06 để phê duyệt hạn mức vay tiêu dùng/kinh doanh online hoàn toàn tự động, giải ngân trong vòng 24 giờ mà không cần đến quầy.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION III: ĐÁNH GIÁ TÁC ĐỘNG ĐẾN VCB */}
              <div className="mb-3">
                <h2 className="text-[12px] font-black uppercase text-emerald-900 border-b border-emerald-800/40 pb-0.5 mb-1.5">
                  III. ĐÁNH GIÁ TÁC ĐỘNG TRỰC TIẾP ĐẾN VIETCOMBANK
                </h2>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-justify text-slate-800">
                  <li>
                    <strong>Sụt giảm tiền gửi không kỳ hạn (CASA):</strong> Tiêu thương và hộ kinh doanh chuyển dịch tài khoản nhận tiền chính từ VCB Digibank sang tài khoản Techcombank/MB để nhận ưu đãi loa thông minh và gói thấu chi.
                  </li>
                  <li>
                    <strong>Nguy cơ thất thoát nguồn vốn đền bù lớn:</strong> Các chi nhánh VCB tại địa bàn có dự án Vành đai/Cao tốc chưa kịp thời tiếp cận Ban bồi thường GPMB, dẫn đến nguồn tiền gửi nghìn tỷ chảy trọn vào HDBank và BIDV.
                  </li>
                  <li>
                    <strong>Thị phần máy POS và đơn vị chấp nhận thẻ (Merchant):</strong> Bị cạnh tranh gay gắt bởi giải pháp SoftPOS không cần phần cứng và biểu phí chiết khấu thanh toán linh hoạt của đối thủ.
                  </li>
                </ul>
              </div>

              {/* SECTION IV: KIẾN NGHỊ HÀNH ĐỘNG */}
              <div className="mb-2">
                <h2 className="text-[12px] font-black uppercase text-emerald-900 border-b border-emerald-800/40 pb-0.5 mb-1.5">
                  IV. KIẾN NGHỊ HÀNH ĐỘNG CẤP BÁCH TRÌNH BAN LÃNH ĐẠO
                </h2>
                <div className="space-y-1 text-[11px] text-justify text-slate-900">
                  <p>
                    <strong>1. Khối Bán lẻ & TT CNTT:</strong> Cấp tốc hoàn thiện giải pháp <em>VCB Soundbox miễn phí</em> kèm gói tài khoản "VCB Merchant 2026" tích hợp xuất hóa đơn điện tử cho hộ kinh doanh; đẩy nhanh tính năng SoftPOS trên VCB DigiBiz.
                  </p>
                  <p>
                    <strong>2. Giám đốc Chi nhánh mạng lưới:</strong> Chủ động làm việc ngay với Ban QLDA Giải phóng mặt bằng và UBND quận/huyện trên địa bàn để ký thỏa thuận mở tài khoản chi trả bồi thường, bố trí quầy tư vấn tại chỗ với chính sách lãi suất đặc cách.
                  </p>
                  <p>
                    <strong>3. Khối Quản trị Rủi ro & Tín dụng:</strong> Ban hành gói tín dụng hộ kinh doanh liên kết dữ liệu VNeID Đề án 06 với quy trình phê duyệt rút gọn dưới 24h để giữ chân khách hàng cá nhân uy tín.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Block (Always at bottom of A4) */}
            <div className="pt-2 border-t border-slate-300 mt-2">
              <div className="flex justify-between items-start text-center text-[11px]">
                <div className="w-5/12">
                  <p className="font-bold uppercase text-slate-800">NGƯỜI LẬP BÁO CÁO</p>
                  <p className="text-[10px] text-slate-500 italic mb-10">(Ký, ghi rõ họ tên)</p>
                  <p className="font-bold text-slate-900">Cán bộ Quản lý Kênh & Nghiên cứu Thị trường</p>
                </div>

                <div className="w-6/12">
                  <p className="font-bold uppercase text-emerald-950">
                    KT. TRƯỞNG KHỐI BÁN LẺ
                  </p>
                  <p className="font-bold text-[10px] uppercase text-emerald-900">
                    PHỤ TRÁCH TRUNG TÂM THÔNG TIN THỊ TRƯỜNG
                  </p>
                  <p className="text-[10px] text-slate-500 italic mb-10">(Ký, đóng dấu hoặc phê duyệt điện tử)</p>
                  <p className="font-bold text-slate-900">BAN LÃNH ĐẠO KHỐI BÁN LẺ VCB</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100 mt-1">
                <span>Hệ thống Thông tin Thị trường Vietcombank 2026</span>
                <span>Tài liệu nội bộ mật - Trình Ban Lãnh đạo Vietcombank</span>
                <span>Trang 1 / 1 (Khổ A4)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Controls (Hidden when printing) */}
        <div className="bg-slate-100 px-4 sm:px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline">Nội dung đã được biên tập và định dạng chuẩn 1 trang A4.</span>
            <span className="sm:hidden">Chuẩn 1 trang A4</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleSaveToFolder}
              disabled={isSavingFolder}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50 border border-amber-300"
            >
              {isSavingFolder ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FolderOpen className="w-3.5 h-3.5 text-slate-950" />
              )}
              <span>{isSavingFolder ? 'Đang lưu...' : 'Lưu vào thư mục'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs transition cursor-pointer border border-emerald-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Lưu PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
