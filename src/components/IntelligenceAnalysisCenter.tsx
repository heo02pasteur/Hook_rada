import React, { useState, useMemo } from 'react';
import {
  Users,
  Radio,
  Search,
  AlertTriangle,
  Building2,
  Store,
  MapPin,
  Smartphone,
  CreditCard,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Paperclip,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Clock,
  Zap,
  RotateCcw,
  Check
} from 'lucide-react';
import { CompetitorRecord, MarketIntelligenceItem, RetailPillar, ImpactSeverity } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';

interface IntelligenceAnalysisCenterProps {
  records: CompetitorRecord[];
  marketItems: MarketIntelligenceItem[];
  onExtractToForm: (item: {
    competitor: string;
    content: string;
    impactOnVcb: string;
    pillarCategory: RetailPillar;
    impactLevel: ImpactSeverity;
  }) => void;
  onSelectRecordToEdit?: (record: CompetitorRecord) => void;
}

interface SynthesizedCluster {
  id: string;
  pillar: RetailPillar;
  themeTitle: string;
  banks: string[];
  isOverlap: boolean;
  reportsCount: number;
  synthesizedContent: string;
  synthesizedImpact: string;
  recommendedAction: string;
  severity: ImpactSeverity;
  subItems: Array<{
    id: string;
    submitterEmail?: string;
    competitor: string;
    content: string;
    impactOnVcb: string;
    timestamp: string;
    evidenceCount?: number;
    source?: string;
    rawRecord?: CompetitorRecord;
  }>;
}

