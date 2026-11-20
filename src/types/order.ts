export type SizeKey = 'HOT' | 'M' | 'L' | 'DEFAULT';

export type MenuCategoryId =
  | 'ca-phe-phin-me'
  | 'ca-phe-espresso'
  | 'tra-sua-dam-vi'
  | 'thanh-huong-tra'
  | 'tra-trai-cay'
  | 'cold-brew-trai-cay'
  | 'matcha-katinat'
  | 'fruit-boost'
  | 'banh-tart'
  | 'an-vat'
  | 'topping';

export interface MenuCategoryMeta {
  id: MenuCategoryId;
  title: string;
  englishTitle: string;
  subtitle?: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  englishName: string;
  unit: string;
  price: number; // in thousands VND, e.g. 15 = 15.000đ
  milkTeaLPromoPrice?: number; // e.g. 9 for Trân Châu Phô Mai Dẻo when buying Trà Sữa Size L
  tone: string;
}

export interface MenuItem {
  id: string;
  name: string;
  englishName: string;
  categoryId: MenuCategoryId;
  categoryLabel: string;
  description?: string;
  tag?: 'best_seller' | 'new';
  prices: Partial<Record<SizeKey, number>>;
  unitNote?: string;
  allowSweetness: boolean;
  allowIce: boolean;
  allowToppings: boolean;
  isMilkTea?: boolean;
  recommendedExtra?: {
    id: string;
    name: string;
    price: number;
    detail: string;
  };
  visualStyle: 'coffee-ice' | 'coffee-hot' | 'milk-tea' | 'fruit-tea' | 'cold-brew' | 'matcha' | 'smoothie' | 'tart' | 'snack' | 'topping';
  cupTone: string;
  layerTone: string;
}

export interface SelectedTopping {
  id: string;
  name: string;
  price: number;
  unit?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  englishName: string;
  categoryLabel: string;
  size: SizeKey;
  unitBasePrice: number; // in thousands VND
  sweetness?: string;
  ice?: string;
  toppings: SelectedTopping[];
  quantity: number;
  note?: string;
  lineTotal: number; // in thousands VND
}

export interface SavedTeacherOrder {
  id: string;
  teacherName: string;
  wishNote?: string;
  items: CartItem[];
  totalAmount: number; // in thousands VND
  totalCups: number;
  purchased: boolean;
  createdAt: string;
}
