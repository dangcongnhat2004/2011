import { useMemo, useState } from 'react';
import { X, Plus, Minus, Check, Save } from 'lucide-react';
import type { CartItem, MenuItem, SelectedTopping, SizeKey } from '../types/order';
import { ICE_LEVELS, SWEETNESS_LEVELS, TOPPINGS } from '../data/menuData';
import {
  CATEGORY_JA,
  MENU_ITEM_JA,
  translateIce,
  translateSize,
  translateSweetness,
  translateToppingName,
  type Language,
} from '../data/i18n';
import { MenuItemVisual } from './MenuItemVisual';

interface ItemModalProps {
  lang: Language;
  item: MenuItem;
  defaultTeacherName: string;
  isSaving: boolean;
  onClose: () => void;
  onQuickSave: (teacherName: string, cartItem: CartItem, wishNote: string) => Promise<boolean>;
  onAddToCart: (cartItem: CartItem) => void;
}

export function ItemModal({
  lang,
  item,
  defaultTeacherName,
  isSaving,
  onClose,
  onQuickSave,
  onAddToCart,
}: ItemModalProps) {
  const isJa = lang === 'ja';
  const availableSizes = useMemo(() => {
    const keys: SizeKey[] = ['M', 'L', 'HOT', 'DEFAULT'];
    return keys.filter((k) => typeof item.prices[k] === 'number');
  }, [item]);

  const [teacherName, setTeacherName] = useState<string>(defaultTeacherName);
  const [size, setSize] = useState<SizeKey>(availableSizes[0] ?? 'DEFAULT');
  const [sweetness, setSweetness] = useState<string>('100% Ngọt chuẩn');
  const [ice, setIce] = useState<string>('100% Đá vừa');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [includeExtra, setIncludeExtra] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [nameError, setNameError] = useState<string | null>(null);

  const basePrice = item.prices[size] ?? 0;
  const isHotSelection = size === 'HOT';
  const showIceSelector = item.allowIce && !isHotSelection;
  const isMilkTeaLarge = Boolean(item.isMilkTea && size === 'L');

  const resolvedToppings: SelectedTopping[] = useMemo(() => {
    const list: SelectedTopping[] = [];
    if (includeExtra && item.recommendedExtra) {
      list.push({
        id: item.recommendedExtra.id,
        name: item.recommendedExtra.name,
        price: item.recommendedExtra.price,
      });
    }
    for (const topId of selectedToppings) {
      const top = TOPPINGS.find((t) => t.id === topId);
      if (top) {
        const effectivePrice =
          isMilkTeaLarge && typeof top.milkTeaLPromoPrice === 'number'
            ? top.milkTeaLPromoPrice
            : top.price;
        list.push({
          id: top.id,
          name: top.name,
          price: effectivePrice,
          unit: top.unit,
        });
      }
    }
    return list;
  }, [includeExtra, item.recommendedExtra, selectedToppings, isMilkTeaLarge]);

  const toppingsUnitTotal = resolvedToppings.reduce((sum, t) => sum + t.price, 0);
  const lineTotal = (basePrice + toppingsUnitTotal) * quantity;

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const buildCartItem = (): CartItem => ({
    cartItemId: `${item.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    menuItemId: item.id,
    name: item.name,
    englishName: item.englishName,
    categoryLabel: item.categoryLabel,
    size,
    unitBasePrice: basePrice,
    sweetness: item.allowSweetness ? sweetness : undefined,
    ice: showIceSelector ? ice : undefined,
    toppings: resolvedToppings,
    quantity,
    note: note.trim() || undefined,
    lineTotal,
  });

  const handleSaveDirectly = async () => {
    const trimmed = teacherName.trim();
    if (!trimmed) {
      setNameError(
        isJa
          ? 'お名前をご入力ください（正しくお届けするため）。'
          : 'Cô / Thầy nhập tên giúp tụi em để lưu đúng người nhận nhé!'
      );
      return;
    }
    setNameError(null);
    const ok = await onQuickSave(trimmed, buildCartItem(), '');
    if (ok) {
      onClose();
    }
  };

  const handleAddToCartOnly = () => {
    onAddToCart(buildCartItem());
    onClose();
  };

  const jaMeta = MENU_ITEM_JA[item.id];
  const displayName = isJa && jaMeta ? jaMeta.name : item.name;
  const displayCategory = isJa ? CATEGORY_JA[item.categoryId]?.title ?? item.categoryLabel : item.categoryLabel;
  const displayDesc = isJa && jaMeta?.description ? jaMeta.description : item.description;
  const displayExtra = isJa && jaMeta?.extra ? jaMeta.extra : item.recommendedExtra?.name;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#EFF6FF] to-[#FDF2F8] px-6 py-5">
          <div className="flex items-center gap-4">
            <MenuItemVisual item={item} size="sm" />
            <div>
              <p className="text-xs font-semibold text-[#1D4ED8]">{displayCategory}</p>
              <h3 id="item-modal-title" className="font-display text-2xl font-bold text-[#172542]">
                {displayName}
              </h3>
              <p className="text-xs text-[#516487]">
                {isJa ? item.name : item.englishName}
                {displayDesc ? ` · ${displayDesc}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isJa ? '閉じる' : 'Đóng hộp thoại chọn món'}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#4B5E80] transition-colors hover:bg-white/70 hover:text-[#172542]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label htmlFor="modal-teacher-name" className="mb-1.5 block text-sm font-semibold text-[#172542]">
              {isJa ? '先生のお名前' : 'Tên Cô / Thầy chọn món'}
            </label>
            <input
              id="modal-teacher-name"
              type="text"
              value={teacherName}
              onChange={(e) => {
                setTeacherName(e.target.value);
                setNameError(null);
              }}
              placeholder={isJa ? '例：佐藤先生、ラン先生...' : 'VD: Cô Thảo, Cô Minh Anh, Thầy Hùng...'}
              className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-medium text-[#172542] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:outline-none"
            />
            {nameError && (
              <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
                {nameError}
              </p>
            )}
          </div>

          {availableSizes.length > 0 && availableSizes[0] !== 'DEFAULT' && (
            <div>
              <p className="mb-2.5 text-sm font-semibold text-[#172542]">
                {isJa ? 'サイズ選択' : 'Chọn kích cỡ'}
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {availableSizes.map((s) => {
                  const active = size === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border px-3.5 py-2.5 text-center transition-colors ${
                        active
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                          : 'border-[#CBD5E1] bg-white text-[#334566] hover:border-[#2563EB]/45'
                      }`}
                    >
                      <span className="text-xs font-semibold">{translateSize(s, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {item.allowSweetness && (
            <div>
              <p className="mb-2.5 text-sm font-semibold text-[#172542]">
                {isJa ? '甘さ' : 'Độ ngọt'}
              </p>
              <div className="flex flex-wrap gap-2">
                {SWEETNESS_LEVELS.map((lvl) => {
                  const active = sweetness === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSweetness(lvl)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'border-[#2563EB] bg-[#2563EB] text-white'
                          : 'border-[#CBD5E1] bg-white text-[#334566] hover:border-[#2563EB]/45'
                      }`}
                    >
                      {translateSweetness(lvl, lang)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {showIceSelector && (
            <div>
              <p className="mb-2.5 text-sm font-semibold text-[#172542]">
                {isJa ? '氷の量' : 'Lượng đá'}
              </p>
              <div className="flex flex-wrap gap-2">
                {ICE_LEVELS.map((lvl) => {
                  const active = ice === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setIce(lvl)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'border-[#EC4899] bg-[#EC4899] text-white'
                          : 'border-[#CBD5E1] bg-white text-[#334566] hover:border-[#EC4899]/45'
                      }`}
                    >
                      {translateIce(lvl, lang)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {item.recommendedExtra && (
            <div>
              <p className="mb-2 text-sm font-semibold text-[#172542]">
                {isJa ? 'おすすめ追加オプション' : 'Gợi ý thêm đặc biệt'}
              </p>
              <button
                type="button"
                onClick={() => setIncludeExtra((v) => !v)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                  includeExtra
                    ? 'border-[#EC4899] bg-[#FDF2F8]'
                    : 'border-[#CBD5E1] bg-white hover:border-[#EC4899]/45'
                }`}
              >
                <p className="text-sm font-medium text-[#172542]">{displayExtra}</p>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    includeExtra
                      ? 'border-[#EC4899] bg-[#EC4899] text-white'
                      : 'border-[#94A3B8] bg-white'
                  }`}
                >
                  {includeExtra && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            </div>
          )}

          {item.allowToppings && (
            <div>
              <p className="mb-2.5 text-sm font-semibold text-[#172542]">
                {isJa ? 'トッピング追加' : 'Topping dùng kèm'}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPPINGS.map((top) => {
                  const checked = selectedToppings.includes(top.id);
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => toggleTopping(top.id)}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                        checked
                          ? 'border-[#2563EB] bg-[#EFF6FF]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/45'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#172542]">
                          {translateToppingName(top.id, top.name, lang)}
                        </p>
                        <p className="text-[11px] text-[#64748B]">
                          {isJa ? top.name : top.englishName} · {top.unit}
                        </p>
                      </div>
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          checked
                            ? 'border-[#2563EB] bg-[#2563EB] text-white'
                            : 'border-[#94A3B8] bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="item-note" className="mb-1.5 block text-sm font-semibold text-[#172542]">
              {isJa ? '備考（ご希望があれば）' : 'Ghi chú riêng cho món này (nếu có)'}
            </label>
            <input
              id="item-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isJa ? '例：フォーム少なめ、別カップなど...' : 'Ví dụ: ít bọt, ly riêng...'}
              className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#172542] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label={isJa ? '数量を減らす' : 'Giảm số lượng'}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#1D4ED8] transition-colors hover:bg-[#EFF6FF]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums text-[#172542]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label={isJa ? '数量を増やす' : 'Tăng số lượng'}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#1D4ED8] transition-colors hover:bg-[#EFF6FF]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleAddToCartOnly}
              className="cursor-pointer rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-3 text-xs font-semibold text-[#334566] transition-colors hover:bg-[#EFF6FF] whitespace-nowrap shrink-0"
            >
              {isJa ? '一時カートへ' : 'Thêm giỏ tạm'}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveDirectly}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EC4899] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSaving
                  ? isJa
                    ? '保存中...'
                    : 'Đang lưu...'
                  : isJa
                    ? '決定してファイルに保存'
                    : 'Chọn & Lưu vào file'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
