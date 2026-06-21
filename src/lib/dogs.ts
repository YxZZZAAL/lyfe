export type Dog = {
  id: string
  name: string
  breed: string
  emoji: string
  art: string          // ASCII/unicode art shown large
  rarity: 'starter' | 'common' | 'rare' | 'epic' | 'legendary'
  unlock: {
    type: 'tasks' | 'streak' | 'amazing_moods' | 'combined'
    tasksNeeded?: number
    streakNeeded?: number
    amazingMoodsNeeded?: number
    label: string
  }
  power: {
    name: string
    description: string
    featureId: string   // what it actually unlocks in code
  }
  personality: string
  fact: string
}

export const DOGS: Dog[] = [
  {
    id: 'rex',
    name: 'Rex',
    breed: 'German Shepherd',
    emoji: '🐕',
    art: '🐕',
    rarity: 'starter',
    unlock: {
      type: 'tasks',
      tasksNeeded: 5,
      label: 'Complete your first 5 tasks',
    },
    power: {
      name: 'Focus Timer',
      description: '25-minute Pomodoro blocks appear in your planner. Rex guards your time and blocks distractions.',
      featureId: 'focus_mode',
    },
    personality: 'Disciplined. Rex shows up every day, no excuses.',
    fact: 'German Shepherds can learn a new command in under 5 repetitions.',
  },
  {
    id: 'luna',
    name: 'Luna',
    breed: 'Border Collie',
    emoji: '🐩',
    art: '🐩',
    rarity: 'common',
    unlock: {
      type: 'streak',
      streakNeeded: 7,
      label: '7-day check-in streak',
    },
    power: {
      name: 'Weekly Digest',
      description: 'Every Sunday, Luna generates a personal review of your week — mood trends, task completion rate, what worked.',
      featureId: 'weekly_digest',
    },
    personality: 'Curious and relentless. Luna wants to know everything about your week.',
    fact: 'Border Collies are ranked the #1 most intelligent dog breed on earth.',
  },
  {
    id: 'biscuit',
    name: 'Biscuit',
    breed: 'Golden Retriever',
    emoji: '🦮',
    art: '🦮',
    rarity: 'common',
    unlock: {
      type: 'amazing_moods',
      amazingMoodsNeeded: 5,
      label: '5 days where you felt amazing (🤩)',
    },
    power: {
      name: 'Habit Tracker',
      description: 'Mark any task as a recurring habit. Biscuit makes it show up every day automatically. Build the routine.',
      featureId: 'habits',
    },
    personality: 'Optimistic and consistent. Biscuit never has a bad day.',
    fact: 'Golden Retrievers smile. Not metaphorically — they actually show their teeth in a grin.',
  },
  {
    id: 'storm',
    name: 'Storm',
    breed: 'Husky',
    emoji: '🐺',
    art: '🐺',
    rarity: 'rare',
    unlock: {
      type: 'streak',
      streakNeeded: 14,
      label: '14-day check-in streak',
    },
    power: {
      name: 'Ice Mode',
      description: 'Each morning, Storm gives you one brutal, honest challenge. No AI fluff — a single hard thing you\'ve been avoiding.',
      featureId: 'ice_mode',
    },
    personality: 'Wild and direct. Storm doesn\'t sugarcoat anything.',
    fact: 'Huskies can run 100 miles a day in -60°C. Your morning run excuse is invalid.',
  },
  {
    id: 'beans',
    name: 'Beans',
    breed: 'Corgi',
    emoji: '🐶',
    art: '🐶',
    rarity: 'rare',
    unlock: {
      type: 'tasks',
      tasksNeeded: 50,
      label: '50 total tasks completed',
    },
    power: {
      name: 'Smart Scheduling',
      description: 'Beans analyses your past task completion times and auto-suggests the best times to schedule new tasks based on when you actually get things done.',
      featureId: 'smart_schedule',
    },
    personality: 'Smarter than they look. Beans always knows the right moment.',
    fact: 'Corgis were bred to herd cattle by nipping at their heels — then dodging kicks. Pure strategy.',
  },
  {
    id: 'doge',
    name: 'Doge',
    breed: 'Shiba Inu',
    emoji: '🦊',
    art: '🦊',
    rarity: 'epic',
    unlock: {
      type: 'combined',
      tasksNeeded: 100,
      streakNeeded: 21,
      label: '100 tasks done + 21-day streak',
    },
    power: {
      name: 'World Leaderboard',
      description: 'Doge unlocks your leaderboard ranking. Compete globally on streak length, tasks done this week, and mood consistency. Much competition. Very stats.',
      featureId: 'leaderboard',
    },
    personality: 'Chaotic good. Doge shows up when you least expect it and makes you smile.',
    fact: 'The original Doge meme dog is named Kabosu. She\'s still alive and doing great.',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    breed: 'Doberman',
    emoji: '🐾',
    art: '🐾',
    rarity: 'epic',
    unlock: {
      type: 'combined',
      streakNeeded: 30,
      amazingMoodsNeeded: 15,
      label: '30-day streak + 15 amazing mood days',
    },
    power: {
      name: 'AI Deep Analysis',
      description: 'Phantom unlocks a monthly AI report that analyses every mood, task, and pattern in your data and tells you exactly what to change about your life.',
      featureId: 'deep_analysis',
    },
    personality: 'Observant and precise. Phantom sees what you don\'t.',
    fact: 'Dobermans were literally bred to be the perfect guard dog by a tax collector who needed protection.',
  },
  {
    id: 'shadow',
    name: 'Shadow',
    breed: 'Arctic Wolf',
    emoji: '❄️',
    art: '❄️',
    rarity: 'legendary',
    unlock: {
      type: 'combined',
      tasksNeeded: 200,
      streakNeeded: 60,
      amazingMoodsNeeded: 30,
      label: '200 tasks · 60-day streak · 30 amazing days',
    },
    power: {
      name: 'Alpha Status',
      description: 'Shadow is not a dog. Shadow is a wolf. Alpha status: your map pin glows silver, your profile gets a unique badge, and your name appears in the Hall of Wolves.',
      featureId: 'alpha',
    },
    personality: 'Shadow doesn\'t speak. Shadow appears.',
    fact: 'Arctic wolves are one of the few animals that show no fear of humans — they\'ve simply never needed to.',
  },
]

