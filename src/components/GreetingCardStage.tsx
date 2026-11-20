import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Heart,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import { LETTER_PAGES_I18N, type Language, type LetterPageItem } from '../data/i18n';

export interface MemoryPhoto {
  src: string;
  caption: string;
  subcaption: string;
}

interface GreetingCardStageProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  isOpen: boolean;
  isMusicPlaying: boolean;
  flowersEnabled: boolean;
  heartCount: number;
  onOpenCard: () => void;
  onToggleMusic: () => void;
  onToggleFlowers: () => void;
  onSendHeartBurst: () => void;
  onProceedToMenu: () => void;
  onCloseCard: () => void;
  onSelectPhoto: (photo: MemoryPhoto) => void;
}

const AUTO_FLIP_INTERVAL_MS = 5500;

export function GreetingCardStage({
  lang,
  onChangeLang,
  isOpen,
  isMusicPlaying,
  flowersEnabled,
  heartCount,
  onOpenCard,
  onToggleMusic,
  onToggleFlowers,
  onSendHeartBurst,
  onProceedToMenu,
  onCloseCard,
  onSelectPhoto,
}: GreetingCardStageProps) {
  const pages = LETTER_PAGES_I18N[lang];
  const isJa = lang === 'ja';

  const [envelopePhase, setEnvelopePhase] = useState<'sealed' | 'opening' | 'opened'>(
    isOpen ? 'opened' : 'sealed'
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [autoFlip, setAutoFlip] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setEnvelopePhase('sealed');
      setPageIndex(0);
    }
  }, [isOpen]);

  // Auto-flip through the 3 photo-wish pages when letter is opened
  useEffect(() => {
    if (envelopePhase !== 'opened' || !autoFlip) return;

    const timer = window.setInterval(() => {
      setFlipDirection(1);
      setPageIndex((prev) => (prev + 1) % pages.length);
    }, AUTO_FLIP_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [envelopePhase, autoFlip, pages.length]);

  const handleTriggerOpenEnvelope = () => {
    if (envelopePhase !== 'sealed') return;
    setEnvelopePhase('opening');
    setPageIndex(0);
    setAutoFlip(true);
    onOpenCard();
    window.setTimeout(() => {
      setEnvelopePhase('opened');
    }, 900);
  };

  const handleCloseEnvelope = () => {
    setEnvelopePhase('sealed');
    onCloseCard();
  };

  const goToPage = (nextIdx: number) => {
    const normalized = (nextIdx + pages.length) % pages.length;
    setFlipDirection(normalized >= pageIndex ? 1 : -1);
    setPageIndex(normalized);
  };

  const activePage: LetterPageItem = pages[pageIndex] ?? pages[0];

  const langSwitcher = (
    <div className="inline-flex rounded-lg border border-white/80 bg-white/75 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChangeLang('vi')}
        className={`cursor-pointer rounded-md px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
          lang === 'vi'
            ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
            : 'text-[#334566] hover:text-[#172542]'
        }`}
      >
        Tiếng Việt
      </button>
      <button
        type="button"
        onClick={() => onChangeLang('ja')}
        className={`cursor-pointer rounded-md px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
          lang === 'ja'
            ? 'bg-gradient-to-r from-[#2563EB] to-[#EC4899] text-white'
            : 'text-[#334566] hover:text-[#172542]'
        }`}
      >
        日本語
      </button>
    </div>
  );

  return (
    <section
      id="greeting-card"
      className="relative overflow-hidden bg-gradient-to-br from-[#CBE5FF] via-[#EDE0FA] to-[#FFD6E8] text-[#172542]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 14% 20%, rgba(255, 255, 255, 0.72) 0%, transparent 42%), radial-gradient(circle at 86% 78%, rgba(255, 255, 255, 0.65) 0%, transparent 46%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          {envelopePhase !== 'opened' ? (
            <motion.div
              key="envelope-stage"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-2xl"
              style={{ perspective: 1400 }}
            >
              {/* Top Bar inside Envelope Stage */}
              <div className="mb-4 flex items-center justify-between text-xs font-semibold tracking-wider text-[#2C4472]">
                <span>
                  {isJa ? 'ベトナム教師の日 · 11月20日' : 'NGÀY NHÀ GIÁO VIỆT NAM · 20/11'}
                </span>
                {langSwitcher}
              </div>

              {/* 3D Interactive Envelope Container */}
              <div className="relative pt-14">
                {/* Rising Letter Sheet sliding out when opening */}
                <motion.div
                  initial={false}
                  animate={
                    envelopePhase === 'opening'
                      ? { y: -92, opacity: 1, scale: 1 }
                      : { y: 18, opacity: 0.95, scale: 0.96 }
                  }
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="mx-auto w-[90%] rounded-t-2xl border border-[#E2E8F0] bg-white px-6 py-5 text-center shadow-lg"
                >
                  <p className="text-[11px] font-bold tracking-wider text-[#2563EB]">
                    {isJa ? 'NIX EDUCATION の先生方へ' : 'KÍNH GỬI TẬP THỂ GIÁO VIÊN NIX'}
                  </p>
                  <p className="font-display mt-1 text-xl font-bold text-[#172542]">
                    {isJa
                      ? '感謝のメッセージと3枚の思い出ページ'
                      : 'Thư Tri Ân & 3 Trang Kỷ Niệm 20/11'}
                  </p>
                </motion.div>

                {/* Envelope Pocket Body */}
                <div className="relative -mt-6 overflow-visible rounded-3xl border border-white/90 bg-gradient-to-br from-[#DCEEFF] via-[#F2E6FA] to-[#FFDCEB] p-8 shadow-2xl md:p-11">
                  {/* Animated Top Triangular Envelope Flap */}
                  <motion.div
                    initial={false}
                    animate={
                      envelopePhase === 'opening'
                        ? { rotateX: 175, opacity: 0.25 }
                        : { rotateX: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-24 overflow-hidden rounded-t-3xl"
                  >
                    <svg viewBox="0 0 600 110" preserveAspectRatio="none" className="h-full w-full">
                      <polygon
                        points="0,0 600,0 300,104"
                        fill="url(#flapGrad)"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#BFDFFF" />
                          <stop offset="50%" stopColor="#E9D8FA" />
                          <stop offset="100%" stopColor="#FFC9E0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Wax Seal on Flap */}
                  <motion.div
                    initial={false}
                    animate={
                      envelopePhase === 'opening'
                        ? { scale: 1.25, opacity: 0, y: -20 }
                        : { scale: 1, opacity: 1, y: 0 }
                    }
                    transition={{ duration: 0.35 }}
                    className="relative z-20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#3B82F6] to-[#EC4899] text-white shadow-md"
                  >
                    <Heart className="h-6 w-6 fill-white" />
                  </motion.div>

                  <div className="relative z-10 text-center">
                    <p className="text-sm font-medium text-[#9D174D]">
                      {isJa
                        ? '心からの感謝と笑顔を込めて'
                        : 'Gửi tặng ngàn lời chúc dễ thương nhất tới'}
                    </p>
                    <h1 className="font-display mt-1.5 text-4xl font-bold tracking-tight text-balance text-[#172542] md:text-5xl">
                      {isJa ? 'NIX Education の先生方へ' : 'Tập Thể Giáo Viên Nix'}
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#384A6B]">
                      {isJa
                        ? '封筒を開くと手紙が自動でページをめくり、1枚ごとの思い出写真とメッセージをご覧いただけます。'
                        : 'Mở lá thư ra, từng trang ảnh kỷ niệm và lời chúc riêng sẽ tự động lật mở cùng hoa sakura rơi & nhạc nền dịu êm.'}
                    </p>

                    <div className="mt-7 flex justify-center">
                      <button
                        type="button"
                        onClick={handleTriggerOpenEnvelope}
                        disabled={envelopePhase === 'opening'}
                        className="group inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#EC4899] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-75 whitespace-nowrap shrink-0"
                      >
                        <span>
                          {envelopePhase === 'opening'
                            ? isJa
                              ? '封筒を開いています...'
                              : 'Đang mở lá thư...'
                            : isJa
                              ? 'お手紙を開く'
                              : 'Mở lá thư 20/11'}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="opened-letter-book"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-5xl"
            >
              {/* Controls Toolbar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#1E3359]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold tracking-wide">
                    {isJa
                      ? '教師の日 11/20 · NIX Education の先生方へ'
                      : 'Thư Chúc Mừng 20/11 · Tập Thể Giáo Viên Nix'}
                  </span>
                  {langSwitcher}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoFlip((v) => !v)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/80 bg-white/75 px-3 py-1.5 font-semibold text-[#1D4ED8] transition-colors hover:bg-white whitespace-nowrap shrink-0"
                  >
                    {autoFlip ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>{isJa ? '自動めくり: ON' : 'Tự động lật: Đang bật'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>{isJa ? '自動めくり: OFF' : 'Tự động lật: Tạm dừng'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onSendHeartBurst}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/80 bg-white/75 px-3 py-1.5 font-semibold text-[#BE185D] transition-colors hover:bg-white whitespace-nowrap shrink-0"
                  >
                    <Heart className="h-3.5 w-3.5 fill-[#EC4899] text-[#EC4899]" />
                    <span>
                      {isJa
                        ? `ハートを送る (${heartCount})`
                        : `Thả tim (${heartCount})`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onToggleMusic}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/80 bg-white/75 px-3 py-1.5 font-medium text-[#172542] transition-colors hover:bg-white whitespace-nowrap shrink-0"
                  >
                    {isMusicPlaying ? (
                      <>
                        <Volume2 className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>{isJa ? 'BGM: ON' : 'Nhạc: Bật'}</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-3.5 w-3.5 text-[#64748B]" />
                        <span>{isJa ? 'BGM: OFF' : 'Nhạc: Tắt'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onToggleFlowers}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/80 bg-white/75 px-3 py-1.5 font-medium text-[#172542] transition-colors hover:bg-white whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#EC4899]" />
                    <span>{isJa ? (flowersEnabled ? '桜: ON' : '桜: OFF') : flowersEnabled ? 'Hoa: Bật' : 'Hoa: Tắt'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEnvelope}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/60 bg-white/50 px-3 py-1.5 font-medium text-[#334155] transition-colors hover:bg-white whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{isJa ? '閉じる' : 'Gấp thư'}</span>
                  </button>
                </div>
              </div>

              {/* Auto-Flipping 3D Letter Spread */}
              <div
                className="relative overflow-hidden rounded-3xl border border-white/95 bg-white/95 shadow-2xl backdrop-blur-md"
                style={{ perspective: 1600 }}
              >
                {/* Center book-fold subtle crease on desktop */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#CBD5E1]/70 to-transparent lg:block"
                />

                <AnimatePresence mode="wait" custom={flipDirection}>
                  <motion.div
                    key={`${lang}-${pageIndex}`}
                    custom={flipDirection}
                    initial={{
                      opacity: 0,
                      rotateY: flipDirection > 0 ? 45 : -45,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      rotateY: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotateY: flipDirection > 0 ? -45 : 45,
                      scale: 0.98,
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                    className="grid gap-8 p-6 md:p-10 lg:grid-cols-12 lg:items-center"
                  >
                    {/* Left Page: Photo of this spread */}
                    <div className="lg:col-span-6">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectPhoto({
                            src: activePage.src,
                            caption: activePage.caption,
                            subcaption: activePage.subcaption,
                          })
                        }
                        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border-4 border-[#FCE7F3] bg-[#EFF6FF] text-left shadow-md"
                      >
                        <img
                          src={activePage.src}
                          alt={activePage.caption}
                          referrerPolicy="no-referrer"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-103"
                        />
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#EFF6FF] to-[#FDF2F8] px-4 py-3">
                          <div>
                            <p className="text-xs font-semibold text-[#172542]">
                              {activePage.caption}
                            </p>
                            <p className="text-[11px] text-[#4B5E80]">
                              {activePage.subcaption}
                            </p>
                          </div>
                          <ZoomIn className="h-4 w-4 shrink-0 text-[#2563EB]" />
                        </div>
                      </button>
                    </div>

                    {/* Right Page: Dedicated Wish for this Photo */}
                    <div className="flex flex-col justify-between lg:col-span-6">
                      <div>
                        <p className="text-xs font-bold tracking-wider text-[#2563EB]">
                          {activePage.kicker}
                        </p>
                        <h2 className="font-display mt-2 text-3xl font-bold text-balance text-[#172542] md:text-4xl">
                          {activePage.wishTitle}
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-[#334566]">
                          {activePage.wishBody}
                        </p>
                        <p className="font-display mt-5 text-xl font-bold italic text-[#BE185D]">
                          {activePage.wishHighlight}
                        </p>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2E8F0] pt-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => goToPage(pageIndex - 1)}
                            aria-label={isJa ? '前のページ' : 'Trang trước'}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-[#172542] transition-colors hover:bg-[#EFF6FF]"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          <div className="flex items-center gap-1.5 px-1">
                            {pages.map((p, idx) => {
                              const active = idx === pageIndex;
                              return (
                                <button
                                  key={p.src}
                                  type="button"
                                  onClick={() => goToPage(idx)}
                                  aria-label={isJa ? `${idx + 1}ページ目` : `Trang ${idx + 1}`}
                                  className={`h-2.5 cursor-pointer rounded-full transition-all ${
                                    active
                                      ? 'w-7 bg-gradient-to-r from-[#2563EB] to-[#EC4899]'
                                      : 'w-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                                  }`}
                                />
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => goToPage(pageIndex + 1)}
                            aria-label={isJa ? '次のページ' : 'Trang sau'}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-[#172542] transition-colors hover:bg-[#EFF6FF]"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={onProceedToMenu}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                        >
                          <span>{isJa ? 'メニューを選ぶ' : 'Chọn Menu Ngay'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Auto-flip progress bar */}
                {autoFlip && (
                  <div className="h-1 w-full bg-[#F1F5F9]">
                    <motion.div
                      key={`progress-${pageIndex}-${lang}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTO_FLIP_INTERVAL_MS / 1000, ease: 'linear' }}
                      style={{ transformOrigin: 'left center' }}
                      className="h-full w-full bg-gradient-to-r from-[#3B82F6] to-[#EC4899]"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
