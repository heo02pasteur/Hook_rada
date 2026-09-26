import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IntakeForm, IntakeFormData } from './components/IntakeForm';
import { MarketAnalysisCard } from './components/MarketAnalysisCard';
import { AutoRadarCard } from './components/AutoRadarCard';
import { SavedRecordsModal } from './components/SavedRecordsModal';
import { WebhookModal } from './components/WebhookModal';
import {
  CompetitorRecord,
  MarketIntelligenceItem,
  RetailPillar,
  ImpactSeverity,
  UploadedFileEvidence
} from './types';
import {
  INITIAL_MARKET_INTELLIGENCE_2026,
  PILLAR_LABELS
} from './data/marketIntelligence2026';
import {
  sendToMakeWebhook,
  WebhookSendResult
} from './services/webhookService';
import {
  BarChart3,
  Radio,
  PenLine,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';

const INITIAL_FORM_STATE: IntakeFormData = {
  emailcb: 'qlkcn.ho',
  chude: 'ho_kinh_doanh',
  doithu: '',
  tintuc: '',
  muctacdong: 'high',
  tacdong: '',
  dexuat: '',
  bangchung: '',
  // Tương thích:
  submitterEmail: 'qlkcn.ho',
  competitor: '',
  content: '',
  impactOnVcb: '',
  pillarCategory: 'ho_kinh_doanh',
  impactLevel: 'high',
  evidenceFiles: [],
};

export default function App() {
  // Main form state
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_FORM_STATE);

  // Stored records (Thông tin từ cán bộ thu thập)
  const [records, setRecords] = useState<CompetitorRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vcb_ci_records_2026');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }

    // Dữ liệu mẫu chuẩn hóa 8 trường thông tin
    return [
      {
        id: 'rec-sample-01',
        emailcb: 'qlkcn.ho',
        chude: 'ho_kinh_doanh',
        doithu: 'Techcombank',
        tintuc: 'Techcombank triển khai phủ loa thanh toán TCB Soundbox miễn phí tại chợ Đồng Xuân và chợ Hôm, cấp trước hạn mức thấu chi 500 triệu đồng giải ngân trong 30 giây dựa trên dòng tiền QR.',
        muctacdong: 'critical',
        tacdong: 'Nguy cơ sụt giảm số dư CASA từ các tiểu thương và hộ kinh doanh truyền thống của Vietcombank.',
        dexuat: 'Khối Bán lẻ khẩn trương triển khai chiến dịch trang bị miễn phí VCB Soundbox cho tiểu thương; Chi nhánh tiếp cận trực tiếp ban quản lý chợ.',
        bangchung: 'Tài liệu đính kèm: Anh_quay_TCB_DongXuan.jpg & To_roi_Soundbox.pdf',
        submitterEmail: 'qlkcn.ho',
        competitor: 'Techcombank',
        content: 'Techcombank triển khai phủ loa thanh toán TCB Soundbox miễn phí tại chợ Đồng Xuân và chợ Hôm, cấp trước hạn mức thấu chi 500 triệu đồng giải ngân trong 30 giây dựa trên dòng tiền QR.',
        impactOnVcb: 'Nguy cơ sụt giảm số dư CASA từ các tiểu thương và hộ kinh doanh truyền thống của Vietcombank.',
        pillarCategory: 'ho_kinh_doanh',
        impactLevel: 'critical',
        status: 'submitted',
        createdAt: '2026-09-24 09:15',
        updatedAt: '2026-09-24 09:15',
      },
      {
        id: 'rec-sample-02',
        emailcb: 'vcb.hoankiem@vietcombank.com.vn',
        chude: 'ho_kinh_doanh',
        doithu: 'VPBank',
        tintuc: 'VPBank phối hợp Sapo tặng loa Smart Soundbox và máy in hóa đơn điện tử cho tiểu thương phố Huế, miễn 100% phí chuyển khoản và cấp vốn lưu động 5.8%/năm.',
        muctacdong: 'high',
        tacdong: 'Cạnh tranh gay gắt giữ chân chủ hộ kinh doanh bán lẻ của Chi nhánh Hoàn Kiếm.',
        dexuat: 'Đẩy mạnh truyền thông gói giải pháp VCB DigiBiz kết hợp POS máy tính tiền cho các tuyến phố thương mại.',
        bangchung: 'Tài liệu đính kèm: HopDongLienKet_VPBank_Sapo_PhoHue.pdf',
        submitterEmail: 'vcb.hoankiem@vietcombank.com.vn',
        competitor: 'VPBank',
        content: 'VPBank phối hợp Sapo tặng loa Smart Soundbox và máy in hóa đơn điện tử cho tiểu thương phố Huế, miễn 100% phí chuyển khoản và cấp vốn lưu động 5.8%/năm.',
        impactOnVcb: 'Cạnh tranh gay gắt giữ chân chủ hộ kinh doanh bán lẻ của Chi nhánh Hoàn Kiếm.',
        pillarCategory: 'ho_kinh_doanh',
        impactLevel: 'high',
        status: 'submitted',
        createdAt: '2026-09-24 10:20',
        updatedAt: '2026-09-24 10:20',
      },
      {
        id: 'rec-sample-03',
        emailcb: 'vcb.thanglong@vietcombank.com.vn',
        chude: 'ho_kinh_doanh',
        doithu: 'MB Bank',
        tintuc: 'MB Bank trang bị soundbox phát âm thanh thông báo tiền về kèm gói vay thấu chi tín chấp không cần TSBĐ cho các sạp hàng chợ đầu mối phía Tây.',
        muctacdong: 'high',
        tacdong: 'Áp lực lên thị phần thanh toán QR Vietcombank tại các cụm thương mại đầu mối.',
        dexuat: 'Chi nhánh cử cán bộ trực tiếp tư vấn mã QR động gắn liền tài khoản số đẹp VCB.',
        bangchung: 'Thông tin CHỜ thu thập',
        submitterEmail: 'vcb.thanglong@vietcombank.com.vn',
        competitor: 'MB Bank',
        content: 'MB Bank trang bị soundbox phát âm thanh thông báo tiền về kèm gói vay thấu chi tín chấp không cần TSBĐ cho các sạp hàng chợ đầu mối phía Tây.',
        impactOnVcb: 'Áp lực lên thị phần thanh toán QR Vietcombank tại các cụm thương mại đầu mối.',
        pillarCategory: 'ho_kinh_doanh',
        impactLevel: 'high',
        status: 'submitted',
        createdAt: '2026-09-23 14:00',
        updatedAt: '2026-09-23 14:00',
      },
      {
        id: 'rec-sample-04',
        emailcb: 'qlkcn.ho',
        chude: 'gpmb',
        doithu: 'HDBank',
        tintuc: 'HDBank lập quầy tiếp nhận bồi thường đền bù GPMB Vành Đai 4 tại Hoài Đức, cộng lãi suất 0.7%/năm cho hộ nhận tiền đền bù mở sổ tiết kiệm.',
        muctacdong: 'critical',
        tacdong: 'Cạnh tranh trực tiếp với nguồn huy động vốn bán lẻ của VCB Chi nhánh Tây Hà Nội.',
        dexuat: 'Hội đồng bồi thường huyện Đan Phượng & Hoài Đức cần có sự hiện diện của quầy cơ động VCB.',
        bangchung: 'Tài liệu đính kèm: BienBanHop_BanBoiThuong_HoaiDuc.pdf (Công văn số 118/UBND-GPMB)',
        submitterEmail: 'qlkcn.ho',
        competitor: 'HDBank',
        content: 'HDBank lập quầy tiếp nhận bồi thường đền bù GPMB Vành Đai 4 tại Hoài Đức, cộng lãi suất 0.7%/năm cho hộ nhận tiền đền bù mở sổ tiết kiệm.',
        impactOnVcb: 'Cạnh tranh trực tiếp với nguồn huy động vốn bán lẻ của VCB Chi nhánh Tây Hà Nội.',
        pillarCategory: 'gpmb',
        impactLevel: 'critical',
        status: 'submitted',
        createdAt: '2026-09-23 16:30',
        updatedAt: '2026-09-23 16:30',
      },
      {
        id: 'rec-sample-05',
        emailcb: 'vcb.dongnai@vietcombank.com.vn',
        chude: 'gpmb',
        doithu: 'Agribank',
        tintuc: 'Agribank cử xe giao dịch lưu động tại các xã chi trả bồi thường cao tốc và sân bay Long Thành, áp dụng lãi suất tiền gửi đặc cách cộng 0.6%/năm.',
        muctacdong: 'high',
        tacdong: 'Dòng tiền đền bù đất bị hút mạnh về Agribank do mạng lưới phòng giao dịch bám sát địa bàn xã.',
        dexuat: 'Kích hoạt gói Tiết kiệm Tích lũy An Vui của Vietcombank kèm quà tặng an cư.',
        bangchung: 'Thông tin CHỜ thu thập',
        submitterEmail: 'vcb.dongnai@vietcombank.com.vn',
        competitor: 'Agribank',
        content: 'Agribank cử xe giao dịch lưu động tại các xã chi trả bồi thường cao tốc và sân bay Long Thành, áp dụng lãi suất tiền gửi đặc cách cộng 0.6%/năm.',
        impactOnVcb: 'Dòng tiền đền bù đất bị hút mạnh về Agribank do mạng lưới phòng giao dịch bám sát địa bàn xã.',
        pillarCategory: 'gpmb',
        impactLevel: 'high',
        status: 'submitted',
        createdAt: '2026-09-22 15:45',
        updatedAt: '2026-09-22 15:45',
      },
      {
        id: 'rec-sample-06',
        emailcb: 'vcb.hcm@vietcombank.com.vn',
        chude: 'thanh_toan_so',
        doithu: 'VPBank',
        tintuc: 'VPBank triển khai tính năng Tap to Phone biến điện thoại di động thông minh thành máy POS quẹt thẻ không tiếp xúc cho chuỗi nhà hàng ăn uống.',
        muctacdong: 'high',
        tacdong: 'Giảm nhu cầu thuê máy POS truyền thống của VCB tại chuỗi F&B và bán lẻ.',
        dexuat: 'Tăng tốc triển khai VCB Tap-to-phone trên ứng dụng VCB Digibank và DigiBiz.',
        bangchung: 'Tài liệu đính kèm: Video_TapToPhone_Grab_VPB.mp4 & HuongDanSuDung.pdf',
        submitterEmail: 'vcb.hcm@vietcombank.com.vn',
        competitor: 'VPBank',
        content: 'VPBank triển khai tính năng Tap to Phone biến điện thoại di động thông minh thành máy POS quẹt thẻ không tiếp xúc cho chuỗi nhà hàng ăn uống.',
        impactOnVcb: 'Giảm nhu cầu thuê máy POS truyền thống của VCB tại chuỗi F&B và bán lẻ.',
        pillarCategory: 'thanh_toan_so',
        impactLevel: 'high',
        status: 'submitted',
        createdAt: '2026-09-22 11:00',
        updatedAt: '2026-09-22 11:00',
      },
      {
        id: 'rec-sample-07',
        emailcb: 'vcb.namsaigon@vietcombank.com.vn',
        chude: 'tin_dung',
        doithu: 'MB Bank',
        tintuc: 'MB Bank tung gói vay mua nhà và SXKD lãi suất 5.9%/năm phê duyệt siêu tốc 5 phút qua liên kết cơ sở dữ liệu VNeID.',
        muctacdong: 'critical',
        tacdong: 'Khách hàng vay mua nhà chuyển sang đối thủ do quy trình số hóa thẩm định nhanh hơn.',
        dexuat: 'Khối Bán lẻ rà soát biên độ lãi suất vay mua nhà VCB; rút gọn thời gian thẩm định qua VCB Digibank.',
        bangchung: 'Tài liệu đính kèm: BangLaiSuat_MB_CoDinh36Thang.pdf (https://cafef.vn/lai-suat-nha-dat-mb)',
        submitterEmail: 'vcb.namsaigon@vietcombank.com.vn',
        competitor: 'MB Bank',
        content: 'MB Bank tung gói vay mua nhà và SXKD lãi suất 5.9%/năm phê duyệt siêu tốc 5 phút qua liên kết cơ sở dữ liệu VNeID.',
        impactOnVcb: 'Khách hàng vay mua nhà chuyển sang đối thủ do quy trình số hóa thẩm định nhanh hơn.',
        pillarCategory: 'tin_dung',
        impactLevel: 'critical',
        status: 'submitted',
        createdAt: '2026-09-21 13:15',
        updatedAt: '2026-09-21 13:15',
      },
    ];
  });

  // Market items cho Auto Radar
  const [marketItems] = useState<MarketIntelligenceItem[]>(INITIAL_MARKET_INTELLIGENCE_2026);

  // 3 THẺ CHÍNH THEO THỨ TỰ TRÌNH BÀY:
  // Thẻ 1: 'analysis' ("Phân tích thị trường" - Ưu tiên mặc định)
  // Thẻ 2: 'radar' ("Auto Radar thị trường")
  // Thẻ 3: 'intake' ("Nhập thông tin thị trường")
  const [activeMainTab, setActiveMainTab] = useState<'analysis' | 'radar' | 'intake'>('analysis');

  // Modals
  const [isSavedRecordsOpen, setIsSavedRecordsOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // Design mode: ẩn/hiện cấu hình Webhook Make
  const [isDesignMode, setIsDesignMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('design') === '1' || urlParams.get('mode') === 'design') {
        return true;
      }
      return localStorage.getItem('vcb_design_mode') === 'true';
    }
    return false;
  });

  const toggleDesignMode = () => {
    setIsDesignMode((prev) => {
      const next = !prev;
      localStorage.setItem('vcb_design_mode', String(next));
      showToast(
        next
          ? 'Đã bật Chế độ Thiết kế: Hiển thị cấu hình Webhook Make'
          : 'Đã ẩn Webhook Make: Chế độ chuẩn dành cho người dùng',
        'info'
      );
      return next;
    });
  };

  // Webhook submission status
  const [isSubmittingWebhook, setIsSubmittingWebhook] = useState(false);
  const [lastWebhookResult, setLastWebhookResult] = useState<WebhookSendResult | null>(null);

  // AI Agent can prepare structured market records and fill the intake form.\n  const handleAgentFillForm = (data: IntakeFormData) => {\n    setFormData((prev) => ({ ...prev, ...data, id: undefined }));\n    setActiveMainTab('intake');\n    showToast('AI Agent đã điền bản nháp vào biểu mẫu. Hãy kiểm tra trước khi Cập nhật.', 'info');\n  };\n\n  // Toast notifications
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Persist records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vcb_ci_records_2026', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Submit / Update action: Chuyển 8 trường thông tin chuẩn đến Webhook
  const handleSubmitUpdate = async () => {
    const nowStr = new Date().toLocaleString('vi-VN');
    const isUpdate = Boolean(formData.id);
    const recordId = formData.id || 'rec-' + Date.now();

    const recordToProcess: CompetitorRecord = {
      id: recordId,
      emailcb: formData.emailcb || 'qlkcn.ho',
      chude: formData.chude || 'ho_kinh_doanh',
      doithu: formData.doithu,
      tintuc: formData.tintuc,
      muctacdong: formData.muctacdong || 'high',
      tacdong: formData.tacdong,
      dexuat: formData.dexuat || '',
      bangchung: formData.bangchung?.trim() ? formData.bangchung : 'Thông tin CHỜ thu thập',

      // Backward compat:
      submitterEmail: formData.emailcb || 'qlkcn.ho',
      competitor: formData.doithu,
      content: formData.tintuc,
      impactOnVcb: formData.tacdong,
      pillarCategory: (formData.chude as RetailPillar) || 'ho_kinh_doanh',
      impactLevel: formData.muctacdong || 'high',
      evidenceFiles: formData.evidenceFiles || [],
      status: isUpdate ? 'updated' : 'submitted',
      createdAt: isUpdate
        ? records.find((r) => r.id === recordId)?.createdAt || nowStr
        : nowStr,
      updatedAt: nowStr,
    };

    setIsSubmittingWebhook(true);

    try {
      // Gửi 8 trường thông tin đến Webhook Make.com
      const webhookRes = await sendToMakeWebhook(recordToProcess, isUpdate ? 'update' : 'create');
      setLastWebhookResult(webhookRes);

      recordToProcess.webhookSync = {
        sent: webhookRes.success,
        at: new Date().toLocaleTimeString('vi-VN'),
        httpStatus: webhookRes.status,
        message: webhookRes.message,
      };

      // Lưu trữ bản ghi
      if (isUpdate) {
        setRecords((prev) => prev.map((r) => (r.id === recordId ? recordToProcess : r)));
      } else {
        setRecords((prev) => [recordToProcess, ...prev]);
      }

      if (webhookRes.status === 200 || webhookRes.status === 202) {
        showToast('✅ Đã cập nhật & gửi 8 trường thông tin sang Webhook thành công!', 'success');
      } else if (webhookRes.status === 410) {
        showToast('⚡ Đã cập nhật bản ghi! Make.com đang chờ kích hoạt kịch bản.', 'info');
      } else {
        showToast(`Đã lưu bản ghi vào hệ thống. Phản hồi Webhook: ${webhookRes.message}`, 'info');
      }

      // Reset form sau khi gửi thành công nhưng giữ lại email cán bộ
      setFormData({
        ...INITIAL_FORM_STATE,
        emailcb: formData.emailcb,
        submitterEmail: formData.emailcb,
      });

      // Chuyển sang thẻ 1 để xem phân tích mới nhất
      setActiveMainTab('analysis');
    } catch (err: unknown) {
      console.error(err);
      showToast('Đã lưu bản ghi nội bộ (Lỗi mạng Webhook).', 'info');
    } finally {
      setIsSubmittingWebhook(false);
    }
  };

  // Lưu tạm
  const handleSaveDraft = () => {
    const nowStr = new Date().toLocaleString('vi-VN');
    const recordId = formData.id || 'draft-' + Date.now();

    const draftRecord: CompetitorRecord = {
      id: recordId,
      emailcb: formData.emailcb || 'qlkcn.ho',
      chude: formData.chude || 'ho_kinh_doanh',
      doithu: formData.doithu || 'Bản nháp',
      tintuc: formData.tintuc || 'Chưa hoàn thiện nội dung',
      muctacdong: formData.muctacdong || 'medium',
      tacdong: formData.tacdong || 'Đang đánh giá',
      dexuat: formData.dexuat || '',
      bangchung: formData.bangchung || 'Thông tin CHỜ thu thập',

      submitterEmail: formData.emailcb || 'qlkcn.ho',
      competitor: formData.doithu || 'Bản nháp',
      content: formData.tintuc || '',
      impactOnVcb: formData.tacdong || '',
      pillarCategory: (formData.chude as RetailPillar) || 'ho_kinh_doanh',
      impactLevel: formData.muctacdong || 'medium',
      status: 'draft',
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    setRecords((prev) => [draftRecord, ...prev.filter((r) => r.id !== recordId)]);
    showToast('Đã lưu tạm bản ghi! Bạn có thể chọn lại qua nút "Xem bản lưu".', 'info');
  };

  // Reset form
  const handleResetForm = () => {
    setFormData({
      ...INITIAL_FORM_STATE,
      emailcb: formData.emailcb,
      submitterEmail: formData.emailcb,
    });
    showToast('Đã xóa trắng biểu mẫu.', 'info');
  };

  // Chọn bản ghi để sửa từ "Xem bản lưu" hoặc từ Thẻ Phân tích
  const handleSelectToEdit = (record: CompetitorRecord) => {
    setFormData({
      id: record.id,
      emailcb: record.emailcb || record.submitterEmail || 'qlkcn.ho',
      chude: record.chude || record.pillarCategory || 'ho_kinh_doanh',
      doithu: record.doithu || record.competitor || '',
      tintuc: record.tintuc || record.content || '',
      muctacdong: record.muctacdong || record.impactLevel || 'high',
      tacdong: record.tacdong || record.impactOnVcb || '',
      dexuat: record.dexuat || '',
      bangchung: record.bangchung || '',
      evidenceFiles: record.evidenceFiles || [],
      submitterEmail: record.emailcb || record.submitterEmail || 'qlkcn.ho',
      competitor: record.doithu || record.competitor || '',
      content: record.tintuc || record.content || '',
      impactOnVcb: record.tacdong || record.impactOnVcb || '',
      pillarCategory: (record.chude || record.pillarCategory) as RetailPillar,
      impactLevel: record.muctacdong || record.impactLevel || 'high',
    });

    setActiveMainTab('intake');
    showToast(`Đã nạp bản ghi "${record.doithu || record.competitor}" vào biểu mẫu để chỉnh sửa!`, 'info');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Đã xóa bản ghi.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#042116] text-slate-900">
      {/* Top Header */}
      <Header
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
        isDesignMode={isDesignMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
        {/* ========================================================================= */}
        {/* CARD NAVIGATION SWITCHER - TRÌNH BÀY THỨ TỰ 3 THẺ CHÍNH CHUẨN XÁC */}
        {/* ========================================================================= */}
        <div className="mb-5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-800/60 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {/* THẺ SỐ 1: PHÂN TÍCH THỊ TRƯỜNG (ƯU TIÊN HIỂN THỊ) */}
            <button
              id="card-tab-analysis"
              onClick={() => setActiveMainTab('analysis')}
              className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeMainTab === 'analysis'
                  ? 'bg-emerald-700 text-white shadow-lg ring-2 ring-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="tracking-wide">1. PHÂN TÍCH THỊ TRƯỜNG</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 text-[10px] font-extrabold uppercase border border-emerald-600/50 shrink-0">
                Ưu tiên
              </span>
            </button>

            {/* THẺ SỐ 2: AUTO RADAR THỊ TRƯỜNG */}
            <button
              id="card-tab-radar"
              onClick={() => setActiveMainTab('radar')}
              className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeMainTab === 'radar'
                  ? 'bg-cyan-700 text-white shadow-lg ring-2 ring-cyan-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="tracking-wide">2. AUTO RADAR THỊ TRƯỜNG</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-mono border border-cyan-800 shrink-0">
                Đa kênh MXH
              </span>
            </button>

            {/* THẺ SỐ 3: NHẬP THÔNG TIN THỊ TRƯỜNG */}
            <button
              id="card-tab-intake"
              onClick={() => setActiveMainTab('intake')}
              className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeMainTab === 'intake'
                  ? 'bg-emerald-700 text-white shadow-lg ring-2 ring-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="tracking-wide">3. NHẬP THÔNG TIN THỊ TRƯỜNG</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-mono border border-slate-700 shrink-0">
                8 trường
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD VIEW 1: PHÂN TÍCH THỊ TRƯỜNG (TỪ LOG THU THẬP CÁN BỘ NHẬP) */}
        {/* ========================================================================= */}
        {activeMainTab === 'analysis' && (
          <MarketAnalysisCard
            records={records}
            onSelectRecordToEdit={handleSelectToEdit}
          />
        )}

        {/* ========================================================================= */}
        {/* CARD VIEW 2: AUTO RADAR THỊ TRƯỜNG (BÁO CHÍ, MXH, YOUTUBE, TIKTOK, ZALO) */}
        {/* ========================================================================= */}
        {activeMainTab === 'radar' && (
          <AutoRadarCard marketItems={marketItems} />
        )}

        {/* ========================================================================= */}
        {/* CARD VIEW 3: NHẬP THÔNG TIN THỊ TRƯỜNG (8 TRƯỜNG WEBHOOK + XEM BẢN LƯU) */}
        {/* ========================================================================= */}
        {activeMainTab === 'intake' && (
          <div className="max-w-4xl mx-auto w-full">
            <IntakeForm
              formData={formData}
              setFormData={setFormData}
              onSaveDraft={handleSaveDraft}
              onSubmitUpdate={handleSubmitUpdate}
              onReset={handleResetForm}
              onOpenSavedRecords={() => setIsSavedRecordsOpen(true)}
              isEditingExisting={Boolean(formData.id)}
              isSubmittingWebhook={isSubmittingWebhook}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <footer className="mt-10 py-5 border-t border-emerald-800/40 text-xs text-emerald-300/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) - Khối Bán lẻ</span>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDesignMode}
              className="text-emerald-400/80 hover:text-emerald-200 transition cursor-pointer text-xs flex items-center gap-1.5"
              title="Bật/Tắt hiển thị cấu hình Webhook Make"
            >
              <span>{isDesignMode ? '⚙️ Webhook Make (Đang hiện)' : '⚙️ Cấu hình Webhook Make'}</span>
            </button>
          </div>
        </footer>
      </main>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {/* Modal Xem bản lưu */}
      <SavedRecordsModal
        isOpen={isSavedRecordsOpen}
        onClose={() => setIsSavedRecordsOpen(false)}
        records={records}
        onSelectToEdit={handleSelectToEdit}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* Modal Webhook Make */}
      <WebhookModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        lastResult={lastWebhookResult}
      />

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
