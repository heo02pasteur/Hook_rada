export type RetailPillar = 'ho_kinh_doanh' | 'gpmb' | 'thanh_toan_so' | 'tin_dung' | 'khac';

export type ImpactSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface UploadedFileEvidence {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface CompetitorRecord {
  id: string;
  // 8 trường thông tin chuẩn theo yêu cầu:
  emailcb?: string;               // 1. Email cán bộ nhập
  chude?: RetailPillar | string;  // 2. Chủ đề
  doithu?: string;                // 3. Đối thủ cạnh tranh
  tintuc?: string;                // 4. Tin tức / Nội dung thông tin thị trường
  muctacdong?: ImpactSeverity;    // 5. Mức tác động (Khẩn cấp, Cao, Trung bình, Thấp)
  tacdong?: string;               // 6. Tác động đến Vietcombank
  dexuat?: string;                // 7. Đề xuất phản ứng cho Khối Bán lẻ và Chi nhánh
  bangchung?: string;             // 8. Bằng chứng xác thực (URL hoặc "Thông tin CHỜ thu thập")

  // Tương thích:
  submitterEmail?: string;
  competitor?: string;
  content?: string;
  impactOnVcb?: string;
  evidenceFiles?: UploadedFileEvidence[];
  pillarCategory?: RetailPillar;
  impactLevel?: ImpactSeverity;

  status: 'draft' | 'submitted' | 'updated';
  createdAt: string;
  updatedAt: string;
  branchName?: string;
  webhookSync?: {
    sent: boolean;
    at: string;
    httpStatus: number;
    message: string;
  };
}

export interface MarketIntelligenceItem {
  id: string;
  title: string;
  summary: string;
  pillar: RetailPillar;
  competitors: string[];
  impactOnVcb: string;
  impactLevel: ImpactSeverity;
  source: string;
  evidence?: string;            // Bằng chứng / URL xác thực (hoặc "Thông tin CHỜ thu thập")
  timestamp: string;
  recommendationRetail?: string; // Đề xuất cho Khối Bán lẻ
  recommendationBranch?: string; // Đề xuất cho Chi nhánh
  vcbProductMatching?: string;   // Sản phẩm tương đồng trên vietcombank.com.vn và gợi ý bán hàng
  metrics?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  tags: string[];
  verified: boolean;
}


