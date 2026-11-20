import { useCallback, useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import type { CartItem, MenuItem, SavedTeacherOrder } from './types/order';
import type { Language } from './data/i18n';
import { MENU_ITEM_JA } from './data/i18n';
import { gentleMusicPlayer } from './utils/musicPlayer';
import { FallingFlowers } from './components/FallingFlowers';
import { GreetingCardStage, type MemoryPhoto } from './components/GreetingCardStage';
import { MenuSection } from './components/MenuSection';
import { ItemModal } from './components/ItemModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersSummaryView } from './components/OrdersSummaryView';
import { PosterModal } from './components/PosterModal';

const TEACHER_NAME_STORAGE_KEY = 'nix_20_11_teacher_name';
const LANG_STORAGE_KEY = 'nix_20_11_lang';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      return saved === 'ja' ? 'ja' : 'vi';
    } catch {
      return 'vi';
    }
  });
  const isJa = lang === 'ja';

  const [cardOpen, setCardOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [flowersEnabled, setFlowersEnabled] = useState(true);
  const [burstKey, setBurstKey] = useState(0);
  const [heartCount, setHeartCount] = useState(20);

  const [teacherName, setTeacherName] = useState<string>(() => {
    try {
      return window.localStorage.getItem(TEACHER_NAME_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{
    src: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const [savedOrders, setSavedOrders] = useState<SavedTeacherOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChangeLang = (nextLang: Language) => {
    setLang(nextLang);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    } catch {
      // Ignore storage failures
    }
  };

  const handleTeacherNameChange = (name: string) => {
    setTeacherName(name);
    try {
      window.localStorage.setItem(TEACHER_NAME_STORAGE_KEY, name);
    } catch {
      // Ignore storage failures
    }
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = (await res.json()) as { orders?: SavedTeacherOrder[] };
      setSavedOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      // Keep UI functional even if initial fetch fails
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
    return () => {
      gentleMusicPlayer.pause();
    };
  }, [fetchOrders]);

  const handleOpenCard = () => {
    setCardOpen(true);
    setFlowersEnabled(true);
    setBurstKey((k) => k + 1);
    gentleMusicPlayer.start();
    setIsMusicPlaying(true);
  };

  const handleCloseCard = () => {
    setCardOpen(false);
    gentleMusicPlayer.pause();
    setIsMusicPlaying(false);
  };

  const handleToggleMusic = () => {
    const next = gentleMusicPlayer.toggle();
    setIsMusicPlaying(next);
  };

  const handleToggleFlowers = () => {
    setFlowersEnabled((prev) => !prev);
  };

  const handleSendHeartBurst = () => {
    setFlowersEnabled(true);
    setBurstKey((k) => k + 1);
    setHeartCount((c) => c + 1);
    showToast(
      isJa
        ? '先生方へ花とハートのシャワーをお届けしました！'
        : 'Đã gửi thêm một cơn mưa hoa & tim tới các cô!'
    );
  };

  const handleSelectPhoto = (photo: MemoryPhoto) => {
    setLightboxMedia({
      src: photo.src,
      title: photo.caption,
      subtitle: photo.subcaption,
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (cartItem: CartItem) => {
    setCart((prev) => [...prev, cartItem]);
    const displayName = isJa
      ? MENU_ITEM_JA[cartItem.menuItemId]?.name ?? cartItem.name
      : cartItem.name;
    showToast(
      isJa
        ? `${cartItem.quantity}x ${displayName} を一時カートに追加しました`
        : `Đã thêm ${cartItem.quantity}x ${displayName} vào giỏ tạm`
    );
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId !== cartItemId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          const unitTotal = item.lineTotal / item.quantity;
          return {
            ...item,
            quantity: nextQty,
            lineTotal: unitTotal * nextQty,
          };
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const persistItemsToServer = async (
    submitTeacherName: string,
    itemsToSave: CartItem[],
    wishNote: string
  ): Promise<boolean> => {
    setIsSavingOrder(true);
    setSaveError(null);
    handleTeacherNameChange(submitTeacherName);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName: submitTeacherName,
          wishNote,
          items: itemsToSave,
        }),
      });
      const data = (await res.json()) as {
        orders?: SavedTeacherOrder[];
        error?: string;
      };
      if (!res.ok) {
        const errMsg =
          data.error ?? (isJa ? '保存に失敗しました。' : 'Lưu đơn thất bại, vui lòng thử lại.');
        setSaveError(errMsg);
        showToast(errMsg);
        return false;
      }
      if (Array.isArray(data.orders)) {
        setSavedOrders(data.orders);
      } else {
        await fetchOrders();
      }
      return true;
    } catch {
      const errMsg = isJa ? 'サーバー接続エラーが発生しました。' : 'Lỗi kết nối máy chủ khi lưu file.';
      setSaveError(errMsg);
      showToast(errMsg);
      return false;
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleQuickSaveOrder = async (
    submitTeacherName: string,
    item: CartItem,
    wishNote: string
  ): Promise<boolean> => {
    const ok = await persistItemsToServer(submitTeacherName, [item], wishNote);
    if (ok) {
      const displayName = isJa ? MENU_ITEM_JA[item.menuItemId]?.name ?? item.name : item.name;
      showToast(
        isJa
          ? `${submitTeacherName} の ${item.quantity}x ${displayName} をファイルに保存しました！`
          : `Đã lưu ${item.quantity}x ${displayName} cho ${submitTeacherName} vào file!`
      );
    }
    return ok;
  };

  const handleSubmitOrder = async (
    submitTeacherName: string,
    wishNote: string
  ): Promise<boolean> => {
    const ok = await persistItemsToServer(submitTeacherName, cart, wishNote);
    if (ok) {
      setCart([]);
      showToast(
        isJa
          ? `${submitTeacherName} の注文をファイルに保存しました！`
          : `Đã lưu đơn của ${submitTeacherName} vào file thành công!`
      );
    }
    return ok;
  };

  const handleTogglePurchased = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { orders?: SavedTeacherOrder[] };
      if (Array.isArray(data.orders)) {
        setSavedOrders(data.orders);
      }
    } catch {
      // Ignore transient failure
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) return;
      const data = (await res.json()) as { orders?: SavedTeacherOrder[] };
      if (Array.isArray(data.orders)) {
        setSavedOrders(data.orders);
        showToast(isJa ? '保存済みリストから削除しました' : 'Đã xóa đơn khỏi danh sách đã lưu');
      }
    } catch {
      // Ignore transient failure
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavedCups = savedOrders.reduce((sum, o) => sum + o.totalCups, 0);

  return (
    <div
      className="min-h-screen bg-[#F6F8FC] text-[#172542]"
      style={
        isJa
          ? { fontFamily: '"Noto Sans JP", "Plus Jakarta Sans", sans-serif' }
          : undefined
      }
    >
      {/* Falling Sakura, Pastel Petals & Hearts Overlay */}
      <FallingFlowers active={cardOpen && flowersEnabled} burstKey={burstKey} />

      {/* 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#2563EB]/12 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#greeting-card"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('greeting-card');
            }}
            className="font-display bg-gradient-to-r from-[#1D4ED8] to-[#DB2777] bg-clip-text text-2xl font-bold tracking-tight text-transparent whitespace-nowrap shrink-0"
          >
            Nix · 20/11
          </a>

          {/* Zone 2: Clean Text Nav Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#4B5E80] md:flex">
            <a
              href="#greeting-card"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('greeting-card');
              }}
              className="transition-colors hover:text-[#1D4ED8] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {isJa ? 'お祝いカード' : 'Thiệp Chúc Mừng'}
            </a>
            <a
              href="#menu-section"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('menu-section');
              }}
              className="transition-colors hover:text-[#1D4ED8] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {isJa ? 'メニュー' : 'Thực Đơn'}
            </a>
            <a
              href="#saved-orders"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('saved-orders');
              }}
              className="transition-colors hover:text-[#1D4ED8] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {isJa ? `保存済み (${totalSavedCups}点)` : `Đã Lưu (${totalSavedCups} món)`}
            </a>
            <button
              type="button"
              onClick={() =>
                setLightboxMedia({
                  src: '/assets/aistudio/image_7f72e084.png',
                  title: isJa ? 'KATINAT 元メニュー画像' : 'Ảnh Thực Đơn Katinat Gốc',
                })
              }
              className="cursor-pointer transition-colors hover:text-[#1D4ED8] hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              {isJa ? 'メニュー画像' : 'Ảnh Menu'}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                if (cartItemCount > 0) {
                  setCartOpen(true);
                } else {
                  scrollToSection('saved-orders');
                }
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EC4899] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {cartItemCount > 0
                  ? isJa
                    ? `一時カート (${cartItemCount})`
                    : `Giỏ tạm (${cartItemCount})`
                  : isJa
                    ? `選択済み (${totalSavedCups})`
                    : `Đơn đã chọn (${totalSavedCups})`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <GreetingCardStage
          lang={lang}
          onChangeLang={handleChangeLang}
          isOpen={cardOpen}
          isMusicPlaying={isMusicPlaying}
          flowersEnabled={flowersEnabled}
          heartCount={heartCount}
          onOpenCard={handleOpenCard}
          onToggleMusic={handleToggleMusic}
          onToggleFlowers={handleToggleFlowers}
          onSendHeartBurst={handleSendHeartBurst}
          onProceedToMenu={() => scrollToSection('menu-section')}
          onCloseCard={handleCloseCard}
          onSelectPhoto={handleSelectPhoto}
        />

        <MenuSection
          lang={lang}
          onChangeLang={handleChangeLang}
          teacherName={teacherName}
          onTeacherNameChange={handleTeacherNameChange}
          onSelectItem={(item) => setSelectedItem(item)}
          onOpenPoster={() =>
            setLightboxMedia({
              src: '/assets/aistudio/image_7f72e084.png',
              title: isJa ? 'KATINAT 元メニュー画像' : 'Ảnh Thực Đơn Katinat Gốc',
            })
          }
        />

        <OrdersSummaryView
          lang={lang}
          orders={savedOrders}
          isLoading={isLoadingOrders}
          onTogglePurchased={handleTogglePurchased}
          onDeleteOrder={handleDeleteOrder}
        />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#2563EB]/12 bg-white py-8 text-center text-xs text-[#516487]">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-semibold text-[#172542]">
            {isJa
              ? 'ベトナム教師の日 11月20日 · NIX Education（VKU × Nix Education）の先生方へ心からの感謝を込めて'
              : 'Tri Ân Ngày Nhà Giáo Việt Nam 20/11 · Kính Chúc Tập Thể Giáo Viên Nix (VKU × Nix Education)'}
          </p>
          <p className="mt-1">
            {isJa
              ? '選択されたメニューはすべて自動的に注文ファイルへ保存されます。'
              : 'Mọi lựa chọn món đều được lưu tự động vào file đơn hàng để thuận tiện đặt mua.'}
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedItem && (
        <ItemModal
          lang={lang}
          item={selectedItem}
          defaultTeacherName={teacherName}
          isSaving={isSavingOrder}
          onClose={() => setSelectedItem(null)}
          onQuickSave={handleQuickSaveOrder}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        lang={lang}
        isOpen={cartOpen}
        items={cart}
        defaultTeacherName={teacherName}
        isSaving={isSavingOrder}
        saveError={saveError}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onSubmitOrder={handleSubmitOrder}
      />

      <PosterModal
        isOpen={Boolean(lightboxMedia)}
        imageSrc={lightboxMedia?.src}
        title={lightboxMedia?.title}
        subtitle={lightboxMedia?.subtitle}
        onClose={() => setLightboxMedia(null)}
      />

      {/* Quiet Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-xl border border-white/20 bg-gradient-to-r from-[#1E3A8A] to-[#9D174D] px-4 py-3 text-xs font-medium text-white shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FBCFE8]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
