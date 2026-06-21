import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { unlockedPets: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    unlockedPetIds: user.unlockedPets.map((p: { petId: string }) => p.petId),
    activePetId: user.activePetId,
    profileTheme: user.profileTheme,
    profileBio: user.profileBio,
    stats: {
      totalTasksDone: user.totalTasksDone,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      amazingMoodDays: user.amazingMoodDays,
    },
  })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const data: any = {}
  if (body.activePetId !== undefined) data.activePetId = body.activePetId
  if (body.profileTheme !== undefined) data.profileTheme = body.profileTheme
  if (body.profileBio !== undefined) data.profileBio = String(body.profileBio).slice(0, 120)

  await prisma.user.update({ where: { id: user.id }, data })
  return NextResponse.json({ ok: true })
}
