'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 1. Create account
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
      setLoading(false)
      return
    }

    // 2. Sign in immediately after creation
    const signInResult = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    })

    if (!signInResult?.ok || signInResult.error) {
      // Account was created but auto-login failed — send to login page
      router.push('/login?registered=1')
      return
    }

    // 3. Redirect to dashboard
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0e1a12] flex-col justify-between p-12">
        <Link href="/" className="text-white text-2xl font-black tracking-tight">
          lyfe<span className="text-[#4ade80]">.</span>
        </Link>

        <div>
          <p className="text-[#4ade80] text-sm font-semibold uppercase tracking-widest mb-4">Why people join</p>
          <div className="space-y-6">
            {[
              { heading: '"I finally have a morning routine."', sub: 'Jordan K. — completed 287 tasks in 3 months' },
              { heading: '"60-day streak. I never thought I\'d say that."', sub: 'Mia R. — unlocked Shadow the Arctic Wolf' },
              { heading: '"The AI actually knows me now."', sub: 'Theo B. — 14 amazing mood days this month' },
            ].map(q => (
              <div key={q.heading} className="border-l-2 border-[#4ade80]/30 pl-4">
                <p className="text-white font-semibold text-sm leading-relaxed">{q.heading}</p>
                <p className="text-white/40 text-xs mt-1">{q.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">Your data never leaves our servers. No selling, ever.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-2xl font-black text-gray-900">lyfe<span className="text-green-500">.</span></Link>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm mb-8">
            7 days free, then $17.99/month.{' '}
            <Link href="/login" className="text-gray-900 underline underline-offset-2">Already have one?</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Name <span className="text-gray-300">(optional)</span></label>
              <input
                type="text"
                autoComplete="name"
                placeholder="What should we call you?"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 transition"
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e1a12] hover:bg-[#1a2e1d] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition mt-2"
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p className="text-xs text-gray-300 text-center mt-6">
            No card needed now. By signing up you agree to our{' '}
            <a href="#" className="underline">Terms</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
