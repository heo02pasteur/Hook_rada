import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Building2,
  FileText,
  AlertTriangle,
  UploadCloud,
  File,
  X,
  Save,
  Send,
  RotateCcw,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Tag,
  Link as LinkIcon,
  HelpCircle,
  FolderOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';
import {
  CompetitorRecord,
  UploadedFileEvidence,
  RetailPillar,
  ImpactSeverity
} from '../types';
import { POPULAR_COMPETITORS, PILLAR_LABELS } from '../data/marketIntelligence2026';

export interface IntakeFormData {
  id?: string;
  emailcb: string;
  chude: RetailPillar | string;
  doithu: string;
  tintuc: string;
  muctacdong: ImpactSeverity;
  tacdong: string;
  dexuat: string;
  bangchung: string;
  evidenceFiles?: UploadedFileEvidence[];

  // Tương thích ngược:
  submitterEmail?: string;
  competitor?: string;
  content?: string;
  impactOnVcb?: string;
  pillarCategory?: RetailPillar;
  impactLevel?: ImpactSeverity;
}

interface IntakeFormProps {
  formData: IntakeFormData;
  setFormData: React.Dispatch<React.SetStateAction<IntakeFormData>>;
  onSaveDraft: () => void;
  onSubmitUpdate: () => void;
  onReset: () => void;
  onOpenSavedRecords: () => void; // Nút "Xem bản lưu" ở đầu thẻ
  isEditingExisting: boolean;
  isSubmittingWebhook?: boolean;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  formData,
  setFormData,
  onSaveDraft,
  onSubmitUpdate,
  onReset,
  onOpenSavedRecords,
  isEditingExisting,
  isSubmittingWebhook = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isReadyToUpdate, setIsReadyToUpdate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ref của nút Cập nhật để tự động nhảy con trỏ về chờ sẵn sau khi nhập hết các ô
  const updateButtonRef = useRef<HTMLButtonElement>(null);

  // Kiểm tra xem tất cả các ô chính đã được điền đủ chưa
  useEffect(() => {
    const isFilled =
      Boolean(formData.emailcb?.trim()) &&
      Boolean(formData.doithu?.trim()) &&
      Boolean(formData.tintuc?.trim()) &&
      Boolean(formData.tacdong?.trim()) &&
      Boolean(formData.dexuat?.trim()) &&
      Boolean(formData.bangchung?.trim());

    setIsReadyToUpdate(isFilled);
  }, [formData]);

