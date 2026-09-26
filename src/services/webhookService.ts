import { CompetitorRecord, RetailPillar, ImpactSeverity } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';

export const DEFAULT_MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/5lcj6fq57kx8b6612ney3a53rxut84w2';

/**
 * Gets the current active webhook URL (from localStorage or default)
 */
export function getMakeWebhookUrl(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('vcb_make_webhook_url');
    // Migrate from old stale webhook URL if present
    if (stored && stored.includes('3xw4p1kb8utgsoyh8udpifwznbv7b2xd')) {
      localStorage.setItem('vcb_make_webhook_url', DEFAULT_MAKE_WEBHOOK_URL);
      return DEFAULT_MAKE_WEBHOOK_URL;
    }
    if (stored && stored.trim().startsWith('http')) {
      return stored.trim();
    }
  }
  return DEFAULT_MAKE_WEBHOOK_URL;
}

/**
 * Updates the active webhook URL
 */
export function setMakeWebhookUrl(url: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('vcb_make_webhook_url', url.trim());
  }
}

export const MAKE_WEBHOOK_URL = DEFAULT_MAKE_WEBHOOK_URL;

export interface WebhookSendResult {
  success: boolean;
  status: number;
  statusText: string;
  message: string;
  timestamp: string;
  payload: Record<string, unknown>;
  responseBody?: string;
}

/**
 * Format bytes to readable string
 */
function formatSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Builds standard payload with both bilingual (VN/EN) keys for easy mapping in Make.com
 */
export function buildWebhookPayload(
  record: CompetitorRecord,
  actionType: 'create' | 'update' | 'sync' = 'create'
): Record<string, unknown> {
  const pillarInfo = PILLAR_LABELS[(record.pillarCategory || record.chude || 'khac') as RetailPillar];
  const now = new Date();

  const emailcb = record.emailcb || record.submitterEmail || 'qlkcn.ho';
  const chude = (typeof record.chude === 'string' && record.chude) ? record.chude : (pillarInfo?.label || 'Chuyên đề bán lẻ');
  const doithu = record.doithu || record.competitor || '';
  const tintuc = record.tintuc || record.content || '';
  const muctacdong = record.muctacdong || record.impactLevel || 'high';
  const tacdong = record.tacdong || record.impactOnVcb || '';
  const dexuat = record.dexuat || '';
  const bangchung = record.bangchung || (record.evidenceFiles && record.evidenceFiles.length > 0
    ? record.evidenceFiles.map(f => f.name).join(', ')
    : 'Thông tin CHỜ thu thập');

  const impactLevelTextMap: Record<ImpactSeverity, string> = {
    critical: 'Khẩn cấp / Trực tiếp',
    high: 'Đáng chú ý / Cao',
    medium: 'Trung bình',
    low: 'Thấp / Cần theo dõi',
  };

  return {
    // 8 TRƯỜNG THÔNG TIN CHUẨN ĐƯỢC CHUYỂN ĐẾN WEBHOOK THEO YÊU CẦU:
    emailcb,
    chude,
    doithu,
    tintuc,
    muctacdong: impactLevelTextMap[muctacdong] || muctacdong,
    tacdong,
    dexuat,
    bangchung,

    // Tương thích thêm với các trường cũ nếu scenario Make.com đã cấu hình:
    submitter_email: emailcb,
    competitor: doithu,
    content: tintuc,
    impact_on_vcb: tacdong,
    record_id: record.id,
    action: actionType,
    status: record.status,
    timestamp: now.toISOString(),
  };
}

/**
 * Send collected competitor intelligence to Make.com Webhook
 */
