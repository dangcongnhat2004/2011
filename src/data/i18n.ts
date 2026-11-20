import type { MenuCategoryId, SizeKey } from '../types/order';

export type Language = 'vi' | 'ja';

export const CATEGORY_JA: Record<MenuCategoryId, { title: string; subtitle?: string }> = {
  'ca-phe-phin-me': { title: 'ベトナムコーヒー（フィン）' },
  'ca-phe-espresso': { title: 'エスプレッソ' },
  'tra-sua-dam-vi': { title: '特製ミルクティー' },
  'thanh-huong-tra': { title: 'フレッシュミルクティー' },
  'tra-trai-cay': { title: 'フルーツティー' },
  'cold-brew-trai-cay': { title: 'フルーツ・コールドブリュー' },
  'matcha-katinat': {
    title: '静岡抹茶シリーズ',
    subtitle: '静岡県産の上質な抹茶を使用。濃厚な旨味と香ばしいローストナッツの香り。',
  },
  'fruit-boost': {
    title: 'フルーツブースト',
    subtitle: 'ベトナムの果樹園から届いた新鮮な完熟フルーツをそのままに。',
  },
  'banh-tart': { title: 'エッグタルト' },
  'an-vat': { title: 'おやつ・スナック' },
  topping: {
    title: 'トッピング',
    subtitle: 'お好みのトッピングでさらに美味しく。',
  },
};

export const MENU_ITEM_JA: Record<string, { name: string; description?: string; extra?: string }> = {
  'me-dua-non': { name: 'ヤングココナッツ・ベトナムコーヒー' },
  'me-sua-da': { name: 'ベトナム練乳アイスコーヒー' },
  'me-den-da': { name: 'ベトナムブラックコーヒー' },
  'me-xiu': { name: 'ベトナム風ミルクコーヒー（バクシウ）' },
  'ca-phe-kem-may-chanh-vang': { name: 'レモンフォーム・コーヒー' },
  'espresso-bac-xiu': { name: 'エスプレッソ・バクシウ' },
  'latte-nguyen-ban': { name: 'オリジナル・カフェラテ' },
  'espresso-sua-da': { name: 'エスプレッソ・練乳アイスコーヒー' },
  americano: { name: 'アメリカーノ' },
  'espresso-den-da': { name: 'エスプレッソ・ブラック' },
  'so-co-la-katinat': { name: 'KATINAT チョコレート', description: 'カフェインレスドリンク' },
  'tra-sua-chom-chom': { name: 'ランブータン・ミルクティー', extra: 'ランブータン追加（3個）' },
  'oolong-nuong-huyen-chau': { name: '黒糖タピオカ・焙煎ウーロンミルクティー' },
  'tra-sua-oolong-ba-la': { name: '三葉ウーロンミルクティー' },
  'hong-tra-sua-huyen-chau': { name: '黒糖タピオカ・紅茶ミルクティー' },
  'tra-sua-oolong-nuong': { name: '焙煎ウーロンミルクティー' },
  'tra-sua-thanh-huong-camellia': { name: 'カメリア・フレッシュミルクティー' },
  'coc-coc-dac-dac': { name: 'アンバレラ＆アレンガの実ティー' },
  'le-chi-thanh-tra': { name: 'ライチ・カメリアティー' },
  'tra-dao-hong-dai': { name: 'ピーチ・ハイビスカスティー', extra: 'ハイビスカスゼリー追加（50g）' },
  'tra-quyt-ha-du': { name: 'マンダリンオレンジティー', extra: 'みかんゼリー追加（40g）' },
  'cold-brew-quyt': { name: 'みかん・コールドブリュー' },
  'cold-brew-chanh-vang': { name: 'レモン・コールドブリュー' },
  'cold-brew-dau-tam': { name: 'マルベリー（桑の実）・コールドブリュー' },
  'matcha-bap-bi': { name: 'コーンミルク・抹茶フォーム', extra: 'コーンタピオカ追加（50g）' },
  'iki-matcha-tau-hu': { name: 'イキ・抹茶豆腐（トウファ）' },
  'matcha-dua-xiem': { name: 'ココナッツ・抹茶' },
  'iki-matcha-latte': { name: 'イキ・抹茶ラテ' },
  'xoai-nep-dua-non': { name: 'マンゴー＆ココナッツもち米スムージー' },
  'bo-gia-dua-non': { name: 'アボカド＆ヤングココナッツスムージー' },
  'sua-chua-tam': { name: 'マルベリー・ヨーグルトスムージー' },
  'banh-tart-trung-ngan-lop': { name: 'サクサク・エッグタルト' },
  'banh-trang-tron-muoi-toi': { name: 'ガーリックソルト・ライスペーパー和え' },
  'banh-trang-tron-tom-hanh': { name: '干しエビ＆ネギ・ライスペーパー和え' },
  'banh-trang-tron-trung-muoi': { name: '塩卵黄・ライスペーパー和え' },
  'banh-trang-tron-muoi-ghien': { name: 'ピリ辛エビ塩・ライスペーパー和え' },
  'banh-trang-nuong-xot-tom': { name: 'エビソース・焼きライスペーパー' },
  'banh-trang-nuong-mam-ruoc': { name: '発酵エビペースト・焼きライスペーパー' },
  'kho-ga-la-chanh': { name: 'レモンの葉風味・ほぐし干し鶏肉' },
  'kho-heo-ga-xe-say-toi': { name: 'ガーリック風味・ほぐしポーク＆チキン' },
};

