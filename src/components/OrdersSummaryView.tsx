import { useMemo, useState } from 'react';
import { Check, Copy, Download, Trash2, CheckSquare, Square, FileText } from 'lucide-react';
import type { SavedTeacherOrder } from '../types/order';
import {
  MENU_ITEM_JA,
  translateIce,
  translateSize,
  translateSweetness,
  translateToppingName,
  type Language,
} from '../data/i18n';

interface OrdersSummaryViewProps {
  lang: Language;
  orders: SavedTeacherOrder[];
  isLoading: boolean;
  onTogglePurchased: (id: string) => void;
  onDeleteOrder: (id: string) => void;
}

interface AggregatedLine {
  key: string;
  name: string;
  details: string;
  quantity: number;
  teachers: string[];
}

export function OrdersSummaryView({
  lang,
  orders,
  isLoading,
  onTogglePurchased,
  onDeleteOrder,
}: OrdersSummaryViewProps) {
  const isJa = lang === 'ja';
  const [viewMode, setViewMode] = useState<'grouped' | 'by-teacher'>('grouped');
  const [copied, setCopied] = useState(false);

  const { groupedLines, totalCups, purchasedOrdersCount } = useMemo(() => {
    const map = new Map<string, AggregatedLine>();
    let cups = 0;
    let purchased = 0;

    for (const order of orders) {
      if (order.purchased) purchased += 1;
      cups += order.totalCups;

      for (const item of order.items) {
        const displayName = isJa ? MENU_ITEM_JA[item.menuItemId]?.name ?? item.name : item.name;
        const sizeLabel =
          item.size !== 'DEFAULT'
            ? translateSize(item.size, lang)
            : isJa
              ? 'レギュラー'
              : 'Phần chuẩn';
        const topNames = item.toppings
          .map((t) => translateToppingName(t.id, t.name, lang))
          .sort()
          .join(', ');

        const details = [
          sizeLabel,
          translateSweetness(item.sweetness, lang),
          translateIce(item.ice, lang),
          topNames ? `${isJa ? 'トッピング' : 'Topping'}: ${topNames}` : null,
          item.note ? `${isJa ? '備考' : 'Ghi chú'}: ${item.note}` : null,
        ]
          .filter(Boolean)
          .join(' · ');

        const key = `${item.name}||${details}`;
        const existing = map.get(key);

        if (existing) {
          existing.quantity += item.quantity;
          existing.teachers.push(`${order.teacherName} (${item.quantity})`);
        } else {
          map.set(key, {
            key,
            name: displayName,
            details,
            quantity: item.quantity,
            teachers: [`${order.teacherName} (${item.quantity})`],
          });
        }
      }
    }

    return {
      groupedLines: Array.from(map.values()),
      totalCups: cups,
      purchasedOrdersCount: purchased,
    };
  }, [orders, isJa, lang]);

  const handleCopyShoppingList = async () => {
    const lines: string[] = [
      'DANH SÁCH MÓN KATINAT — TẬP THỂ GIÁO VIÊN NIX (20/11)',
      ...groupedLines.map(
        (g, idx) => `${idx + 1}. ${g.quantity}x ${g.name} (${g.details}) [${g.teachers.join(', ')}]`
      ),
      `Tổng cộng: ${totalCups} món`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <section
      id="saved-orders"
      className="border-t border-[#2563EB]/12 bg-gradient-to-b from-[#EFF6FF]/85 to-[#FDF2F8]/85 py-14"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#172542] md:text-4xl">
              {isJa ? '先生方のセレクトリスト' : 'Danh Sách Món Của Quý Thầy Cô'}
            </h2>
            <p className="mt-1.5 text-sm text-[#4B5E80]">
              {isJa ? '合計 ' : 'Tổng cộng '}
              <span className="font-semibold tabular-nums text-[#172542]">{orders.length}</span>
              {isJa ? ' 件の登録 · ' : ' lượt chọn · '}
              <span className="font-semibold tabular-nums text-[#172542]">{totalCups}</span>
              {isJa ? ' 点' : ' món'}
              {orders.length > 0 &&
                (isJa
                  ? ` · 準備完了 ${purchasedOrdersCount}/${orders.length}`
                  : ` · Đã chuẩn bị ${purchasedOrdersCount}/${orders.length}`)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyShoppingList}
              disabled={groupedLines.length === 0}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-[#172542] transition-colors hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-[#2563EB]" /> : <Copy className="h-4 w-4 text-[#2563EB]" />}
              <span>
                {copied
                  ? isJa
                    ? 'コピーしました'
                    : 'Đã sao chép'
                  : isJa
                    ? 'リストをコピー'
                    : 'Sao chép danh sách'}
              </span>
            </button>

            <a
              href="/api/orders/export?format=txt"
              download="nix-20-11-orders.txt"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 text-xs font-semibold text-[#172542] transition-colors hover:bg-[#EFF6FF] whitespace-nowrap shrink-0"
            >
              <FileText className="h-4 w-4 text-[#EC4899]" />
              <span>{isJa ? '.TXT をダウンロード' : 'Tải file .TXT'}</span>
            </a>

            <a
              href="/api/orders/export?format=json"
              download="nix-20-11-orders.json"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EC4899] px-4 text-xs font-semibold text-white transition-opacity hover:opacity-95 whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>{isJa ? '.JSON をダウンロード' : 'Tải file .JSON'}</span>
            </a>
          </div>
        </div>

        {/* View switcher */}
        <div className="mt-7 inline-flex rounded-xl border border-[#CBD5E1] bg-white p-1">
          <button
            type="button"
            onClick={() => setViewMode('grouped')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'grouped'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
                : 'text-[#334566] hover:text-[#172542]'
            }`}
          >
            {isJa
              ? `メニュー別まとめ (${groupedLines.length})`
              : `Tổng hợp theo món (${groupedLines.length})`}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('by-teacher')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'by-teacher'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
                : 'text-[#334566] hover:text-[#172542]'
            }`}
          >
            {isJa
              ? `先生別の詳細 (${orders.length})`
              : `Chi tiết theo từng Cô / Thầy (${orders.length})`}
          </button>
        </div>

        {/* Content */}
        <div className="mt-5">
          {isLoading ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center text-sm text-[#516487]">
              {isJa ? '読み込み中...' : 'Đang tải danh sách...'}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
              <p className="text-base font-semibold text-[#172542]">
                {isJa ? 'まだ選択されたメニューはありません' : 'Chưa có giáo viên nào gửi lựa chọn'}
              </p>
              <p className="mt-1.5 text-sm text-[#516487]">
                {isJa
                  ? '上のメニューから選択すると、ここに一覧が表示されます。'
                  : 'Khi các cô chọn món ở thực đơn phía trên, danh sách sẽ hiển thị ngay tại đây.'}
              </p>
            </div>
          ) : viewMode === 'grouped' ? (
            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#4B5E80]">
                      <th className="px-5 py-3.5">{isJa ? '数量' : 'SL'}</th>
                      <th className="px-5 py-3.5">{isJa ? 'メニュー名・オプション' : 'Tên món & Tùy chọn'}</th>
                      <th className="px-5 py-3.5">{isJa ? '選んだ先生' : 'Giáo viên chọn'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {groupedLines.map((line) => (
                      <tr key={line.key} className="hover:bg-[#F8FAFC]">
                        <td className="px-5 py-4 align-top font-bold tabular-nums text-[#2563EB]">
                          {line.quantity}x
                        </td>
                        <td className="px-5 py-4 align-top">
                          <p className="font-semibold text-[#172542]">{line.name}</p>
                          <p className="mt-0.5 text-xs text-[#516487]">{line.details}</p>
                        </td>
                        <td className="px-5 py-4 align-top text-xs text-[#334566]">
                          {line.teachers.join(' · ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                      <td className="px-5 py-4 font-bold tabular-nums text-[#2563EB]">
                        {totalCups} {isJa ? '点' : 'món'}
                      </td>
                      <td colSpan={2} className="px-5 py-4 text-sm font-semibold text-[#172542]">
                        {isJa ? '選択された合計数' : 'Tổng số lượng món đã chọn'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className={`flex flex-col justify-between rounded-2xl border bg-white p-5 transition-colors ${
                    order.purchased ? 'border-[#2563EB]/35 bg-[#F8FAFF]' : 'border-[#E2E8F0]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 border-b border-[#F1F5F9] pb-3.5">
                      <div>
                        <h3 className="text-lg font-semibold text-[#172542]">
                          {order.teacherName}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#64748B]">
                          {new Date(order.createdAt).toLocaleString(isJa ? 'ja-JP' : 'vi-VN')} · {order.totalCups}{' '}
                          {isJa ? '点' : 'món'}
                        </p>
                      </div>
                    </div>

                    {order.wishNote && (
                      <p className="mt-3 rounded-lg bg-[#FDF2F8] px-3 py-2 text-xs italic text-[#9D174D]">
                        &ldquo;{order.wishNote}&rdquo;
                      </p>
                    )}

                    <ul className="mt-3.5 space-y-2.5 text-sm">
                      {order.items.map((item) => {
                        const displayName = isJa
                          ? MENU_ITEM_JA[item.menuItemId]?.name ?? item.name
                          : item.name;
                        return (
                          <li key={item.cartItemId}>
                            <p className="font-medium text-[#172542]">
                              <span className="font-semibold tabular-nums text-[#2563EB]">
                                {item.quantity}x
                              </span>{' '}
                              {displayName}
                              {item.size !== 'DEFAULT' ? ` (${translateSize(item.size, lang)})` : ''}
                            </p>
                            <p className="text-xs text-[#516487]">
                              {[
                                translateSweetness(item.sweetness, lang),
                                translateIce(item.ice, lang),
                                item.toppings.length > 0
                                  ? `${isJa ? 'トッピング' : 'Topping'}: ${item.toppings
                                      .map((t) => translateToppingName(t.id, t.name, lang))
                                      .join(', ')}`
                                  : null,
                                item.note ? `${isJa ? '備考' : 'Ghi chú'}: ${item.note}` : null,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
                    <button
                      type="button"
                      onClick={() => onTogglePurchased(order.id)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        order.purchased
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE]'
                      }`}
                    >
                      {order.purchased ? (
                        <>
                          <CheckSquare className="h-3.5 w-3.5" />
                          <span>{isJa ? '準備完了' : 'Đã mua xong'}</span>
                        </>
                      ) : (
                        <>
                          <Square className="h-3.5 w-3.5" />
                          <span>{isJa ? '準備完了にする' : 'Đánh dấu đã mua'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteOrder(order.id)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:bg-red-50 hover:text-red-700 whitespace-nowrap shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{isJa ? '削除' : 'Xóa đơn'}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
