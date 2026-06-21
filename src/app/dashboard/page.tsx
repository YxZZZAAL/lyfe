'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { DOGS, checkUnlock, type UserStats } from '@/lib/dogs'

const MOODS = [
  { emoji: '😩', label: 'Rough',   value: 1 },
  { emoji: '😕', label: 'Meh',     value: 2 },
  { emoji: '😐', label: 'Okay',    value: 3 },
  { emoji: '😊', label: 'Good',    value: 4 },
  { emoji: '🤩', label: 'Amazing', value: 5 },
]

const COLORS = [
  { id: 'slate',  bg: 'bg-slate-100  border-slate-200  text-slate-800',  dot: 'bg-slate-400'  },
  { id: 'green',  bg: 'bg-green-50   border-green-200  text-green-800',  dot: 'bg-green-500'  },
  { id: 'blue',   bg: 'bg-blue-50    border-blue-200   text-blue-800',   dot: 'bg-blue-500'   },
  { id: 'purple', bg: 'bg-violet-50  border-violet-200 text-violet-800', dot: 'bg-violet-500' },
  { id: 'amber',  bg: 'bg-amber-50   border-amber-200  text-amber-800',  dot: 'bg-amber-500'  },
  { id: 'rose',   bg: 'bg-rose-50    border-rose-200   text-rose-800',   dot: 'bg-rose-500'   },
]

