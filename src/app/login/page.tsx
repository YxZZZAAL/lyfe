'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (params.get('registered')) setNotice('Account created! Sign in below.')
  }, [params])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    })

    if (!result?.ok || result.error) {
      setError('Wrong email or password.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0e1a12] flex-col justify-between p-12">
        <Link href="/" className="text-white text-2xl font-black">
          lyfe<span className="text-[#4ade80]">.</span>
        </Link>
        <div>
          <p className="text-5xl font-black text-white leading-tight mb-4">
            Good to<br />have you<br />back.
          </p>
          <p className="text-white/40 text-sm">Your streak is waiting.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['📅','Tasks done'],['🔥','Day streak'],['🐾','Companions']].map(([e,l]) => (
            <div key={l} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{e}</div>
              <div className="text-white/40 text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-2xl font-black text-gray-900">lyfe<span className="text-green-500">.</span></Link>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">
            No account?{' '}
            <Link href="/register" className="text-gray-900 underline underline-offset-2">Sign up free</Link>
          </p>

          {notice && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-4">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 transition"
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
              className="w-full bg-[#0e1a12] hover:bg-[#1a2e1d] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