  // Nạp nhanh kịch bản 2026 mẫu
  const handleLoadSample = (sampleType: 'hkd' | 'gpmb' | 'tts' | 'td') => {
    if (sampleType === 'hkd') {
      setFormData((prev) => ({
        ...prev,
        chude: 'ho_kinh_doanh',
        pillarCategory: 'ho_kinh_doanh',
        doithu: 'Techcombank',
        competitor: 'Techcombank',
        muctacdong: 'critical',
        impactLevel: 'critical',
        tintuc:
          'Techcombank triển khai chiến dịch tặng máy in hóa đơn điện tử + loa thông minh TCB Soundbox miễn phí cho các hộ kinh doanh tại Chợ vải Đồng Xuân và Chợ Bình Tây. Đính kèm gói thấu chi tự động 500 triệu đồng giải ngân trong 30 giây dựa trên dòng tiền QR.',
        content:
          'Techcombank triển khai chiến dịch tặng máy in hóa đơn điện tử + loa thông minh TCB Soundbox miễn phí cho các hộ kinh doanh tại Chợ vải Đồng Xuân và Chợ Bình Tây. Đính kèm gói thấu chi tự động 500 triệu đồng giải ngân trong 30 giây dựa trên dòng tiền QR.',
        tacdong:
          'Nguy cơ mất 30% khách hàng tiểu thương dùng QR VCB Digibank hiện hữu; sụt giảm số dư CASA bán lẻ.',
        impactOnVcb:
          'Nguy cơ mất 30% khách hàng tiểu thương dùng QR VCB Digibank hiện hữu; sụt giảm số dư CASA bán lẻ.',
        dexuat:
          'Khối Bán lẻ khẩn trương trang bị miễn phí VCB Soundbox cho tiểu thương; Chi nhánh tiếp cận trực tiếp ban quản lý chợ.',
        bangchung: 'Tài liệu đính kèm: Anh_Chup_Quay_TCB_DongXuan.jpg & To_roi_Soundbox.pdf',
      }));
    } else if (sampleType === 'gpmb') {
      setFormData((prev) => ({
        ...prev,
        chude: 'gpmb',
        pillarCategory: 'gpmb',
        doithu: 'HDBank',
        competitor: 'HDBank',
        muctacdong: 'critical',
        impactLevel: 'critical',
        tintuc:
          'HDBank liên kết Ban Bồi thường GPMB Vành Đai 4 tại Hoài Đức và Thường Tín, lập quầy lưu động tại UBND xã để mở tài khoản nhận tiền bồi thường đất. Tặng ngay sổ tiết kiệm cộng lãi suất 0.7%/năm cho hộ nhận từ 1 tỷ đồng.',
        content:
          'HDBank liên kết Ban Bồi thường GPMB Vành Đai 4 tại Hoài Đức và Thường Tín, lập quầy lưu động tại UBND xã để mở tài khoản nhận tiền bồi thường đất. Tặng ngay sổ tiết kiệm cộng lãi suất 0.7%/năm cho hộ nhận từ 1 tỷ đồng.',
        tacdong:
          'HDBank đang hút trọn dòng tiền bồi thường dự án hạ tầng trọng điểm hàng nghìn tỷ đồng.',
        impactOnVcb:
          'HDBank đang hút trọn dòng tiền bồi thường dự án hạ tầng trọng điểm hàng nghìn tỷ đồng.',
        dexuat:
          'Chi nhánh VCB chủ động tiếp cận BQLDA và chính quyền huyện để đặt quầy đối trọng; Trụ sở chính ban hành cơ chế lãi suất thỏa thuận.',
        bangchung: 'Tài liệu đính kèm: BienBanHop_BanBoiThuong_HoaiDuc.pdf (Công văn số 118/UBND-GPMB)',
      }));
    } else if (sampleType === 'tts') {
      setFormData((prev) => ({
        ...prev,
        chude: 'thanh_toan_so',
        pillarCategory: 'thanh_toan_so',
        doithu: 'VPBank',
        competitor: 'VPBank',
        muctacdong: 'high',
        impactLevel: 'high',
        tintuc:
          'VPBank cập nhật tính năng Tap-to-Phone trên app VPBank NEO Biz, cho phép các tài xế Grab, ShopeeFood thanh toán thẻ trực tiếp qua NFC điện thoại thay vì quẹt thẻ POS truyền thống.',
        content:
          'VPBank cập nhật tính năng Tap-to-Phone trên app VPBank NEO Biz, cho phép các tài xế Grab, ShopeeFood thanh toán thẻ trực tiếp qua NFC điện thoại thay vì quẹt thẻ POS truyền thống.',
        tacdong:
          'Giảm doanh thu dịch vụ thuê máy POS của VCB tại chuỗi cửa hàng tiện lợi và giao hàng nhanh.',
        impactOnVcb:
          'Giảm doanh thu dịch vụ thuê máy POS của VCB tại chuỗi cửa hàng tiện lợi và giao hàng nhanh.',
        dexuat:
          'Đẩy mạnh tích hợp SoftPOS Tap-to-phone trên ứng dụng VCB DigiBiz và VCB Digibank.',
        bangchung: 'Tài liệu đính kèm: Video_TapToPhone_Grab_VPB.mp4 & ThongBaoMerchant.pdf',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        chude: 'tin_dung',
        pillarCategory: 'tin_dung',
        doithu: 'MB Bank',
        competitor: 'MB Bank',
        muctacdong: 'critical',
        impactLevel: 'critical',
        tintuc:
          'MB tung gói tín dụng nhà đất 2026 với lãi suất cố định 5.9%/năm trong 36 tháng đầu, đồng thời miễn phí trả nợ trước hạn từ năm thứ 4. Hồ sơ duyệt qua app MB trong 24 giờ.',
        content:
          'MB tung gói tín dụng nhà đất 2026 với lãi suất cố định 5.9%/năm trong 36 tháng đầu, đồng thời miễn phí trả nợ trước hạn từ năm thứ 4. Hồ sơ duyệt qua app MB trong 24 giờ.',
        tacdong:
          'Khách hàng vay mua nhà tại VCB so sánh lãi suất; nguy cơ chuyển dịch dư nợ sang MB.',
        impactOnVcb:
          'Khách hàng vay mua nhà tại VCB so sánh lãi suất; nguy cơ chuyển dịch dư nợ sang MB.',
        dexuat:
          'Khối Bán lẻ rà soát biên độ lãi suất vay mua nhà 2026; Chi nhánh chủ động chăm sóc khách hàng VIP.',
        bangchung: 'Tài liệu đính kèm: BangLaiSuat_MB_CoDinh36Thang.pdf (https://cafef.vn/lai-suat-nha-dat-mb)',
      }));
    }

    // Nhảy con trỏ về nút Cập nhật chờ sẵn
    setTimeout(() => {
      updateButtonRef.current?.focus();
    }, 150);
  };

  // Hàm kích hoạt nhảy con trỏ về nút Cập nhật chờ sẵn sau khi nhập xong ô cuối cùng
  const handleFinalFieldBlur = () => {
    if (updateButtonRef.current) {
      updateButtonRef.current.focus();
    }
  };

