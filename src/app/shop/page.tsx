'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DOGS, checkUnlock, type UserStats } from '@/lib/dogs'

type DogStats = {
  unlockedPetIds: string[]
  activePetId: string | null
  profileBio: string | null
  stats: UserStats & { longestStreak: number }
}

export default function ShopPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const isSubscribed = user?.subscriptionStatus === 'active'
  const [data, setData] = useState<DogStats | null>(null)
  const [saving, setSaving] = useState(false)
  const [bio, setBio] = useState('')
  const [activeTab, setActiveTab] = useState<'companions' | 'profile'>('companions')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && isSubscribed) load()
  }, [status, isSubscribed])

  async function load() {
    const res = await fetch('/api/dogs')
    const d = await res.json()
    setData(d)
    setBio(d.profileBio || '')
  }

  async function setActive(petId: string) {
    if (!data) return
    setSaving(true)
    await fetch('/api/dogs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activePetId: petId }),
    })
    setData(prev => prev ? { ...prev, activePetId: petId } : prev)
    setSaving(false)
  }

  async function saveProfile() {
    setSaving(true)
    await fetch('/api/dogs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileBio: bio }),
    })
    setSaving(false)
  }

  if (status === 'loading' || !data) return <div className="min-h-screen bg-[#f8f7f4]" />

  const stats: UserStats = { ...data.stats, unlockedPetIds: data.unlockedPetIds }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 text-sm transition">← Back</Link>
            <span className="text-gray-200">|</span>
            <span className="text-lg font-black text-gray-900">Companions</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            🔥 {data.stats.currentStreak}d
            <span className="text-gray-200">·</span>
            ✅ {data.stats.totalTasksDone} tasks
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0e1a12] rounded-2xl p-6 text-white">
          <p className="text-white/40 text-sm mb-4">Your progress</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { emoji: '✅', v: data.stats.totalTasksDone, l: 'Tasks done' },
              { emoji: '🔥', v: data.stats.currentStreak, l: 'Day streak' },
              { emoji: '🤩', v: data.stats.amazingMoodDays, l: 'Amazing days' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-black">{s.v}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs">{data.unlockedPetIds.length} / {DOGS.length} companions unlocked</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5">
              <div className="h-1.5 bg-[#4ade80] rounded-full transition-all" style={{ width: `${(data.unlockedPetIds.length / DOGS.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {(['companions', 'profile'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${activeTab === t ? 'bg-[#0e1a12] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'companions' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {DOGS.map(dog => {
              const { unlocked, progress } = checkUnlock(dog, stats)
              const isActive = data.activePetId === dog.id
              return (
                <div key={dog.id}
                  className={`bg-white rounded-2xl border-2 p-5 transition ${unlocked ? 'border-green-300' : 'border-gray-200 opacity-75'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-5xl ${!unlocked ? 'grayscale opacity-40' : ''}`}>{dog.emoji}</div>
                      <div>
                        <div className="font-black text-gray-900 text-lg">{dog.name}</div>
                        <div className="text-xs text-gray-400">{dog.breed}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                          dog.rarity === 'legendary' ? 'text-amber-600' :
                          dog.rarity === 'epic' ? 'text-violet-600' :
                          dog.rarity === 'rare' ? 'text-blue-600' : 'text-gray-400'
                        }`}>{dog.rarity}</div>
                      </div>
                    </div>
                    {unlocked ? (
                      isActive ? (
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">Active</span>
                      ) : (
                        <button onClick={() => setActive(dog.id)} disabled={saving}
                          className="text-xs bg-gray-900 hover:bg-gray-700 text-white font-bold px-2.5 py-1 rounded-full transition disabled:opacity-50">
                          Equip
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-gray-300 font-semibold">Locked</span>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Power</div>
                    <div className="text-sm font-bold text-gray-800">{dog.power.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{dog.power.description}</div>
                  </div>
                  {!unlocked ? (
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">How to earn</div>
                      <div className="text-xs text-gray-600 mb-1">{dog.unlock.label}</div>
                      <div className="text-xs text-green-600 font-semibold">{progress}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">{dog.personality}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-black text-gray-900 text-lg mb-4">Profile bio</h3>
              <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 120))}
                placeholder="A short bio shown on the world map… (120 chars max)"
                className="w-full border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 resize-none transition min-h-[80px]" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-300">{bio.length} / 120</span>
                <button onClick={saveProfile} disabled={saving}
                  className="bg-[#0e1a12] hover:bg-[#1a2e1d] disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-sm transition">
                  {saving ? 'Saving…' : 'Save bio'}
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-black text-gray-900 text-lg mb-2">Active companion</h3>
              <p className="text-sm text-gray-400 mb-4">Your active companion shows on your map pin and profile.</p>
              {data.activePetId ? (() => {
                const dog = DOGS.find(d => d.id === data.activePetId)
                return dog ? (
                  <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-4xl">{dog.emoji}</div>
                    <div>
                      <div className="font-black text-gray-900">{dog.name}</div>
                      <div className="text-xs text-gray-500">{dog.breed} · {dog.power.name}</div>
                    </div>
                  </div>
                ) : null
              })() : (
                <p className="text-sm text-gray-400">No companion equipped. Unlock one from the Companions tab.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