type Task = { id: string; title: string; time: string | null; done: boolean; color: string; isHabit: boolean }
type Tab = 'planner' | 'ai' | 'ideas' | 'dogs'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const isSubscribed = user?.subscriptionStatus === 'active'
  const today = new Date().toISOString().split('T')[0]
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const [tab, setTab] = useState<Tab>('planner')
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newColor, setNewColor] = useState('slate')
  const [addingTask, setAddingTask] = useState(false)
  const [mood, setMood] = useState<typeof MOODS[0] | null>(null)
  const [moodSaved, setMoodSaved] = useState(false)
  const [aiNotes, setAiNotes] = useState('')
  const [plan, setPlan] = useState('')
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [ideaCtx, setIdeaCtx] = useState('')
  const [ideas, setIdeas] = useState('')
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const [dogStats, setDogStats] = useState<{ unlockedPetIds: string[]; activePetId: string | null; stats: UserStats } | null>(null)
  const [newUnlock, setNewUnlock] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && isSubscribed) {
      loadTasks()
      loadDogStats()
      checkTodayMood()
    }
  }, [status, isSubscribed])

  async function loadTasks() {
    const res = await fetch(`/api/tasks?date=${today}`)
    const data = await res.json()
    setTasks(data.tasks || [])
  }

  async function loadDogStats() {
    const res = await fetch('/api/dogs')
    const data = await res.json()
    setDogStats(data)
  }

  async function checkTodayMood() {
    const res = await fetch('/api/mood?days=1')
    const data = await res.json()
    const todayEntry = data.entries?.find((e: any) => e.date === today)
    if (todayEntry) {
      const m = MOODS.find(m => m.value === todayEntry.mood)
      if (m) { setMood(m); setMoodSaved(true) }
    }
  }

  async function saveMood(m: typeof MOODS[0]) {
    setMood(m)
    setMoodSaved(true)
    const before = dogStats?.unlockedPetIds || []
    await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: m.value, moodLabel: m.label }),
    })
    const res = await fetch('/api/dogs')
    const data = await res.json()
    setDogStats(data)
    const after = data.unlockedPetIds || []
    const gained = after.find((id: string) => !before.includes(id))
    if (gained) setNewUnlock(gained)
  }

  async function addTask() {
    if (!newTitle.trim()) return
    setAddingTask(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, time: newTime || null, date: today, color: newColor }),
    })
    const data = await res.json()
    setTasks(prev => [...prev, data.task].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99')))
    setNewTitle('')
    setNewTime('')
    setAddingTask(false)
    titleRef.current?.focus()
  }

  async function toggleTask(id: string, done: boolean) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done } : t))
    const before = dogStats?.unlockedPetIds || []
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done }),
    })
    if (done) {
      const res = await fetch('/api/dogs')
      const data = await res.json()
      setDogStats(data)
      const after = data.unlockedPetIds || []
      const gained = after.find((pid: string) => !before.includes(pid))
      if (gained) setNewUnlock(gained)
    }
  }

  async function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    await fetch('/api/tasks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
  }

  async function generatePlan() {
    if (!mood) return
    setLoadingPlan(true)
    const res = await fetch('/api/ai/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: mood.value, moodLabel: mood.label, notes: aiNotes }),
    })
    const data = await res.json()
    setPlan(data.plan || data.error || '')
    setLoadingPlan(false)
  }

  async function addPlanToTasks() {
    const lines = plan.split('\n').filter(l => l.includes('⏰'))
    for (const line of lines) {
      const timeMatch = line.match(/([0-9]{1,2}:[0-9]{2})/)
      const time = timeMatch ? timeMatch[1] : ''
      const title = line.replace(/^⏰[^—–\-]*[—–\-]\s*/, '').split('\n')[0].trim().replace(/^⏰\s*/, '')
      if (title.length > 2) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, time, date: today, color: 'green' }),
        })
      }
    }
    await loadTasks()
    setTab('planner')
  }

  async function getIdeas() {
    setLoadingIdeas(true)
    const res = await fetch('/api/ai/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: mood?.value || 3, moodLabel: mood?.label || 'Okay', context: ideaCtx }),
    })
    const data = await res.json()
    setIdeas(data.ideas || '')
    setLoadingIdeas(false)
  }

  async function startSubscription() {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Could not start checkout. Please try again.')
      }
    } catch {
      alert('Could not connect to payment system. Please try again.')
    }
  }

  const doneTasks = tasks.filter(t => t.done).length
  const progress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0
  const activeDog = dogStats?.activePetId ? DOGS.find(d => d.id === dogStats.activePetId) : null
  const unlockedCount = dogStats?.unlockedPetIds?.length || 0

  if (status === 'loading') return <div className="min-h-screen bg-[#f8f7f4]" />

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">

      {/* Unlock toast */}
      {newUnlock && (() => {
        const dog = DOGS.find(d => d.id === newUnlock)
        return dog ? (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0e1a12] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-2xl">{dog.emoji}</span>
            <div>
              <div className="font-black text-sm">{dog.name} unlocked!</div>
              <div className="text-white/60 text-xs">{dog.power.name} is now active</div>
            </div>
            <button onClick={() => setNewUnlock(null)} className="ml-2 text-white/40 hover:text-white">×</button>
          </div>
        ) : null
      })()}

      {/* Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-black text-gray-900">lyfe<span className="text-green-500">.</span></Link>
            {activeDog && (
              <span className="text-sm text-gray-400 flex items-center gap-1">
                {activeDog.emoji} {activeDog.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {dogStats && (
              <button onClick={() => setTab('dogs')} className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition px-2 py-1">
                🔥 {dogStats.stats.currentStreak}d
                <span className="text-gray-300">·</span>
                ✅ {dogStats.stats.totalTasksDone}
              </button>
            )}
            <Link href="/map" className="text-xs border border-gray-200 hover:border-gray-400 text-gray-500 px-3 py-1.5 rounded-lg transition">Map</Link>
            <Link href="/shop" className="text-xs border border-gray-200 hover:border-gray-400 text-gray-500 px-3 py-1.5 rounded-lg transition">Shop</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-gray-400 hover:text-gray-700 transition">Sign out</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">

        {/* Paywall */}
        {!isSubscribed && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm max-w-md mx-auto mt-12">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Activate your account</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Start your 7-day free trial to unlock the planner, AI features, world map, and the companion system.</p>
            <button onClick={startSubscription} className="w-full bg-[#0e1a12] hover:bg-[#1a2e1d] text-white font-bold py-3.5 rounded-xl transition">
              Start free trial →
            </button>
            <p className="text-xs text-gray-300 mt-3">No charge until day 8. Cancel anytime.</p>
          </div>
        )}

        {isSubscribed && (
          <div className="space-y-4">
            {/* Top row: date + mood + progress */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                  <h1 className="text-xl font-black text-gray-900">{dateLabel}</h1>
                  {tasks.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-28 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{doneTasks} / {tasks.length}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">How are you feeling?</span>
                  <div className="flex gap-1">
                    {MOODS.map(m => (
                      <button key={m.value} onClick={() => saveMood(m)} title={m.label}
                        className={`text-xl p-1.5 rounded-xl transition ${mood?.value === m.value ? 'bg-gray-900 scale-110' : 'hover:bg-gray-100'}`}>
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                  {moodSaved && mood && <span className="text-xs text-gray-400">Feeling {mood.label} today</span>}
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {([
                ['planner', '📋 Planner'],
                ['ai',      '🤖 AI Plan'],
                ['ideas',   '💡 Ideas'],
                ['dogs',    `🐾 Companions ${unlockedCount > 0 ? `(${unlockedCount})` : ''}`],
              ] as [Tab, string][]).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition flex-shrink-0 ${tab === id ? 'bg-[#0e1a12] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* PLANNER */}
            {tab === 'planner' && (
              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex flex-wrap gap-2 items-center">
                    <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:border-gray-900 outline-none w-28 flex-shrink-0" />
                    <input ref={titleRef} type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addTask() }}
                      placeholder="What do you want to do today?"
                      className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder-gray-300 focus:border-gray-900 outline-none" />
                    <div className="flex gap-1.5 items-center">
                      {COLORS.map(c => (
                        <button key={c.id} onClick={() => setNewColor(c.id)}
                          className={`w-5 h-5 rounded-full transition ${c.dot} ${newColor === c.id ? 'ring-2 ring-gray-900 ring-offset-1' : 'opacity-50 hover:opacity-100'}`} />
                      ))}
                    </div>
                    <button onClick={addTask} disabled={!newTitle.trim() || addingTask}
                      className="bg-[#0e1a12] hover:bg-[#1a2e1d] disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl text-sm transition flex-shrink-0">
                      Add
                    </button>
                  </div>
                </div>

                {tasks.length === 0 ? (
                  <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                    <p className="text-2xl mb-2">📋</p>
                    <p className="text-gray-400 text-sm">Add your first task, or use <button onClick={() => setTab('ai')} className="text-gray-900 underline">AI Plan</button> to fill your day.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {tasks.map(task => {
                      const colorClass = COLORS.find(c => c.id === task.color)?.bg || COLORS[0].bg
                      return (
                        <div key={task.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition group ${colorClass} ${task.done ? 'opacity-50' : ''}`}>
                          <button onClick={() => toggleTask(task.id, !task.done)}
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs transition ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 bg-white hover:border-gray-700'}`}>
                            {task.done && '✓'}
                          </button>
                          {task.time && <span className="text-xs font-mono text-gray-400 w-10 flex-shrink-0">{task.time}</span>}
                          <span className={`flex-1 text-sm font-medium min-w-0 ${task.done ? 'line-through' : ''}`}>{task.title}</span>
                          {task.isHabit && <span className="text-[10px] bg-white/60 px-1.5 py-0.5 rounded font-semibold text-gray-500">habit</span>}
                          <button onClick={() => deleteTask(task.id)}
                            className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xl leading-none flex-shrink-0">
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* AI PLAN */}
            {tab === 'ai' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="font-black text-xl text-gray-900">AI Day Planner</h2>
                  <p className="text-sm text-gray-400 mt-1">Pick your mood and Claude builds a realistic day around it. Then push it straight to your planner.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Mood</p>
                  <div className="flex gap-2">
                    {MOODS.map(m => (
                      <button key={m.value} onClick={() => setMood(m)}
                        className={`flex-1 py-2.5 rounded-xl text-xl transition border-2 ${mood?.value === m.value ? 'border-gray-900 bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}>
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Goals / notes <span className="text-gray-300">(optional)</span></p>
                  <textarea value={aiNotes} onChange={e => setAiNotes(e.target.value)}
                    placeholder="e.g. Finish client proposal, go to gym, take it easy in the afternoon..."
                    className="w-full border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 resize-none transition min-h-[80px]" />
                </div>

                <button onClick={generatePlan} disabled={!mood || loadingPlan}
                  className="w-full bg-[#0e1a12] hover:bg-[#1a2e1d] disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition">
                  {loadingPlan ? 'Planning your day…' : 'Generate day plan →'}
                </button>

                {plan && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-700">Your plan</span>
                      <button onClick={addPlanToTasks}
                        className="text-xs bg-[#0e1a12] text-white font-bold px-4 py-1.5 rounded-lg hover:bg-[#1a2e1d] transition">
                        → Add all to planner
                      </button>
                    </div>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">{plan}</pre>
                  </div>
                )}
              </div>
            )}

            {/* IDEAS */}
            {tab === 'ideas' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="font-black text-xl text-gray-900">What should I do?</h2>
                  <p className="text-sm text-gray-400 mt-1">Stuck or bored? Describe your situation and get 5 ideas tailored to your mood and context.</p>
                </div>
                <textarea value={ideaCtx} onChange={e => setIdeaCtx(e.target.value)}
                  placeholder="e.g. I have 2 hours, I'm at home, I want something that gets me off my phone..."
                  className="w-full border border-gray-200 focus:border-gray-900 outline-none rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 resize-none transition min-h-[80px]" />
                <button onClick={getIdeas} disabled={loadingIdeas}
                  className="w-full bg-[#0e1a12] hover:bg-[#1a2e1d] disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition">
                  {loadingIdeas ? 'Thinking…' : 'Give me ideas →'}
                </button>
                {ideas && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{ideas}</pre>
                  </div>
                )}
              </div>
            )}

            {/* DOGS / ACHIEVEMENTS */}
            {tab === 'dogs' && dogStats && (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Tasks done',    value: dogStats.stats.totalTasksDone, emoji: '✅' },
                    { label: 'Day streak',    value: dogStats.stats.currentStreak,  emoji: '🔥' },
                    { label: 'Amazing days',  value: dogStats.stats.amazingMoodDays,emoji: '🤩' },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                      <div className="text-2xl mb-1">{s.emoji}</div>
                      <div className="text-2xl font-black text-gray-900">{s.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Dog cards */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {DOGS.map(dog => {
                    const stats: UserStats = {
                      totalTasksDone: dogStats.stats.totalTasksDone,
                      currentStreak: dogStats.stats.currentStreak,
                      amazingMoodDays: dogStats.stats.amazingMoodDays,
                      unlockedPetIds: dogStats.unlockedPetIds,
                    }
                    const { unlocked, progress } = checkUnlock(dog, stats)
                    const isActive = dogStats.activePetId === dog.id

                    return (
                      <div key={dog.id}
                        className={`bg-white border-2 rounded-2xl p-5 transition ${unlocked ? 'border-green-300' : 'border-gray-200'} ${!unlocked ? 'opacity-70' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`text-4xl ${!unlocked && 'grayscale opacity-50'}`}>{dog.emoji}</span>
                            <div>
                              <div className="font-black text-gray-900">{dog.name}</div>
                              <div className="text-xs text-gray-400">{dog.breed}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            {unlocked ? (
                              isActive ? (
                                <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                              ) : (
                                <button onClick={async () => {
                                  await fetch('/api/dogs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activePetId: dog.id }) })
                                  setDogStats(prev => prev ? { ...prev, activePetId: dog.id } : prev)
                                }} className="text-xs bg-gray-900 text-white font-bold px-2 py-0.5 rounded-full hover:bg-gray-700 transition">
                                  Equip
                                </button>
                              )
                            ) : (
                              <span className="text-xs text-gray-300 font-semibold capitalize">{dog.rarity}</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Power</p>
                          <p className="text-xs font-semibold text-gray-700">{dog.power.name} — {dog.power.description.slice(0, 60)}…</p>
                        </div>

                        {!unlocked ? (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Earn by</p>
                            <p className="text-xs text-gray-500">{dog.unlock.label}</p>
                            <p className="text-xs text-green-600 font-semibold mt-1">{progress}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-gray-400 italic">{dog.personality}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