export const TOPPING_JA: Record<string, string> = {
  'top-tran-chau-matcha-dua': '抹茶ココナッツパール',
  'top-tran-chau-dua-thot-not': 'パームシュガー・ココナッツパール',
  'top-tran-chau-pho-mai-deo': 'もちもちチーズパール',
  'top-tran-chau-bap': 'コーンパール',
  'top-huyen-chau': '黒糖タピオカ',
  'top-tran-chau-trang': 'ホワイトパール（寒天タピオカ）',
  'top-thach-hong-dao': 'ハイビスカスゼリー',
  'top-banh-flan': 'カスタードプリン',
  'top-tau-hu': '豆花（トウファ）',
};

export const SWEETNESS_JA: Record<string, string> = {
  '100% Ngọt chuẩn': '100% 標準の甘さ',
  '70% Ít ngọt': '70% 甘さ控えめ',
  '50% Ngọt vừa': '50% 半分の甘さ',
  '30% Ngọt thanh': '30% 微糖',
  '0% Không đường': '0% 無糖',
};

export const ICE_JA: Record<string, string> = {
  '100% Đá vừa': '100% 通常の氷',
  '70% Ít đá': '70% 氷少なめ',
  '50% Nửa đá': '50% 氷半分',
  'Không đá': '氷なし',
  'Đá riêng': '氷別添え',
};

export function translateSize(size: SizeKey, lang: Language): string {
  if (lang === 'vi') {
    if (size === 'HOT') return 'Nóng';
    if (size === 'M') return 'Size M';
    if (size === 'L') return 'Size L';
    return 'Phần chuẩn';
  }
  if (size === 'HOT') return 'ホット';
  if (size === 'M') return 'Mサイズ';
  if (size === 'L') return 'Lサイズ';
  return 'レギュラー';
}

export function translateSweetness(val: string | undefined, lang: Language): string | undefined {
  if (!val) return undefined;
  return lang === 'ja' ? SWEETNESS_JA[val] ?? val : val;
}

export function translateIce(val: string | undefined, lang: Language): string | undefined {
  if (!val) return undefined;
  return lang === 'ja' ? ICE_JA[val] ?? val : val;
}

export function translateToppingName(id: string, viName: string, lang: Language): string {
  if (lang === 'vi') return viName;
  return TOPPING_JA[id] ?? viName;
}

export interface LetterPageItem {
  src: string;
  caption: string;
  subcaption: string;
  kicker: string;
  wishTitle: string;
  wishBody: string;
  wishHighlight: string;
}