export const IntelligenceAnalysisCenter: React.FC<IntelligenceAnalysisCenterProps> = ({
  records,
  marketItems,
  onExtractToForm,
  onSelectRecordToEdit,
}) => {
  // Tab: 'officer' (Thông tin do cán bộ nhập) | 'market' (Radar thị trường bán lẻ cô đọng)
  const [activeTab, setActiveTab] = useState<'officer' | 'market'>('officer');
  const [selectedPillar, setSelectedPillar] = useState<RetailPillar | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);

  // 1. Lựa chọn thời gian cho Thông tin cán bộ nhập (1 tuần, 1 tháng, toàn bộ - Ưu tiên 1 tuần)
  const [officerTimeRange, setOfficerTimeRange] = useState<'1_week' | '1_month' | 'all'>('1_week');
  const [isScanningOfficer, setIsScanningOfficer] = useState(false);

  // 2. Lựa chọn cho Radar thị trường (Giữ nguyên vs Cập nhật; nếu Cập nhật: 1 ngày, 1 tuần, 1 tháng)
  const [radarMode, setRadarMode] = useState<'keep' | 'update'>('keep');
  const [radarUpdatePeriod, setRadarUpdatePeriod] = useState<'1_day' | '1_week' | '1_month'>('1_week');
  const [isUpdatingRadar, setIsUpdatingRadar] = useState(false);
  const [isScanningRadar, setIsScanningRadar] = useState(false);
  const [lastRadarScanTime, setLastRadarScanTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  });

  const handleTriggerOfficerScan = (range?: '1_week' | '1_month' | 'all') => {
    if (range) setOfficerTimeRange(range);
    setIsScanningOfficer(true);
    setTimeout(() => {
      setIsScanningOfficer(false);
    }, 350);
  };

  const handleSelectOfficerTab = () => {
    setActiveTab('officer');
    // Quét và tổng hợp ngay toàn bộ thông tin cán bộ đã nhập
    setIsScanningOfficer(true);
    setTimeout(() => {
      setIsScanningOfficer(false);
    }, 350);
  };

  const handleSelectMarketTab = () => {
    setActiveTab('market');
  };

  const handleSetRadarMode = (mode: 'keep' | 'update') => {
    setRadarMode(mode);
    if (mode === 'update') {
      setIsScanningRadar(true);
      setTimeout(() => {
        setIsScanningRadar(false);
        setLastRadarScanTime(
          new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      }, 350);
    }
  };

  const handleSetRadarPeriod = (period: '1_day' | '1_week' | '1_month') => {
    setRadarUpdatePeriod(period);
    setIsScanningRadar(true);
    setTimeout(() => {
      setIsScanningRadar(false);
      setLastRadarScanTime(
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 400);
  };

  // Nút quét lại theo đúng điều kiện thời gian của nút lệnh
  const handleRescanRadar = () => {
    setIsScanningRadar(true);
    setTimeout(() => {
      setIsScanningRadar(false);
      setLastRadarScanTime(
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 450);
  };

  // Lọc thông tin cán bộ theo khoảng thời gian được chọn
  const filteredOfficerRecords = useMemo(() => {
    const list = records || [];
    if (officerTimeRange === 'all') return list;

    let latestTs = 0;
    list.forEach((r) => {
      const ts = r.createdAt || r.updatedAt || '';
      if (ts) {
        const t = new Date(ts.replace(' ', 'T')).getTime();
        if (!isNaN(t) && t > latestTs) latestTs = t;
      }
    });

    if (latestTs === 0) latestTs = Date.now();
    const daysLimit = officerTimeRange === '1_week' ? 7 : 30;
    const maxDiffMs = daysLimit * 24 * 60 * 60 * 1000;

    return list.filter((rec) => {
      const ts = rec.createdAt || rec.updatedAt || '';
      if (!ts) return true;
      const t = new Date(ts.replace(' ', 'T')).getTime();
      if (isNaN(t)) return true;
      return latestTs - t <= maxDiffMs;
    });
  }, [records, officerTimeRange]);

  // Lọc radar thị trường theo chế độ và chu kỳ
  const filteredMarketItems = useMemo(() => {
    const list = marketItems || [];
    if (radarMode === 'keep') return list;

    let latestTs = 0;
    list.forEach((m) => {
      if (m.timestamp) {
        const t = new Date(m.timestamp.replace(' ', 'T')).getTime();
        if (!isNaN(t) && t > latestTs) latestTs = t;
      }
    });

    if (latestTs === 0) latestTs = Date.now();
    const daysLimit =
      radarUpdatePeriod === '1_day' ? 1.5 : radarUpdatePeriod === '1_week' ? 7 : 30;
    const maxDiffMs = daysLimit * 24 * 60 * 60 * 1000;

    return list.filter((m) => {
      if (!m.timestamp) return true;
      const t = new Date(m.timestamp.replace(' ', 'T')).getTime();
      if (isNaN(t)) return true;
      return latestTs - t <= maxDiffMs;
    });
  }, [marketItems, radarMode, radarUpdatePeriod]);

  // ========================================================================
  // 1. TỔNG HỢP & PHÂN TÍCH THÔNG TIN DO CÁN BỘ NHẬP (CLUSTERING & OVERLAPS)
  // ========================================================================
  const officerClusters = useMemo(() => {
    const list = filteredOfficerRecords || [];

    // Rules for clustering staff reports by pillar & key topics
    const clusterMap: { [key: string]: SynthesizedCluster } = {
      // Nhóm 1: Hộ kinh doanh
      'hkd-soundbox': {
        id: 'c-hkd-soundbox',
        pillar: 'ho_kinh_doanh',
        themeTitle: 'Tặng loa thông minh Soundbox, máy in hóa đơn điện tử & cấp thấu chi tự động cho Hộ kinh doanh',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Các ngân hàng đang ồ ạt đổ bộ vào các chợ đầu mối và tuyến phố kinh doanh; tài trợ miễn phí loa thanh toán Soundbox kết hợp phần mềm máy tính tiền HĐĐT 2026, kèm gói thấu chi tín chấp 200 - 500 triệu đồng duyệt trong 30 giây dựa trên dòng tiền QR.',
        synthesizedImpact:
          'Đe dọa trực tiếp CASA tiểu thương của Vietcombank; làm giảm thị phần mã QR VCB Digibank hiện hữu tại các cụm thương mại truyền thống.',
        recommendedAction:
          'Khối Bán lẻ VCB khẩn trương trang bị miễn phí VCB Soundbox và phát triển gói "VCB Merchant Pro" tích hợp máy in hóa đơn điện tử.',
        severity: 'critical',
        subItems: [],
      },
      'hkd-digital': {
        id: 'c-hkd-digital',
        pillar: 'ho_kinh_doanh',
        themeTitle: 'Định danh tài khoản tiểu thương qua VNeID / Zalo Mini App và miễn 100% phí dịch vụ',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Tối ưu hành trình mở tài khoản kinh doanh trực tuyến không cần đến quầy, miễn trọn đời phí chuyển tiền và phí thông báo biến động số dư OTT, kèm gói quảng cáo số cho chủ hộ.',
        synthesizedImpact:
          'Thu hút nhóm chủ hộ kinh doanh trẻ tuổi (Gen Z, Millennials) chuyển dịch tài khoản thanh toán chính sang đối thủ.',
        recommendedAction:
          'Nâng cấp phân hệ VCB DigiBiz, miễn phí trọn gói biến động số dư OTT cho tài khoản kinh doanh.',
        severity: 'high',
        subItems: [],
      },

      // Nhóm 2: Giải phóng mặt bằng (GPMB)
      'gpmb-caotoc': {
        id: 'c-gpmb-caotoc',
        pillar: 'gpmb',
        themeTitle: 'Chi trả bồi thường GPMB Vành đai 4 & Cao tốc: Lập quầy lưu động dã chiến và cộng thêm lãi suất tiết kiệm',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Thiết lập bàn tư vấn trực tiếp tại trụ sở UBND xã/phường nơi người dân nhận tiền đền bù; áp dụng chính sách cộng thêm 0.5% - 0.7%/năm cho sổ tiết kiệm từ 500 triệu đồng trở lên, tặng vàng và quà an cư.',
        synthesizedImpact:
          'Dòng tiền đền bù quy mô hàng chục nghìn tỷ đồng có nguy cơ bị đối thủ thâu tóm ngay tại điểm chi trả nếu Chi nhánh VCB địa bàn không có mặt kịp thời.',
        recommendedAction:
          'Chỉ đạo các Chi nhánh VCB phối hợp với Trung tâm phát triển quỹ đất mở tài khoản chi trả bồi thường và lập quầy cơ động tại địa phương.',
        severity: 'critical',
        subItems: [],
      },
      'gpmb-longthanh': {
        id: 'c-gpmb-longthanh',
        pillar: 'gpmb',
        themeTitle: 'Khai thác dòng tiền tái định cư đại dự án (Sân bay Long Thành, KCN lớn)',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Ký kết thỏa thuận độc quyền mở tài khoản thanh toán và phát hành thẻ an sinh xã hội cho hàng nghìn hộ dân tái định cư, cung cấp trọn gói tư vấn xây nhà và đầu tư tích lũy.',
        synthesizedImpact:
          'Mất lợi thế cạnh tranh nguồn vốn bán lẻ tại các cực tăng trưởng kinh tế trọng điểm phía Nam.',
        recommendedAction:
          'Kích hoạt gói sản phẩm đặc thù "An cư Long Thành" với lãi suất tiết kiệm bậc thang và tư vấn tài chính gia đình.',
        severity: 'high',
        subItems: [],
      },

      // Nhóm 3: Thanh toán số
      'tts-tap-phone': {
        id: 'c-tts-tap-phone',
        pillar: 'thanh_toan_so',
        themeTitle: 'Triển khai giải pháp Tap-to-phone (biến điện thoại thông minh thành máy POS) & Chạm thẻ Contactless',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Cung cấp tính năng biến smartphone chạy Android/iOS thành điểm chấp nhận thanh toán thẻ không cần đầu tư máy POS truyền thống, phí ưu đãi 0.8% - 1.0%.',
        synthesizedImpact:
          'Làm giảm nhu cầu thuê máy POS truyền thống của VCB tại các cửa hàng ăn uống, chuỗi bán lẻ nhỏ và dịch vụ giao hàng.',
        recommendedAction:
          'Đẩy mạnh tính năng VCB Tap-to-phone trên ứng dụng VCB Digibank và hạ phí chấp nhận thẻ cho merchant mới.',
        severity: 'high',
        subItems: [],
      },
      'tts-qd2345': {
        id: 'c-tts-qd2345',
        pillar: 'thanh_toan_so',
        themeTitle: 'Tối ưu trải nghiệm xác thực sinh trắc học khuôn mặt AI theo Quyết định 2345 NHNN',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Nâng cấp thuật toán AI FaceID nhận diện trong 1 giây, loại bỏ hiện tượng nghẽn mạng khi chuyển tiền trên 10 triệu đồng, bảo hiểm an toàn tài khoản miễn phí.',
        synthesizedImpact:
          'Gia tăng độ hài lòng của người dùng cuối; khách hàng chuyển sang giao dịch trên app đối thủ nếu app VCB chậm xử lý sinh trắc học.',
        recommendedAction:
          'Tối ưu hóa máy chủ xác thực sinh trắc học và truyền thông mạnh về chuẩn mực bảo mật thanh toán VCB.',
        severity: 'medium',
        subItems: [],
      },

      // Nhóm 4: Tín dụng
      'td-vneid': {
        id: 'c-td-vneid',
        pillar: 'tin_dung',
        themeTitle: 'Cho vay tiêu dùng & Sản xuất kinh doanh phê duyệt siêu tốc 5 phút qua liên kết cơ sở dữ liệu VNeID',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Kết nối trực tiếp hệ thống ngân hàng với cơ sở dữ liệu dân cư quốc gia VNeID để chấm điểm tín dụng tự động, cấp hạn mức vay không tài sản bảo đảm đến 200 triệu đồng giải ngân ngay trong ngày.',
        synthesizedImpact:
          'Rút ngắn thời gian tiếp cận khách hàng cá nhân; VCB đối mặt áp lực cạnh tranh về thủ tục phê duyệt truyền thống.',
        recommendedAction:
          'Triển khai phê duyệt tín dụng tức thì cho khách hàng trả lương qua VCB kết hợp làm sạch dữ liệu VNeID.',
        severity: 'critical',
        subItems: [],
      },
      'td-laisuat': {
        id: 'c-td-laisuat',
        pillar: 'tin_dung',
        themeTitle: 'Cuộc đua hạ lãi suất vay mua nhà, đất và SXKD xuống mốc 5.5% - 5.9%/năm cố định 24 tháng',
        banks: [],
        isOverlap: false,
        reportsCount: 0,
        synthesizedContent:
          'Áp dụng biên độ lãi suất siêu cạnh tranh (5.5% - 5.9%/năm) cho các khoản vay mua nhà ở xã hội, ân hạn nợ gốc đến 24 tháng và miễn phí trả nợ trước hạn từ năm thứ 3.',
        synthesizedImpact:
          'Cạnh tranh khốc liệt về biên lãi thuần NIM; nguy cơ khách hàng vay mua nhà chuyển nợ sang ngân hàng khác.',
        recommendedAction:
          'Linh hoạt điều chỉnh gói lãi suất vay mua nhà "An cư lạc nghiệp" của VCB để bảo vệ danh mục dư nợ bán lẻ.',
        severity: 'high',
        subItems: [],
      },
    };

    // Distribute staff records into clusters
    list.forEach((rec) => {
      const txt = (rec.content + ' ' + rec.impactOnVcb).toLowerCase();
      let assignedClusterKey = '';

      if (rec.pillarCategory === 'ho_kinh_doanh') {
        if (txt.includes('soundbox') || txt.includes('loa') || txt.includes('hóa đơn') || txt.includes('thấu chi')) {
          assignedClusterKey = 'hkd-soundbox';
        } else {
          assignedClusterKey = 'hkd-digital';
        }
      } else if (rec.pillarCategory === 'gpmb') {
        if (txt.includes('vành đai') || txt.includes('cao tốc') || txt.includes('quầy') || txt.includes('lãi suất') || txt.includes('tiết kiệm')) {
          assignedClusterKey = 'gpmb-caotoc';
        } else {
          assignedClusterKey = 'gpmb-longthanh';
        }
      } else if (rec.pillarCategory === 'thanh_toan_so') {
        if (txt.includes('tap') || txt.includes('pos') || txt.includes('chạm') || txt.includes('contactless')) {
          assignedClusterKey = 'tts-tap-phone';
        } else {
          assignedClusterKey = 'tts-qd2345';
        }
      } else if (rec.pillarCategory === 'tin_dung') {
        if (txt.includes('vneid') || txt.includes('dân cư') || txt.includes('chấm điểm') || txt.includes('tự động')) {
          assignedClusterKey = 'td-vneid';
        } else {
          assignedClusterKey = 'td-laisuat';
        }
      }

      if (assignedClusterKey && clusterMap[assignedClusterKey]) {
        const cluster = clusterMap[assignedClusterKey];
        if (rec.competitor && !cluster.banks.includes(rec.competitor)) {
          cluster.banks.push(rec.competitor);
        }
        cluster.reportsCount += 1;
        cluster.subItems.push({
          id: rec.id,
          submitterEmail: rec.emailcb || rec.submitterEmail || 'qlkcn.ho',
          competitor: rec.doithu || rec.competitor || 'Đối thủ',
          content: rec.tintuc || rec.content || '',
          impactOnVcb: rec.tacdong || rec.impactOnVcb || '',
          timestamp: rec.updatedAt || rec.createdAt,
          evidenceCount: rec.evidenceFiles?.length || 0,
          rawRecord: rec,
        });
      }
    });

    // Check overlaps & format
    return Object.values(clusterMap).map((c) => {
      // Overlap occurs if multiple banks are involved or multiple reports entered
      const isOverlap = c.banks.length > 1 || c.reportsCount >= 2;
      return {
        ...c,
        isOverlap,
      };
    });
  }, [filteredOfficerRecords]);

  // ========================================================================
  // 2. TỔNG HỢP & PHÂN TÍCH THỊ TRƯỜNG CÔ ĐỌNG (4 NHÓM BÁN LẺ 2026)
  // ========================================================================
  const marketClusters = useMemo(() => {
    const list = filteredMarketItems || [];

    // Group raw market items into 4 condensed strategic themes
    const themes: { [key in RetailPillar]?: SynthesizedCluster } = {
      ho_kinh_doanh: {
        id: 'mkt-c-hkd',
        pillar: 'ho_kinh_doanh',
        themeTitle: 'Chuyển đổi số hộ kinh doanh: Soundbox, Phần mềm bán hàng & Tín chấp luồng tiền QR',
        banks: [],
        isOverlap: true,
        reportsCount: 0,
        synthesizedContent:
          'Liên minh giữa ngân hàng thương mại và các nền tảng SaaS (KiotViet, Sapo, Zalo) cung cấp gói giải pháp toàn diện trước hạn chót chuẩn hóa hóa đơn điện tử 2026. Chủ hộ được tặng trọn gói loa thông minh, cấp trước thấu chi và miễn phí giao dịch.',
        synthesizedImpact:
          'Nguy cơ mất thị phần CASA bán lẻ quy mô lớn vào tay nhóm Techcombank, VPBank, MB Bank tại các chợ đầu mối trọng điểm.',
        recommendedAction:
          'Đẩy mạnh truyền thông gói giải pháp "VCB Merchant 2026", tích hợp loa thanh toán và miễn phí máy in hóa đơn.',
        severity: 'critical',
        subItems: [],
      },
      gpmb: {
        id: 'mkt-c-gpmb',
        pillar: 'gpmb',
        themeTitle: 'Dòng tiền bồi thường đền bù hạ tầng & cao tốc: Tiếp cận nguồn vốn tại gốc',
        banks: [],
        isOverlap: true,
        reportsCount: 0,
        synthesizedContent:
          'Hàng chục nghìn tỷ đồng tiền bồi thường GPMB tại các tuyến Vành đai 4, Cao tốc Bắc - Nam và Sân bay Long Thành đang được các đối thủ tiếp cận quyết liệt qua quầy cơ động, phát hành thẻ an sinh và chính sách cộng thưởng lãi suất tiết kiệm.',
        synthesizedImpact:
          'Áp lực lớn lên chỉ tiêu huy động vốn cá nhân của các Chi nhánh VCB tại các vùng dự án trọng điểm.',
        recommendedAction:
          'Lãnh đạo Chi nhánh chủ động ký thỏa thuận chi trả trực tiếp với Ban QLDA và Hội đồng bồi thường huyện/thị xã.',
        severity: 'critical',
        subItems: [],
      },
      thanh_toan_so: {
        id: 'mkt-c-thanh_toan_so',
        pillar: 'thanh_toan_so',
        themeTitle: 'Cuộc cách mạng thanh toán chạm Tap-to-phone & Bảo mật sinh trắc học AI theo QĐ 2345',
        banks: [],
        isOverlap: true,
        reportsCount: 0,
        synthesizedContent:
          'Các đối thủ đẩy mạnh biến điện thoại thành máy POS (SoftPOS/Tap-to-phone) nhằm tiết giảm chi phí thiết bị, đồng thời ứng dụng công nghệ nhận diện khuôn mặt AI liveness để bảo vệ tài khoản khách hàng khi chuyển tiền lớn.',
        synthesizedImpact:
          'Giảm doanh thu dịch vụ POS truyền thống của VCB; đòi hỏi trải nghiệm ứng dụng VCB Digibank phải siêu mượt mà.',
        recommendedAction:
          'Hoàn thiện tính năng Tap-to-phone trên VCB Digibank và triển khai chiến dịch bảo chứng thanh toán an toàn.',
        severity: 'high',
        subItems: [],
      },
      tin_dung: {
        id: 'mkt-c-tin_dung',
        pillar: 'tin_dung',
        themeTitle: 'Cạnh tranh lãi suất cho vay 5.5% - 5.9% và Phê duyệt tự động hóa qua định danh VNeID',
        banks: [],
        isOverlap: true,
        reportsCount: 0,
        synthesizedContent:
          'Các ngân hàng cắt giảm thủ tục giấy tờ, khai thác dữ liệu công dân VNeID để chấm điểm tín dụng tự động trong vài phút, đồng thời đưa mức lãi suất cho vay mua nhà và sản xuất kinh doanh xuống mức thấp kỷ lục.',
        synthesizedImpact:
          'Áp lực giảm lãi suất cho vay của VCB để giữ chân các khách hàng tốt; nguy cơ chuyển dịch dư nợ sang đối thủ.',
        recommendedAction:
          'Rà soát danh mục khách hàng cá nhân có uy tín để cấp trước hạn mức vay ưu đãi với quy trình số hóa toàn diện.',
        severity: 'critical',
        subItems: [],
      },
    };

    // Populate from market items
    list.forEach((item) => {
      const theme = themes[item.pillar];
      if (theme) {
        item.competitors.forEach((c) => {
          if (!theme.banks.includes(c)) {
            theme.banks.push(c);
          }
        });
        theme.reportsCount += 1;
        theme.subItems.push({
          id: item.id,
          competitor: item.competitors.join(', '),
          content: item.title + ': ' + item.summary,
          impactOnVcb: item.impactOnVcb,
          timestamp: item.timestamp,
          source: item.source,
        });
      }
    });

    return Object.values(themes);
  }, [filteredMarketItems]);

  // Current active clusters based on tab
  const activeClusters = activeTab === 'officer' ? officerClusters : marketClusters;

  // Filter clusters by selected pillar & search
  const filteredClusters = activeClusters.filter((c) => {
    const matchesPillar = selectedPillar === 'all' || c.pillar === selectedPillar;
    const matchesSearch =
      searchQuery === '' ||
      c.themeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.synthesizedContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.synthesizedImpact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.banks.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    // When viewing officer tab, hide empty clusters unless search is cleared
    if (activeTab === 'officer' && c.reportsCount === 0 && searchQuery === '') {
      return false;
    }

    return matchesPillar && matchesSearch;
  });

  // Calculate high-level summary metrics
  const totalOverlaps = filteredClusters.filter((c) => c.isOverlap && c.banks.length > 1).length;
  const allParticipatingBanks = Array.from(
    new Set(filteredClusters.flatMap((c) => c.banks))
  ).filter(Boolean);

  const getPillarIcon = (pillar: RetailPillar) => {
    switch (pillar) {
      case 'ho_kinh_doanh':
        return <Store className="w-4 h-4 text-amber-700" />;
      case 'gpmb':
        return <MapPin className="w-4 h-4 text-emerald-700" />;
      case 'thanh_toan_so':
        return <Smartphone className="w-4 h-4 text-blue-700" />;
      case 'tin_dung':
        return <CreditCard className="w-4 h-4 text-purple-700" />;
      default:
        return <Layers className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header & Tab Navigation */}
      <div className="bg-gradient-to-r from-[#00523d] via-[#005a43] to-[#00523d] text-white p-4 border-b border-emerald-600/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-xs"></span>
              <h2 className="text-sm font-bold tracking-wide uppercase text-white">
                PHÂN TÍCH THÔNG TIN THỊ TRƯỜNG
              </h2>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Phân loại 4 nhóm trọng tâm bán lẻ 2026 • Bám sát thông tin cán bộ & Phát hiện trùng hợp đối thủ
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-[#004231] p-1 rounded-lg border border-emerald-500/40">
            <button
              onClick={handleSelectOfficerTab}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                activeTab === 'officer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Thông tin cán bộ nhập</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-900 text-[10px] text-emerald-100 font-mono">
                {filteredOfficerRecords.length}
              </span>
            </button>

            <button
              onClick={handleSelectMarketTab}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                activeTab === 'market'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-300" />
              <span>Radar thị trường (Cô đọng)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#003628] text-[10px] text-emerald-100 font-mono">
                {filteredMarketItems.length}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Filter Pills */}
        <div className="mt-3.5 pt-3 border-t border-emerald-600/40 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedPillar('all')}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition cursor-pointer ${
                selectedPillar === 'all'
                  ? 'bg-white text-[#00523d] font-bold shadow-xs'
                  : 'bg-[#004231] text-emerald-100 hover:bg-[#003628]'
              }`}
            >
              Tất cả 4 nhóm
            </button>
            <button
              onClick={() => setSelectedPillar('ho_kinh_doanh')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-xs transition cursor-pointer ${
                selectedPillar === 'ho_kinh_doanh'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-[#004231] text-emerald-100 hover:bg-[#003628]'
              }`}
            >
              <Store className="w-3 h-3 text-amber-300" />
              <span>Hộ kinh doanh</span>
            </button>
            <button
              onClick={() => setSelectedPillar('gpmb')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-xs transition cursor-pointer ${
                selectedPillar === 'gpmb'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'bg-[#004231] text-emerald-100 hover:bg-[#003628]'
              }`}
            >
              <MapPin className="w-3 h-3 text-emerald-300" />
              <span>GPMB</span>
            </button>
            <button
              onClick={() => setSelectedPillar('thanh_toan_so')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-xs transition cursor-pointer ${
                selectedPillar === 'thanh_toan_so'
                  ? 'bg-blue-500 text-white font-bold shadow-xs'
                  : 'bg-[#004231] text-emerald-100 hover:bg-[#003628]'
              }`}
            >
              <Smartphone className="w-3 h-3 text-blue-300" />
              <span>Thanh toán số</span>
            </button>
            <button
              onClick={() => setSelectedPillar('tin_dung')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-xs transition cursor-pointer ${
                selectedPillar === 'tin_dung'
                  ? 'bg-purple-500 text-white font-bold shadow-xs'
                  : 'bg-[#004231] text-emerald-100 hover:bg-[#003628]'
              }`}
            >
              <CreditCard className="w-3 h-3 text-purple-300" />
              <span>Tín dụng</span>
            </button>
          </div>

          {/* Quick Search in Clusters */}
          <div className="relative w-full sm:w-48">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lọc đối thủ, từ khóa..."
              className="w-full bg-[#004231] border border-emerald-500/50 rounded-md px-2.5 py-1 pl-7 text-xs text-white placeholder-emerald-200/60 focus:outline-none focus:border-emerald-300"
            />
            <Search className="w-3.5 h-3.5 text-emerald-300 absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* THANH ĐIỀU KHIỂN: THÔNG TIN CÁN BỘ NHẬP / RADAR THỊ TRƯỜNG */}
      {/* ==================================================================== */}
      {activeTab === 'officer' ? (
        /* TAB CÁN BỘ: QUÉT & TỔNG HỢP VỚI 3 LỰA CHỌN 1 TUẦN (ƯU TIÊN), 1 THÁNG, TOÀN BỘ */
        <div className="bg-[#004734] border-b border-emerald-700/60 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="font-bold text-emerald-50 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Quét & Tổng hợp thông tin cán bộ:</span>
            </span>
            <span className="text-[11px] text-emerald-200/80 hidden md:inline">
              (Chu kỳ tổng hợp)
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* 3 Lựa chọn: 1 tuần (ưu tiên), 1 tháng, toàn bộ */}
            <div className="inline-flex items-center bg-[#003829] p-0.5 rounded-lg border border-emerald-600/60 shadow-inner">
              <button
                onClick={() => handleTriggerOfficerScan('1_week')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  officerTimeRange === '1_week'
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
                title="Quét và tổng hợp dữ liệu cán bộ nhập trong 1 tuần qua (Ưu tiên)"
              >
                <span>1 tuần</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900 text-emerald-200 font-extrabold uppercase tracking-wide">
                  Ưu tiên
                </span>
              </button>

              <button
                onClick={() => handleTriggerOfficerScan('1_month')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  officerTimeRange === '1_month'
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
                title="Quét và tổng hợp dữ liệu cán bộ nhập trong 1 tháng qua"
              >
                1 tháng
              </button>

              <button
                onClick={() => handleTriggerOfficerScan('all')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  officerTimeRange === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
                }`}
                title="Quét và tổng hợp toàn bộ lịch sử thông tin do cán bộ nhập"
              >
                Toàn bộ
              </button>
            </div>

            {/* Nút bấm Quét lại ngay */}
            <button
              onClick={() => handleTriggerOfficerScan()}
              disabled={isScanningOfficer}
              className="flex items-center gap-1.5 bg-[#003829] hover:bg-emerald-700 active:bg-[#002d21] text-emerald-100 px-2.5 py-1 rounded-md border border-emerald-500/70 font-semibold transition cursor-pointer disabled:opacity-50 text-xs shadow-xs"
              title="Quét & tổng hợp lại ngay lập tức"
            >
              <RefreshCw className={`w-3 h-3 text-emerald-300 ${isScanningOfficer ? 'animate-spin' : ''}`} />
              <span>{isScanningOfficer ? 'Đang quét...' : 'Quét lại'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* TAB RADAR THỊ TRƯỜNG: 2 LỰA CHỌN CẬP NHẬT HOẶC GIỮ NGUYÊN; NẾU CẬP NHẬT: 1 NGÀY, 1 TUẦN, 1 THÁNG + NÚT QUÉT LẠI */
        <div className="bg-[#004734] border-b border-emerald-700/60 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="font-bold text-emerald-50">
              Radar thị trường:
            </span>
            <span className="text-[11px] text-emerald-200/80 hidden md:inline">
              (Luồng thông tin đối thủ Big 4, NHTMCP & Fintech)
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* 2 Lựa chọn chính: Cập nhật hoặc Giữ nguyên */}
            <div className="inline-flex items-center bg-[#003829] p-0.5 rounded-lg border border-emerald-600/60">
              <button
                onClick={() => handleSetRadarMode('keep')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  radarMode === 'keep'
                    ? 'bg-white text-[#00523d] shadow-sm font-bold'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Giữ nguyên dữ liệu radar thị trường chuẩn định kỳ 2026"
              >
                <span>Giữ nguyên</span>
              </button>

              <button
                onClick={() => handleSetRadarMode('update')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  radarMode === 'update'
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Cập nhật radar thị trường theo chu kỳ thời gian"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span>Cập nhật</span>
              </button>
            </div>

            {/* TRƯỜNG HỢP CHỌN CẬP NHẬT: ĐƯA RA 3 LỰA CHỌN: 1 NGÀY, 1 TUẦN, 1 THÁNG + NÚT QUÉT LẠI */}
            {radarMode === 'update' && (
              <div className="flex items-center flex-wrap gap-2 bg-[#003829] px-2.5 py-1 rounded-lg border border-emerald-500/70 shadow-xs">
                <span className="text-[11px] text-emerald-200 font-medium">Khoảng cập nhật:</span>
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => handleSetRadarPeriod('1_day')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      radarUpdatePeriod === '1_day'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                    }`}
                    title="Cập nhật radar trong 1 ngày (24 giờ qua)"
                  >
                    1 ngày
                  </button>
                  <button
                    onClick={() => handleSetRadarPeriod('1_week')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      radarUpdatePeriod === '1_week'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                    }`}
                    title="Cập nhật radar trong 1 tuần (7 ngày qua)"
                  >
                    1 tuần
                  </button>
                  <button
                    onClick={() => handleSetRadarPeriod('1_month')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      radarUpdatePeriod === '1_month'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                    }`}
                    title="Cập nhật radar trong 1 tháng (30 ngày qua)"
                  >
                    1 tháng
                  </button>
                </div>

                {/* NÚT QUÉT LẠI BẮT BUỘC TUÂN THỦ ĐÚNG ĐIỀU KIỆN 1 NGÀY / 1 TUẦN / 1 THÁNG */}
                <button
                  onClick={handleRescanRadar}
                  disabled={isScanningRadar}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold transition shadow-xs cursor-pointer disabled:opacity-50 text-xs border border-amber-300"
                  title={`Quét lại toàn bộ thị trường theo đúng điều kiện ${
                    radarUpdatePeriod === '1_day'
                      ? '1 ngày (24 giờ qua)'
                      : radarUpdatePeriod === '1_week'
                      ? '1 tuần (7 ngày qua)'
                      : '1 tháng (30 ngày qua)'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-950 ${isScanningRadar ? 'animate-spin' : ''}`} />
                  <span>{isScanningRadar ? 'Đang quét...' : 'Quét lại'}</span>
                </button>

                <span className="text-[10px] text-emerald-300/80 hidden lg:inline">
                  (Lúc {lastRadarScanTime})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytical Summary Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            {activeTab === 'officer' ? (
              <span>
                Đã quét & tổng hợp <strong>{filteredOfficerRecords.length}</strong>/{records.length} thông tin cán bộ (
                {officerTimeRange === '1_week'
                  ? '1 tuần qua • Ưu tiên'
                  : officerTimeRange === '1_month'
                  ? '1 tháng qua'
                  : 'Toàn bộ thời gian'}
                ):
              </span>
            ) : (
              <span>
                Radar thị trường ({radarMode === 'update' ? `Cập nhật ${radarUpdatePeriod === '1_day' ? '1 ngày qua' : radarUpdatePeriod === '1_week' ? '1 tuần qua' : '1 tháng qua'}` : 'Giữ nguyên dữ liệu chuẩn 2026'}):
              </span>
            )}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            {filteredClusters.length} chuyên đề
          </span>
        </div>

        {allParticipatingBanks.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Đối thủ xuất hiện:</span>
            <div className="flex flex-wrap gap-1">
              {allParticipatingBanks.slice(0, 5).map((b) => (
                <span
                  key={b}
                  className="px-1.5 py-0.2 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                >
                  {b}
                </span>
              ))}
              {allParticipatingBanks.length > 5 && (
                <span className="text-slate-500 font-medium">+{allParticipatingBanks.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis List */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
        {filteredClusters.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">
              Chưa có dữ liệu phân tích phù hợp với tiêu chí lọc
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Hãy nhập thêm thông tin đối thủ vào biểu mẫu bên trái hoặc chuyển đổi bộ lọc nhóm bán lẻ.
            </p>
          </div>
        ) : (
          filteredClusters.map((cluster) => {
            const pillarInfo = PILLAR_LABELS[cluster.pillar] || PILLAR_LABELS.khac;
            const isExpanded = expandedClusterId === cluster.id;
            const hasMultipleBanks = cluster.banks.length > 1;

            return (
              <div
                key={cluster.id}
                className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-xs overflow-hidden"
              >
                {/* Cluster Header */}
                <div className="p-4 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.8 rounded text-xs font-bold border ${pillarInfo.badgeColor}`}
                      >
                        {getPillarIcon(cluster.pillar)}
                        <span>{pillarInfo.label}</span>
                      </span>

                      <span className="text-[11px] text-slate-500 font-medium">
                        {cluster.reportsCount} nguồn ghi nhận
                      </span>
                    </div>

                    {/* Impact Level Badge */}
                    {cluster.severity === 'critical' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                        Tác động cấp bách
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Đáng chú ý
                      </span>
                    )}
                  </div>

                  {/* Title of the cluster */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2.5">
                    {cluster.themeTitle}
                  </h3>

                  {/* ========================================================= */}
                  {/* OVERLAPPING HIGHLIGHT BOX: Nêu tên cụ thể các ngân hàng trùng */}
                  {/* ========================================================= */}
                  {hasMultipleBanks ? (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/80 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-900 flex items-center gap-1 flex-wrap">
                            <span>Phát hiện sự trùng hợp triển khai tại {cluster.banks.length} ngân hàng:</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {cluster.banks.map((bank) => (
                              <span
                                key={bank}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-amber-300 text-xs font-bold text-amber-900 shadow-xs"
                              >
                                <Building2 className="w-3 h-3 text-amber-600" />
                                {bank}
                              </span>
                            ))}
                          </div>
                          <p className="text-[11px] text-amber-800/90 mt-1.5 leading-relaxed">
                            Cả {cluster.banks.join(', ')} đều đang đồng loạt áp dụng chiến thuật tương đồng này trên địa bàn.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : cluster.banks.length === 1 ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                      <span className="font-medium text-slate-500">Ngân hàng ghi nhận:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold text-slate-800">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {cluster.banks[0]}
                      </span>
                    </div>
                  ) : null}

                  {/* Synthesized Content */}
                  <div className="text-xs text-slate-700 leading-relaxed space-y-2 mb-3">
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-900">Tóm lược hành động đối thủ: </strong>
                      {cluster.synthesizedContent}
                    </p>
                  </div>

                  {/* Impact on VCB */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 mb-3">
                    <div className="font-bold text-emerald-900 mb-0.5 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Đánh giá tác động đến Vietcombank:</span>
                    </div>
                    <p className="leading-relaxed text-emerald-900/90 pl-4.5">
                      {cluster.synthesizedImpact}
                    </p>
                  </div>

                  {/* Action Recommendation */}
                  <div className="p-2 rounded bg-slate-100 text-[11px] text-slate-700 border border-slate-200">
                    <strong className="text-slate-800">💡 Kiến nghị phản ứng cho Chi nhánh/Khối Bán lẻ: </strong>
                    {cluster.recommendedAction}
                  </div>
                </div>

                {/* Sub-items / Raw reports drawer toggle */}
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setExpandedClusterId(isExpanded ? null : cluster.id)}
                    className="text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? 'Thu gọn danh sách chi tiết'
                        : `Xem chi tiết ${cluster.subItems.length} nguồn thông tin thành phần`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onExtractToForm({
                        competitor: cluster.banks.join(', ') || 'Nhiều đối thủ',
                        content: cluster.synthesizedContent,
                        impactOnVcb: cluster.synthesizedImpact,
                        pillarCategory: cluster.pillar,
                        impactLevel: cluster.severity,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    title="Sao chép nội dung chuyên đề này vào biểu mẫu nhập liệu"
                  >
                    <span>Trích xuất vào form</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Expanded Sub-items List */}
                {isExpanded && (
                  <div className="p-4 bg-slate-100/70 border-t border-slate-200 space-y-2.5">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                      <span>Danh sách thông tin gốc cấu thành chuyên đề này ({cluster.subItems.length}):</span>
                      {activeTab === 'officer' && (
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                          Bám sát tuyệt đối thông tin do cán bộ cung cấp
                        </span>
                      )}
                    </h4>

                    {cluster.subItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                              {item.competitor}
                            </span>
                            {item.submitterEmail && (
                              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Cán bộ: {item.submitterEmail}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                        </div>

                        <p className="text-slate-800 leading-relaxed mb-2 bg-slate-50/70 p-2 rounded border border-slate-200">
                          {item.content}
                        </p>

                        <div className="text-[11px] text-emerald-900 bg-emerald-50/60 p-2 rounded border border-emerald-200 mb-2">
                          <strong className="text-emerald-950">Tác động đối với Vietcombank: </strong>
                          {item.impactOnVcb}
                        </div>

                        {/* Citation for automated intelligence */}
                        {item.source && (
                          <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-[11px] text-slate-800">
                            <span className="font-bold text-emerald-800 shrink-0">📌 Nguồn trích dẫn cụ thể:</span>
                            <span className="font-semibold text-slate-900">{item.source}</span>
                          </div>
                        )}

                        {item.evidenceCount && item.evidenceCount > 0 ? (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                            <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                            <span>{item.evidenceCount} tệp bằng chứng đính kèm</span>
                          </div>
                        ) : null}

                        {item.rawRecord && onSelectRecordToEdit && (
                          <div className="mt-2 text-right">
                            <button
                              type="button"
                              onClick={() => onSelectRecordToEdit(item.rawRecord!)}
                              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                            >
                              Tải lên để chỉnh sửa lại bản ghi này
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
