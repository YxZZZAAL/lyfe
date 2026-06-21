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
    owned: user.unlockedPets.map((p: { petId: string }) => p.petId),
    activePetId: user.activePetId,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { petId } = await req.json()
  if (!petId) return NextResponse.json({ error: 'Missing petId' }, { status: 400 })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { unlockedPets: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const already = user.unlockedPets.find(p => p.petId === petId)
  if (already) return NextResponse.json({ ok: true, message: 'Already owned' })
  await prisma.userPet.create({ data: { userId: user.id, petId } })
  return NextResponse.json({ ok: true })
}
