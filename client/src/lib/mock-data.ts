export interface Member {
  id: number;
  name: string;
  category: string;
  hp_url: string;
  product_url?: string;
  facebook_url: string;
  photo_url?: string;
  description: string;
}

export const MOCK_MEMBERS: Member[] = [
  {
    id: 1,
    name: "籾木 真一郎",
    category: "焼酎販売",
    hp_url: "http://www.momiki.com/",
    facebook_url: "https://www.facebook.com/shinichirou.momiki",
    description: "宮崎県産の厳選された焼酎をお届けします。伝統の味と新しい挑戦。",
    photo_url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "児玉 拓隆",
    category: "酒造メーカー",
    hp_url: "https://shochu-kojika.jp/",
    facebook_url: "https://www.facebook.com/hirotaka.kodama.3",
    description: "鹿児島の芋焼酎「小鹿」の製造・販売。地域の恵みをボトルに詰めて。",
    photo_url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "井久保 大介",
    category: "印刷・デザイン",
    hp_url: "https://www.pricom.jp/",
    facebook_url: "https://www.facebook.com/d.ikubo",
    description: "ビジネスを加速させる印刷物とデザインの提案。名刺から看板まで。",
    photo_url: "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "ヤギ おじさん",
    category: "害虫駆除",
    hp_url: "https://bochu.net/",
    facebook_url: "https://www.facebook.com/masuo.kawasaki.1",
    description: "安心・安全な害虫駆除サービス。環境に配慮した施工を行います。",
    photo_url: "https://images.unsplash.com/photo-1587560699334-cc4da63c24b9?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "阿万 聡志",
    category: "健康食品",
    hp_url: "https://www.sun-moringa.com/",
    facebook_url: "https://www.facebook.com/satoshiaman",
    description: "奇跡の木「モリンガ」を使用した健康食品の販売。毎日の健康をサポート。",
    photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "鎌田 俊作",
    category: "お茶販売",
    hp_url: "http://www.satsumaen.com/",
    facebook_url: "https://www.facebook.com/kamadshunsaku",
    description: "鹿児島茶の魅力を全国へ。香り高い銘茶を取り揃えています。",
    photo_url: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "笹原 彰朗",
    category: "ITコンサルティング",
    hp_url: "https://officeplata.com/",
    facebook_url: "https://www.facebook.com/akio.sasahara/",
    description: "中小企業のDX推進をサポート。業務効率化からシステム開発まで。",
    photo_url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "上沖 和己",
    category: "食品加工",
    hp_url: "http://kamioki.shop-pro.jp/",
    facebook_url: "https://www.facebook.com/kazumi.kamioki",
    description: "地元の食材を活かした加工食品の製造・販売。食卓に笑顔を。",
    photo_url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "三上 裕",
    category: "スイーツ販売",
    hp_url: "https://ringoxame.com/",
    facebook_url: "https://www.facebook.com/profile.php?id=100040651162061",
    description: "こだわりのりんご飴専門店。お祭りだけでなく日常のスイーツとして。",
    photo_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2089&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "梅田 由佳",
    category: "ジュエリー",
    hp_url: "http://www.mesanges2012.com/",
    facebook_url: "https://www.facebook.com/yuka.umeda.399",
    description: "あなただけの輝きを。オーダーメイドジュエリーとリフォーム。",
    photo_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop"
  }
];
