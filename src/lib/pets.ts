export type Pet = {
  id: string;
  name: string;
  emoji: string;
  breed: string;
  price: number; // per month USD
  personality: string;
  trait: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string; // tailwind gradient classes
  border: string;
  badge: string;
};

export const PETS: Pet[] = [
  {
    id: 'chihuahua',
    name: 'Peanut',
    emoji: '🐕',
    breed: 'Chihuahua',
    price: 1.99,
    personality: 'Tiny but mighty. Peanut shows up on your profile and cheers you on.',
    trait: '🔥 Always hyped',
    rarity: 'common',
    color: 'from-yellow-50 to-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'labrador',
    name: 'Bruno',
    emoji: '🦮',
    breed: 'Labrador',
    price: 2.99,
    personality: 'Your reliable best friend. Bruno never misses a check-in and brings good vibes.',
    trait: '💛 Loyal forever',
    rarity: 'common',
    color: 'from-orange-50 to-yellow-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'poodle',
    name: 'Coco',
    emoji: '🐩',
    breed: 'Poodle',
    price: 3.99,
    personality: 'Fabulous, elegant, and effortlessly chic. Coco makes your profile *the* place to be.',
    trait: '✨ Pure glamour',
    rarity: 'rare',
    color: 'from-pink-50 to-rose-50',
    border: 'border-pink-300',
    badge: 'bg-pink-100 text-pink-800',
  },
  {
    id: 'husky',
    name: 'Storm',
    emoji: '🐺',
    breed: 'Husky',
    price: 4.99,
    personality: 'Wild, free, and absolutely unstoppable. Storm turns heads on the world map.',
    trait: '❄️ Ice cold focus',
    rarity: 'rare',
    color: 'from-blue-50 to-cyan-50',
    border: 'border-blue-300',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'corgi',
    name: 'Beans',
    emoji: '🐶',
    breed: 'Corgi',
    price: 5.99,
    personality: 'Short legs. Big heart. Beans is basically internet royalty and everyone loves them.',
    trait: '👑 Internet famous',
    rarity: 'epic',
    color: 'from-amber-50 to-orange-100',
    border: 'border-amber-400',
    badge: 'bg-amber-200 text-amber-900',
  },
  {
    id: 'shiba',
    name: 'Doge',
    emoji: '🦊',
    breed: 'Shiba Inu',
    price: 7.99,
    personality: 'Much wow. Very lyfe. Such planner. Doge is the meme legend who graces your profile.',
    trait: '🌕 Much wow',
    rarity: 'epic',
    color: 'from-orange-100 to-red-50',
    border: 'border-orange-400',
    badge: 'bg-orange-200 text-orange-900',
  },
  {
    id: 'golden',
    name: 'Sunny',
    emoji: '🐕‍🦺',
    breed: 'Golden Retriever',
    price: 9.99,
    personality: 'Pure sunshine in dog form. Sunny radiates good energy and makes every day feel worth planning.',
    trait: '☀️ Infinite warmth',
    rarity: 'legendary',
    color: 'from-yellow-100 to-amber-100',
    border: 'border-yellow-400',
    badge: 'bg-yellow-200 text-yellow-900',
  },
  {
    id: 'wolf',
    name: 'Shadow',
    emoji: '🐾',
    breed: 'Arctic Wolf',
    price: 14.99,
    personality: 'Not even a dog — Shadow is a rare arctic wolf companion. The rarest flex on the entire world map.',
    trait: '🌌 Mythic status',
    rarity: 'legendary',
    color: 'from-purple-100 to-indigo-100',
    border: 'border-purple-400',
    badge: 'bg-purple-200 text-purple-900',
  },
];

export const RARITY_LABELS: Record<Pet['rarity'], { label: string; color: string }> = {
  common:    { label: 'Common',    color: 'bg-gray-100 text-gray-600' },
  rare:      { label: 'Rare',      color: 'bg-blue-100 text-blue-700' },
  epic:      { label: 'Epic',      color: 'bg-purple-100 text-purple-700' },
  legendary: { label: 'Legendary', color: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' },
};

export const THEMES = [
  { id: 'default',  label: 'Fresh Green',  preview: 'bg-green-500',  gradient: 'from-green-50 to-emerald-50',  accent: '#22c55e' },
  { id: 'ocean',    label: 'Deep Ocean',   preview: 'bg-blue-500',   gradient: 'from-blue-50 to-cyan-50',      accent: '#3b82f6' },
  { id: 'sunset',   label: 'Sunset',       preview: 'bg-orange-500', gradient: 'from-orange-50 to-rose-50',    accent: '#f97316' },
  { id: 'midnight', label: 'Midnight',     preview: 'bg-indigo-600', gradient: 'from-indigo-50 to-violet-50',  accent: '#6366f1' },
  { id: 'sakura',   label: 'Sakura',       preview: 'bg-pink-400',   gradient: 'from-pink-50 to-rose-50',      accent: '#ec4899' },
  { id: 'forest',   label: 'Forest',       preview: 'bg-emerald-700',gradient: 'from-emerald-50 to-teal-50',   accent: '#10b981' },
];
