import { useMemo, useState } from 'react';
import { Search, Plus, Image as ImageIcon, UserCheck } from 'lucide-react';
import type { MenuCategoryId, MenuItem, SizeKey } from '../types/order';
import { MENU_CATEGORIES, MENU_ITEMS, TOPPINGS } from '../data/menuData';
import { CATEGORY_JA, MENU_ITEM_JA, TOPPING_JA, translateSize, type Language } from '../data/i18n';
import { MenuItemVisual } from './MenuItemVisual';

interface MenuSectionProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  teacherName: string;
  onTeacherNameChange: (name: string) => void;
  onSelectItem: (item: MenuItem) => void;
  onOpenPoster: () => void;
}

function renderSizeAvailability(prices: Partial<Record<SizeKey, number>>, lang: Language) {
  const keys: SizeKey[] = ['HOT', 'M', 'L', 'DEFAULT'];
  const labels = keys
    .filter((k) => typeof prices[k] === 'number')
    .map((k) => translateSize(k, lang));
  return labels.join(' · ');
}

export function MenuSection({
  lang,
  onChangeLang,
  teacherName,
  onTeacherNameChange,
  onSelectItem,
  onOpenPoster,
}: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | MenuCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isJa = lang === 'ja';

  const visibleCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MENU_CATEGORIES.filter((cat) => cat.id !== 'topping')
      .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
      .map((cat) => {
        const items = MENU_ITEMS.filter((item) => {
          if (item.categoryId !== cat.id) return false;
          if (!query) return true;
          const jaName = MENU_ITEM_JA[item.id]?.name.toLowerCase() ?? '';
          return (
            item.name.toLowerCase().includes(query) ||
            item.englishName.toLowerCase().includes(query) ||
            item.categoryLabel.toLowerCase().includes(query) ||
            jaName.includes(query)
          );
        });
        return { ...cat, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [activeCategory, searchQuery]);

  const showToppingsSection =
    (activeCategory === 'all' || activeCategory === 'topping') &&
    (!searchQuery.trim() ||
      TOPPINGS.some((t) => {
        const q = searchQuery.trim().toLowerCase();
        const ja = TOPPING_JA[t.id]?.toLowerCase() ?? '';
        return t.name.toLowerCase().includes(q) || ja.includes(q);
      }));

  return (
    <section id="menu-section" className="mx-auto max-w-6xl px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col gap-6 border-b border-[#2563EB]/12 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB]">
            {isJa
              ? 'KATINAT メニュー · 11月20日 先生方への感謝ギフト'
              : 'THỰC ĐƠN KATINAT · QUÀ TẶNG TRI ÂN 20/11'}
          </p>
          <h2 className="font-display mt-1.5 text-3xl font-bold text-[#172542] md:text-4xl">
            {isJa
              ? '先生方のお好きなドリンク・おやつをお選びください'
              : 'Mời Quý Thầy Cô Chọn Món Yêu Thích'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4B5E80]">
            {isJa
              ? 'お名前を一度入力してからメニューを選ぶと、そのまま自動的にファイルへ保存されます！'
              : 'Các cô chỉ cần nhập tên một lần rồi bấm chọn món — hệ thống sẽ tự lưu ngay vào file để lớp đi mua tặng các cô nha!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-[#CBD5E1] bg-white p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onChangeLang('vi')}
              className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                lang === 'vi'
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
                  : 'text-[#334566]'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('ja')}
              className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                lang === 'ja'
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
                  : 'text-[#334566]'
              }`}
            >
              日本語
            </button>
          </div>

          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isJa ? '検索 (例: 抹茶, ウーロン, コーヒー...)' : 'Tìm món (VD: Matcha, Oolong, Bơ...)'}
              className="h-10 w-full rounded-xl border border-[#CBD5E1] bg-white pr-4 pl-10 text-sm text-[#172542] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onOpenPoster}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-[#1D4ED8] transition-colors hover:bg-[#EFF6FF] whitespace-nowrap shrink-0"
          >
            <ImageIcon className="h-4 w-4" />
            <span>{isJa ? '元メニュー画像を見る' : 'Xem ảnh menu gốc'}</span>
          </button>
        </div>
      </div>

      {/* Convenient Quick Teacher Name Input */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-gradient-to-r from-[#EFF6FF] via-white to-[#FDF2F8] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-xs">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <label htmlFor="quick-teacher-name" className="block text-sm font-semibold text-[#172542]">
              {isJa
                ? '先生のお名前（選ぶとそのままファイルに保存されます）'
                : 'Tên của Cô / Thầy (chọn món là lưu thẳng vào file)'}
            </label>
            <p className="text-xs text-[#516487]">
              {isJa
                ? '一度入力すると、何度選んでも再入力は不要です。'
                : 'Nhập tên một lần để đặt nhanh nhiều món mà không cần nhập lại.'}
            </p>
          </div>
        </div>

        <input
          id="quick-teacher-name"
          type="text"
          value={teacherName}
          onChange={(e) => onTeacherNameChange(e.target.value)}
          placeholder={isJa ? '例：佐藤先生、ラン先生、ミン先生...' : 'VD: Cô Thảo, Cô Lan, Thầy Minh...'}
          className="h-10 w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 text-sm font-medium text-[#172542] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none sm:w-72"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
              : 'bg-white text-[#334566] hover:bg-[#EFF6FF]'
          }`}
        >
          {isJa ? 'すべて' : 'Tất cả món'}
        </button>
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
                : 'bg-white text-[#334566] hover:bg-[#EFF6FF]'
            }`}
          >
            {isJa ? CATEGORY_JA[cat.id]?.title ?? cat.title : cat.title}
          </button>
        ))}
      </div>

      {/* Menu Categories Grid */}
      <div className="mt-8 space-y-12">
        {visibleCategories.length === 0 && !showToppingsSection ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
            <p className="text-base font-medium text-[#172542]">
              {isJa ? '該当するメニューが見つかりません' : 'Không tìm thấy món phù hợp'}
            </p>
            <p className="mt-1 text-sm text-[#516487]">
              {isJa
                ? '検索キーワードをクリアするか、「すべて」を選択してください。'
                : 'Thử xóa từ khóa tìm kiếm hoặc chọn mục Tất cả món.'}
            </p>
          </div>
        ) : (
          visibleCategories.map((category) => {
            const catTitle = isJa ? CATEGORY_JA[category.id]?.title ?? category.title : category.title;
            const catSub = isJa
              ? CATEGORY_JA[category.id]?.subtitle ?? category.subtitle
              : category.subtitle;

            return (
              <div key={category.id}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#2563EB]/12 pb-3">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className="font-display text-2xl font-bold text-[#172542]">
                        {catTitle}
                      </h3>
                      <span className="text-xs font-medium text-[#64748B]">
                        {isJa ? category.title : category.englishTitle}
                      </span>
                    </div>
                    {catSub && <p className="mt-1 text-xs text-[#516487]">{catSub}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item) => {
                    const jaMeta = MENU_ITEM_JA[item.id];
                    const primaryName = isJa && jaMeta ? jaMeta.name : item.name;
                    const secondaryName = isJa ? item.name : item.englishName;
                    const desc = isJa && jaMeta?.description ? jaMeta.description : item.description;
                    const extraText =
                      isJa && jaMeta?.extra ? jaMeta.extra : item.recommendedExtra?.name;

                    return (
                      <article
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#EC4899]/45 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3.5">
                          <MenuItemVisual item={item} size="md" />
                          <div className="min-w-0 flex-1">
                            {(item.tag || item.unitNote) && (
                              <p className="mb-1 text-[11px] font-semibold tracking-wide text-[#BE185D]">
                                {item.tag === 'best_seller' && (isJa ? '人気メニュー' : 'Được yêu thích')}
                                {item.tag === 'new' && (isJa ? '新作' : 'Món mới')}
                                {item.tag && item.unitNote && ' · '}
                                {item.unitNote && (isJa ? '1個' : item.unitNote)}
                              </p>
                            )}
                            <h4 className="text-base font-semibold leading-snug text-[#172542] group-hover:text-[#1D4ED8]">
                              {primaryName}
                            </h4>
                            <p className="mt-0.5 text-xs text-[#64748B]">{secondaryName}</p>
                            {desc && <p className="mt-1 text-[11px] text-[#64748B]">{desc}</p>}
                            {extraText && (
                              <p className="mt-1 text-[11px] font-medium text-[#BE185D]">
                                {isJa ? `おすすめ: ${extraText}` : `Gợi ý: ${extraText}`}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F1F5F9] pt-3">
                          <p className="truncate text-xs font-medium text-[#516487]">
                            {renderSizeAvailability(item.prices, lang)}
                          </p>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectItem(item);
                            }}
                            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#EFF6FF] to-[#FDF2F8] px-3 text-xs font-semibold text-[#1D4ED8] transition-colors group-hover:from-[#2563EB] group-hover:to-[#EC4899] group-hover:text-white whitespace-nowrap shrink-0"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>{isJa ? '選ぶ' : 'Chọn món'}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Topping Reference Strip */}
        {showToppingsSection && (
          <div>
            <div className="mb-5 border-b border-[#2563EB]/12 pb-3">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h3 className="font-display text-2xl font-bold text-[#172542]">
                  {isJa ? 'トッピング一覧' : 'Topping Dùng Kèm'}
                </h3>
                <span className="text-xs font-medium text-[#64748B]">
                  {isJa ? 'お好みのトッピングでさらに美味しく' : 'Thức uống ngon hơn khi dùng kèm Topping'}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {TOPPINGS.filter((t) => {
                const q = searchQuery.trim().toLowerCase();
                if (!q) return true;
                const ja = TOPPING_JA[t.id]?.toLowerCase() ?? '';
                return t.name.toLowerCase().includes(q) || ja.includes(q);
              }).map((top) => (
                <div
                  key={top.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-7 w-7 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: top.tone }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#172542]">
                        {isJa ? TOPPING_JA[top.id] ?? top.name : top.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {isJa ? top.name : top.englishName}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#516487]">{top.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
