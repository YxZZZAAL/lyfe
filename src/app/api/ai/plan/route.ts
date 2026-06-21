import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getClient() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) }

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!user || user.subscriptionStatus !== 'active') {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
  }

  const { mood, moodLabel, notes } = await req.json()

  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a helpful life planning assistant.
Current mood: ${moodLabel} (${mood}/5)
Goals/notes: ${notes || 'None'}

Create a realistic, motivating daily plan with 5-7 time blocks.
Format each as: ⏰ [TIME] — [ACTIVITY]\nBrief description (1 sentence)

Match energy to mood. Be specific and practical.`,
    }],
  })

  const content = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ plan: content })
}
