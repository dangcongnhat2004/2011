import { X } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export function PosterModal({
  isOpen,
  imageSrc = '/assets/aistudio/image_7f72e084.png',
  title = 'Ảnh Thực Đơn Gốc',
  subtitle,
  onClose,
}: PosterModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-gradient-to-r from-[#EFF6FF] to-[#FDF2F8] px-5 py-3.5">
          <div>
            <p className="text-sm font-semibold text-[#172542]">{title}</p>
            {subtitle && <p className="text-xs text-[#516487]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng xem ảnh"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#4B5E80] transition-colors hover:bg-white/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[82vh] overflow-auto bg-[#F8FAFC] p-4">
          <img
            src={imageSrc}
            alt={title}
            referrerPolicy="no-referrer"
            className="mx-auto h-auto max-h-[76vh] max-w-full rounded-lg object-contain shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
