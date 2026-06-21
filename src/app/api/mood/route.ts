import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DOGS, checkUnlock } from '@/lib/dogs'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

async function checkAndGrantAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { unlockedPets: true },
  })
  if (!user) return

  const stats = {
    totalTasksDone: user.totalTasksDone,
    currentStreak: user.currentStreak,
    amazingMoodDays: user.amazingMoodDays,
    unlockedPetIds: user.unlockedPets.map((p: { petId: string }) => p.petId),
  }

  for (const dog of DOGS) {
    const { unlocked } = checkUnlock(dog, stats)
    if (unlocked && !stats.unlockedPetIds.includes(dog.id)) {
      await prisma.userPet.create({ data: { userId, petId: dog.id } }).catch(() => {})
      if (!user.activePetId) {
        await prisma.user.update({ where: { id: userId }, data: { activePetId: dog.id } })
      }
    }
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { mood, moodLabel, notes } = await req.json()
  const today = todayStr()

  // Upsert mood entry
  const existing = await prisma.moodEntry.findFirst({ where: { userId: user.id, date: today } })
  if (!existing) {
    await prisma.moodEntry.create({ data: { userId: user.id, date: today, mood, moodLabel, notes: notes || null } })
  }

  // Streak logic
  let newStreak = user.currentStreak
  const lastDate = user.lastCheckInDate

  if (lastDate === today) {
    // Already checked in today, no change
  } else if (lastDate === yesterday()) {
    newStreak = user.currentStreak + 1
  } else {
    // Streak broken
    newStreak = 1
  }

  // Amazing mood days
  const isAmazing = mood >= 5
  const newAmazingDays = isAmazing && lastDate !== today
    ? user.amazingMoodDays + 1
    : user.amazingMoodDays

  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      lastCheckInDate: today,
      amazingMoodDays: newAmazingDays,
    },
  })

  await checkAndGrantAchievements(user.id)

  return NextResponse.json({ ok: true, streak: newStreak })
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '14')

  const entries = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: days,
  })

  return NextResponse.json({
    entries,
    stats: {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalTasksDone: user.totalTasksDone,
      amazingMoodDays: user.amazingMoodDays,
    },
  })
}
