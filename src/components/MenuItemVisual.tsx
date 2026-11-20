import type { MenuItem } from '../types/order';

interface MenuItemVisualProps {
  item: MenuItem;
  size?: 'sm' | 'md';
}

export function MenuItemVisual({ item, size = 'md' }: MenuItemVisualProps) {
  const dim = size === 'sm' ? 'h-16 w-16' : 'h-24 w-24';

  if (item.visualStyle === 'tart') {
    return (
      <div className={`${dim} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#FDF2F8]`}>
        <svg viewBox="0 0 80 80" className="h-4/5 w-4/5" aria-hidden="true">
          <ellipse cx="40" cy="56" rx="28" ry="8" fill="#D9C7A8" />
          <path d="M16 42 L22 55 C28 60 52 60 58 55 L64 42 Z" fill="#C78A47" />
          <ellipse cx="40" cy="42" rx="24" ry="9" fill="#E6AE5C" />
          <ellipse cx="40" cy="41" rx="18" ry="6.5" fill="#F4C14E" />
          <ellipse cx="36" cy="40" rx="6" ry="2.2" fill="#8C4B1B" opacity="0.7" />
          <ellipse cx="46" cy="42" rx="4" ry="1.6" fill="#8C4B1B" opacity="0.55" />
        </svg>
      </div>
    );
  }

  if (item.visualStyle === 'snack') {
    return (
      <div className={`${dim} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#FDF2F8]`}>
        <svg viewBox="0 0 80 80" className="h-4/5 w-4/5" aria-hidden="true">
          <rect x="21" y="16" width="38" height="48" rx="6" fill={item.cupTone} stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="1.5" />
          <path d="M21 24 L59 24" stroke="#EC4899" strokeOpacity="0.3" strokeWidth="1.5" />
          <circle cx="40" cy="42" r="10" fill={item.layerTone} opacity="0.88" />
          <circle cx="36" cy="40" r="2.2" fill="#FFFDF7" opacity="0.8" />
          <circle cx="44" cy="44" r="2" fill="#FFFDF7" opacity="0.7" />
          <rect x="28" y="55" width="24" height="3" rx="1.5" fill="#2563EB" opacity="0.35" />
        </svg>
      </div>
    );
  }

  const isHot = item.visualStyle === 'coffee-hot';

  return (
    <div className={`${dim} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#FDF2F8]`}>
      <svg viewBox="0 0 80 80" className="h-4/5 w-4/5" aria-hidden="true">
        {!isHot && (
          <>
            <path d="M46 10 L42 26" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M23 24 C23 19 57 19 57 24 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
          </>
        )}
        {isHot && (
          <path
            d="M32 14 Q34 9 32 6 M40 13 Q42 8 40 5 M48 14 Q50 9 48 6"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
        <path
          d={isHot ? 'M24 24 L56 24 L50 64 C49.5 66 30.5 66 30 64 Z' : 'M24 25 L56 25 L50 65 C49.5 67 30.5 67 30 65 Z'}
          fill={item.cupTone}
          stroke="#CBD5E1"
          strokeWidth="1.2"
        />
        <path
          d="M27.5 46 L52.5 46 L50 64 C49.5 66 30.5 66 30 64 Z"
          fill={item.layerTone}
          opacity="0.92"
        />
        {!isHot && (
          <g fill="#FFFFFF" opacity="0.45">
            <rect x="31" y="29" width="7" height="7" rx="1.5" transform="rotate(-10 34 32)" />
            <rect x="42" y="30" width="7" height="7" rx="1.5" transform="rotate(14 45 33)" />
          </g>
        )}
        <rect x="29" y="38" width="22" height="6" rx="1.5" fill="#2563EB" opacity="0.82" />
        <path d="M35 41 L45 41" stroke="#FFFDF7" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
      </svg>
    </div>
  );
}
