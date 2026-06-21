import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getClient() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); }

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user || user.subscriptionStatus !== 'active') {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
  }

  const { mood, moodLabel, context } = await req.json();

  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are a creative life coach. User doesn't know what to do.
Mood: ${moodLabel} (${mood}/5). Context: ${context || 'None'}

Give 5 fun, varied, specific ideas for right now. Mix: creative, social, physical, learning, relaxing.
Numbered list. Be specific, not generic. Make it exciting.`,
    }],
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  return NextResponse.json({ ideas: content });
}
