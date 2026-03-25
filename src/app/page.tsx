import { getCumulativeRecords } from '@/utils/dataProcessing';
import { Trophy, Target } from 'lucide-react';
import CumulativeTable from '@/components/CumulativeTable';
import { Medal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const records = getCumulativeRecords();
  
  // Hall of fame: managers with championships
  const hallOfFame = records.filter(r => r.championships > 0).sort((a, b) => b.championships - a.championships);

  return (
    <div className="space-y-12">
      <header className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-4">
          <div className="relative group">
            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 group-hover:bg-emerald-500/30 transition-colors duration-500"></div>
            <Image 
              src="/logo.png" 
              alt="SRC FFL Logo" 
              width={600} 
              height={74} 
              className="relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-emerald-500 font-bold tracking-widest uppercase">Class of 2018</div>
          <div className="text-white font-bold tracking-widest uppercase mb-2">Fantasy Football League</div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          A Decade of <span className="text-emerald-400">Dominance & Disappointment</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-400">
          Welcome to the definitive analytics hub for our fantasy football league history (2014-2023).
        </p>
      </header>

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-400 w-8 h-8" /> Hall of Fame
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hallOfFame.map((manager) => (
            <Link key={manager.manager} href={`/managers/${manager.manager}`} className="block group">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50 transition-colors h-full">
                <div className="absolute top-0 right-0 p-4">
                  <Medal className={`w-6 h-6 ${
                    manager.championships >= 3 ? 'text-yellow-400' : 
                    manager.championships === 2 ? 'text-slate-300' : 
                    'text-amber-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{manager.manager}</h3>
                <div className="text-4xl font-black text-emerald-400 mb-2">{manager.championships} <span className="text-sm text-slate-500 font-normal">Rings</span></div>
                <p className="text-slate-400 text-sm">{manager.wins}-{manager.losses} Overall Record</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Target className="text-blue-400 w-8 h-8" /> Decade Leaderboard
        </h2>
        <CumulativeTable initialRecords={records} />
      </section>
    </div>
  );
}
