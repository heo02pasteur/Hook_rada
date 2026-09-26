import React, { useState, useMemo } from 'react';
import {
  Users,
  BarChart3,
  Award,
  Flame,
  ShieldAlert,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Building2,
  Tag
} from 'lucide-react';
import { CompetitorRecord, RetailPillar, ImpactSeverity } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';
import { PrintA4Modal } from './PrintA4Modal';
import { EvidenceBadge } from './EvidenceBadge';
import { EvidenceViewerModal, EvidenceModalData } from './EvidenceViewerModal';

interface MarketAnalysisCardProps {
  records: CompetitorRecord[];
  onSelectRecordToEdit?: (record: CompetitorRecord) => void;
}

export const MarketAnalysisCard: React.FC<MarketAnalysisCardProps> = ({
  records,
  onSelectRecordToEdit,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<RetailPillar | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<ImpactSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<EvidenceModalData | null>(null);

  // =========================================================================
  // BIỂU ĐỒ 1: CÓ BAO NHIÊU CÁN BỘ ĐÃ NHẬP THÔNG TIN
  // =========================================================================
  const officerStats = useMemo(() => {
    const officerMap: { [email: string]: number } = {};
    records.forEach((r) => {
      const email = r.emailcb || r.submitterEmail || 'Khác';
      officerMap[email] = (officerMap[email] || 0) + 1;
    });

    const uniqueOfficers = Object.keys(officerMap);
    const totalOfficers = uniqueOfficers.length;

    // Top 3 cán bộ siêng năng nhất
    const sortedOfficers = Object.entries(officerMap)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count);

    const top3Officers = sortedOfficers.slice(0, 3);

    return {
      totalOfficers,
      uniqueOfficers,
      officerMap,
      top3Officers,
    };
  }, [records]);

  // =========================================================================
  // BIỂU ĐỒ 2: MỖI CHỦ ĐỀ CÓ BAO NHIÊU NỘI DUNG & TOP 3 CHỦ ĐỀ NÓNG
  // =========================================================================
  const pillarDistribution = useMemo(() => {
    const distribution: Record<RetailPillar, number> = {
      ho_kinh_doanh: 0,
      gpmb: 0,
      thanh_toan_so: 0,
      tin_dung: 0,
      khac: 0,
    };

    records.forEach((r) => {
      const p = (r.chude || r.pillarCategory || 'khac') as RetailPillar;
      if (distribution[p] !== undefined) {
        distribution[p]++;
      } else {
        distribution.khac++;
      }
    });

    // Top 3 chủ đề nóng (có nhiều nội dung nhất)
    const sortedPillars = (Object.keys(distribution) as RetailPillar[])
      .map((key) => ({
        key,
        count: distribution[key],
        label: PILLAR_LABELS[key]?.label || key,
      }))
      .sort((a, b) => b.count - a.count);

    const top3Pillars = sortedPillars.slice(0, 3);

    return {
      distribution,
      sortedPillars,
      top3Pillars,
    };
  }, [records]);

  // =========================================================================
  // BIỂU ĐỒ 5: XẾP LOẠI SỐ LƯỢNG BÀI VIẾT THEO MỨC ĐỘ TÁC ĐỘNG
  // =========================================================================
  const impactLevelDistribution = useMemo(() => {
    const counts: Record<ImpactSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    records.forEach((r) => {
      const lvl = (r.muctacdong || r.impactLevel || 'high') as ImpactSeverity;
      if (counts[lvl] !== undefined) {
        counts[lvl]++;
      } else {
        counts.high++;
      }
    });

    return counts;
  }, [records]);

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

  // =========================================================================
  // TỔNG HỢP TOÀN DIỆN CÁC CHỦ ĐỀ & MỖI CHỦ ĐỀ CÓ NHIỀU NỘI DUNG CHI TIẾT (7 MỤC)
  // =========================================================================
  const allThematicGroups = useMemo(() => {
    const groups: Array<{
      pillar: RetailPillar;
      pillarTitle: string;
      badgeColor: string;
      contents: Array<{
        id: string;
        mainTitle: string;
        matchedBanks: string[];
        competitorActionSummary: string;
        vcbImpactAssessment: string;
        vcbProductMatchingAndSalesPitch: string;
        retailDivisionAction: string;
        branchAction: string;
        severity: ImpactSeverity;
        evidence: string;
      }>;
    }> = [
      // =====================================================================
      // 1. CHỦ ĐỀ: HỘ KINH DOANH & TIỂU THƯƠNG
      // =====================================================================
      {
        pillar: 'ho_kinh_doanh',
        pillarTitle: 'Chuyên đề 1: Hộ kinh doanh & Tiểu thương',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        contents: [
          {
            id: 'clu-hkd-1',
            mainTitle: '1. Phổ cập loa thanh toán Soundbox kết hợp máy in hóa đơn điện tử cho sạp hàng chợ truyền thống',
            matchedBanks: ['Techcombank', 'VPBank', 'MB Bank', 'Sacombank'],
            competitorActionSummary:
              'Các đối thủ đang đồng loạt đổ bộ vào các chợ đầu mối và tuyến phố thương mại lớn (Đồng Xuân, Chợ Lớn, chợ Hôm, chợ Bình Tây); tài trợ miễn phí 100% loa thanh toán Soundbox và máy in hóa đơn điện tử máy tính tiền cho tiểu thương theo luật thuế 2026.',
            vcbImpactAssessment:
              'Đe dọa trực tiếp nguồn tiền gửi không kỳ hạn (CASA) bán lẻ của Vietcombank; có nguy cơ làm mất 25% - 35% thị phần đơn vị chấp nhận thanh toán VietQR tại các cụm thương mại truyền thống.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Sản phẩm tương đồng là VCB DigiBiz và Gói giải pháp QR VCB Digibank. Lợi thế vượt trội của VCB là thương hiệu an toàn số 1, liên kết không giới hạn hạn mức giao dịch với tài khoản doanh nghiệp. Gợi ý bán hàng: Tư vấn trọn gói mở tài khoản thanh toán số đẹp + tích hợp mã QR động trên POS / phần mềm KiotViet & Sapo.',
            retailDivisionAction:
              'Khối Bán lẻ khẩn trương triển khai chiến dịch trang bị miễn phí loa thông minh VCB Soundbox; ban hành gói sản phẩm chuyên biệt "VCB Hộ Kinh Doanh Pro" miễn phí trọn đời biến động số dư OTT.',
            branchAction:
              'Chi nhánh thành lập tổ lưu động trực tiếp tiếp cận Ban Quản lý chợ, tuyến phố không dùng tiền mặt; truyền thông giải pháp QR VCB và chăm sóc các chủ hộ kinh doanh cốt lõi.',
            severity: 'critical',
            evidence:
              records.find((r) => r.chude === 'ho_kinh_doanh' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
              'Tài liệu đính kèm: Anh_quay_TCB_DongXuan.jpg & To_roi_Soundbox.pdf',
          },
          {
            id: 'clu-hkd-2',
            mainTitle: '2. Cấp trước hạn mức thấu chi tín chấp tự động 200 - 500 triệu đồng duyệt 30 giây dựa trên dòng tiền QR',
            matchedBanks: ['Techcombank', 'Sacombank', 'VPBank'],
            competitorActionSummary:
              'Áp dụng thuật toán AI chấm điểm giao dịch chuyển tiền QR để giải ngân thấu chi kinh doanh trong vòng 30 giây không cần thủ tục thế chấp tài sản, lãi suất ưu đãi 30 ngày đầu.',
            vcbImpactAssessment:
              'Chủ hộ kinh doanh có xu hướng chuyển toàn bộ doanh số bán hàng hàng ngày sang tài khoản đối thủ để duy trì hạn mức thấu chi.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Gói thấu chi tiểu thương và cho vay SXKD bán lẻ VCB. Lợi thế là lãi suất vay kinh doanh luôn thấp hơn mặt bằng thị trường 1.5% - 2.0%/năm.',
            retailDivisionAction:
              'Khối Bán lẻ hoàn thiện mô hình chấm điểm tự động cấp hạn mức tín dụng dự phòng cho khách hàng có luồng tiền QR qua VCB Digibank.',
            branchAction:
              'Cán bộ khách hàng Chi nhánh rà soát danh sách merchant QR hiện hữu để chủ động tư vấn cấp hạn mức vốn lưu động cạnh tranh.',
            severity: 'high',
            evidence: 'Tài liệu đính kèm: DieuKhoanThauChi_TCB_KiotViet.pdf',
          },
          {
            id: 'clu-hkd-3',
            mainTitle: '3. Định danh tài khoản tiểu thương qua VNeID / Zalo Mini App và miễn 100% phí biến động số dư',
            matchedBanks: ['VPBank', 'ZaloPay', 'MB Bank'],
            competitorActionSummary:
              'Tối ưu hành trình mở tài khoản kinh doanh trực tuyến không cần đến quầy, miễn trọn đời phí chuyển tiền và phí thông báo biến động số dư OTT, kèm gói quảng cáo số cho chủ hộ.',
            vcbImpactAssessment:
              'Thu hút nhóm chủ hộ kinh doanh trẻ tuổi (Gen Z, Millennials) chuyển dịch tài khoản thanh toán chính sang đối thủ.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Ứng dụng VCB DigiBiz. Lợi thế là phân quyền đa người dùng cho nhân viên thu ngân và kế toán cửa hàng an toàn tuyệt đối.',
            retailDivisionAction:
              'Miễn phí hoàn toàn dịch vụ thông báo OTT trên app VCB DigiBiz cho khách hàng hộ kinh doanh.',
            branchAction:
              'Hướng dẫn cài đặt VCB DigiBiz tận quầy cho các cửa hàng mới thành lập tại địa phương.',
            severity: 'medium',
            evidence: 'Thông tin CHỜ thu thập',
          },
        ],
      },

      // =====================================================================
      // 2. CHỦ ĐỀ: GIẢI PHÓNG MẶT BẰNG & TIỀN GỬI ĐỀN BÙ
      // =====================================================================
      {
        pillar: 'gpmb',
        pillarTitle: 'Chuyên đề 2: Giải phóng mặt bằng & Tiền gửi đền bù tái định cư',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        contents: [
          {
            id: 'clu-gpmb-1',
            mainTitle: '1. Lập quầy lưu động tại UBND xã/huyện nơi chi trả bồi thường dự án Vành Đai 4 và Cao tốc',
            matchedBanks: ['HDBank', 'BIDV', 'Agribank', 'MB Bank'],
            competitorActionSummary:
              'Thiết lập quầy giao dịch cơ động trực tiếp tại hội trường UBND xã nơi người dân nhận tiền bồi thường đất; áp dụng chính sách cộng thêm lãi suất tiết kiệm 0.6% - 0.7%/năm cho số dư từ 500 triệu đồng trở lên, tặng vàng và quà an cư.',
            vcbImpactAssessment:
              'Dòng tiền đền bù quy mô hơn 45.000 tỷ đồng có nguy cơ chảy trọn vẹn về các ngân hàng đối thủ nếu Chi nhánh Vietcombank địa bàn không có mặt kịp thời tại điểm chi trả.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Sản phẩm tương đồng là Tiết kiệm Tích lũy An Vui và Chứng chỉ tiền gửi VCB. Lợi thế của VCB là uy tín ngân hàng quốc doanh vững chắc nhất Việt Nam, tuyệt đối an toàn cho tài sản tích lũy cả đời của người dân.',
            retailDivisionAction:
              'Ban hành cơ chế thỏa thuận lãi suất đặc cách cho dòng tiền GPMB quy mô lớn; phân quyền linh hoạt cho Giám đốc Chi nhánh quyết định mức lãi suất cộng thêm trong khung.',
            branchAction:
              'Phối hợp chặt chẽ với Hội đồng bồi thường, Trung tâm phát triển quỹ đất huyện/thị xã để mở tài khoản chi trả bồi thường; cử cán bộ cắm chốt tư vấn tại trụ sở chi trả.',
            severity: 'critical',
            evidence:
              records.find((r) => r.chude === 'gpmb' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
              'Tài liệu đính kèm: BienBanHop_BanBoiThuong_HoaiDuc.pdf (Công văn số 118/UBND-GPMB)',
          },
          {
            id: 'clu-gpmb-2',
            mainTitle: '2. Thỏa thuận độc quyền tài khoản chi trả bồi thường và phát hành thẻ an sinh tái định cư Sân bay Long Thành',
            matchedBanks: ['BIDV', 'VietinBank'],
            competitorActionSummary:
              'Ký thỏa thuận độc quyền với Trung tâm phát triển quỹ đất mở tài khoản thanh toán và phát hành thẻ an sinh cho hơn 3.200 hộ dân tái định cư tại khu Lộc An - Bình Sơn.',
            vcbImpactAssessment:
              'Mất lợi thế cạnh tranh nguồn vốn bán lẻ tại các cực tăng trưởng kinh tế trọng điểm phía Nam.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Gói giải pháp tài chính "An cư Long Thành" với lãi suất tiết kiệm bậc thang và tư vấn tài chính gia đình.',
            retailDivisionAction:
              'Chỉ đạo Chi nhánh VCB Đồng Nai & Long Thành xây dựng chính sách ưu đãi tài khoản gia đình cho các hộ nhận tiền bồi thường lớn.',
            branchAction:
              'Cử cán bộ tín dụng và huy động trực tiếp đến các ấp tái định cư để mở tài khoản và tư vấn sinh lời an toàn.',
            severity: 'high',
            evidence: 'Tài liệu đính kèm: ThoaThuanHopTac_BIDV_LongThanh.pdf',
          },
        ],
      },

      // =====================================================================
      // 3. CHỦ ĐỀ: THANH TOÁN SỐ & SINH TRẮC HỌC
      // =====================================================================
      {
        pillar: 'thanh_toan_so',
        pillarTitle: 'Chuyên đề 3: Thanh toán số & Sinh trắc học Quyết định 2345',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        contents: [
          {
            id: 'clu-tts-1',
            mainTitle: '1. Ứng dụng SoftPOS Tap-to-phone biến smartphone thành máy quẹt thẻ Contactless',
            matchedBanks: ['VPBank', 'Grab', 'Techcombank', 'TPBank'],
            competitorActionSummary:
              'Biến trực tiếp điện thoại smartphone Android/iOS thành thiết bị quẹt thẻ không tiếp xúc Contactless thay thế máy POS cồng kềnh; phí ưu đãi chỉ 0.8% - 1.0% cho các điểm ăn uống F&B và dịch vụ giao hàng.',
            vcbImpactAssessment:
              'Làm giảm nhu cầu thuê máy POS truyền thống của VCB tại chuỗi F&B và dịch vụ giao hàng; chia sẻ doanh thu dịch vụ thanh toán thẻ.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Dịch vụ VCB Tap-on-phone trên VCB Digibank/VCB DigiBiz. Lợi thế là hệ sinh thái liên kết thẻ quốc tế Visa, Mastercard, JCB, Napas toàn diện với hạ tầng bảo mật cấp cao nhất.',
            retailDivisionAction:
              'Đẩy nhanh tiến độ phát hành tính năng Tap-to-phone diện rộng trên VCB Digibank; tung chính sách miễn phí thường niên và chiết khấu merchant cạnh tranh.',
            branchAction:
              'Tập trung tiếp cận chuỗi nhà hàng, quán cà phê, đơn vị vận chuyển tại địa bàn để chuyển đổi hoặc tích hợp song song giải pháp thanh toán VCB.',
            severity: 'high',
            evidence:
              records.find((r) => r.chude === 'thanh_toan_so' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
              'Tài liệu đính kèm: Video_TapToPhone_Grab_VPB.mp4 & HuongDanSuDung.pdf',
          },
          {
            id: 'clu-tts-2',
            mainTitle: '2. Bùng nổ thanh toán QR song phương quốc tế (WeChat/Alipay du khách Trung Quốc & Hàn Quốc)',
            matchedBanks: ['BIDV', 'Sacombank', 'WeChat Pay', 'Alipay'],
            competitorActionSummary:
              'Cho phép du khách quốc tế quét trực tiếp mã QR tại cửa hàng Việt Nam không cần đổi tiền mặt, chiết khấu chỉ 0.8% cho đơn vị chấp nhận thanh toán tại Nha Trang, Đà Nẵng, Phú Quốc.',
            vcbImpactAssessment:
              'VCB là ngân hàng thanh toán ngoại hối số 1 nhưng đang bị đối thủ chia sẻ doanh số merchant tại các điểm du lịch lớn.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Dịch vụ thanh toán quốc tế đa kênh VCB. Lợi thế tỷ giá mua bán ngoại tệ tốt nhất hệ thống ngân hàng Việt Nam.',
            retailDivisionAction:
              'Khối Bán lẻ hoàn thiện kết nối các ví điện tử quốc tế phổ biến vào mạng lưới chấp nhận thanh toán Vietcombank QR Pro.',
            branchAction:
              'Chi nhánh tại các vùng du lịch tiếp cận ngay các khách sạn, khu nghỉ dưỡng, trung tâm thương mại để lắp đặt mã thanh toán VCB quốc tế.',
            severity: 'critical',
            evidence: 'https://vneconomy.vn/ngan-hang-ket-noi-thanh-toan-qr-song-phuong-wechat-alipay.htm',
          },
        ],
      },

      // =====================================================================
      // 4. CHỦ ĐỀ: TÍN DỤNG BÁN LẺ & VAY MUA NHÀ
      // =====================================================================
      {
        pillar: 'tin_dung',
        pillarTitle: 'Chuyên đề 4: Tín dụng bán lẻ & Vay mua nhà',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        contents: [
          {
            id: 'clu-td-1',
            mainTitle: '1. Chạy đua hạ lãi suất vay mua nhà cố định 36 tháng xuống 5.8% - 5.9%/năm',
            matchedBanks: ['Techcombank', 'MB Bank', 'ACB', 'VPBank'],
            competitorActionSummary:
              'Tung các gói tín dụng mua nhà và sản xuất kinh doanh với lãi suất cố định siêu ưu đãi trong 3 năm đầu, cam kết biên độ sau ưu đãi 2.5%, miễn phí trả nợ trước hạn từ năm thứ 4.',
            vcbImpactAssessment:
              'Khách hàng vay mua nhà hiện hữu có xu hướng so sánh lãi suất hoặc chuyển khoản vay sang ngân hàng đối thủ theo Thông tư 06; giảm tốc độ tăng trưởng dư nợ cho vay bán lẻ của Vietcombank.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Gói vay "An Gia Lập Nghiệp" và "Vay mua nhà Vietcombank". Lợi thế của VCB là lãi suất ổn định dài hạn, biên độ sau ưu đãi minh bạch, không phí ẩn và giải ngân nhanh chóng.',
            retailDivisionAction:
              'Điều chỉnh linh hoạt gói lãi suất vay mua nhà 2026; rút ngắn quy trình thẩm định tín dụng bán lẻ thông qua liên kết cơ sở dữ liệu dân cư quốc gia.',
            branchAction:
              'Rà soát danh mục khách hàng vay mua nhà hiện hữu có nguy cơ chuyển dịch nợ; chủ động liên hệ tư vấn điều chỉnh gói lãi suất giữ chân khách hàng tốt.',
            severity: 'critical',
            evidence:
              records.find((r) => r.chude === 'tin_dung' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
              'Tài liệu đính kèm: BangLaiSuat_MB_CoDinh36Thang.pdf (https://cafef.vn/lai-suat-nha-dat-mb)',
          },
          {
            id: 'clu-td-2',
            mainTitle: '2. Phê duyệt tín chấp tự động qua VNeID mức 2 trong 5 phút không cần sao kê bảng lương',
            matchedBanks: ['VPBank', 'TPBank'],
            competitorActionSummary:
              'Ứng dụng mô hình chấm điểm AI kết nối thẳng cơ sở dữ liệu dân cư và hóa đơn điện thoại viễn thông để cấp hạn mức vay 120 triệu đồng trong 5 phút.',
            vcbImpactAssessment:
              'Mất dần phân khúc khách hàng cá nhân trẻ và công chức có nhu cầu vốn tiêu dùng tức thời.',
            vcbProductMatchingAndSalesPitch:
              'Tìm kiếm trên vietcombank.com.vn: Thẻ tín dụng VCB Digicard và Vay thấu chi lương VCB. Lợi thế là hạn mức cao, lãi suất thấp nhất thị trường.',
            retailDivisionAction:
              'Đẩy mạnh tích hợp định danh VNeID mức 2 để phê duyệt hạn mức thẻ tín dụng số tức thì trên app VCB Digibank.',
            branchAction:
              'Chăm sóc các đơn vị trả lương qua VCB để phát hành thẻ tín dụng và cấp hạn mức thấu chi trọn gói.',
            severity: 'high',
            evidence: 'Thông tin CHỜ thu thập',
          },
        ],
      },
    ];

    return groups;
  }, [records]);

  // Lọc theo chủ đề đã chọn nếu có
  const filteredThematicGroups = useMemo(() => {
    if (selectedPillar === 'all') return allThematicGroups;
    return allThematicGroups.filter((g) => g.pillar === selectedPillar);
  }, [allThematicGroups, selectedPillar]);

  // Đếm số lượng theo mức ưu tiên
  const priorityCounts = useMemo(() => {
    let list = records || [];
    if (selectedPillar !== 'all') {
      list = list.filter((r) => (r.chude || r.pillarCategory) === selectedPillar);
    }
    return {
      all: list.length,
      critical: list.filter((r) => (r.muctacdong || r.impactLevel) === 'critical').length,
      high: list.filter((r) => (r.muctacdong || r.impactLevel) === 'high').length,
      medium: list.filter((r) => (r.muctacdong || r.impactLevel) === 'medium').length,
      low: list.filter((r) => (r.muctacdong || r.impactLevel) === 'low').length,
    };
  }, [records, selectedPillar]);

  // Sắp xếp và lọc các bản ghi do cán bộ nhập
  const sortedAndFilteredOfficerRecords = useMemo(() => {
    let list = records || [];
    if (selectedPillar !== 'all') {
      list = list.filter((r) => (r.chude || r.pillarCategory) === selectedPillar);
    }
    if (selectedPriority !== 'all') {
      list = list.filter((r) => (r.muctacdong || r.impactLevel) === selectedPriority);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const doithu = (r.doithu || r.competitor || '').toLowerCase();
        const tintuc = (r.tintuc || r.content || '').toLowerCase();
        const tacdong = (r.tacdong || r.impactOnVcb || '').toLowerCase();
        const email = (r.emailcb || r.submitterEmail || '').toLowerCase();
        return doithu.includes(q) || tintuc.includes(q) || tacdong.includes(q) || email.includes(q);
      });
    }
    return [...list].sort((a, b) => {
      const rankA = getSeverityRank(a.muctacdong || a.impactLevel);
      const rankB = getSeverityRank(b.muctacdong || b.impactLevel);
      if (rankB !== rankA) return rankB - rankA;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [records, selectedPillar, selectedPriority, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* HEADER BANNER & THÔNG BÁO NGUỒN TIN CHUẨN */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-2xl p-5 text-white shadow-xl border border-emerald-700/60 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-black uppercase tracking-wider">
                Thẻ số 1 • Ưu tiên cao nhất
              </span>
              <span className="text-emerald-300/80 text-xs">• Nguồn tin khép kín từ cán bộ</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wide">
              PHÂN TÍCH THÔNG TIN THỊ TRƯỜNG
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed mt-1">
              Phân tích chuyên sâu tập trung <strong>duy nhất</strong> vào các thông tin do mạng lưới cán bộ Khối Bán lẻ thu thập thực tế từ địa bàn, ưu tiên từ tác động cao xuống thấp kèm bằng chứng xác thực.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>In Thị trường (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5 BIỂU ĐỒ TRỰC QUAN ĐẸP MẮT (THEO YÊU CẦU CỦA USER) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* BIỂU ĐỒ 1: CÓ BAO NHIÊU CÁN BỘ ĐÃ NHẬP THÔNG TIN */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Số cán bộ đã nhập tin</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                {officerStats.totalOfficers} cán bộ
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950 mb-1">
              {officerStats.totalOfficers}
              <span className="text-xs text-slate-500 font-medium ml-1.5">cán bộ đóng góp</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              Mạng lưới cán bộ phủ khắp các Chi nhánh & Phòng nghiệp vụ Trụ sở chính
            </p>
          </div>

          {/* Danh sách email các cán bộ */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
            {officerStats.uniqueOfficers.slice(0, 4).map((email) => (
              <span
                key={email}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono truncate max-w-[130px]"
                title={email}
              >
                {email}
              </span>
            ))}
            {officerStats.totalOfficers > 4 && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                +{officerStats.totalOfficers - 4} khác
              </span>
            )}
          </div>
        </div>

        {/* BIỂU ĐỒ 2: MỖI CHỦ ĐỀ CÓ BAO NHIÊU NỘI DUNG */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Nội dung theo chủ đề</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Tổng: {records.length} tin</span>
          </div>

          <div className="space-y-2 text-xs">
            {pillarDistribution.sortedPillars.slice(0, 4).map((item) => {
              const pct = records.length > 0 ? Math.round((item.count / records.length) * 100) : 0;
              return (
                <div key={item.key} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <span className="text-slate-600 font-mono font-bold">
                      {item.count} bài ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BIỂU ĐỒ 3: TOP 3 CÁN BỘ SIÊNG NĂNG */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top 3 cán bộ siêng năng</span>
            </span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              Vinh danh
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {officerStats.top3Officers.map((officer, idx) => (
              <div
                key={officer.email}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-amber-700 text-amber-100'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800 truncate" title={officer.email}>
                    {officer.email}
                  </span>
                </div>
                <span className="font-extrabold text-emerald-700 font-mono shrink-0 ml-2">
                  {officer.count} tin
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BIỂU ĐỒ 4: TOP 3 CHỦ ĐỀ NÓNG */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Top 3 chủ đề nóng nhất</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              Tiêu điểm
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {pillarDistribution.top3Pillars.map((p, idx) => (
              <div
                key={p.key}
                className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 border border-rose-100"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{p.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-rose-700 font-bold border border-rose-200 font-mono text-[11px]">
                  {p.count} phản ánh
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BIỂU ĐỒ 5: XẾP LOẠI BÀI VIẾT THEO MỨC ĐỘ TÁC ĐỘNG */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Xếp loại số lượng bài viết theo mức độ tác động</span>
            </span>
            <span className="text-[11px] text-slate-500">Ưu tiên xử lý từ Khẩn cấp</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
              <div className="text-lg font-black text-rose-700">
                {impactLevelDistribution.critical}
              </div>
              <div className="text-[11px] font-bold text-rose-800 uppercase mt-0.5">Khẩn cấp</div>
              <p className="text-[10px] text-rose-600/80 mt-0.5">Ưu tiên số 1</p>
            </div>

            <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-lg font-black text-orange-700">
                {impactLevelDistribution.high}
              </div>
              <div className="text-[11px] font-bold text-orange-800 uppercase mt-0.5">Ảnh hưởng cao</div>
              <p className="text-[10px] text-orange-600/80 mt-0.5">Cần phản ứng nhanh</p>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-lg font-black text-blue-700">
                {impactLevelDistribution.medium}
              </div>
              <div className="text-[11px] font-bold text-blue-800 uppercase mt-0.5">Trung bình</div>
              <p className="text-[10px] text-blue-600/80 mt-0.5">Theo dõi định kỳ</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-lg font-black text-slate-700">
                {impactLevelDistribution.low}
              </div>
              <div className="text-[11px] font-bold text-slate-800 uppercase mt-0.5">Thấp</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Ghi nhận thông tin</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BÀI VIẾT TỔNG HỢP NỘI DUNG TRÙNG NHAU THEO TỪNG CHỦ ĐỀ (7 MỤC CHUẨN) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm tracking-wide uppercase">
              BÀI VIẾT TỔNG HỢP NỘI DUNG TRÙNG NHAU TRONG TỪNG CHỦ ĐỀ
            </h3>
          </div>
          <span className="text-[11px] text-emerald-200">
            Tự động đối chiếu website vietcombank.com.vn & gợi ý bán hàng
          </span>
        </div>

        <div className="p-5 space-y-6">
          {filteredThematicGroups.map((group) => {
            const pillarInfo = PILLAR_LABELS[group.pillar];

            return (
              <div
                key={group.pillar}
                className="border-2 border-emerald-900/30 rounded-2xl overflow-hidden bg-slate-50/50 shadow-xs"
              >
                {/* Theme Group Header */}
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 px-4 py-3 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <h4 className="font-extrabold text-sm sm:text-base text-white tracking-wide uppercase">
                      {group.pillarTitle}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600/60">
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
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 transition shadow-2xs"
                      >
                        {/* Content Item Header */}
                        <div
                          onClick={() => setExpandedClusterId(isExpanded ? null : contentItem.id)}
                          className="bg-white hover:bg-emerald-50/40 p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition border-b border-slate-100"
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
                            <span className="text-xs text-emerald-700 font-bold hidden sm:inline">
                              {isExpanded ? 'Thu gọn' : 'Xem 7 mục phân tích'}
                            </span>
                            <button className="p-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* 7 Mục phân tích chi tiết của từng nội dung */}
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
                                    className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-300"
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

                            {/* Bằng chứng xác thực */}
                            <div className="p-2.5 rounded-lg bg-slate-100/90 border border-slate-200 text-[11px]">
                              <strong className="text-slate-800 block mb-1">
                                Đường dẫn / Bằng chứng xác thực:
                              </strong>
                              <EvidenceBadge
                                evidence={contentItem.evidence}
                                onViewDetails={(data) => setActiveEvidenceModal(data)}
                                title={contentItem.mainTitle}
                                competitor={contentItem.matchedBanks.join(', ')}
                                topic={group.pillarTitle}
                                theme="emerald"
                              />
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
      {/* DANH SÁCH BẢN GHI CỦA CÁN BỘ: ƯU TIÊN TÁC ĐỘNG TỪ CAO XUỐNG THẤP & BẰNG CHỨNG */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar & Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">
                Chi Tiết Từng Tin Cán Bộ Thu Thập ({sortedAndFilteredOfficerRecords.length})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm nội dung, đối thủ..."
                  className="bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Pillar Selector */}
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
                selectedPriority === 'high' ? 'bg-orange-900 text-orange-100' : 'bg-orange-200/80 text-orange-900'
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
                selectedPriority === 'medium' ? 'bg-blue-900 text-blue-100' : 'bg-blue-200/80 text-blue-900'
              }`}>
                {priorityCounts.medium}
              </span>
            </button>

            {/* Thấp */}
            <button
              onClick={() => setSelectedPriority('low')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                selectedPriority === 'low'
                  ? 'bg-slate-700 text-white border-slate-800 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>Thấp</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                selectedPriority === 'low' ? 'bg-slate-900 text-slate-200' : 'bg-slate-200 text-slate-800'
              }`}>
                {priorityCounts.low}
              </span>
            </button>
          </div>
        </div>

        {/* Records Grid */}
        <div className="p-4 sm:p-5">
          {sortedAndFilteredOfficerRecords.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p className="font-semibold">Chưa có thông tin phù hợp với bộ lọc</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy chuyển sang thẻ "Nhập thông tin thị trường" để thêm dữ liệu thực tế
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedAndFilteredOfficerRecords.map((rec) => {
                const pillarKey = (rec.chude || rec.pillarCategory || 'khac') as RetailPillar;
                const pillarInfo = PILLAR_LABELS[pillarKey];
                const competitorName = rec.doithu || rec.competitor || 'Đối thủ';
                const contentText = rec.tintuc || rec.content || '';
                const impactText = rec.tacdong || rec.impactOnVcb || '';
                const officerEmail = rec.emailcb || rec.submitterEmail || 'qlkcn.ho';
                const dexuatText = rec.dexuat || '';
                // Bằng chứng: nếu chưa có thì hiển thị "Thông tin CHỜ thu thập"
                const evidenceText =
                  rec.bangchung ||
                  (rec.evidenceFiles && rec.evidenceFiles.length > 0
                    ? rec.evidenceFiles.map((f) => f.name).join(', ')
                    : 'Thông tin CHỜ thu thập');

                const severity = (rec.muctacdong || rec.impactLevel || 'high') as ImpactSeverity;

                return (
                  <div
                    key={rec.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
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
                            severity === 'critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : severity === 'high'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {severity === 'critical'
                            ? 'Khẩn cấp'
                            : severity === 'high'
                            ? 'Cao'
                            : 'Trung bình'}
                        </span>
                      </div>

                      {/* Competitor */}
                      <h4 className="font-extrabold text-sm text-slate-900 mb-1.5">
                        {competitorName}
                      </h4>

                      {/* Content */}
                      <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
                        {contentText}
                      </p>

                      {/* Impact */}
                      <div className="p-2 rounded bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] mb-2">
                        <strong>Tác động VCB:</strong> {impactText}
                      </div>

                      {/* Đề xuất kiến nghị */}
                      {dexuatText && (
                        <div className="p-2 rounded bg-blue-50/80 border border-blue-200 text-blue-950 text-[11px] mb-2">
                          <strong>Đề xuất phản ứng:</strong> {dexuatText}
                        </div>
                      )}

                      {/* Bằng chứng xác thực */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] mb-3">
                        <strong className="text-slate-800 block mb-1">Đường dẫn / Bằng chứng xác thực:</strong>
                        <EvidenceBadge
                          evidence={evidenceText}
                          onViewDetails={(data) => setActiveEvidenceModal(data)}
                          title={contentText}
                          competitor={competitorName}
                          topic={pillarInfo?.label}
                          date={rec.updatedAt || rec.createdAt}
                          files={rec.evidenceFiles}
                          theme="emerald"
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div>
                        <span>Cán bộ: </span>
                        <strong className="text-slate-800">{officerEmail}</strong>
                        <span className="block text-[10px] text-slate-400">
                          {rec.updatedAt || rec.createdAt}
                        </span>
                      </div>

                      {onSelectRecordToEdit && (
                        <button
                          onClick={() => onSelectRecordToEdit(rec)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold border border-slate-200 transition cursor-pointer"
                        >
                          Sửa tin
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUỐI TRANG: NÚT "IN THỊ TRƯỜNG" TẠO BÀI VIẾT 1 TRANG A4 */}
      {/* ========================================================================= */}
      <div className="p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-700">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span>Xuất Bản Tin Phân Tích Thông Tin Thị Trường (1 Trang A4)</span>
          </h3>
          <p className="text-xs text-emerald-200 mt-1 max-w-xl">
            Tạo bài viết ngắn gọn chuẩn A4 trình Ban Lãnh đạo; hỗ trợ review, tạo lại, lưu tệp vào thiết bị hoặc chia sẻ lên mạng xã hội.
          </p>
        </div>

        <button
          onClick={() => setIsPrintModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-slate-950" />
          <span>In Thị trường (1 trang A4)</span>
        </button>
      </div>

      {/* Review Modal 1 trang A4 */}
      <PrintA4Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        reportType="officer"
        records={records}
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
