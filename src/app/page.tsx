import Link from 'next/link'

const DOGS_PREVIEW = [
  { name: 'Rex', breed: 'German Shepherd', emoji: '🐕', rarity: 'Starter', condition: 'Complete 5 tasks', power: 'Focus Timer — 25-min Pomodoro blocks', rarityColor: 'text-gray-500' },
  { name: 'Luna', breed: 'Border Collie', emoji: '🐩', rarity: 'Common', condition: '7-day streak', power: 'Weekly Digest — personal performance review', rarityColor: 'text-stone-500' },
  { name: 'Storm', breed: 'Husky', emoji: '🐺', rarity: 'Rare', condition: '14-day streak', power: 'Ice Mode — one brutal honest challenge daily', rarityColor: 'text-blue-600' },
  { name: 'Doge', breed: 'Shiba Inu', emoji: '🦊', rarity: 'Epic', condition: '100 tasks + 21-day streak', power: 'World Leaderboard — compete globally', rarityColor: 'text-violet-600' },
  { name: 'Phantom', breed: 'Doberman', emoji: '🐾', rarity: 'Epic', condition: '30-day streak + 15 amazing days', power: 'AI Deep Analysis — monthly life report', rarityColor: 'text-violet-600' },
  { name: 'Shadow', breed: 'Arctic Wolf', emoji: '❄️', rarity: 'Legendary', condition: '200 tasks · 60-day streak · 30 amazing days', power: 'Alpha Status — silver map pin + Hall of Wolves', rarityColor: 'text-amber-600' },
]

