import React from 'react';
import { Webhook } from 'lucide-react';

interface HeaderProps {
  onOpenWebhookModal?: () => void;
  isDesignMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWebhookModal,
  isDesignMode = false,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#00523d] via-[#005a43] to-[#00523d] text-white border-b-2 border-emerald-400/40 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            {/* Logo VCB */}
            <div className="flex items-center bg-white px-2.5 py-1 rounded-lg shadow-sm border border-emerald-300/40 shrink-0">
              <img
                src="/logoVCB_xanh.png"
                alt="Vietcombank Logo"
                className="h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                THÔNG TIN THỊ TRƯỜNG
              </h1>
              <p className="text-xs text-emerald-100/90 hidden sm:block">
                Hệ thống phân tích thông tin thị trường & đối thủ cạnh tranh bán lẻ Vietcombank
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Make.com Webhook status button - ONLY SHOWN IN DESIGN MODE */}
            {isDesignMode && onOpenWebhookModal && (
              <button
                onClick={onOpenWebhookModal}
                className="flex items-center gap-1.5 bg-amber-900/90 hover:bg-amber-800 active:bg-amber-950 px-2.5 py-1.5 rounded-md border border-amber-600/70 text-amber-200 text-xs transition cursor-pointer"
                title="Giao diện thiết kế: Kiểm tra & cấu hình Webhook Make.com"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <Webhook className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">Webhook Make</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