  // Upload file handlers
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const names = Array.from(files).map((f) => f.name).join(', ');
    setFormData((prev) => ({
      ...prev,
      bangchung: prev.bangchung ? `${prev.bangchung}, ${names}` : names,
    }));

    // Nhảy về nút cập nhật
    setTimeout(() => {
      updateButtonRef.current?.focus();
    }, 200);
  };

  const handleValidateAndSubmit = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.emailcb?.trim()) errors.emailcb = 'Vui lòng nhập Email cán bộ';
    if (!formData.doithu?.trim()) errors.doithu = 'Vui lòng chọn hoặc nhập Đối thủ cạnh tranh';
    if (!formData.tintuc?.trim()) errors.tintuc = 'Vui lòng nhập Tin tức / Nội dung thông tin';
    if (!formData.tacdong?.trim()) errors.tacdong = 'Vui lòng nhập Tác động đến Vietcombank';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmitUpdate();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header thanh lịch Vietcombank */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <div>
            <h2 className="font-bold text-sm sm:text-base tracking-wide uppercase text-white">
              NHẬP THÔNG TIN THỊ TRƯỜNG
            </h2>
            <p className="text-[11px] text-emerald-200">
              {isEditingExisting ? 'Đang chỉnh sửa bản ghi hiện hữu' : '8 trường dữ liệu chuẩn hóa kết nối Make.com Webhook'}
            </p>
          </div>
        </div>

        {/* Nút Xem bản lưu ở đầu thẻ */}
        <button
          type="button"
          onClick={onOpenSavedRecords}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer"
          title="Xem danh sách các bản đã lưu để chọn ra và sửa lại nếu cần rồi Cập nhật"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-950" />
          <span>Xem bản lưu</span>
        </button>
      </div>

      {/* Quick sample scenario prompt */}
      <div className="bg-emerald-50/80 border-b border-emerald-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Nạp nhanh kịch bản mẫu:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleLoadSample('hkd')}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold transition cursor-pointer shadow-2xs"
          >
            Hộ kinh doanh (Soundbox)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('gpmb')}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold transition cursor-pointer shadow-2xs"
          >
            GPMB (Vành đai 4)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('tts')}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold transition cursor-pointer shadow-2xs"
          >
            Thanh toán số (Tap-to-phone)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('td')}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold transition cursor-pointer shadow-2xs"
          >
            Tín dụng (Vay mua nhà 5.9%)
          </button>
        </div>
      </div>

      {/* 8 Trường nhập thông tin thị trường */}
      <div className="p-5 sm:p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TRƯỜNG 1: emailcb */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                  1
                </span>
                <span>Email cán bộ (emailcb)</span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.emailcb || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailcb: e.target.value,
                    submitterEmail: e.target.value,
                  }))
                }
                placeholder="Ví dụ: vcb.hoankiem@vietcombank.com.vn"
                className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  validationErrors.emailcb ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.emailcb && (
              <p className="text-[11px] text-red-600 mt-1">{validationErrors.emailcb}</p>
            )}
          </div>

          {/* TRƯỜNG 2: chude */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                  2
                </span>
                <span>Chủ đề (chude)</span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              value={formData.chude || 'ho_kinh_doanh'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  chude: e.target.value,
                  pillarCategory: e.target.value as RetailPillar,
                }))
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ho_kinh_doanh">Hộ kinh doanh & Tiểu thương</option>
              <option value="gpmb">Giải phóng mặt bằng & Đền bù tái định cư</option>
              <option value="thanh_toan_so">Thanh toán số & Sinh trắc học QĐ 2345</option>
              <option value="tin_dung">Tín dụng bán lẻ (Vay nhà, SXKD, Thấu chi)</option>
              <option value="khac">Chủ đề thị trường khác</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TRƯỜNG 3: doithu */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                  3
                </span>
                <span>Đối thủ cạnh tranh (doithu)</span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.doithu || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    doithu: e.target.value,
                    competitor: e.target.value,
                  }))
                }
                placeholder="Ví dụ: Techcombank, VPBank, MB Bank, BIDV..."
                className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  validationErrors.doithu ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                }`}
              />
            </div>
            {validationErrors.doithu && (
              <p className="text-[11px] text-red-600 mt-1">{validationErrors.doithu}</p>
            )}

            {/* Quick badges đối thủ */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['Techcombank', 'VPBank', 'MB Bank', 'BIDV', 'Agribank', 'ACB'].map((bank) => (
                <button
                  type="button"
                  key={bank}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      doithu: bank,
                      competitor: bank,
                    }))
                  }
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[10px] font-semibold border border-slate-200 transition cursor-pointer"
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>

          {/* TRƯỜNG 5: muctacdong */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                  5
                </span>
                <span>Mức tác động (muctacdong)</span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'critical', label: 'Khẩn cấp', color: 'bg-rose-100 text-rose-800 border-rose-300' },
                  { id: 'high', label: 'Cao', color: 'bg-orange-100 text-orange-800 border-orange-300' },
                  { id: 'medium', label: 'Trung bình', color: 'bg-blue-100 text-blue-800 border-blue-300' },
                  { id: 'low', label: 'Thấp', color: 'bg-slate-100 text-slate-800 border-slate-300' },
                ] as const
              ).map((lvl) => {
                const isSelected =
                  formData.muctacdong === lvl.id || formData.impactLevel === lvl.id;
                return (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        muctacdong: lvl.id,
                        impactLevel: lvl.id,
                      }))
                    }
                    className={`py-2 px-1 rounded-lg border text-center font-bold text-[11px] transition cursor-pointer ${
                      isSelected
                        ? `${lvl.color} ring-2 ring-emerald-500 shadow-xs font-black`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TRƯỜNG 4: tintuc */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                4
              </span>
              <span>Tin tức / Nội dung thông tin thị trường (tintuc)</span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            rows={3}
            value={formData.tintuc || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tintuc: e.target.value,
                content: e.target.value,
              }))
            }
            placeholder="Mô tả cụ thể diễn biến đối thủ, sản phẩm mới, chính sách lãi suất hoặc chương trình ưu đãi..."
            className={`w-full bg-slate-50 border rounded-lg p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              validationErrors.tintuc ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
            }`}
          />
          {validationErrors.tintuc && (
            <p className="text-[11px] text-red-600 mt-0.5">{validationErrors.tintuc}</p>
          )}
        </div>

        {/* TRƯỜNG 6: tacdong */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                6
              </span>
              <span>Tác động đến Vietcombank (tacdong)</span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            rows={2}
            value={formData.tacdong || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tacdong: e.target.value,
                impactOnVcb: e.target.value,
              }))
            }
            placeholder="Đánh giá nguy cơ suy giảm CASA, mất thị phần merchant QR, hoặc khách hàng chuyển dịch..."
            className={`w-full bg-slate-50 border rounded-lg p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              validationErrors.tacdong ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
            }`}
          />
          {validationErrors.tacdong && (
            <p className="text-[11px] text-red-600 mt-0.5">{validationErrors.tacdong}</p>
          )}
        </div>

        {/* TRƯỜNG 7: dexuat */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                7
              </span>
              <span>Đề xuất kiến nghị phản ứng (dexuat)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal">Cho Khối Bán lẻ & Chi nhánh</span>
          </label>
          <textarea
            rows={2}
            value={formData.dexuat || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, dexuat: e.target.value }))}
            placeholder="Đề xuất Khối Bán lẻ ban hành chính sách gì? Chi nhánh cần hành động phản ứng ra sao?"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* TRƯỜNG 8: bangchung (Ô cuối cùng - sau khi nhập xong, con trỏ nhảy về nút Cập nhật chờ sẵn) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] items-center justify-center">
                8
              </span>
              <span>Bằng chứng xác thực / Đường dẫn (bangchung)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Nếu chưa có nhập: "Thông tin CHỜ thu thập"
            </span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.bangchung || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, bangchung: e.target.value }))}
                onBlur={handleFinalFieldBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFinalFieldBlur();
                  }
                }}
                placeholder='Đường dẫn website, bài báo, hoặc nhập "Thông tin CHỜ thu thập"...'
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300 transition cursor-pointer shrink-0"
              title="Tải tệp đính kèm bằng chứng"
            >
              <UploadCloud className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Tải tệp</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              className="hidden"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 italic">
            * Mẹo: Sau khi nhập xong ô Bằng chứng, con trỏ sẽ tự động nhảy về nút Cập nhật chờ sẵn!
          </p>
        </div>

        {/* ========================================================================= */}
        {/* NÚT THAO TÁC: CẬP NHẬT (ƯU TIÊN FOCUS) & LƯU TẠM & LÀM MỚI */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa trắng</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Nút Lưu tạm */}
            <button
              type="button"
              onClick={onSaveDraft}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 shadow-2xs transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>Lưu tạm</span>
            </button>

            {/* Nút CẬP NHẬT: Nhận focus tự động sau khi điền hết các ô */}
            <button
              ref={updateButtonRef}
              type="button"
              onClick={handleValidateAndSubmit}
              disabled={isSubmittingWebhook}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm shadow-md transition cursor-pointer ${
                isReadyToUpdate
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white ring-4 ring-emerald-300 animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              } disabled:opacity-50`}
            >
              {isSubmittingWebhook ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang truyền Make...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Cập nhật</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
