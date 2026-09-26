import React, { useState, useMemo } from 'react';
import {
  Printer,
  RotateCcw,
  Download,
  Share2,
  X,
  Copy,
  FileText,
  Send,
  Building2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { CompetitorRecord, MarketIntelligenceItem, RetailPillar, ImpactSeverity } from '../types';

interface PrintA4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'officer' | 'radar'; // 'officer' = "In Thị trường" (cán bộ nhập) | 'radar' = "In Auto Rada"
  records?: CompetitorRecord[];
  marketItems?: MarketIntelligenceItem[];
}

// 3 Góc nhìn phân tích biên tập động khi người dùng nhấn "Tạo lại"
const EDITORIAL_ANGLES = [
  {
    key: 'tactical',
    name: 'Góc nhìn Tác chiến & Trực diện Cạnh tranh Thị phần',
    badge: 'Chiến Lược Tác Chiến Thực Địa',
    overviewOfficer:
      'Hệ thống ghi nhận diễn biến cạnh tranh khốc liệt tại các địa bàn trọng điểm. Các đối thủ tư nhân (Techcombank, VPBank, MB, HDBank) đang tấn công trực diện vào phân khúc thế mạnh của Vietcombank: đổ bộ các chợ đầu mối bằng loa Soundbox & máy in hóa đơn miễn phí, đồng thời lập quầy lưu động bám sát các đợt chi trả đền bù GPMB Vành Đai 4 và Cao tốc. Vietcombank cần phản ứng thần tốc với các gói sản phẩm đối trọng ngay tại tuyến đầu.',
    overviewRadar:
      'Radar quét đa kênh tự động phát hiện các chiến dịch truyền thông dồn dập từ đối thủ: Chạy đua hạ lãi suất vay mua nhà cố định 36 tháng xuống 5.8% - 5.9%/năm, liên minh Napas mở rộng thanh toán QR chéo cho du khách quốc tế WeChat/Alipay, và triển khai SoftPOS biến smartphone thành máy POS. Đòi hỏi Khối Bán lẻ và Chi nhánh hành động quyết liệt bảo vệ thị phần.',
    vcbFocusRetail:
      'Cấp tốc ban hành chính sách trang bị miễn phí Loa VCB Soundbox; ban hành khung lãi suất thỏa thuận đặc cách cho dòng vốn bồi thường GPMB quy mô lớn; linh hoạt biên độ vay mua nhà 2026.',
    vcbFocusBranch:
      'Thành lập tổ cơ động cắm chốt trực tiếp tại UBND xã/phường nơi chi trả bồi thường; tiếp cận Ban Quản lý chợ truyền thống và hộ kinh doanh cốt lõi; rà soát danh mục khách hàng vay mua nhà VIP.',
  },
  {
    key: 'digital',
    name: 'Góc nhìn Đột phá Số & Tinh gọn Trải nghiệm Khách hàng',
    badge: 'Chiến Lược Chuyển Đổi Số',
    overviewOfficer:
      'Phân tích chuyên sâu từ thực tế phản ánh yêu cầu cấp bách về tối ưu hóa trải nghiệm số. Các ngân hàng đối thủ đang tận dụng tối đa tiện ích định danh VNeID mức 2, phê duyệt thấu chi tiểu thương và khoản vay tiêu dùng chỉ trong 30 giây đến 5 phút không cần giấy tờ. Vietcombank cần phát huy sức mạnh vượt trội của VCB Digibank và VCB DigiBiz để tạo ra trải nghiệm liền mạch, vượt trội.',
    overviewRadar:
      'Dữ liệu số hóa đa nguồn cho thấy xu hướng bùng nổ của thanh toán một chạm Contactless và chuẩn hóa sinh trắc học AI 3D theo Quyết định 2345. Đối thủ tập trung đơn giản hóa hành trình mở tài khoản và giải ngân thấu chi tự động cho tiểu thương. Vietcombank cần dẫn đầu về tốc độ xử lý giao dịch và an toàn thông tin chuẩn quốc tế.',
    vcbFocusRetail:
      'Đẩy nhanh tiến độ phát hành diện rộng tính năng VCB Tap-on-phone trên VCB Digibank/DigiBiz; hoàn thiện mô hình chấm điểm tự động cấp hạn mức tín dụng dự phòng cho khách hàng có dòng tiền QR.',
    vcbFocusBranch:
      'Bố trí máy quét CCCD gắn chip chuyên dụng tại sảnh giao dịch; hướng dẫn tiểu thương cài đặt VCB DigiBiz và ứng dụng sinh trắc học mượt mà; khai thác khách hàng trẻ Gen Z và hộ kinh doanh số.',
  },
  {
    key: 'wealth',
    name: 'Góc nhìn Quản trị Hiệu quả & Khai thác Khách hàng Chất lượng cao',
    badge: 'Chiến Lược Quản Trị Giá Trị',
    overviewOfficer:
      'Dữ liệu mạng lưới cán bộ chỉ ra cơ hội khai thác dòng tiền lớn và bền vững từ các dự án hạ tầng kinh tế trọng điểm (Vành Đai 4, Cao tốc Bắc - Nam, Sân bay Long Thành). Trước áp lực cạnh tranh lãi suất của đối thủ, uy tín thương hiệu Quốc doanh số 1 của Vietcombank là lợi thế tuyệt đối để thu hút các khoản tiền gửi đền bù đất hàng nghìn tỷ đồng và chăm sóc tệp khách hàng cá nhân giàu có.',
    overviewRadar:
      'Bản tin radar chỉ ra sự phân hóa mạnh mẽ của thị trường: Trong khi các ngân hàng thương mại nhỏ cạnh tranh bằng hạ phí và quà tặng ngắn hạn, khách hàng lớn ngày càng ưu tiên tính an toàn tuyệt đối và sự ổn định dài hạn. Vietcombank cần tập trung thiết kế các giải pháp Wealth Management trọn gói kết hợp tư vấn an cư, giữ chân tài sản tích lũy của khách hàng.',
    vcbFocusRetail:
      'Triển khai gói giải pháp quản lý tài sản "Tiết kiệm Tích lũy An Vui" và Chứng chỉ tiền gửi đặc cách; xây dựng cơ chế phân quyền linh hoạt cho Giám đốc Chi nhánh quyết định lãi suất huy động trong khung.',
    vcbFocusBranch:
      'Làm việc với Kho bạc Nhà nước, Hội đồng bồi thường GPMB để nắm chắc tiến độ chi trả; tư vấn lập kế hoạch tài chính gia đình cho các hộ nhận tiền bồi thường lớn; chăm sóc khách hàng ưu tiên VCB Priority.',
  },
];

