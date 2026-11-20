import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, Save, CheckCircle2 } from 'lucide-react';
import type { CartItem } from '../types/order';
import {
  MENU_ITEM_JA,
  translateIce,
  translateSize,
  translateSweetness,
  translateToppingName,
  type Language,
} from '../data/i18n';

interface CartDrawerProps {
  lang: Language;
  isOpen: boolean;
  items: CartItem[];
  defaultTeacherName: string;
  isSaving: boolean;
  saveError: string | null;
  onClose: () => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onSubmitOrder: (teacherName: string, wishNote: string) => Promise<boolean>;
}

export function CartDrawer({
  lang,
  isOpen,
  items,
  defaultTeacherName,
  isSaving,
  saveError,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
}: CartDrawerProps) {
  const isJa = lang === 'ja';
  const [teacherName, setTeacherName] = useState(defaultTeacherName);
  const [wishNote, setWishNote] = useState('');
  const [localValidation, setLocalValidation] = useState<string | null>(null);
  const [justSavedTeacher, setJustSavedTeacher] = useState<string | null>(null);

  useEffect(() => {
    if (defaultTeacherName && !teacherName) {
      setTeacherName(defaultTeacherName);
    }
  }, [defaultTeacherName, teacherName]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidation(null);
    const trimmed = teacherName.trim();
    if (!trimmed) {
      setLocalValidation(
        isJa
          ? 'お名前をご入力ください。'
          : 'Vui lòng nhập tên của cô / thầy để ghi nhận vào danh sách đi mua.'
      );
      return;
    }
    if (items.length === 0) {
      setLocalValidation(
        isJa ? 'カートが空です。1つ以上お選びください。' : 'Giỏ tạm đang trống. Vui lòng chọn ít nhất một món.'
      );
      return;
    }

    const ok = await onSubmitOrder(trimmed, wishNote.trim());
    if (ok) {
      setJustSavedTeacher(trimmed);
      setWishNote('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-gradient-to-r from-[#EFF6FF] to-[#FDF2F8] px-6 py-4">
          <div>
            <h3 id="cart-drawer-title" className="font-display text-2xl font-bold text-[#172542]">
              {isJa ? '一時カート' : 'Giỏ Tạm Đang Chọn'}
            </h3>
            <p className="text-xs text-[#516487]">
              {isJa
                ? `${totalCount} 点 · 保存すると注文リストに記録されます`
                : `${totalCount} món · Bấm lưu để ghi vào file danh sách đi mua`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isJa ? '閉じる' : 'Đóng giỏ hàng'}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#4B5E80] transition-colors hover:bg-white/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {justSavedTeacher && items.length === 0 && (
            <div className="mb-5 rounded-xl border border-[#2563EB]/25 bg-gradient-to-r from-[#EFF6FF] to-[#FDF2F8] p-4 text-sm text-[#172542]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="font-semibold">
                    {isJa
                      ? `${justSavedTeacher} のご注文をファイルに保存しました！`
                      : `Đã lưu đơn của ${justSavedTeacher} vào file!`}
                  </p>
                  <p className="mt-1 text-xs text-[#4B5E80]">
                    {isJa
                      ? '下部の注文まとめリストに反映されました。'
                      : 'Đơn đã được cập nhật trong danh sách tổng hợp bên dưới để lớp đi mua cho các cô.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
              <p className="text-sm font-semibold text-[#172542]">
                {isJa ? '一時カートは空です' : 'Giỏ tạm hiện đang trống'}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#516487]">
                {isJa
                  ? 'メニューから「決定してファイルに保存」を押すと、すぐにファイルへ保存されます。'
                  : 'Khi các cô chọn món và bấm "Chọn & Lưu vào file", món sẽ được lưu ngay lập tức vào file mà không cần qua bước giỏ tạm.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {items.map((item) => {
                const displayName = isJa ? MENU_ITEM_JA[item.menuItemId]?.name ?? item.name : item.name;
                const optionLines = [
                  item.size !== 'DEFAULT' ? translateSize(item.size, lang) : null,
                  translateSweetness(item.sweetness, lang) ?? null,
                  translateIce(item.ice, lang) ?? null,
                ]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <div
                    key={item.cartItemId}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#172542]">{displayName}</p>
                        {optionLines && (
                          <p className="mt-0.5 text-xs text-[#516487]">{optionLines}</p>
                        )}
                        {item.toppings.length > 0 && (
                          <p className="mt-0.5 text-xs font-medium text-[#BE185D]">
                            + {item.toppings.map((t) => translateToppingName(t.id, t.name, lang)).join(', ')}
                          </p>
                        )}
                        {item.note && (
                          <p className="mt-0.5 text-xs italic text-[#64748B]">
                            {isJa ? '備考: ' : 'Ghi chú: '}
                            {item.note}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        aria-label={isJa ? '削除' : `Xóa ${item.name}`}
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#E2E8F0] pt-2.5">
                      <span className="text-xs text-[#516487]">{isJa ? '数量' : 'Số lượng'}</span>
                      <div className="flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          aria-label={isJa ? '減らす' : 'Giảm số lượng'}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[#1D4ED8] hover:bg-[#EFF6FF]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums text-[#172542]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          aria-label={isJa ? '増やす' : 'Tăng số lượng'}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-[#1D4ED8] hover:bg-[#EFF6FF]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save to File Form */}
        <form
          onSubmit={handleSave}
          className="border-t border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-[#FDF2F8]/60 px-6 py-4"
        >
          <div className="space-y-3">
            <div>
              <label htmlFor="teacher-name" className="mb-1 block text-xs font-semibold text-[#172542]">
                {isJa ? '先生のお名前（必須）' : 'Tên Giáo Viên (bắt buộc)'}
              </label>
              <input
                id="teacher-name"
                type="text"
                value={teacherName}
                onChange={(e) => {
                  setTeacherName(e.target.value);
                  setLocalValidation(null);
                  setJustSavedTeacher(null);
                }}
                placeholder={isJa ? '例：佐藤先生、ラン先生...' : 'Ví dụ: Cô Thảo, Cô Minh Anh, Thầy Hùng...'}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#172542] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="wish-note" className="mb-1 block text-xs font-semibold text-[#172542]">
                {isJa ? 'メッセージ・お届けメモ（任意）' : 'Lời nhắn hoặc dặn dò thêm (tùy chọn)'}
              </label>
              <input
                id="wish-note"
                type="text"
                value={wishNote}
                onChange={(e) => setWishNote(e.target.value)}
                placeholder={isJa ? '例：VJIT講師室へお願いします...' : 'Ví dụ: Giao phòng giáo viên VJIT...'}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-sm text-[#172542] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            {(localValidation || saveError) && (
              <p className="text-xs font-medium text-red-700" role="alert">
                {localValidation || saveError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving || items.length === 0}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EC4899] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSaving
                  ? isJa
                    ? '保存中...'
                    : 'Đang lưu vào file...'
                  : isJa
                    ? `${totalCount} 点をファイルに保存`
                    : `Lưu ${totalCount} món vào file`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
