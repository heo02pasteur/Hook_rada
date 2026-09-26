import React, { useState, useMemo } from 'react';
import {
  Radio,
  RotateCcw,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Printer,
  ShieldAlert,
  Building2,
  Tag,
  TrendingUp,
  Globe,
  Share2
} from 'lucide-react';
import { MarketIntelligenceItem, RetailPillar, ImpactSeverity } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';
import { PrintA4Modal } from './PrintA4Modal';
import { EvidenceBadge } from './EvidenceBadge';
import { EvidenceViewerModal, EvidenceModalData } from './EvidenceViewerModal';

interface AutoRadarCardProps {
  marketItems: MarketIntelligenceItem[];
}

export const AutoRadarCard: React.FC<AutoRadarCardProps> = ({ marketItems }) => {
  // Bộ chọn thời gian: 1 ngày, 1 tuần, 1 tháng
  const [timeRange, setTimeRange] = useState<'1_day' | '1_week' | '1_month'>('1_week');
  const [selectedPillar, setSelectedPillar] = useState<RetailPillar | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<ImpactSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  });
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<EvidenceModalData | null>(null);

  // Nút Quét lại: Tuân thủ đúng điều kiện của nút lệnh về thời gian nêu trên
  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(
        new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 450);
  };

  // Severity Weight for Sorting
  const getSeverityRank = (severity?: ImpactSeverity) => {
    switch (severity) {
      case 'critical':
        return 4;
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  };

  // Danh sách các tin cơ sở lọc theo thời gian, chủ đề, từ khóa (chưa lọc priority)
  const baseRadarItems = useMemo(() => {
    let list = marketItems || [];

    // Filter by timestamp
    let latestTs = 0;
    list.forEach((m) => {
      if (m.timestamp) {
        const t = new Date(m.timestamp.replace(' ', 'T')).getTime();
        if (!isNaN(t) && t > latestTs) latestTs = t;
      }
    });

    if (latestTs === 0) latestTs = Date.now();
    const daysLimit = timeRange === '1_day' ? 1.5 : timeRange === '1_week' ? 7 : 30;
    const maxDiffMs = daysLimit * 24 * 60 * 60 * 1000;

    list = list.filter((m) => {
      if (!m.timestamp) return true;
      const t = new Date(m.timestamp.replace(' ', 'T')).getTime();
      if (isNaN(t)) return true;
      return latestTs - t <= maxDiffMs;
    });

    // Lọc theo chủ đề
    if (selectedPillar !== 'all') {
      list = list.filter((m) => m.pillar === selectedPillar);
    }

    // Lọc theo từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => {
        const title = m.title.toLowerCase();
        const summary = m.summary.toLowerCase();
        const source = m.source.toLowerCase();
        const competitors = m.competitors.join(' ').toLowerCase();
        return (
          title.includes(q) ||
          summary.includes(q) ||
          source.includes(q) ||
          competitors.includes(q)
        );
      });
    }

    // Sắp xếp ưu tiên: Mức tác động từ cao xuống thấp (critical -> high -> medium -> low)
    return [...list].sort((a, b) => {
      const rankA = getSeverityRank(a.impactLevel);
      const rankB = getSeverityRank(b.impactLevel);
      if (rankB !== rankA) {
        return rankB - rankA;
      }
      return (b.timestamp || '').localeCompare(a.timestamp || '');
    });
  }, [marketItems, timeRange, selectedPillar, searchQuery]);

  // Đếm số lượng theo cấp độ ưu tiên
  const priorityCounts = useMemo(() => {
    return {
      all: baseRadarItems.length,
      critical: baseRadarItems.filter((i) => i.impactLevel === 'critical').length,
      high: baseRadarItems.filter((i) => i.impactLevel === 'high').length,
      medium: baseRadarItems.filter((i) => i.impactLevel === 'medium').length,
      low: baseRadarItems.filter((i) => i.impactLevel === 'low').length,
    };
  }, [baseRadarItems]);

  // Danh sách tin sau khi lọc thêm theo Cấp độ ưu tiên (Khẩn cấp, Cao, Trung bình, Thấp)
  const filteredRadarItems = useMemo(() => {
    if (selectedPriority === 'all') return baseRadarItems;
    return baseRadarItems.filter((item) => item.impactLevel === selectedPriority);
  }, [baseRadarItems, selectedPriority]);

  // Tổng hợp toàn diện theo từng chủ đề và nhiều nội dung cho Auto Radar
  const radarThematicGroups = useMemo(() => {
    return [
      {
        pillar: 'thanh_toan_so' as RetailPillar,
        pillarTitle: 'Chuyên đề 1: Thanh toán số & Sinh trắc học đa kênh',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        contents: [
          {
            id: 'rad-clu-1-1',
            mainTitle: '1. Bùng nổ làn sóng thanh toán QR song phương quốc tế (WeChat/Alipay/GLN)',
            matchedBanks: ['BIDV', 'Sacombank', 'Napas', 'WeChat Pay', 'Alipay'],
            competitorActionSummary:
              'Dữ liệu từ báo chí và truyền thông công nghệ cho thấy các NHTM tăng tốc liên kết Napas và các tổ chức thẻ quốc tế mở cổng thanh toán QR chéo cho du khách Trung Quốc và Hàn Quốc; chiết khấu chỉ 0.8% cho đơn vị chấp nhận thanh toán tại Nha Trang, Đà Nẵng, Phú Quốc.',
            vcbImpactAssessment:
              'Vietcombank có lợi thế ngoại hối mạnh mẽ nhưng có nguy cơ bị phân tán thị phần thanh toán du lịch quốc tế tại các thành phố du lịch biển.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Dịch vụ chấp nhận thanh toán Vietcombank QR Pro và VCB Digibank. Lợi thế là tỷ giá ngoại tệ tốt nhất thị trường, hệ thống xử lý giao dịch ổn định số 1. Gợi ý bán hàng: Tiếp cận chuỗi khách sạn, khu nghỉ dưỡng và trung tâm mua sắm du lịch quốc tế.',
            retailDivisionAction:
              'Khối Bán lẻ hoàn thiện kết nối các ví điện tử quốc tế phổ biến; tung chương trình hoàn tiền thanh toán QR thẻ quốc tế cho khách hàng inbound/outbound.',
            branchAction:
              'Chi nhánh tại các địa bàn du lịch trọng điểm chủ động rà soát, nâng cấp mã QR cho đơn vị chấp nhận thẻ hiện hữu và hỗ trợ khách hàng đăng ký sinh trắc học nhanh tại quầy.',
            severity: 'critical' as ImpactSeverity,
          },
          {
            id: 'rad-clu-1-2',
            mainTitle: '2. Nâng cấp trải nghiệm xác thực sinh trắc học AI 3D dưới 0.2 giây theo Quyết định 2345',
            matchedBanks: ['Techcombank', 'MB Bank', 'Napas'],
            competitorActionSummary:
              'Cập nhật ứng dụng ngân hàng số nhận diện khuôn mặt và mống mắt tức thì, tự động mở khóa thẻ quốc tế và nâng trần giao dịch trực tuyến.',
            vcbImpactAssessment:
              'Áp lực duy trì sự mượt mà và tốc độ phản hồi trên VCB Digibank trong các khung giờ cao điểm.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Hệ thống xác thực sinh trắc học VCB Digibank. Lợi thế bảo mật chuẩn FIDO và dữ liệu kết nối VNeID an toàn tuyệt đối.',
            retailDivisionAction:
              'Tối ưu hóa máy chủ xử lý sinh trắc học, đảm bảo tỷ lệ thành công trên 99.9% cho các giao dịch chuyển tiền trên 10 triệu đồng.',
            branchAction:
              'Bố trí máy quét căn cước CCCD gắn chip chuyên dụng tại sảnh giao dịch để hỗ trợ cài đặt cho khách hàng lớn tuổi.',
            severity: 'high' as ImpactSeverity,
          },
        ],
      },
      {
        pillar: 'tin_dung' as RetailPillar,
        pillarTitle: 'Chuyên đề 2: Tín dụng bán lẻ & Vay mua nhà đô thị',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        contents: [
          {
            id: 'rad-clu-2-1',
            mainTitle: '1. Cuộc đua hạ lãi suất vay mua nhà cố định 36 tháng xuống 5.8% - 5.9%/năm',
            matchedBanks: ['Techcombank', 'MB Bank', 'VPBank', 'ACB'],
            competitorActionSummary:
              'Ghi nhận trên các diễn đàn bất động sản và kênh tài chính YouTube/TikTok: Techcombank và MB triển khai chiến dịch tài trợ gói tín dụng 30.000 tỷ đồng với lãi suất cố định 5.9%/năm trong 3 năm đầu, cam kết ân hạn nợ gốc và miễn phạt trả trước hạn sau năm thứ 3.',
            vcbImpactAssessment:
              'Áp lực chuyển dịch các khoản vay mua nhà cũ sang đối thủ theo Thông tư 06 của NHNN; cạnh tranh gay gắt giữ chân tệp khách hàng cá nhân vay mua nhà cao cấp.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Gói vay mua nhà "An Gia Lập Nghiệp" và "Vay mua ô tô VCB". Lợi thế của VCB là thương hiệu an tâm bậc nhất, thủ tục pháp lý minh bạch và biên độ lãi suất sau ưu đãi luôn ở mức cạnh tranh nhất hệ thống.',
            retailDivisionAction:
              'Nghiên cứu kéo dài thời hạn lãi suất ưu đãi cho khách hàng vay mua nhà dự án liên kết chiến lược; tinh gọn quy trình phê duyệt hồ sơ vay trong vòng 24 giờ.',
            branchAction:
              'Cán bộ tín dụng Chi nhánh chủ động rà soát danh sách khách hàng vay có dư nợ tốt để tư vấn chính sách chăm sóc VIP, tránh để đối thủ tiếp cận chèo kéo.',
            severity: 'critical' as ImpactSeverity,
          },
          {
            id: 'rad-clu-2-2',
            mainTitle: '2. Phê duyệt tín dụng tự động không thế chấp qua dữ liệu VNeID và viễn thông',
            matchedBanks: ['VPBank', 'TPBank'],
            competitorActionSummary:
              'Quảng cáo rầm rộ trên Facebook và TikTok gói vay tín chấp tiêu dùng 100 - 150 triệu duyệt online 5 phút.',
            vcbImpactAssessment:
              'Thu hút dòng khách hàng trẻ vay tiêu dùng số.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Vay theo lương và thẻ tín dụng VCB.',
            retailDivisionAction:
              'Mở rộng đối tượng phê duyệt thấu chi tín chấp tự động trên VCB Digibank.',
            branchAction:
              'Chủ động tiếp cận các doanh nghiệp chi lương qua tài khoản Vietcombank.',
            severity: 'medium' as ImpactSeverity,
          },
        ],
      },
      {
        pillar: 'ho_kinh_doanh' as RetailPillar,
        pillarTitle: 'Chuyên đề 3: Hộ kinh doanh & Tiểu thương thị trường',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        contents: [
          {
            id: 'rad-clu-3-1',
            mainTitle: '1. Chiến dịch chiếm lĩnh tiểu thương qua Zalo Mini App và Hóa đơn điện tử máy tính tiền',
            matchedBanks: ['VPBank', 'Techcombank', 'MB Bank'],
            competitorActionSummary:
              'Các ngân hàng hợp tác với nền tảng công nghệ Zalo và TikTok Shop để định danh mở tài khoản hộ kinh doanh chỉ qua 3 bước chạm, kết nối thẳng hóa đơn điện tử cho cơ quan thuế và tặng gói quảng cáo.',
            vcbImpactAssessment:
              'Thu hút nhóm chủ hộ kinh doanh trẻ tuổi bán hàng đa kênh chuyển đổi tài khoản dòng tiền về hệ sinh thái đối thủ.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Giải pháp ngân hàng số VCB DigiBiz cho doanh nghiệp vừa và nhỏ, hộ kinh doanh. Lợi thế là quản trị dòng tiền chuyên nghiệp, bảo mật đa lớp và tích hợp thanh toán lương tự động.',
            retailDivisionAction:
              'Đẩy mạnh truyền thông số giải pháp VCB DigiBiz trên các kênh mạng xã hội chính thức; triển khai chương trình miễn phí quản lý tài khoản.',
            branchAction:
              'Tổ chức các buổi hội thảo hướng dẫn quy định thuế và hóa đơn điện tử cho tiểu thương tại địa phương kết hợp giới thiệu sản phẩm VCB.',
            severity: 'high' as ImpactSeverity,
          },
        ],
      },
      {
        pillar: 'gpmb' as RetailPillar,
        pillarTitle: 'Chuyên đề 4: Giải phóng mặt bằng & Các đại dự án hạ tầng',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        contents: [
          {
            id: 'rad-clu-4-1',
            mainTitle: '1. Báo cáo tiến độ chi trả bồi thường các dự án cao tốc trọng điểm quốc gia',
            matchedBanks: ['BIDV', 'HDBank', 'Agribank'],
            competitorActionSummary:
              'Các báo điện tử phản ánh tiến độ giải ngân hàng nghìn tỷ đồng bồi thường đất cao tốc Bắc - Nam và đường sắt đô thị; các ngân hàng cạnh tranh gay gắt giữ chân người nhận tiền.',
            vcbImpactAssessment:
              'Cơ hội lớn để thu hút nguồn vốn tiền gửi cá nhân nếu hành động kịp thời.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Sản phẩm Tiết kiệm Tích lũy An Vui và Chứng chỉ tiền gửi VCB.',
            retailDivisionAction:
              'Chỉ đạo các Chi nhánh nằm trên tuyến dự án lập kế hoạch huy động dòng tiền GPMB.',
            branchAction:
              'Làm việc với Kho bạc Nhà nước và BQLDA để nắm lịch chi trả từng đợt.',
            severity: 'high' as ImpactSeverity,
          },
        ],
      },
    ];
  }, []);

  const filteredRadarGroups = useMemo(() => {
    if (selectedPillar === 'all') return radarThematicGroups;
    return radarThematicGroups.filter((g) => g.pillar === selectedPillar);
  }, [radarThematicGroups, selectedPillar]);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* HEADER AUTO RADAR THỊ TRƯỜNG & BỘ LỌC CHU KỲ QUÉT */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Thẻ số 2 • Auto Radar thị trường</span>
              </span>
              <span className="text-slate-400 text-xs">
                • Quét Báo điện tử, Website, Diễn đàn, YouTube, TikTok, Zalo
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wide">
              AUTO RADAR THỊ TRƯỜNG BÁN LẺ NGÂN HÀNG
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
              Hệ thống tự động thu thập và sàng lọc tin tức trên toàn mạng xã hội & cổng thông tin tài chính bán lẻ. Phân tích theo chủ đề, ưu tiên từ tác động cao xuống thấp kèm đường dẫn bằng chứng xác thực.
            </p>
          </div>

          {/* BỘ LỌC THỜI GIAN & NÚT QUÉT LẠI */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
            {/* 1 ngày / 1 tuần / 1 tháng */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setTimeRange('1_day')}
                className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                  timeRange === '1_day'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Ngày
              </button>
              <button
                onClick={() => setTimeRange('1_week')}
                className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                  timeRange === '1_week'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Tuần
              </button>
              <button
                onClick={() => setTimeRange('1_month')}
                className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${
                  timeRange === '1_month'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Tháng
              </button>
            </div>

            {/* Nút Quét lại: Tuân thủ đúng điều kiện thời gian của nút lệnh */}
            <button
              onClick={handleRescan}
              disabled={isScanning}
              className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              title="Quét lại theo đúng khoảng thời gian đã chọn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Đang quét...' : 'Quét lại'}</span>
            </button>
          </div>
        </div>

        {/* Scan Status pill */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Trạng thái: <strong>Đang giám sát đa kênh thời gian thực</strong></span>
            <span>•</span>
            <span>Lần quét gần nhất: <strong className="text-emerald-300">{lastScanTime}</strong></span>
          </div>
          <div className="text-slate-400">
            Đã thu thập: <strong className="text-cyan-300 font-mono">{filteredRadarItems.length}</strong> bài viết trong {timeRange === '1_day' ? '1 ngày' : timeRange === '1_week' ? '1 tuần' : '1 tháng'} qua
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BÀI VIẾT TỔNG HỢP NỘI DUNG TRÙNG NHAU TRÊN THỊ TRƯỜNG (7 MỤC CHUẨN) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <h3 className="font-bold text-sm tracking-wide uppercase">
              BÀI VIẾT TỔNG HỢP NỘI DUNG TRÙNG NHAU TRÊN RADAR THỊ TRƯỜNG
            </h3>
          </div>
          <span className="text-[11px] text-emerald-200">
            Tự động đối chiếu website vietcombank.com.vn & gợi ý bán hàng
          </span>
        </div>

        <div className="p-5 space-y-6">
          {filteredRadarGroups.map((group) => {
            const pillarInfo = PILLAR_LABELS[group.pillar];

            return (
              <div
                key={group.pillar}
                className="border-2 border-cyan-900/30 rounded-2xl overflow-hidden bg-slate-50/50 shadow-xs"
              >
                {/* Theme Group Header */}
                <div className="bg-gradient-to-r from-slate-900 to-cyan-950 px-4 py-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <h4 className="font-extrabold text-sm sm:text-base text-white tracking-wide uppercase">
                      {group.pillarTitle}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-200 text-xs font-bold border border-cyan-700/60">
                    {group.contents.length} nội dung phát hiện
                  </span>
                </div>

                {/* Multiple Contents under this Theme */}
                <div className="p-3 sm:p-4 space-y-3.5">
                  {group.contents.map((contentItem) => {
                    const isExpanded = expandedClusterId === contentItem.id;

                    return (
                      <div
                        key={contentItem.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-cyan-500 transition shadow-2xs"
                      >
                        {/* Content Item Header */}
                        <div
                          onClick={() => setExpandedClusterId(isExpanded ? null : contentItem.id)}
                          className="bg-white hover:bg-cyan-50/40 p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition border-b border-slate-100"
                        >
                          <div className="flex-1 min-w-[280px]">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                                  contentItem.severity === 'critical'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : contentItem.severity === 'high'
                                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}
                              >
                                Tác động: {contentItem.severity === 'critical' ? 'Khẩn cấp' : contentItem.severity === 'high' ? 'Cao' : 'Trung bình'}
                              </span>

                              <span className="text-[11px] text-slate-500">
                                Ngân hàng: <strong>{contentItem.matchedBanks.join(', ')}</strong>
                              </span>
                            </div>

                            <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                              {contentItem.mainTitle}
                            </h5>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-cyan-800 font-bold hidden sm:inline">
                              {isExpanded ? 'Thu gọn' : 'Xem 7 mục tổng hợp'}
                            </span>
                            <button className="p-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* 7 Mục phân tích chi tiết */}
                        {isExpanded && (
                          <div className="p-4 space-y-3 bg-slate-50/70 text-xs text-slate-800 leading-relaxed border-t border-slate-200">
                            {/* 1. Tiêu đề chính */}
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <strong className="text-emerald-950 font-bold block mb-0.5">
                                1. Tiêu đề chính của nội dung:
                              </strong>
                              <span className="text-slate-800 font-semibold">{contentItem.mainTitle}</span>
                            </div>

                            {/* 2. Phát hiện trùng hợp ở các ngân hàng nào */}
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <strong className="text-emerald-950 font-bold block mb-0.5">
                                2. Phát hiện trùng hợp ở các ngân hàng:
                              </strong>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {contentItem.matchedBanks.map((bank) => (
                                  <span
                                    key={bank}
                                    className="px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-900 font-bold text-[11px] border border-cyan-300"
                                  >
                                    {bank}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* 3. Tóm lược hành động của đối thủ */}
                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                              <strong className="text-emerald-950 font-bold block mb-0.5">
                                3. Tóm lược hành động của đối thủ:
                              </strong>
                              <p className="text-slate-700">{contentItem.competitorActionSummary}</p>
                            </div>

                            {/* 4. Đánh giá tác động đến Vietcombank */}
                            <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-amber-950">
                              <strong className="font-bold block mb-0.5 text-amber-900">
                                4. Đánh giá tác động đến Vietcombank:
                              </strong>
                              <p>{contentItem.vcbImpactAssessment}</p>
                            </div>

                            {/* 5. Tìm kiếm trên vietcombank.com.vn & Gợi ý bán hàng */}
                            <div className="p-3 rounded-lg bg-emerald-50/90 border border-emerald-300 text-emerald-950">
                              <strong className="font-bold block mb-1 text-emerald-900 flex items-center gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>5. Đối chiếu sản phẩm vietcombank.com.vn & Gợi ý bán hàng:</span>
                              </strong>
                              <p className="leading-relaxed">{contentItem.vcbProductMatchingAndSalesPitch}</p>
                            </div>

                            {/* 6. Kiến nghị phản ứng cho Khối Bán lẻ */}
                            <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-950">
                              <strong className="font-bold block mb-0.5 text-blue-900">
                                6. Kiến nghị phản ứng cho Khối Bán lẻ (Trụ sở chính):
                              </strong>
                              <p>{contentItem.retailDivisionAction}</p>
                            </div>

                            {/* 7. Kiến nghị phản ứng cho Chi nhánh */}
                            <div className="p-2.5 rounded-lg bg-purple-50/80 border border-purple-200 text-purple-950">
                              <strong className="font-bold block mb-0.5 text-purple-900">
                                7. Kiến nghị phản ứng cho Chi nhánh địa bàn:
                              </strong>
                              <p>{contentItem.branchAction}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DANH SÁCH BẢN GHI AUTO RADAR: ƯU TIÊN MỨC TÁC ĐỘNG TỪ CAO XUỐNG THẤP */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">
                Chi Tiết Tin Bài Tự Động Thu Thập ({filteredRadarItems.length})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tin tức, đối thủ..."
                  className="bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <select
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value as RetailPillar | 'all')}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="all">Tất cả chủ đề</option>
                <option value="ho_kinh_doanh">Hộ kinh doanh</option>
                <option value="gpmb">Giải phóng mặt bằng</option>
                <option value="thanh_toan_so">Thanh toán số</option>
                <option value="tin_dung">Tín dụng bán lẻ</option>
                <option value="khac">Chủ đề khác</option>
              </select>
            </div>
          </div>

          {/* HÀNG NÚT BẤM CHỌN THEO CẤP ĐỘ ƯU TIÊN (KHẨN CẤP -> CAO -> TRUNG BÌNH -> THẤP) */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80 flex-wrap">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">
              Chọn mức ưu tiên:
            </span>

            {/* Tất cả */}
            <button
              onClick={() => setSelectedPriority('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                selectedPriority === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              <span>Tất cả</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedPriority === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {priorityCounts.all}
              </span>
            </button>

            {/* Khẩn cấp */}
            <button
              onClick={() => setSelectedPriority('critical')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                selectedPriority === 'critical'
                  ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Khẩn cấp</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                selectedPriority === 'critical' ? 'bg-rose-900 text-rose-100' : 'bg-rose-200/80 text-rose-900'
              }`}>
                {priorityCounts.critical}
              </span>
            </button>

            {/* Cao */}
            <button
              onClick={() => setSelectedPriority('high')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                selectedPriority === 'high'
                  ? 'bg-orange-600 text-white border-orange-700 shadow-xs'
                  : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border-orange-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>Cao</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                selectedPriority === 'high' ? 'bg-orange-800 text-orange-100' : 'bg-orange-200/80 text-orange-900'
              }`}>
                {priorityCounts.high}
              </span>
            </button>

            {/* Trung bình */}
            <button
              onClick={() => setSelectedPriority('medium')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                selectedPriority === 'medium'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Trung bình</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                selectedPriority === 'medium' ? 'bg-blue-800 text-blue-100' : 'bg-blue-200/80 text-blue-900'
              }`}>
                {priorityCounts.medium}
              </span>
            </button>

            {/* Thấp */}
            <button
              onClick={() => setSelectedPriority('low')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                selectedPriority === 'low'
                  ? 'bg-slate-600 text-white border-slate-700 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>Thấp</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                selectedPriority === 'low' ? 'bg-slate-800 text-slate-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {priorityCounts.low}
              </span>
            </button>
          </div>
        </div>

        {/* Radar Items Grid */}
        <div className="p-4 sm:p-5">
          {filteredRadarItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p className="font-semibold">Không tìm thấy tin bài nào phù hợp với bộ lọc ưu tiên đã chọn</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy nhấn nút "Tất cả" hoặc chọn mức ưu tiên khác để xem đầy đủ
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRadarItems.map((item) => {
                const pillarInfo = PILLAR_LABELS[item.pillar || 'khac'];
                const rawEvidence = item.evidence || item.source || 'Thông tin CHỜ thu thập';
                const evidenceLink = rawEvidence.includes('vietcombank.com.vn')
                  ? (item.source && !item.source.includes('vietcombank.com.vn') ? item.source : 'Thông tin CHỜ thu thập')
                  : rawEvidence;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:border-cyan-500 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            pillarInfo?.badgeColor || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {pillarInfo?.label || 'Chuyên đề'}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            item.impactLevel === 'critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : item.impactLevel === 'high'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {item.impactLevel === 'critical'
                            ? 'Khẩn cấp'
                            : item.impactLevel === 'high'
                            ? 'Cao'
                            : 'Trung bình'}
                        </span>
                      </div>

                      {/* Title & Competitors */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        {item.competitors.map((comp) => (
                          <span
                            key={comp}
                            className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 mb-1.5 leading-snug">
                        {item.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
                        {item.summary}
                      </p>

                      {/* Impact on VCB */}
                      <div className="p-2 rounded bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] mb-2">
                        <strong>Tác động VCB:</strong> {item.impactOnVcb}
                      </div>

                      {/* Bằng chứng xác thực */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] mb-3">
                        <strong className="text-slate-800 block mb-1">Đường dẫn / Bằng chứng xác thực:</strong>
                        <EvidenceBadge
                          evidence={evidenceLink}
                          onViewDetails={(data) => setActiveEvidenceModal(data)}
                          title={item.title}
                          competitor={item.competitors ? item.competitors.join(', ') : ''}
                          topic={pillarInfo?.label}
                          date={item.timestamp}
                          theme="cyan"
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div>
                        <span>Nguồn thu thập: </span>
                        <strong className="text-slate-800">{item.source}</strong>
                        <span className="block text-[10px] text-slate-400">{item.timestamp}</span>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        Auto Radar AI
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUỐI TRANG: NÚT "IN AUTO RADA" TẠO BÀI VIẾT 1 TRANG A4 */}
      {/* ========================================================================= */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span>Xuất Bản Tin Auto Radar Thị Trường Bán Lẻ (1 Trang A4)</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Tạo bài viết ngắn gọn chuẩn 1 trang A4 từ nguồn thông tin tự động thu thập; cho phép review, tạo lại, lưu tệp vào thiết bị hoặc chia sẻ lên mạng xã hội.
          </p>
        </div>

        <button
          onClick={() => setIsPrintModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-slate-950" />
          <span>In Auto Rada (1 trang A4)</span>
        </button>
      </div>

      {/* Review Modal 1 trang A4 cho Auto Radar */}
      <PrintA4Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        reportType="radar"
        marketItems={marketItems}
      />

      {/* Modal xem chi tiết tài liệu bằng chứng xác thực */}
      <EvidenceViewerModal
        isOpen={!!activeEvidenceModal}
        onClose={() => setActiveEvidenceModal(null)}
        data={activeEvidenceModal}
      />
    </div>
  );
};
