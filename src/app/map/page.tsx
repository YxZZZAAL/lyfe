'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const FullMap = dynamic(() => import('@/components/FullMap'), { ssr: false });

export default function MapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  if (status === 'loading') return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  const isSubscribed = user?.subscriptionStatus === 'active';

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-5 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-gray-900">lyfe<span className="text-green-500">.</span></Link>
          <div className="flex gap-2">
            <Link href="/shop" className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:border-green-400 transition">🛍️ Shop</Link>
            <Link href="/dashboard" className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:border-green-400 transition">← Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6">
        <div className="mb-5">
          <h1 className="text-3xl font-black text-gray-900">🌍 World Map</h1>
          <p className="text-gray-500 text-sm mt-1">See Lyfe users planning their day around the world. Click any pin to see their profile & companions.</p>
        </div>

        {!isSubscribed ? (
          <div className="flex-1 bg-white rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-center p-12">
            <div>
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Start your subscription to join the map</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">The world map is available to all Lyfe subscribers. Drop your pin, see who else is planning their lyfe today.</p>
              <Link href="/#pricing" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-green-100">
                See plans →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
            <FullMap />
          </div>
        )}
      </div>
    </main>
  );
}