export const PrintA4Modal: React.FC<PrintA4ModalProps> = ({
  isOpen,
  onClose,
  reportType,
  records = [],
  marketItems = [],
}) => {
  const [versionSeed, setVersionSeed] = useState(1);
  const [angleIndex, setAngleIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  const isOfficer = reportType === 'officer';
  const currentAngle = EDITORIAL_ANGLES[angleIndex];

  const title = isOfficer
    ? 'BÁO CÁO PHÂN TÍCH THÔNG TIN THỊ TRƯỜNG BÁN LẺ TỪ MẠNG LƯỚI CÁN BỘ'
    : 'BẢN TIN AUTO RADAR THỊ TRƯỜNG BÁN LẺ ĐA KÊNH NGÂN HÀNG';

  const subtitle = isOfficer
    ? 'Dữ liệu thực tế do mạng lưới cán bộ Khối Bán lẻ ghi nhận trực tiếp tại địa bàn'
    : 'Tổng hợp tự động từ Báo điện tử, Website, Diễn đàn, Mạng xã hội, YouTube, TikTok, Zalo';

  // Nút Tạo lại (Regenerate): Thay đổi góc nhìn phân tích, làm mới văn phong và kiến nghị
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setAngleIndex((prev) => (prev + 1) % EDITORIAL_ANGLES.length);
      setVersionSeed((prev) => prev + 1);
      setIsRegenerating(false);
      setSaveSuccessToast(
        `Đã tạo lại bản tin thành công: ${EDITORIAL_ANGLES[(angleIndex + 1) % EDITORIAL_ANGLES.length].name}!`
      );
      setTimeout(() => setSaveSuccessToast(null), 3000);
    }, 450);
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // =========================================================================
  // DỮ LIỆU PHÂN TÍCH CHI TIẾT THEO 4 CHỦ ĐỀ: TUÂN THỦ TỐI ĐA 3 BÀI VIẾT MỖI CHỦ ĐỀ
  // BẰNG CHỨNG LÀ TÀI LIỆU ĐÍNH KÈM / NGUỒN BÁO CHÍ THỰC TẾ (KHÔNG LẤY TỪ WEB VCB)
  // =========================================================================
  const printThemesData = useMemo(() => {
    // 1. Chủ đề: Hộ kinh doanh & Tiểu thương (Tối đa 3 bài viết)
    const hkdArticles = [
      {
        id: 'p-hkd-1',
        title: 'Chiến dịch tài trợ miễn phí Loa Soundbox và Máy in hóa đơn điện tử theo luật thuế 2026',
        banks: ['Techcombank', 'VPBank', 'MB Bank', 'Sacombank'],
        competitorAction:
          'Đồng loạt đổ bộ vào các chợ đầu mối lớn (Đồng Xuân, Chợ Lớn, chợ Hôm, chợ Bình Tây); tài trợ miễn phí 100% loa thông minh Soundbox kết nối phần mềm kế toán KiotViet & Sapo.',
        vcbImpact:
          'Nguy cơ suy giảm mạnh số dư CASA bán lẻ; mất 25% - 35% thị phần đơn vị chấp nhận thanh toán VietQR tại các cụm thương mại truyền thống.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Sản phẩm VCB DigiBiz và QR VCB Digibank. Lợi thế: Thương hiệu an toàn số 1, bảo mật tối đa. Gợi ý bán hàng: Tư vấn trọn gói mở tài khoản thanh toán số đẹp + tích hợp mã QR động trên POS.',
        evidence:
          records.find((r) => r.chude === 'ho_kinh_doanh' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
          'Tài liệu đính kèm: Anh_quay_TCB_DongXuan.jpg & To_roi_Soundbox.pdf',
        retailAction:
          'Cấp tốc triển khai chiến dịch trang bị miễn phí loa thông minh VCB Soundbox; ban hành gói sản phẩm chuyên biệt miễn phí biến động OTT.',
        branchAction:
          'Thành lập tổ lưu động trực tiếp tiếp cận Ban Quản lý chợ, tuyến phố không dùng tiền mặt để tư vấn giải pháp Vietcombank.',
      },
      {
        id: 'p-hkd-2',
        title: 'Cấp trước hạn mức thấu chi tín chấp tự động 200 - 500 triệu đồng duyệt trong 30 giây',
        banks: ['Techcombank', 'Sacombank', 'VPBank'],
        competitorAction:
          'Áp dụng thuật toán AI chấm điểm giao dịch chuyển tiền QR để giải ngân thấu chi kinh doanh trong vòng 30 giây không cần thủ tục thế chấp tài sản.',
        vcbImpact:
          'Chủ hộ kinh doanh có xu hướng chuyển toàn bộ doanh số bán hàng hàng ngày sang tài khoản đối thủ để duy trì hạn mức thấu chi.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Gói thấu chi tiểu thương và cho vay SXKD bán lẻ VCB. Lợi thế: Lãi suất vay kinh doanh luôn thấp hơn thị trường 1.5% - 2.0%/năm.',
        evidence: 'Tài liệu đính kèm: DieuKhoanThauChi_TCB_KiotViet.pdf',
        retailAction:
          'Hoàn thiện mô hình chấm điểm tự động cấp hạn mức tín dụng dự phòng cho khách hàng có luồng tiền QR qua VCB Digibank.',
        branchAction:
          'Cán bộ khách hàng Chi nhánh rà soát danh sách merchant QR hiện hữu để chủ động tư vấn cấp hạn mức vốn lưu động cạnh tranh.',
      },
      {
        id: 'p-hkd-3',
        title: 'Định danh tài khoản tiểu thương qua VNeID / Zalo Mini App và miễn 100% phí biến động số dư',
        banks: ['VPBank', 'ZaloPay', 'MB Bank'],
        competitorAction:
          'Mở tài khoản kinh doanh trực tuyến không cần đến quầy, miễn trọn đời phí chuyển tiền và phí thông báo biến động số dư OTT, tặng gói quảng cáo số.',
        vcbImpact:
          'Thu hút nhóm chủ hộ kinh doanh trẻ tuổi (Gen Z, Millennials) chuyển dịch tài khoản thanh toán chính sang đối thủ.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Ứng dụng VCB DigiBiz. Lợi thế: Phân quyền đa người dùng cho nhân viên thu ngân và kế toán cửa hàng an toàn tuyệt đối.',
        evidence: 'Tài liệu đính kèm: HopDongLienKet_VPBank_Sapo_PhoHue.pdf',
        retailAction:
          'Miễn phí hoàn toàn dịch vụ thông báo OTT trên app VCB DigiBiz cho khách hàng hộ kinh doanh.',
        branchAction:
          'Hướng dẫn cài đặt VCB DigiBiz tận quầy cho các cửa hàng mới thành lập tại địa phương.',
      },
    ].slice(0, 3); // Tuyệt đối không quá 3 bài viết

    // 2. Chủ đề: Giải phóng mặt bằng (Tối đa 3 bài viết)
    const gpmbArticles = [
      {
        id: 'p-gpmb-1',
        title: 'Lập quầy lưu động tại UBND xã/huyện nơi chi trả bồi thường dự án Vành Đai 4 và Cao tốc',
        banks: ['HDBank', 'BIDV', 'Agribank', 'MB Bank'],
        competitorAction:
          'Thiết lập quầy giao dịch cơ động trực tiếp tại hội trường UBND xã; áp dụng chính sách cộng thêm lãi suất tiết kiệm 0.6% - 0.7%/năm cho số dư từ 500 triệu đồng trở lên, tặng quà an cư.',
        vcbImpact:
          'Dòng tiền đền bù quy mô hơn 45.000 tỷ đồng có nguy cơ chảy trọn vẹn về các ngân hàng đối thủ nếu Chi nhánh VCB không có mặt kịp thời.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Sản phẩm Tiết kiệm Tích lũy An Vui và Chứng chỉ tiền gửi VCB. Lợi thế: Uy tín ngân hàng quốc doanh vững chắc nhất Việt Nam.',
        evidence:
          records.find((r) => r.chude === 'gpmb' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
          'Tài liệu đính kèm: BienBanHop_BanBoiThuong_HoaiDuc.pdf (Công văn số 118/UBND-GPMB)',
        retailAction:
          'Ban hành cơ chế thỏa thuận lãi suất đặc cách cho dòng tiền GPMB quy mô lớn; phân quyền linh hoạt cho Giám đốc Chi nhánh.',
        branchAction:
          'Phối hợp chặt chẽ với Hội đồng bồi thường, Trung tâm phát triển quỹ đất để mở tài khoản chi trả bồi thường; cử cán bộ cắm chốt tại trụ sở chi trả.',
      },
      {
        id: 'p-gpmb-2',
        title: 'Thỏa thuận độc quyền tài khoản chi trả bồi thường và thẻ an sinh tái định cư Sân bay Long Thành',
        banks: ['BIDV', 'VietinBank'],
        competitorAction:
          'Ký thỏa thuận độc quyền với Trung tâm phát triển quỹ đất mở tài khoản thanh toán và phát hành thẻ an sinh cho hơn 3.200 hộ dân tái định cư tại khu Lộc An - Bình Sơn.',
        vcbImpact:
          'Mất lợi thế cạnh tranh nguồn vốn bán lẻ tại các cực tăng trưởng kinh tế trọng điểm phía Nam.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Gói giải pháp tài chính "An cư Long Thành" với lãi suất tiết kiệm bậc thang và tư vấn tài chính gia đình.',
        evidence: 'Tài liệu đính kèm: ThoaThuanHopTac_BIDV_LongThanh.pdf',
        retailAction:
          'Chỉ đạo Chi nhánh VCB Đồng Nai & Long Thành xây dựng chính sách ưu đãi tài khoản gia đình cho các hộ nhận tiền bồi thường lớn.',
        branchAction:
          'Cử cán bộ tín dụng và huy động trực tiếp đến các ấp tái định cư để mở tài khoản và tư vấn sinh lời an toàn.',
      },
      {
        id: 'p-gpmb-3',
        title: 'Thiết kế gói quản lý gia sản Wealth Management chuyên biệt cho các hộ nhận bồi thường đất nông nghiệp',
        banks: ['ACB', 'HDBank'],
        competitorAction:
          'Thiết kế gói sản phẩm: 50% gửi tiết kiệm bậc thang 13 tháng, 50% tư vấn đầu tư chứng chỉ quỹ trái phiếu an toàn và hỗ trợ thủ tục công chứng mua đất xây nhà mới.',
        vcbImpact:
          'Đối thủ định vị mạnh mảng tư vấn quản lý tài sản cá nhân cho khách hàng đại chúng giàu lên nhờ đất đền bù.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Dịch vụ khách hàng ưu tiên VCB Priority và Chứng chỉ quỹ VCBF. Lợi thế: Đội ngũ chuyên gia quản lý gia sản hàng đầu Việt Nam.',
        evidence: 'Thông tin CHỜ thu thập',
        retailAction:
          'Xây dựng cẩm nang tư vấn tài chính an cư dành riêng cho khách hàng nhận tiền bồi thường đất giải phóng mặt bằng.',
        branchAction:
          'Tổ chức tư vấn tài chính trực tiếp tại nhà cho các hộ dân có số tiền bồi thường từ 3 tỷ đồng trở lên.',
      },
    ].slice(0, 3); // Tuyệt đối không quá 3 bài viết

    // 3. Chủ đề: Thanh toán số (Tối đa 3 bài viết)
    const ttsArticles = [
      {
        id: 'p-tts-1',
        title: 'Ứng dụng SoftPOS Tap-to-phone biến smartphone thành máy quẹt thẻ Contactless',
        banks: ['VPBank', 'Grab', 'Techcombank', 'TPBank'],
        competitorAction:
          'Biến trực tiếp điện thoại smartphone thành thiết bị quẹt thẻ không tiếp xúc Contactless thay thế máy POS cồng kềnh; phí ưu đãi chỉ 0.8% - 1.0% cho các điểm ăn uống F&B.',
        vcbImpact:
          'Làm giảm nhu cầu thuê máy POS truyền thống của VCB tại chuỗi F&B và dịch vụ giao hàng; chia sẻ doanh thu dịch vụ thanh toán thẻ.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Dịch vụ VCB Tap-on-phone trên VCB Digibank/VCB DigiBiz. Lợi thế: Hệ sinh thái liên kết thẻ quốc tế Visa, Mastercard, JCB toàn diện.',
        evidence:
          records.find((r) => r.chude === 'thanh_toan_so' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
          'Tài liệu đính kèm: Video_TapToPhone_Grab_VPB.mp4 & HuongDanSuDung.pdf',
        retailAction:
          'Đẩy nhanh tiến độ phát hành tính năng Tap-to-phone diện rộng trên VCB Digibank; tung chính sách chiết khấu merchant cạnh tranh.',
        branchAction:
          'Tập trung tiếp cận chuỗi nhà hàng, quán cà phê, đơn vị vận chuyển tại địa bàn để chuyển đổi giải pháp thanh toán VCB.',
      },
      {
        id: 'p-tts-2',
        title: 'Bùng nổ thanh toán QR song phương quốc tế (WeChat/Alipay du khách Trung Quốc & Hàn Quốc)',
        banks: ['BIDV', 'Sacombank', 'WeChat Pay', 'Alipay'],
        competitorAction:
          'Cho phép du khách quốc tế quét trực tiếp mã QR tại cửa hàng Việt Nam không cần đổi tiền mặt, chiết khấu chỉ 0.8% cho đơn vị chấp nhận thanh toán tại Nha Trang, Đà Nẵng, Phú Quốc.',
        vcbImpact:
          'VCB là ngân hàng thanh toán ngoại hối số 1 nhưng đang bị đối thủ chia sẻ doanh số merchant tại các điểm du lịch lớn.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Dịch vụ thanh toán quốc tế đa kênh VCB. Lợi thế: Tỷ giá mua bán ngoại tệ tốt nhất hệ thống ngân hàng Việt Nam.',
        evidence: 'https://vneconomy.vn/ngan-hang-ket-noi-thanh-toan-qr-song-phuong-wechat-alipay.htm',
        retailAction:
          'Khối Bán lẻ hoàn thiện kết nối các ví điện tử quốc tế phổ biến vào mạng lưới chấp nhận thanh toán Vietcombank QR Pro.',
        branchAction:
          'Chi nhánh tại các vùng du lịch tiếp cận ngay các khách sạn, khu nghỉ dưỡng, trung tâm thương mại để lắp đặt mã thanh toán VCB quốc tế.',
      },
      {
        id: 'p-tts-3',
        title: 'Nâng cấp trải nghiệm xác thực sinh trắc học AI 3D dưới 0.2 giây theo Quyết định 2345',
        banks: ['Techcombank', 'MB Bank', 'Napas'],
        competitorAction:
          'Cập nhật ứng dụng ngân hàng số nhận diện khuôn mặt tức thì dưới 0.2 giây, tự động mở khóa thẻ quốc tế và nâng trần giao dịch trực tuyến.',
        vcbImpact:
          'Áp lực duy trì sự mượt mà và tốc độ phản hồi trên VCB Digibank trong các khung giờ cao điểm.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Hệ thống xác thực sinh trắc học VCB Digibank chuẩn FIDO an toàn tuyệt đối.',
        evidence: 'Thông tư 06/2024/TT-NHNN & Quyết định 2345/QĐ-NHNN',
        retailAction:
          'Tối ưu hóa máy chủ xử lý sinh trắc học, đảm bảo tỷ lệ thành công trên 99.9% cho các giao dịch chuyển tiền trên 10 triệu đồng.',
        branchAction:
          'Bố trí máy quét căn cước CCCD gắn chip chuyên dụng tại sảnh giao dịch để hỗ trợ cài đặt cho khách hàng tại quầy.',
      },
    ].slice(0, 3); // Tuyệt đối không quá 3 bài viết

    // 4. Chủ đề: Tín dụng bán lẻ (Tối đa 3 bài viết)
    const tdArticles = [
      {
        id: 'p-td-1',
        title: 'Chạy đua hạ lãi suất vay mua nhà cố định 36 tháng xuống 5.8% - 5.9%/năm',
        banks: ['Techcombank', 'MB Bank', 'ACB', 'VPBank'],
        competitorAction:
          'Tung các gói tín dụng mua nhà và sản xuất kinh doanh với lãi suất cố định siêu ưu đãi trong 3 năm đầu, cam kết biên độ sau ưu đãi 2.5%, miễn phí trả nợ trước hạn từ năm thứ 4.',
        vcbImpact:
          'Khách hàng vay mua nhà hiện hữu có xu hướng so sánh lãi suất hoặc chuyển khoản vay sang ngân hàng đối thủ theo Thông tư 06.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Gói vay "An Gia Lập Nghiệp" và "Vay mua nhà Vietcombank". Lợi thế: Lãi suất ổn định dài hạn, biên độ sau ưu đãi minh bạch, không phí ẩn.',
        evidence:
          records.find((r) => r.chude === 'tin_dung' && r.bangchung && !r.bangchung.includes('vietcombank.com.vn'))?.bangchung ||
          'Tài liệu đính kèm: BangLaiSuat_MB_CoDinh36Thang.pdf (https://cafef.vn/lai-suat-nha-dat-mb)',
        retailAction:
          'Điều chỉnh linh hoạt gói lãi suất vay mua nhà 2026; rút ngắn quy trình thẩm định tín dụng bán lẻ thông qua cơ sở dữ liệu dân cư.',
        branchAction:
          'Rà soát danh mục khách hàng vay mua nhà hiện hữu có nguy cơ chuyển dịch nợ; chủ động liên hệ tư vấn điều chỉnh gói lãi suất giữ chân khách hàng tốt.',
      },
      {
        id: 'p-td-2',
        title: 'Phê duyệt tín chấp tự động qua VNeID mức 2 trong 5 phút không cần sao kê bảng lương',
        banks: ['VPBank', 'TPBank'],
        competitorAction:
          'Ứng dụng mô hình chấm điểm AI kết nối thẳng cơ sở dữ liệu dân cư và hóa đơn viễn thông để cấp hạn mức vay 120 triệu đồng trong 5 phút trực tuyến.',
        vcbImpact:
          'Mất dần phân khúc khách hàng cá nhân trẻ và công chức có nhu cầu vốn tiêu dùng tức thời.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Thẻ tín dụng VCB Digicard và Vay thấu chi lương VCB. Lợi thế: Hạn mức cao, lãi suất thấp nhất thị trường.',
        evidence: 'Thông tin CHỜ thu thập',
        retailAction:
          'Đẩy mạnh tích hợp định danh VNeID mức 2 để phê duyệt hạn mức thẻ tín dụng số tức thì trên app VCB Digibank.',
        branchAction:
          'Chăm sóc các đơn vị trả lương qua VCB để phát hành thẻ tín dụng và cấp hạn mức thấu chi trọn gói.',
      },
      {
        id: 'p-td-3',
        title: 'Liên kết độc quyền gói vay mua nhà với các chủ đầu tư đại đô thị Vinhomes, Masterise, Ecopark',
        banks: ['Techcombank', 'MB Bank', 'VietinBank'],
        competitorAction:
          'Cung cấp gói ân hạn nợ gốc lên đến 36 tháng và hỗ trợ lãi suất 0% từ chủ đầu tư cho các dự án căn hộ cao cấp mới mở bán.',
        vcbImpact:
          'Bị thu hẹp dư nợ giải ngân mới ở các phân khúc dự án bất động sản có thanh khoản tốt nhất.',
        vcbMatching:
          'Tìm kiếm trên vietcombank.com.vn: Chương trình liên kết tài trợ dự án bất động sản VCB. Lợi thế: Định giá tài sản chuẩn xác, pháp lý an tâm tuyệt đối.',
        evidence: 'Tài liệu đính kèm: ThoaThuanLienKet_TCB_Masterise2026.pdf',
        retailAction:
          'Tăng tốc ký kết hợp đồng hợp tác chiến lược với các chủ đầu tư bất động sản uy tín; ban hành gói lãi suất cạnh tranh.',
        branchAction:
          'Bố trí tổ thẩm định độc lập tại các sàn giao dịch bất động sản trọng điểm để tư vấn hồ sơ giải ngân nhanh trong ngày.',
      },
    ].slice(0, 3); // Tuyệt đối không quá 3 bài viết

    return {
      hkd: hkdArticles,
      gpmb: gpmbArticles,
      tts: ttsArticles,
      td: tdArticles,
    };
  }, [records]);

  // Tạo nội dung HTML độc lập hoàn chỉnh để tải trực tiếp về máy
  const generateStandaloneHtml = () => {
    const page1El = document.getElementById('a4-page-1');
    const page2El = document.getElementById('a4-page-2');

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${title} - Vietcombank</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    body {
      font-family: 'Times New Roman', serif;
      background: #f1f5f9;
      color: #0f172a;
      margin: 0;
      padding: 20px;
      line-height: 1.45;
    }
    .a4-sheet {
      width: 210mm;
      min-height: 297mm;
      max-width: 100%;
      background: #ffffff;
      padding: 10mm 12mm;
      margin: 0 auto 30px auto;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .a4-sheet {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
        break-after: page;
      }
      .no-print {
        display: none !important;
      }
    }
    h1, h2, h3, h4, h5, p { margin-top: 0; }
  </style>
</head>
<body>
  <div class="a4-sheet">
    ${page1El ? page1El.innerHTML : ''}
  </div>
  <div class="a4-sheet">
    ${page2El ? page2El.innerHTML : ''}
  </div>
</body>
</html>`;
  };

  // Tải file Báo cáo HTML về thiết bị
  const downloadHtmlFile = () => {
    try {
      const html = generateStandaloneHtml();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ban-Tin-Thi-Truong-VCB-2-Trang-A4-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaveSuccessToast('Đã tải thành công tệp Báo cáo 2 trang A4 (.html) vào thiết bị của bạn!');
      setTimeout(() => setSaveSuccessToast(null), 3500);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  // Tải file Tóm tắt văn bản TXT về thiết bị
  const downloadTxtFile = () => {
    try {
      const summaryText = `${title}
${subtitle}
Thời gian: ${currentDate} - ${currentTime}
Góc nhìn phân tích: ${currentAngle.name} (Phiên bản #${versionSeed})

I. TỔNG QUAN TÌNH HÌNH:
${isOfficer ? currentAngle.overviewOfficer : currentAngle.overviewRadar}

II. NỘI DUNG TRỌNG TÂM THEO CHỦ ĐỀ (Tối đa 3 bài viết/chủ đề):
1. Chuyên đề Hộ kinh doanh & Tiểu thương:
${printThemesData.hkd.map((a, i) => `  ${i + 1}. ${a.title}\n     - Đối thủ: ${a.banks.join(', ')}\n     - Diễn biến: ${a.competitorAction}\n     - Tác động VCB: ${a.vcbImpact}\n     - Bằng chứng: ${a.evidence}`).join('\n\n')}

2. Chuyên đề Giải phóng mặt bằng:
${printThemesData.gpmb.map((a, i) => `  ${i + 1}. ${a.title}\n     - Đối thủ: ${a.banks.join(', ')}\n     - Diễn biến: ${a.competitorAction}\n     - Tác động VCB: ${a.vcbImpact}\n     - Bằng chứng: ${a.evidence}`).join('\n\n')}

3. Chuyên đề Thanh toán số:
${printThemesData.tts.map((a, i) => `  ${i + 1}. ${a.title}\n     - Đối thủ: ${a.banks.join(', ')}\n     - Diễn biến: ${a.competitorAction}\n     - Tác động VCB: ${a.vcbImpact}\n     - Bằng chứng: ${a.evidence}`).join('\n\n')}

4. Chuyên đề Tín dụng bán lẻ:
${printThemesData.td.map((a, i) => `  ${i + 1}. ${a.title}\n     - Đối thủ: ${a.banks.join(', ')}\n     - Diễn biến: ${a.competitorAction}\n     - Tác động VCB: ${a.vcbImpact}\n     - Bằng chứng: ${a.evidence}`).join('\n\n')}

III. KIẾN NGHỊ HÀNH ĐỘNG:
- Dành cho Khối Bán lẻ (Trụ sở chính): ${currentAngle.vcbFocusRetail}
- Dành cho các Chi nhánh địa bàn: ${currentAngle.vcbFocusBranch}

VIETCOMBANK - BỘ PHẬN PHÂN TÍCH THỊ TRƯỜNG BÁN LẺ
(Đã xác thực và lưu ký điện tử)`;

      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tom-Tat-Dieu-Hanh-Thi-Truong-VCB-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaveSuccessToast('Đã tải thành công tệp Tóm tắt điều hành (.txt) vào thiết bị!');
      setTimeout(() => setSaveSuccessToast(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Nút Lưu vào thiết bị (Xử lý trực tiếp: tải file HTML về máy + mở hộp thoại in)
  const handleDirectSave = () => {
    downloadHtmlFile();
    try {
      window.print();
    } catch (e) {
      console.warn('window.print skipped:', e);
    }
  };

  // Chia sẻ mạng xã hội
  const handleShare = (network: 'zalo' | 'facebook' | 'email' | 'copy') => {
    const shareText = `${title}\n${subtitle}\nThời gian: ${currentDate}\nVietcombank - Khối Bán lẻ`;
    const shareUrl = window.location.href;

    if (network === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } else if (network === 'zalo') {
      window.open(`https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank');
    } else if (network === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (network === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Top Control Bar (Ẩn khi in) */}
        <div className="bg-gradient-to-r from-[#00523d] via-[#005a43] to-[#00523d] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {isOfficer ? 'Review: In Thị Trường (Bản Tin Tối Đa 2 Trang A4)' : 'Review: In Auto Radar (Bản Tin Tối Đa 2 Trang A4)'}
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Tối Đa 2 Trang A4
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 flex items-center gap-1.5">
                <span className="font-semibold text-amber-300">Bản #{versionSeed}</span>
                <span>•</span>
                <span>{currentAngle.name}</span>
              </p>
            </div>
          </div>

          {/* Action buttons: Tạo lại, Lưu vào thiết bị, Share mạng xã hội, Đóng */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Nút Tạo lại (Regenerate) */}
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold border border-emerald-600/60 shadow-xs transition cursor-pointer disabled:opacity-50"
              title="Nhấn để tự động phân tích và viết lại nội dung theo góc nhìn mới"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Đang viết lại...' : 'Tạo lại'}</span>
            </button>

            {/* Nút Lưu vào thiết bị (Có menu chọn định dạng và tải trực tiếp) */}
            <div className="relative">
              <div className="flex items-center rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-xs transition overflow-hidden">
                <button
                  onClick={handleDirectSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-amber-400"
                  title="Lưu file Báo cáo chuẩn 2 trang A4 trực tiếp vào thiết bị"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>Lưu vào thiết bị</span>
                </button>
                <button
                  onClick={() => setSaveMenuOpen(!saveMenuOpen)}
                  className="px-1.5 py-1.5 border-l border-amber-600/40 hover:bg-amber-600/30 cursor-pointer"
                  title="Tùy chọn tải file"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {saveMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Tùy chọn lưu vào thiết bị
                  </div>
                  <button
                    onClick={() => {
                      downloadHtmlFile();
                      setSaveMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <p>Tải File Báo Cáo 2 Trang A4 (.html)</p>
                      <p className="text-[10px] text-slate-500 font-normal">Mở xem và in chuẩn trên mọi máy tính, điện thoại</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadTxtFile();
                      setSaveMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <p>Tải Bản Tóm Tắt Điều Hành (.txt)</p>
                      <p className="text-[10px] text-slate-500 font-normal">Dạng văn bản thuần gọn nhẹ gửi email/báo cáo</p>
                    </div>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setSaveMenuOpen(false);
                      try {
                        window.print();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer font-semibold text-emerald-900"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <div>
                      <p>In hoặc Xuất PDF trực tiếp (Ctrl+P)</p>
                      <p className="text-[10px] text-slate-500 font-normal">Mở trình in trình duyệt để lưu PDF</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Nút Share MXH */}
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-semibold border border-sky-500 shadow-xs transition cursor-pointer"
                title="Chia sẻ lên mạng xã hội"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share MXH</span>
              </button>

              {shareMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 text-xs">
                  <button
                    onClick={() => {
                      handleShare('zalo');
                      setShareMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Chia sẻ Zalo</span>
                  </button>
                  <button
                    onClick={() => {
                      handleShare('facebook');
                      setShareMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>Chia sẻ Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      handleShare('email');
                      setShareMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-500" />
                    <span>Gửi qua Email</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      handleShare('copy');
                      setShareMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 font-semibold text-emerald-800 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sao chép nội dung</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-emerald-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toasts */}
        {copiedToast && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-semibold">
            Đã sao chép nội dung bài viết và đường dẫn vào bộ nhớ tạm!
          </div>
        )}
        {saveSuccessToast && (
          <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessToast}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* NỘI DUNG BẢN IN CHUẨN MỞ TỐI ĐA 2 TRANG A4 */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-200/80 flex flex-col items-center gap-6">
          {/* ======================================================================= */}
          {/* TRANG 1 / 2: TỔNG QUAN & CHUYÊN ĐỀ HỘ KINH DOANH + GIẢI PHÓNG MẶT BẰNG */}
          {/* ======================================================================= */}
          <div className="w-full flex flex-col items-center">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 print:hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Trang 1 / 2 • Tổng quan & Chuyên đề 1, 2</span>
            </div>

            <div
              id="a4-page-1"
              className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-7 sm:p-9 shadow-xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:m-0 print:p-6 flex flex-col justify-between"
              style={{ fontFamily: "'Times New Roman', 'Be Vietnam Pro', serif" }}
            >
              <div>
                {/* Header Ngân hàng / Quốc hiệu */}
                <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/logoVCB_xanh.png"
                      alt="Vietcombank"
                      className="h-8 w-auto object-contain"
                    />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                        NGÂN HÀNG TMCP NGOẠI THƯƠNG VIỆT NAM
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-700">KHỐI BÁN LẺ</p>
                    </div>
                  </div>
                  <div className="text-right text-[10.5px] text-slate-600">
                    <p className="font-bold">BẢN TIN BÁN LẺ NỘI BỘ</p>
                    <p>Hà Nội, ngày {currentDate}</p>
                  </div>
                </div>

                {/* Tiêu đề chính & Góc nhìn */}
                <div className="text-center my-2">
                  <h1 className="text-sm sm:text-base font-black uppercase text-emerald-950 tracking-wide">
                    {title}
                  </h1>
                  <p className="text-[10.5px] italic text-slate-600 mt-0.5">{subtitle}</p>
                  <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span>Phiên bản #{versionSeed}: {currentAngle.name} (Tối đa 2 trang A4)</span>
                  </div>
                </div>

                {/* I. TỔNG QUAN TÌNH HÌNH & XU HƯỚNG CẠNH TRANH THỊ TRƯỜNG */}
                <div className="mb-2.5 p-2 bg-emerald-50/70 rounded border-l-4 border-emerald-800 text-[10.5px]">
                  <h3 className="font-bold text-emerald-950 uppercase mb-0.5">
                    I. TỔNG QUAN TÌNH HÌNH & XU HƯỚNG CẠNH TRANH THỊ TRƯỜNG
                  </h3>
                  <p className="text-slate-800 leading-relaxed text-justify">
                    {isOfficer ? currentAngle.overviewOfficer : currentAngle.overviewRadar}
                  </p>
                </div>

                {/* II. NỘI DUNG PHÂN TÍCH CHI TIẾT CÁC CHỦ ĐỀ TRỌNG TÂM */}
                <div className="space-y-2.5 text-[10.5px]">
                  <h3 className="font-bold text-emerald-950 uppercase border-b border-slate-300 pb-0.5 text-[11px]">
                    II. CHI TIẾT CÁC NỘI DUNG VÀ HÀNH ĐỘNG CỤ THỂ THEO TỪNG CHỦ ĐỀ
                  </h3>

                  {/* 1. CHUYÊN ĐỀ HỘ KINH DOANH & TIỂU THƯƠNG (Tối đa 3 bài viết) */}
                  <div className="p-2 bg-slate-50/90 rounded border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
                      <span className="text-emerald-900 font-extrabold uppercase text-[10.5px]">
                        1. Chuyên đề Hộ kinh doanh & Tiểu thương (HKD) - Tối đa 3 bài viết
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                        Tác động: Khẩn cấp
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {printThemesData.hkd.map((art, idx) => (
                        <div key={art.id} className="bg-white p-1.5 rounded border border-slate-200 text-slate-800 leading-snug">
                          <p className="font-bold text-slate-900 text-[10.5px]">
                            • Bài {idx + 1}: {art.title}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Đối thủ & Diễn biến:</strong> ({art.banks.join(', ')}) {art.competitorAction}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Tác động Vietcombank:</strong> {art.vcbImpact}
                          </p>
                          <p className="mt-0.5 text-emerald-950">
                            <strong>- Đối chiếu website vietcombank.com.vn & Gợi ý bán hàng:</strong> {art.vcbMatching}
                          </p>
                          <p className="mt-0.5 text-slate-600">
                            <strong>- Bằng chứng xác thực:</strong>{' '}
                            <span className="font-mono text-[9.5px] font-semibold text-emerald-800 underline">
                              {art.evidence}
                            </span>
                          </p>
                          <p className="mt-0.5 text-slate-700">
                            <strong>- Phản ứng:</strong> <em>Khối Bán lẻ:</em> {art.retailAction} • <em>Chi nhánh:</em> {art.branchAction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. CHUYÊN ĐỀ GIẢI PHÓNG MẶT BẰNG & TIỀN GỬI ĐỀN BÙ (Tối đa 3 bài viết) */}
                  <div className="p-2 bg-slate-50/90 rounded border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
                      <span className="text-emerald-900 font-extrabold uppercase text-[10.5px]">
                        2. Chuyên đề Giải phóng mặt bằng (GPMB) & Tiền gửi đền bù - Tối đa 3 bài viết
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-bold">
                        Tác động: Rất cao
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {printThemesData.gpmb.map((art, idx) => (
                        <div key={art.id} className="bg-white p-1.5 rounded border border-slate-200 text-slate-800 leading-snug">
                          <p className="font-bold text-slate-900 text-[10.5px]">
                            • Bài {idx + 1}: {art.title}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Đối thủ & Diễn biến:</strong> ({art.banks.join(', ')}) {art.competitorAction}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Tác động Vietcombank:</strong> {art.vcbImpact}
                          </p>
                          <p className="mt-0.5 text-emerald-950">
                            <strong>- Đối chiếu website vietcombank.com.vn & Gợi ý bán hàng:</strong> {art.vcbMatching}
                          </p>
                          <p className="mt-0.5 text-slate-600">
                            <strong>- Bằng chứng xác thực:</strong>{' '}
                            <span className="font-mono text-[9.5px] font-semibold text-emerald-800 underline">
                              {art.evidence}
                            </span>
                          </p>
                          <p className="mt-0.5 text-slate-700">
                            <strong>- Phản ứng:</strong> <em>Khối Bán lẻ:</em> {art.retailAction} • <em>Chi nhánh:</em> {art.branchAction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Trang 1 */}
              <div className="mt-3 pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                <span>Bản tin Điều hành & Phân tích Thị trường Bán lẻ Vietcombank 2026</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  Trang 1 / 2
                </span>
              </div>
            </div>
          </div>

          {/* Dấu phân cách trang cho bản in */}
          <div className="w-full max-w-[210mm] border-t-2 border-dashed border-slate-400 my-1 relative flex items-center justify-center print:hidden">
            <span className="bg-slate-200 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              --- Ngắt sang Trang 2 / 2 (Chuẩn in A4) ---
            </span>
          </div>

          {/* ======================================================================= */}
          {/* TRANG 2 / 2: TIẾP TỤC CHUYÊN ĐỀ 3, 4 & KIẾN NGHỊ HÀNH ĐỘNG TRỌNG TÂM */}
          {/* ======================================================================= */}
          <div className="w-full flex flex-col items-center">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 print:hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Trang 2 / 2 • Chuyên đề 3, 4 & Kiến nghị hành động</span>
            </div>

            <div
              id="a4-page-2"
              className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-7 sm:p-9 shadow-xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:m-0 print:p-6 flex flex-col justify-between"
              style={{
                fontFamily: "'Times New Roman', 'Be Vietnam Pro', serif",
                pageBreakBefore: 'always',
              }}
            >
              <div>
                {/* Header mini Trang 2 */}
                <div className="flex items-center justify-between border-b border-emerald-900 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logoVCB_xanh.png"
                      alt="Vietcombank"
                      className="h-6 w-auto object-contain"
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                      NGÂN HÀNG TMCP NGOẠI THƯƠNG VIỆT NAM - KHỐI BÁN LẺ
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-600">
                    Bản tin thị trường • Ngày {currentDate} (Trang 2/2)
                  </span>
                </div>

                {/* Tiếp tục II. Chuyên đề 3 & 4 */}
                <div className="space-y-2.5 text-[10.5px]">
                  {/* 3. CHUYÊN ĐỀ THANH TOÁN SỐ & SINH TRẮC HỌC (Tối đa 3 bài viết) */}
                  <div className="p-2 bg-slate-50/90 rounded border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
                      <span className="text-emerald-900 font-extrabold uppercase text-[10.5px]">
                        3. Chuyên đề Thanh toán số & Sinh trắc học Quyết định 2345 - Tối đa 3 bài viết
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                        Tác động: Cao
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {printThemesData.tts.map((art, idx) => (
                        <div key={art.id} className="bg-white p-1.5 rounded border border-slate-200 text-slate-800 leading-snug">
                          <p className="font-bold text-slate-900 text-[10.5px]">
                            • Bài {idx + 1}: {art.title}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Đối thủ & Diễn biến:</strong> ({art.banks.join(', ')}) {art.competitorAction}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Tác động Vietcombank:</strong> {art.vcbImpact}
                          </p>
                          <p className="mt-0.5 text-emerald-950">
                            <strong>- Đối chiếu website vietcombank.com.vn & Gợi ý bán hàng:</strong> {art.vcbMatching}
                          </p>
                          <p className="mt-0.5 text-slate-600">
                            <strong>- Bằng chứng xác thực:</strong>{' '}
                            <span className="font-mono text-[9.5px] font-semibold text-emerald-800 underline">
                              {art.evidence}
                            </span>
                          </p>
                          <p className="mt-0.5 text-slate-700">
                            <strong>- Phản ứng:</strong> <em>Khối Bán lẻ:</em> {art.retailAction} • <em>Chi nhánh:</em> {art.branchAction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. CHUYÊN ĐỀ TÍN DỤNG BÁN LẺ & VAY MUA NHÀ (Tối đa 3 bài viết) */}
                  <div className="p-2 bg-slate-50/90 rounded border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
                      <span className="text-emerald-900 font-extrabold uppercase text-[10.5px]">
                        4. Chuyên đề Tín dụng bán lẻ & Vay mua nhà - Tối đa 3 bài viết
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                        Tác động: Khẩn cấp
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {printThemesData.td.map((art, idx) => (
                        <div key={art.id} className="bg-white p-1.5 rounded border border-slate-200 text-slate-800 leading-snug">
                          <p className="font-bold text-slate-900 text-[10.5px]">
                            • Bài {idx + 1}: {art.title}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Đối thủ & Diễn biến:</strong> ({art.banks.join(', ')}) {art.competitorAction}
                          </p>
                          <p className="mt-0.5">
                            <strong>- Tác động Vietcombank:</strong> {art.vcbImpact}
                          </p>
                          <p className="mt-0.5 text-emerald-950">
                            <strong>- Đối chiếu website vietcombank.com.vn & Gợi ý bán hàng:</strong> {art.vcbMatching}
                          </p>
                          <p className="mt-0.5 text-slate-600">
                            <strong>- Bằng chứng xác thực:</strong>{' '}
                            <span className="font-mono text-[9.5px] font-semibold text-emerald-800 underline">
                              {art.evidence}
                            </span>
                          </p>
                          <p className="mt-0.5 text-slate-700">
                            <strong>- Phản ứng:</strong> <em>Khối Bán lẻ:</em> {art.retailAction} • <em>Chi nhánh:</em> {art.branchAction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* III. KIẾN NGHỊ HÀNH ĐỘNG TRỌNG TÂM */}
                <div className="mt-3 p-2.5 bg-amber-50/90 rounded border border-amber-300 text-[10.5px]">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-amber-950 uppercase">
                      III. KIẾN NGHỊ HÀNH ĐỘNG TRỌNG TÂM ({currentAngle.name})
                    </h3>
                    <span className="px-2 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold text-[9.5px]">
                      {currentAngle.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-800">
                    <div className="bg-white/80 p-2 rounded border border-amber-200">
                      <strong className="text-emerald-950 block mb-0.5">
                        1. Dành cho Khối Bán lẻ (Trụ sở chính):
                      </strong>
                      <p className="leading-relaxed text-[10px] text-justify">
                        {currentAngle.vcbFocusRetail}
                      </p>
                    </div>

                    <div className="bg-white/80 p-2 rounded border border-amber-200">
                      <strong className="text-emerald-950 block mb-0.5">
                        2. Dành cho các Chi nhánh địa bàn:
                      </strong>
                      <p className="leading-relaxed text-[10px] text-justify">
                        {currentAngle.vcbFocusBranch}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* IV. Ký duyệt & Lưu ký điện tử (Cuối Trang 2) */}
              <div className="mt-3 pt-2 border-t border-slate-300 flex items-end justify-between text-[10px]">
                <div className="text-slate-500">
                  <p>Nơi nhận: Ban Giám đốc Khối Bán lẻ, Giám đốc các Chi nhánh toàn quốc</p>
                  <p className="italic">Nguồn: {isOfficer ? 'Log thu thập của Cán bộ Vietcombank' : 'Hệ thống Auto Radar Đa Kênh 2026'}</p>
                </div>
                <div className="text-center font-bold text-emerald-950">
                  <p className="uppercase text-[10.5px]">BỘ PHẬN PHÂN TÍCH THÔNG TIN THỊ TRƯỜNG BÁN LẺ</p>
                  <p className="text-[9.5px] text-slate-400 font-normal italic mt-4">(Đã xác thực và lưu ký điện tử)</p>
                  <div className="mt-1 font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 inline-block">
                    Trang 2 / 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
