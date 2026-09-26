import React, { useState, useEffect } from 'react';
import {
  X,
  Webhook,
  Send,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Layers,
  Code,
  ArrowUpRight,
  Edit3,
  RotateCcw
} from 'lucide-react';
import {
  getMakeWebhookUrl,
  setMakeWebhookUrl,
  DEFAULT_MAKE_WEBHOOK_URL,
  pingTestWebhook,
  sendToMakeWebhook,
  WebhookSendResult
} from '../services/webhookService';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastResult?: WebhookSendResult | null;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({
  isOpen,
  onClose,
  lastResult,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>(getMakeWebhookUrl());
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState<string>(getMakeWebhookUrl());
  const [urlSavedMsg, setUrlSavedMsg] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<WebhookSendResult | null>(lastResult || null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'payload' | 'guide'>('status');

  useEffect(() => {
    if (isOpen) {
      const activeUrl = getMakeWebhookUrl();
      setCurrentUrl(activeUrl);
      setUrlInput(activeUrl);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed.startsWith('http')) {
      alert('Vui lòng nhập đường dẫn URL hợp lệ bắt đầu bằng https://');
      return;
    }
    setMakeWebhookUrl(trimmed);
    setCurrentUrl(trimmed);
    setIsEditingUrl(false);
    setUrlSavedMsg(true);
    setTimeout(() => setUrlSavedMsg(false), 2500);
  };

  const handleResetDefaultUrl = () => {
    setMakeWebhookUrl(DEFAULT_MAKE_WEBHOOK_URL);
    setCurrentUrl(DEFAULT_MAKE_WEBHOOK_URL);
    setUrlInput(DEFAULT_MAKE_WEBHOOK_URL);
    setIsEditingUrl(false);
    setUrlSavedMsg(true);
    setTimeout(() => setUrlSavedMsg(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await pingTestWebhook();
      setTestResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendFullSample = async () => {
    setIsTesting(true);
    try {
      const res = await sendToMakeWebhook({
        id: 'rec-test-' + Date.now(),
        submitterEmail: 'heo02.pasteur@gmail.com',
        emailcb: 'heo02.pasteur@gmail.com',
        chude: 'Hộ kinh doanh',
        competitor: 'Techcombank & VPBank',
        doithu: 'Techcombank & VPBank',
        content: '[Dữ liệu kiểm tra Make.com] Đối thủ ra mắt gói thấu chi tự động 500 triệu đồng và tặng Soundbox cho tiểu thương 2026.',
        tintuc: '[Dữ liệu kiểm tra Make.com] Đối thủ ra mắt gói thấu chi tự động 500 triệu đồng và tặng Soundbox cho tiểu thương 2026.',
        impactOnVcb: 'Kiểm tra truyền dữ liệu đầy đủ chuẩn 8 trường thông tin vào Scenario Make.com.',
        tacdong: 'Kiểm tra truyền dữ liệu đầy đủ chuẩn 8 trường thông tin vào Scenario Make.com.',
        dexuat: 'Cấp tốc triển khai VCB Soundbox và tư vấn gói giải pháp thấu chi tiểu thương trên VCB DigiBiz.',
        bangchung: 'Tài liệu đính kèm: brochure_tcb_2026.pdf (https://vneconomy.vn/ngan-hang-tai-tro-soundbox)',
        evidenceFiles: [
          {
            id: 'ev-test-1',
            name: 'brochure_tcb_2026.pdf',
            size: 1548200,
            type: 'application/pdf',
            uploadedAt: new Date().toLocaleTimeString('vi-VN'),
          },
        ],
        pillarCategory: 'ho_kinh_doanh',
        impactLevel: 'critical',
        muctacdong: 'critical',
        status: 'submitted',
        createdAt: new Date().toLocaleDateString('vi-VN'),
        updatedAt: new Date().toLocaleDateString('vi-VN'),
      });
      setTestResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentResult = testResult || lastResult;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800/80 border border-emerald-600/40">
              <Webhook className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                CẤU HÌNH & TRẠNG THÁI WEBHOOK MAKE.COM
              </h3>
              <p className="text-xs text-emerald-300">
                Tự động truyền dữ liệu chuẩn 8 trường thông tin sang kịch bản tự động hóa Make.com
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-semibold gap-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Webhook className="w-4 h-4" />
            <span>Trạng thái kết nối</span>
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payload'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Cấu trúc dữ liệu gửi (JSON)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Hướng dẫn Make.com</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Target URL Box with Editing Support */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Đường dẫn Webhook Make.com đang kích hoạt:
              </label>
              {!isEditingUrl ? (
                <button
                  onClick={() => {
                    setUrlInput(currentUrl);
                    setIsEditingUrl(true);
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Đổi Webhook URL</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaultUrl}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Mặc định</span>
                  </button>
                  <button
                    onClick={() => setIsEditingUrl(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {isEditingUrl ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://hook.eu1.make.com/..."
                  className="w-full bg-white border border-emerald-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none ring-2 ring-emerald-500/20"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveUrl}
                    className="px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Lưu Webhook mới
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-emerald-900 font-semibold truncate select-all">
                  {currentUrl}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1 transition cursor-pointer shrink-0"
                  title="Sao chép link Webhook"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
            )}

            {urlSavedMsg && (
              <p className="text-xs text-emerald-700 font-medium">
                ✅ Đã lưu và áp dụng đường dẫn Webhook mới thành công!
              </p>
            )}
          </div>

          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Test Action Buttons */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Kiểm tra thông luồng dữ liệu sang Make.com</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    Gửi gói tin thử nghiệm trực tiếp sang Make.com để xác định cấu trúc dữ liệu (Data Structure) khi tạo mới hoặc kiểm tra kịch bản.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Đang gửi...' : 'Gửi Ping Test'}</span>
                  </button>

                  <button
                    onClick={handleSendFullSample}
                    disabled={isTesting}
                    className="px-3 py-2 rounded-lg bg-white border border-emerald-600 hover:bg-emerald-100/60 active:bg-emerald-200 disabled:opacity-50 text-emerald-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Gửi bản ghi mẫu đầy đủ 8 trường chuẩn Webhook</span>
                  </button>
                </div>
              </div>

              {/* Status Report */}
              {currentResult ? (
                <div
                  className={`p-4 rounded-xl border ${
                    currentResult.success
                      ? currentResult.status === 410
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                        : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {currentResult.success ? (
                      currentResult.status === 410 ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs">
                          {currentResult.status === 200 || currentResult.status === 202
                            ? '✅ Kết nối thành công (HTTP 200/202 Accepted)'
                            : currentResult.status === 410
                            ? '⚡ Webhook Make.com đã nhận gói tin (Mã HTTP 410)'
                            : `❌ Phản hồi HTTP ${currentResult.status}`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {currentResult.timestamp}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{currentResult.message}</p>

                      {currentResult.status === 410 && (
                        <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-amber-300 text-[11px] text-amber-900 space-y-1">
                          <strong className="block text-amber-950">💡 Hướng dẫn xử lý mã 410 trên Make.com:</strong>
                          <p>
                            Địa chỉ Webhook <code>{currentUrl}</code> hoàn toàn chính xác và đã tiếp nhận dữ liệu.
                            Make.com trả về mã 410 (<em>"There is no scenario listening for this webhook"</em>) vì kịch bản trên Make.com hiện chưa được bật chạy.
                          </p>
                          <p className="font-semibold text-emerald-800">
                            👉 Hãy vào giao diện kịch bản trên Make.com, nhấn nút <strong>"Run once"</strong> hoặc gạt nút kích hoạt sang <strong>"ON"</strong>, sau đó nhấn lại nút thử nghiệm ở trên!
                          </p>
                        </div>
                      )}

                      {currentResult.responseBody && (
                        <div className="mt-2 text-[11px] font-mono bg-white/80 p-2 rounded border border-slate-300/60">
                          Nội dung phản hồi từ Make.com: "{currentResult.responseBody}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-300 rounded-xl">
                  Chưa có lượt gửi nào trong phiên này. Hãy nhấn <strong>"Gửi Ping Test"</strong> hoặc nhấn <strong>"Cập nhật"</strong> trên biểu mẫu thu thập.
                </div>
              )}
            </div>
          )}

          {activeTab === 'payload' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Khi cán bộ VCB nhấn <strong>"Cập nhật"</strong>, gói tin JSON gồm <strong>chuẩn 8 trường thông tin</strong> sẽ được tự động POST sang Make.com:
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Chuẩn 8 Trường Webhook
                </span>
              </div>

              {/* Bảng tra cứu 8 trường chuẩn */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-2 w-1/4">Tên trường (Key)</th>
                      <th className="p-2 w-1/4">Loại dữ liệu</th>
                      <th className="p-2 w-1/2">Ý nghĩa trong phân tích bán lẻ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-slate-800">
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-emerald-800">1. emailcb</td>
                      <td className="p-2 text-slate-500 font-sans">Chuỗi (Email)</td>
                      <td className="p-2 text-slate-700 font-sans">Email cán bộ Khối Bán lẻ nhập thông tin</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2 font-bold text-emerald-800">2. chude</td>
                      <td className="p-2 text-slate-500 font-sans">Chuỗi (Danh mục)</td>
                      <td className="p-2 text-slate-700 font-sans">Chuyên đề trọng điểm (Hộ KD, GPMB, TT số, Tín dụng)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-emerald-800">3. doithu</td>
                      <td className="p-2 text-slate-500 font-sans">Chuỗi (Tên Bank)</td>
                      <td className="p-2 text-slate-700 font-sans">Tên ngân hàng đối thủ (Techcombank, MB, VPBank...)</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2 font-bold text-emerald-800">4. tintuc</td>
                      <td className="p-2 text-slate-500 font-sans">Văn bản chi tiết</td>
                      <td className="p-2 text-slate-700 font-sans">Nội dung sản phẩm / động thái đối thủ tại địa bàn</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-emerald-800">5. muctacdong</td>
                      <td className="p-2 text-slate-500 font-sans">Chuỗi (Mức độ)</td>
                      <td className="p-2 text-slate-700 font-sans">Khẩn cấp / Cao / Trung bình / Thấp</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2 font-bold text-emerald-800">6. tacdong</td>
                      <td className="p-2 text-slate-500 font-sans">Văn bản phân tích</td>
                      <td className="p-2 text-slate-700 font-sans">Đánh giá tác động trực tiếp đến CASA, thị phần VCB</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2 font-bold text-emerald-800">7. dexuat</td>
                      <td className="p-2 text-slate-500 font-sans">Văn bản kiến nghị</td>
                      <td className="p-2 text-slate-700 font-sans">Đề xuất giải pháp hành động cho Khối Bán lẻ & Chi nhánh</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-2 font-bold text-emerald-800">8. bangchung</td>
                      <td className="p-2 text-slate-500 font-sans">Đường dẫn / Tên file</td>
                      <td className="p-2 text-slate-700 font-sans">Link bài báo, tài liệu scan PDF, ảnh thực tế đính kèm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed border border-slate-800">
{JSON.stringify(
  currentResult?.payload || {
    emailcb: 'heo02.pasteur@gmail.com',
    chude: 'Hộ kinh doanh & Tiểu thương',
    doithu: 'Techcombank & VPBank',
    tintuc: 'Tài trợ 100% Loa thông minh Soundbox và cấp trước hạn mức thấu chi 500 triệu...',
    muctacdong: 'Khẩn cấp / Trực tiếp',
    tacdong: 'Nguy cơ suy giảm mạnh số dư CASA bán lẻ và mất 25% thị phần QR tại chợ đầu mối...',
    dexuat: 'Cấp tốc phát hành loa VCB Soundbox và miễn phí thông báo OTT trên VCB DigiBiz...',
    bangchung: 'Tài liệu đính kèm: Anh_quay_TCB_DongXuan.jpg & To_roi_Soundbox.pdf (https://vneconomy.vn/ngan-hang-tai-tro-soundbox)',
    record_id: 'rec-sample-01',
    action: 'create',
    status: 'submitted',
    timestamp: new Date().toISOString(),
  },
  null,
  2
)}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900">Cách cấu hình kịch bản tự động hóa trên Make.com:</h4>
                <ol className="list-decimal list-inside space-y-2 text-blue-950 text-xs">
                  <li>
                    Mở kịch bản (Scenario) của bạn trên Make.com chứa Custom Webhook: <code className="bg-blue-100 text-blue-900 font-mono px-1.5 py-0.5 rounded font-bold break-all">{currentUrl}</code>.
                  </li>
                  <li>
                    Nhấn nút <strong>"Run once"</strong> ở góc dưới bên trái của Make.com (hoặc click vào Webhook module chọn <em>"Redetermine data structure"</em>).
                  </li>
                  <li>
                    Quay lại cổng VCB này, nhấn nút <strong>"Gửi bản ghi mẫu đầy đủ 8 trường chuẩn Webhook"</strong> hoặc nhấn <strong>"Cập nhật"</strong> trên biểu mẫu.
                  </li>
                  <li>
                    Make.com sẽ hiển thị thông báo màu xanh <em>"Successfully determined"</em> và tự động nhận diện tất cả 8 biến chuẩn: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">emailcb</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">chude</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">doithu</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">tintuc</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">muctacdong</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">tacdong</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">dexuat</code>, <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">bangchung</code>.
                  </li>
                  <li>
                    Gạt công tắc góc dưới bên trái kịch bản Make.com sang <strong>"ON"</strong> (Scheduling) để kịch bản tự động chạy liên tục 24/7.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono truncate max-w-xs">
            {currentUrl}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