export default function Home() {
  return (
    <div className="bg-[#f8f7f4] text-[#111] min-h-screen">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#f8f7f4]/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">lyfe<span className="text-green-500">.</span></span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#how" className="hover:text-black transition">How it works</a>
            <a href="#dogs" className="hover:text-black transition">Companions</a>
            <Link href="/map" className="hover:text-black transition">World Map</Link>
            <a href="#pricing" className="hover:text-black transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-black transition px-3 py-1.5">Log in</Link>
            <Link href="/register" className="text-sm font-bold bg-[#0e1a12] text-white px-5 py-2 rounded-full hover:bg-[#1a2e1d] transition">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            The planner that gets better the more you use it
          </div>

          <h1 className="text-7xl sm:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            Stop<br />
            <span className="text-green-600">drifting.</span><br />
            Start living.
          </h1>

          <p className="text-xl text-gray-500 max-w-xl leading-relaxed mb-10">
            Lyfe learns your rhythm, rewards your consistency with companions that unlock real features, and connects you to people doing the same — worldwide. No other planner does this.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="bg-[#0e1a12] hover:bg-[#1a2e1d] text-white font-bold px-8 py-4 rounded-2xl transition text-base shadow-xl shadow-black/10">
              Start free — 7 days →
            </Link>
            <Link href="/map" className="bg-white border border-gray-200 hover:border-gray-400 text-gray-700 font-semibold px-8 py-4 rounded-2xl transition text-base">
              🌍 See who's live
            </Link>
          </div>
        </div>

        {/* Stat bar */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-black/5 pt-12">
          {[
            { n: '12,400+', l: 'Tasks completed this week' },
            { n: '860+',    l: 'Companions unlocked' },
            { n: '18',      l: 'Countries on the map' },
            { n: '4.9★',   l: 'Average user rating' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-3xl font-black text-[#0e1a12] mb-1">{s.n}</div>
              <div className="text-sm text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO STRIP — the planner in action */}
      <section className="bg-[#0e1a12] py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#4ade80] text-xs font-bold uppercase tracking-widest mb-4">The planner</p>
          <h2 className="text-4xl font-black text-white mb-12 max-w-lg">Add your tasks. Let AI fill the gaps. Check off. Repeat.</h2>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Mock planner */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Thursday</p>
                  <p className="text-xl font-black text-gray-900">Your day</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">4 of 6 done</div>
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                    <div className="w-[67%] h-1.5 bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { t:'06:30', label:'Cold shower + journal', done:true,  color:'bg-blue-50 border-blue-100' },
                  { t:'08:00', label:'Write 500 words',       done:true,  color:'bg-amber-50 border-amber-100' },
                  { t:'10:00', label:'Deep work block',       done:true,  color:'bg-green-50 border-green-100' },
                  { t:'12:30', label:'Lunch walk',            done:true,  color:'bg-emerald-50 border-emerald-100' },
                  { t:'14:00', label:'Client calls',          done:false, color:'bg-purple-50 border-purple-100' },
                  { t:'17:30', label:'Gym — leg day',         done:false, color:'bg-red-50 border-red-100' },
                ].map(item => (
                  <div key={item.t} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${item.color}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${item.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'}`}>
                      {item.done ? '✓' : ''}
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 w-9 flex-shrink-0">{item.t}</span>
                    <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input readOnly placeholder="+ Add a task…" className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400" />
                <button className="bg-[#0e1a12] text-white text-sm font-bold px-4 rounded-xl">Add</button>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-6 lg:pt-4">
              {[
                { emoji:'⌚', h:'Manual control — full, like Google Calendar', p:'Add tasks with exact times. Pick colours. Reorder. Check off. Your planner does exactly what you tell it, nothing more.' },
                { emoji:'🧠', h:'AI that reads your mood, not just your words', p:'Tell us how you\'re feeling. Claude builds a plan that matches your energy — lighter on rough days, ambitious when you\'re flying.' },
                { emoji:'🔁', h:'Habits that automatically refill every day', p:'Mark any task as a habit. Unlock this with Biscuit the Golden Retriever (5 amazing mood days). It shows up every morning, no setup needed.' },
              ].map(f => (
                <div key={f.h} className="flex gap-4">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{f.emoji}</span>
                  <div>
                    <h3 className="font-black text-white text-base mb-1">{f.h}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{f.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOGS SECTION */}
      <section id="dogs" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4">Companions</p>
            <h2 className="text-5xl font-black leading-tight mb-4">
              Earn dogs.<br />Unlock superpowers.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              These aren't cosmetic pets. Every companion unlocks a real feature — habit tracking, AI analysis, global leaderboards. The harder the dog is to earn, the more powerful it is. No purchases. No shortcuts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOGS_PREVIEW.map(dog => (
              <div key={dog.name} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-400 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{dog.emoji}</div>
                  <span className={`text-xs font-bold ${dog.rarityColor}`}>{dog.rarity}</span>
                </div>
                <div className="font-black text-gray-900 text-lg mb-0.5">{dog.name}</div>
                <div className="text-xs text-gray-400 mb-3">{dog.breed}</div>

                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Unlocks</p>
                  <p className="text-xs font-semibold text-gray-700">{dog.power}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Earn by:</span>
                  <span className="text-[11px] text-gray-600">{dog.condition}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#0e1a12] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white font-black text-lg">Shadow is out there waiting.</p>
              <p className="text-white/40 text-sm mt-1">200 tasks. 60-day streak. 30 amazing days. The rarest companion in Lyfe.</p>
            </div>
            <Link href="/register" className="bg-[#4ade80] hover:bg-[#22c55e] text-[#0e1a12] font-black px-6 py-3 rounded-xl transition text-sm">
              Start your journey →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4">Process</p>
            <h2 className="text-5xl font-black">Three minutes to a better day</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: '01',
                title: 'Check in',
                body: 'Every morning, tap your mood. 5 seconds. This one input changes everything — your AI plan, your suggestions, your daily challenge.',
                detail: 'The streak starts here. Miss a day and it resets.',
              },
              {
                n: '02',
                title: 'Build your day',
                body: 'Add your own tasks with times, then hit "Suggest more." AI fills gaps based on your energy. You stay in control.',
                detail: 'The more you use it, the smarter the suggestions get.',
              },
              {
                n: '03',
                title: 'Live it. Earn it.',
                body: 'Check off tasks. Watch your stats grow. Hit thresholds and your next companion unlocks — bringing a new feature with it.',
                detail: 'Every completion makes Shadow slightly more reachable.',
              },
            ].map(s => (
              <div key={s.n} className="relative">
                <div className="text-8xl font-black text-gray-100 absolute -top-4 -left-2 select-none">{s.n}</div>
                <div className="relative pt-8">
                  <h3 className="text-xl font-black mb-3">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">{s.body}</p>
                  <p className="text-xs text-gray-400 italic">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD MAP */}
      <section className="py-24 px-6 bg-[#f8f7f4]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4">World Map</p>
            <h2 className="text-5xl font-black leading-tight mb-6">
              You're not<br />doing this alone.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Every Lyfe subscriber can drop a pin on the live world map. See who else is planning their day right now. Click a pin to see their companion, their rarity, their streak. The more you earn, the more impressive your card.
            </p>
            <Link href="/map" className="inline-block bg-[#0e1a12] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1a2e1d] transition">
              Open world map →
            </Link>
          </div>

          <div className="bg-[#0e1a12] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm font-semibold">4 users live now</span>
              </div>
              <span className="text-white/30 text-xs">Updates every 30s</span>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { name:'Alex', city:'London, UK',       emoji:'🦊', rarity:'Epic',      streak:47, tasks:203 },
                { name:'Mia',  city:'Tokyo, Japan',     emoji:'❄️', rarity:'Legendary', streak:61, tasks:211 },
                { name:'Sam',  city:'New York, USA',    emoji:'🐩', rarity:'Common',    streak:9,  tasks:38  },
                { name:'Yuki', city:'Berlin, Germany',  emoji:'🐺', rarity:'Rare',      streak:16, tasks:89  },
              ].map(u => (
                <div key={u.name} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">{u.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">{u.name}</div>
                    <div className="text-white/40 text-xs truncate">📍 {u.city}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-white/60">{u.streak}d streak</div>
                    <div className="text-[10px] text-white/30">{u.tasks} tasks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Why not just use Notion?</h2>
          <p className="text-gray-400 text-center mb-12">Or Todoist. Or Reclaim. Or Motion. We've used them all. Here's the difference.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-500 font-semibold w-1/3">Feature</th>
                  <th className="py-3 px-4 font-black text-[#0e1a12] w-1/4 text-center">
                    lyfe<span className="text-green-500">.</span>
                  </th>
                  <th className="py-3 px-4 text-gray-400 font-semibold w-1/4 text-center">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Mood-matched AI planning',      true,  false],
                  ['Manual task scheduling',         true,  true ],
                  ['Companion achievement system',   true,  false],
                  ['Features you actually unlock',   true,  false],
                  ['Live world map of users',        true,  false],
                  ['Habit tracking built-in',        true,  'paid'],
                  ['Weekly AI performance review',   true,  false],
                  ['Works offline on your phone',    true,  'partial'],
                ].map(([f, us, them]) => (
                  <tr key={f as string}>
                    <td className="py-3 pr-4 text-gray-600">{f as string}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {them === true ? <span className="text-gray-300 text-xs">✓</span>
                       : them === 'paid' ? <span className="text-amber-500 text-xs font-medium">paid add-on</span>
                       : them === 'partial' ? <span className="text-amber-500 text-xs font-medium">partial</span>
                       : <span className="text-red-300 text-xs">✗</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#f8f7f4]">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4">Pricing</p>
          <h2 className="text-5xl font-black mb-4">One price. Everything in.</h2>
          <p className="text-gray-400 mb-12">Companions are earned, not bought. No add-ons, no upsells, no bullshit.</p>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-left shadow-xl shadow-black/5">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl font-black text-[#0e1a12]">$17.99</span>
              <span className="text-gray-400 mb-1">/month</span>
            </div>
            <p className="text-green-600 text-sm font-semibold mb-8">First 7 days completely free</p>

            <ul className="space-y-3 mb-8">
              {[
                'Manual task planner — full time control',
                'AI mood-matched day plans (Claude)',
                '💡 Idea generator for blank moments',
                '🌍 World map — drop your pin',
                '📈 30-day mood history',
                '🔥 Streak tracking with achievements',
                '🐾 All 8 companions earnable (no purchases)',
                '📱 Install on phone, works offline',
                '6 dashboard colour themes',
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register" className="block text-center bg-[#0e1a12] hover:bg-[#1a2e1d] text-white font-bold py-4 rounded-xl transition text-base shadow-lg shadow-black/10">
              Start 7-day free trial →
            </Link>
            <p className="text-xs text-gray-300 text-center mt-4">Cancel any time. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 text-center bg-[#0e1a12]">
        <p className="text-[#4ade80] text-xs font-bold uppercase tracking-widest mb-6">The only question left</p>
        <h2 className="text-6xl sm:text-7xl font-black text-white leading-none mb-6 tracking-tight">
          What are you<br />waiting for?
        </h2>
        <p className="text-white/40 mb-10 text-lg max-w-sm mx-auto">Shadow won't unlock itself. Your 60-day streak starts today.</p>
        <Link href="/register" className="inline-block bg-[#4ade80] hover:bg-[#22c55e] text-[#0e1a12] font-black px-12 py-5 rounded-2xl transition text-lg shadow-2xl">
          Start free →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0e1a12] border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-black text-xl">lyfe<span className="text-green-400">.</span></span>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white/60 transition">Privacy</a>
            <a href="#" className="hover:text-white/60 transition">Terms</a>
            <Link href="/map" className="hover:text-white/60 transition">World Map</Link>
            <Link href="/login" className="hover:text-white/60 transition">Log in</Link>
          </div>
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Lyfe</p>
        </div>
      </footer>
    </div>
  )
}