export const RARITY_CONFIG = {
  starter:   { label: 'Starter',   bg: 'bg-gray-100',    text: 'text-gray-600',   border: 'border-gray-200' },
  common:    { label: 'Common',    bg: 'bg-stone-100',   text: 'text-stone-600',  border: 'border-stone-200' },
  rare:      { label: 'Rare',      bg: 'bg-blue-50',     text: 'text-blue-700',   border: 'border-blue-200' },
  epic:      { label: 'Epic',      bg: 'bg-violet-50',   text: 'text-violet-700', border: 'border-violet-200' },
  legendary: { label: 'Legendary', bg: 'bg-amber-50',    text: 'text-amber-700',  border: 'border-amber-300' },
}

export type UserStats = {
  totalTasksDone: number
  currentStreak: number
  amazingMoodDays: number
  unlockedPetIds: string[]
}

export function checkUnlock(dog: Dog, stats: UserStats): { unlocked: boolean; progress: string } {
  const { unlock } = dog
  if (stats.unlockedPetIds.includes(dog.id)) return { unlocked: true, progress: '100%' }

  if (unlock.type === 'tasks') {
    const done = Math.min(stats.totalTasksDone, unlock.tasksNeeded!)
    return {
      unlocked: stats.totalTasksDone >= unlock.tasksNeeded!,
      progress: `${done}/${unlock.tasksNeeded} tasks`,
    }
  }
  if (unlock.type === 'streak') {
    const done = Math.min(stats.currentStreak, unlock.streakNeeded!)
    return {
      unlocked: stats.currentStreak >= unlock.streakNeeded!,
      progress: `${done}/${unlock.streakNeeded} day streak`,
    }
  }
  if (unlock.type === 'amazing_moods') {
    const done = Math.min(stats.amazingMoodDays, unlock.amazingMoodsNeeded!)
    return {
      unlocked: stats.amazingMoodDays >= unlock.amazingMoodsNeeded!,
      progress: `${done}/${unlock.amazingMoodsNeeded} amazing days`,
    }
  }
  if (unlock.type === 'combined') {
    const parts: string[] = []
    if (unlock.tasksNeeded) parts.push(`${Math.min(stats.totalTasksDone, unlock.tasksNeeded)}/${unlock.tasksNeeded} tasks`)
    if (unlock.streakNeeded) parts.push(`${Math.min(stats.currentStreak, unlock.streakNeeded)}/${unlock.streakNeeded} streak`)
    if (unlock.amazingMoodsNeeded) parts.push(`${Math.min(stats.amazingMoodDays, unlock.amazingMoodsNeeded)}/${unlock.amazingMoodsNeeded} amazing days`)
    const allMet =
      (!unlock.tasksNeeded || stats.totalTasksDone >= unlock.tasksNeeded) &&
      (!unlock.streakNeeded || stats.currentStreak >= unlock.streakNeeded) &&
      (!unlock.amazingMoodsNeeded || stats.amazingMoodDays >= unlock.amazingMoodsNeeded)
    return { unlocked: allMet, progress: parts.join(' · ') }
  }
  return { unlocked: false, progress: '' }
}