export const LETTER_PAGES_I18N: Record<Language, LetterPageItem[]> = {
  vi: [
    {
      src: '/assets/aistudio/image_ca05a8e5.png',
      caption: 'Khoảnh khắc rạng rỡ tại VJIT Space',
      subcaption: 'VKU × NIX Education · Hoa tươi và thật nhiều trái tim',
      kicker: 'TRANG 1 · TRI ÂN TẬN TÂM',
      wishTitle: 'Cảm ơn Quý Thầy Cô Nix đã luôn đồng hành cùng tụi em',
      wishBody:
        'Nhân ngày Nhà giáo Việt Nam 20/11, tập thể sinh viên VJIT xin gửi tới Quý Thầy Cô tại NIX Education lời tri ân sâu sắc nhất. Cảm ơn các cô đã luôn kiên nhẫn, tận tình chỉ dạy từ những chữ cái tiếng Nhật đầu tiên đến từng kỹ năng nghề nghiệp.',
      wishHighlight: 'Chúc các cô luôn tươi trẻ, rạng rỡ như những đóa hoa và giữ mãi trái tim nhiệt huyết!',
    },
    {
      src: '/assets/aistudio/image_22a0097f.png',
      caption: 'Lớp học luôn đầy ắp tiếng cười',
      subcaption: 'Cô giáo cầm mic cùng cả lớp vẫy tay siêu nhiệt tình',
      kicker: 'TRANG 2 · NIỀM VUI MỖI NGÀY',
      wishTitle: 'Chúc các giờ lên lớp mãi rộn ràng tiếng cười & năng lượng',
      wishBody:
        'Mỗi tiết học cùng các cô chưa bao giờ nhàm chán — lúc nào cũng đầy ắp tiếng cười, sự ấm áp và những câu chuyện thú vị. Mong rằng mỗi ngày đến lớp của các cô đều nhẹ nhàng, vui vẻ, ít áp lực và luôn nhận được thật nhiều tình cảm từ học trò.',
      wishHighlight: 'Chúc các cô ngày nào cũng cười thật tươi và ít deadline nhé!',
    },
    {
      src: '/assets/aistudio/image_336aacf6.png',
      caption: 'Ngày Khai Giảng K22 VKU × NIX',
      subcaption: 'Khởi đầu hành trình Kỹ sư CNTT Tăng cường Tiếng Nhật',
      kicker: 'TRANG 3 · LỜI CHÚC NGỌT NGÀO',
      wishTitle: 'Kính chúc Tập thể Giáo viên Nix sức khỏe & thành công rực rỡ',
      wishBody:
        'Từ ngày khai giảng K22 đầy háo hức cho đến hôm nay, từng bước trưởng thành của tụi em đều có dấu ấn của thầy cô Nix. Chúc tập thể Nix Education luôn vững mạnh, gặt hái nhiều thành công mới và có một ngày 20/11 thật đáng nhớ.',
      wishHighlight: 'Hôm nay mời các cô chọn ngay đồ uống & bánh yêu thích ở menu bên dưới nhé!',
    },
  ],
  ja: [
    {
      src: '/assets/aistudio/image_ca05a8e5.png',
      caption: 'VJIT Space での笑顔あふれる思い出',
      subcaption: 'VKU × NIX Education · お花とハートの記念写真',
      kicker: '1ページ目 · 心からの感謝',
      wishTitle: 'NIX Education の先生方、いつも本当にありがとうございます',
      wishBody:
        '11月20日のベトナム教師の日にあたり、VJITの学生一同よりNIX Educationの先生方へ心からの感謝をお届けします。日本語の基礎からIT・専門スキルまで、いつも温かく丁寧に導いてくださりありがとうございます。',
      wishHighlight: 'お花のように明るく、いつまでも情熱あふれる素敵な先生でいてください！',
    },
    {
      src: '/assets/aistudio/image_22a0097f.png',
      caption: 'いつも笑い声いっぱいの日本語クラス',
      subcaption: 'マイクを持った先生と元気いっぱいのクラスのみんな',
      kicker: '2ページ目 · 毎日の笑顔',
      wishTitle: '先生方の授業がこれからも笑顔と元気に包まれますように',
      wishBody:
        '先生方の授業はいつも楽しくて、教室には笑顔と温かい雰囲気がいっぱいです。これからも先生方が毎日楽しく、ストレス少なく、学生たちのたくさんの笑顔に囲まれて過ごせますように願っています。',
      wishHighlight: '毎日元気いっぱい、笑顔あふれる素敵な日々になりますように！',
    },
    {
      src: '/assets/aistudio/image_336aacf6.png',
      caption: 'K22 VKU × NIX 入学式・開講式',
      subcaption: '日本語強化ITエンジニア育成プログラムの始まり',
      kicker: '3ページ目 · 未来への祝福',
      wishTitle: 'NIX Education の先生方のご健康とますますのご活躍をお祈りいたします',
      wishBody:
        'ワクワクしたK22の開講式の日から今日まで、私たちの成長の一歩一歩には先生方の支えがあります。NIX Educationのますますの発展と、先生方の幸せな11月20日を心よりお祝い申し上げます。',
      wishHighlight: '今日は下のメニューから、お好きなドリンクやおやつをぜひお選びください！',
    },
  ],
};
