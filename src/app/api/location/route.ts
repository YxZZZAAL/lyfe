import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PETS } from '@/lib/pets';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user || user.subscriptionStatus !== 'active') {
    return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
  }

  const { lat, lng, city } = await req.json();
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLat: lat, lastLng: lng, lastCity: city || null, locationUpdatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user || user.subscriptionStatus !== 'active') {
    return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const users = await prisma.user.findMany({
    where: {
      subscriptionStatus: 'active',
      lastLat: { not: null },
      lastLng: { not: null },
      locationUpdatedAt: { gte: cutoff },
    },
    include: { unlockedPets: true },
    orderBy: { locationUpdatedAt: 'desc' },
  });

  const mapped = users.map(u => {
    const activePet = u.activePetId ? PETS.find(p => p.id === u.activePetId) : null;
    return {
      id: u.id,
      name: u.name,
      lastLat: u.lastLat,
      lastLng: u.lastLng,
      lastCity: u.lastCity,
      activePet: activePet ? { id: activePet.id, name: activePet.name, emoji: activePet.emoji, rarity: activePet.rarity } : null,
      petCount: u.unlockedPets.length,
      profileTheme: u.profileTheme,
      locationUpdatedAt: u.locationUpdatedAt,
    };
  });

  return NextResponse.json({ users: mapped });
}
