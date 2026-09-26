import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  TrendingUp,
  AlertOctagon,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Store,
  MapPin,
  Smartphone,
  CreditCard,
  RefreshCw,
  Copy,
  Info,
  CheckCircle2
} from 'lucide-react';
import { MarketIntelligenceItem, RetailPillar, ImpactSeverity } from '../types';
import { PILLAR_LABELS } from '../data/marketIntelligence2026';

interface MarketRadarStreamProps {
  items: MarketIntelligenceItem[];
  onExtractToForm: (item: MarketIntelligenceItem) => void;
  onSimulateNewItem: () => void;
  isAutoStreaming: boolean;
  setIsAutoStreaming: (val: boolean) => void;
}

export const MarketRadarStream: React.FC<MarketRadarStreamProps> = ({
  items,
  onExtractToForm,
  onSimulateNewItem,
  isAutoStreaming,
  setIsAutoStreaming,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<RetailPillar | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitorFilter, setSelectedCompetitorFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesPillar = selectedPillar === 'all' || item.pillar === selectedPillar;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.impactOnVcb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.competitors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCompetitor =
      selectedCompetitorFilter === 'all' ||
      item.competitors.some((c) => c.toLowerCase() === selectedCompetitorFilter.toLowerCase());

    return matchesPillar && matchesSearch && matchesCompetitor;
  });

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

  const getSeverityBadge = (level: ImpactSeverity) => {
    switch (level) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Tác động trực tiếp
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Đáng chú ý
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Trung bình
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Theo dõi
          </span>
        );
    }
  };

  const handleCopyAndExtract = (item: MarketIntelligenceItem) => {
    onExtractToForm(item);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Pillar counts
  const countByPillar = (pillar: RetailPillar) => items.filter((i) => i.pillar === pillar).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Top Header of the Market Radar Canvas */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>THÔNG TIN THU NHẬN TỰ ĐỘNG TỪ THỊ TRƯỜNG</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Bán lẻ 2026
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Radar cập nhật dữ liệu tự động 4 trụ cột bán lẻ: Hộ kinh doanh • Giải phóng mặt bằng • Thanh toán số • Tín dụng
                </p>
              </div>
            </div>
          </div>

          {/* Live Simulator Controls */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onSimulateNewItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition cursor-pointer"
              title="Mô phỏng bot thu thập tin tức mới từ thị trường 2026"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Quét tin mới</span>
            </button>

            <button
              onClick={() => setIsAutoStreaming(!isAutoStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition cursor-pointer border ${
                isAutoStreaming
                  ? 'bg-emerald-800 text-emerald-100 border-emerald-600'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAutoStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              <span>{isAutoStreaming ? 'Radar Đang Chạy' : 'Tạm Dừng'}</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedPillar('all')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer border ${
              selectedPillar === 'all'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span>Tất cả</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedPillar('ho_kinh_doanh')}
            className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer border ${
              selectedPillar === 'ho_kinh_doanh'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="truncate">Hộ kinh doanh</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
              {countByPillar('ho_kinh_doanh')}
            </span>
          </button>

          <button
            onClick={() => setSelectedPillar('gpmb')}
            className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer border ${
              selectedPillar === 'gpmb'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="truncate">GPMB & Đền bù</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
              {countByPillar('gpmb')}
            </span>
          </button>

          <button
            onClick={() => setSelectedPillar('thanh_toan_so')}
            className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer border ${
              selectedPillar === 'thanh_toan_so'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="truncate">Thanh toán số</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
              {countByPillar('thanh_toan_so')}
            </span>
          </button>

          <button
            onClick={() => setSelectedPillar('tin_dung')}
            className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer border ${
              selectedPillar === 'tin_dung'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span className="truncate">Tín dụng</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
              {countByPillar('tin_dung')}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo đối thủ, chính sách, từ khóa..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs text-slate-600">
          <span className="text-[11px] font-medium text-slate-500">
            Hiển thị <strong className="text-slate-800">{filteredItems.length}</strong> sự kiện thị trường
          </span>
          {selectedPillar !== 'all' && (
            <button
              onClick={() => setSelectedPillar('all')}
              className="text-[11px] text-emerald-700 hover:underline font-medium"
            >
              Xem tất cả
            </button>
          )}
        </div>
      </div>

      {/* Stream List of 2026 Retail Market Events */}
      <div className="p-4 overflow-y-auto max-h-[640px] space-y-3.5 bg-slate-50/50">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Không tìm thấy thông tin thị trường phù hợp</p>
            <p className="text-xs text-slate-500 mt-1">
              Thử xóa từ khóa tìm kiếm hoặc chọn chuyên đề khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPillar('all');
              }}
              className="mt-3 px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const pillarInfo = PILLAR_LABELS[item.pillar];
            const isJustExtracted = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm p-4 transition duration-150 relative group"
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Pillar Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${pillarInfo.badgeColor}`}
                    >
                      {getPillarIcon(item.pillar)}
                      <span>{pillarInfo.label}</span>
                    </span>

                    {/* Competitors involved badges */}
                    {item.competitors.map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>

                  {/* Impact Severity Badge & Timestamp */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    {getSeverityBadge(item.impactLevel)}
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                {/* News Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                  {item.title}
                </h3>

                {/* News Summary */}
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {item.summary}
                </p>

                {/* Impact on VCB highlight callout */}
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs">
                  <div className="flex items-start gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-black text-[10px] uppercase shrink-0 mt-0.5">
                      Tác động VCB
                    </span>
                    <p className="text-emerald-950 font-medium leading-relaxed">
                      {item.impactOnVcb}
                    </p>
                  </div>
                </div>

                {/* Metrics chips if available */}
                {item.metrics && item.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-slate-100">
                    {item.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] flex items-center gap-1"
                      >
                        <span className="text-slate-500">{m.label}:</span>
                        <span className="font-bold text-slate-800">{m.value}</span>
                        {m.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                        {m.trend === 'down' && <TrendingUp className="w-3 h-3 text-rose-600 rotate-180" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Source & Action button */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">
                    Nguồn: <span className="font-medium text-slate-700">{item.source}</span>
                  </span>

                  {/* Button to transfer this intelligence into the 5 input boxes */}
                  <button
                    onClick={() => handleCopyAndExtract(item)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                      isJustExtracted
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
                    }`}
                    title="Nạp tự động thông tin này vào 5 ô nhập liệu để hoàn thiện và báo cáo"
                  >
                    {isJustExtracted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã trích xuất vào form!</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Trích xuất vào ô nhập liệu</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Canvas Footer */}
      <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <span>Hệ thống tự động liên kết nguồn dữ liệu: NHNN, Napas, Báo Đầu Tư, VCCI & phản ánh từ 130 chi nhánh VCB.</span>
        <span className="text-emerald-700 font-semibold shrink-0">Phiên bản radar: 2026.09-v2</span>
      </div>
    </div>
  );
};