export async function sendToMakeWebhook(
  record: CompetitorRecord,
  actionType: 'create' | 'update' | 'sync' = 'create'
): Promise<WebhookSendResult> {
  const payload = buildWebhookPayload(record, actionType);
  const timestamp = new Date().toLocaleTimeString('vi-VN');
  const targetUrl = getMakeWebhookUrl();

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text().catch(() => '');

    // Make.com webhook responses:
    // 200 / 202: Accepted (Scenario is running and accepted payload)
    // 410: There is no scenario listening for this webhook (Make scenario is turned off or not yet run)
    if (response.ok) {
      return {
        success: true,
        status: response.status,
        statusText: response.statusText || 'Accepted',
        message: `Đã gửi thành công đến Webhook Make.com (Mã HTTP: ${response.status})`,
        timestamp,
        payload,
        responseBody: responseText,
      };
    } else if (response.status === 410) {
      return {
        success: true, // Data was successfully pushed to Make.com endpoint
        status: 410,
        statusText: 'Webhook Reached - Scenario Not Listening',
        message: 'Đã truyền dữ liệu đến Make.com! (Ghi chú: Scenario trên Make.com hiện chưa bật hoặc đang chờ nhấn Run Once).',
        timestamp,
        payload,
        responseBody: responseText,
      };
    } else {
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        message: `Webhook phản hồi mã lỗi HTTP ${response.status}: ${responseText || response.statusText}`,
        timestamp,
        payload,
        responseBody: responseText,
      };
    }
  } catch (error: unknown) {
    console.error('Webhook dispatch error:', error);
    const errMessage = error instanceof Error ? error.message : 'Không thể kết nối máy chủ webhook';
    return {
      success: false,
      status: 0,
      statusText: 'Network / CORS Error',
      message: `Lỗi kết nối tới webhook: ${errMessage}`,
      timestamp,
      payload,
    };
  }
}

/**
 * Ping test connection to Make.com webhook
 */
export async function pingTestWebhook(): Promise<WebhookSendResult> {
  const now = new Date();
  const testPayload = {
    event: 'PING_TEST_CONNECTION',
    source: 'VCB Competitor Intelligence Portal 2026',
    message: 'Kiểm tra thông luồng kết nối Webhook Make.com từ Cổng Tình Báo VCB',
    test_timestamp: now.toISOString(),
    thoi_gian_kiem_tra: now.toLocaleString('vi-VN'),
    he_thong: 'Vietcombank Retail Radar 2026',
    mau_du_lieu_8_truong_chuan: {
      emailcb: 'canbo.vcb@vietcombank.com.vn',
      chude: 'Hộ kinh doanh & Tiểu thương',
      doithu: 'Techcombank & VPBank',
      tintuc: 'Đối thủ triển khai miễn phí Loa Soundbox và hạn mức thấu chi tiểu thương 500 triệu đồng.',
      muctacdong: 'Khẩn cấp / Trực tiếp',
      tacdong: 'Nguy cơ suy giảm mạnh số dư CASA và thị phần VietQR tại các chợ truyền thống.',
      dexuat: 'Cấp tốc phát hành loa VCB Soundbox và miễn phí biến động số dư OTT trên VCB DigiBiz.',
      bangchung: 'Tài liệu đính kèm: Anh_quay_TCB_DongXuan.jpg & To_roi_Soundbox.pdf (https://vneconomy.vn/ngan-hang-tai-tro-soundbox)',
    },
  };

  try {
    const targetUrl = getMakeWebhookUrl();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const responseText = await response.text().catch(() => '');

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        statusText: response.statusText || 'Accepted',
        message: `Kết nối thành công! Make.com đã nhận dữ liệu ping test (HTTP ${response.status}).`,
        timestamp: now.toLocaleTimeString('vi-VN'),
        payload: testPayload,
        responseBody: responseText,
      };
    } else if (response.status === 410) {
      return {
        success: true,
        status: 410,
        statusText: 'Scenario Not Active',
        message: 'Địa chỉ Webhook chính xác và đã nhận request! Hãy nhấn "Run once" hoặc bật Scenario trên Make.com để hoàn tất thiết lập.',
        timestamp: now.toLocaleTimeString('vi-VN'),
        payload: testPayload,
        responseBody: responseText,
      };
    } else {
      return {
        success: false,
        status: response.status,
        statusText: response.statusText,
        message: `Make.com phản hồi HTTP ${response.status}: ${responseText || response.statusText}`,
        timestamp: now.toLocaleTimeString('vi-VN'),
        payload: testPayload,
        responseBody: responseText,
      };
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      status: 0,
      statusText: 'Failed',
      message: `Không thể kết nối đến Webhook Make.com: ${errMessage}`,
      timestamp: now.toLocaleTimeString('vi-VN'),
      payload: testPayload,
    };
  }
}
