import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          subscriptionStatus: user.subscriptionStatus,
          activePetId: user.activePetId,
          currentStreak: user.currentStreak,
          totalTasksDone: user.totalTasksDone,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, copy fields from the authorize return value
      if (user) {
        token.id = (user as any).id
        token.subscriptionStatus = (user as any).subscriptionStatus
        token.activePetId = (user as any).activePetId
      }
      // Always refresh subscription status from DB (catches Stripe webhooks)
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              subscriptionStatus: true,
              activePetId: true,
              currentStreak: true,
              totalTasksDone: true,
              amazingMoodDays: true,
              name: true,
              email: true,
            },
          })
          if (dbUser) {
            token.subscriptionStatus = dbUser.subscriptionStatus
            token.activePetId = dbUser.activePetId
            token.currentStreak = dbUser.currentStreak
            token.totalTasksDone = dbUser.totalTasksDone
            token.amazingMoodDays = dbUser.amazingMoodDays
          }
        } catch {
          // DB might be unavailable during build — ignore
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        const u = session.user as any
        u.id = token.id
        u.subscriptionStatus = token.subscriptionStatus
        u.activePetId = token.activePetId
        u.currentStreak = token.currentStreak
        u.totalTasksDone = token.totalTasksDone
        u.amazingMoodDays = token.amazingMoodDays
      }
      return session
    },
  },
}
