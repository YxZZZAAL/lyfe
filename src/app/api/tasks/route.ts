import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DOGS, checkUnlock } from '@/lib/dogs'

async function getUser(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { unlockedPets: true },
  })
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
      // Auto-equip first dog earned
      if (!user.activePetId) {
        await prisma.user.update({ where: { id: userId }, data: { activePetId: dog.id } })
      }
    }
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const tasks = await prisma.task.findMany({
    where: { userId: user.id, date },
    orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
  })

  return NextResponse.json({ tasks })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { title, time, date, color, isHabit } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title: title.trim(),
      time: time || null,
      date: date || new Date().toISOString().split('T')[0],
      color: color || 'slate',
      isHabit: isHabit || false,
    },
  })

  return NextResponse.json({ task })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { id, done, title, time, color } = await req.json()

  const task = await prisma.task.findUnique({ where: { id } })
  if (!task || task.userId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(done !== undefined && { done }),
      ...(title !== undefined && { title }),
      ...(time !== undefined && { time }),
      ...(color !== undefined && { color }),
    },
  })

  // When marking done, increment user stats
  if (done === true && !task.done) {
    await prisma.user.update({
      where: { id: user.id },
      data: { totalTasksDone: { increment: 1 } },
    })
    await checkAndGrantAchievements(user.id)
  }

  return NextResponse.json({ task: updated })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { id } = await req.json()
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task || task.userId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
