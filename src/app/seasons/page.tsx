"use client";

import { useState } from 'react';
import { getLeagueData, SeasonTeam } from '@/utils/dataProcessing';
import { Calendar, Medal, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function SeasonsPage() {
  const data = getLeagueData();
  const years = Object.keys(data.seasons).sort((a, b) => parseInt(b) - parseInt(a));
  const [selectedYear, setSelectedYear] = useState<string>(years[0]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'playoff_finish',
    direction: 'asc'
  });

  const seasonData = data.seasons[selectedYear];

  const parseFinish = (finish: string | undefined): number => {
    if (!finish) return 999;
    const match = finish.match(/\d+/);
    return match ? parseInt(match[0]) : 999;
  };

  const sortedSeason = [...seasonData].sort((a, b) => {
    let aVal: any;
    let bVal: any;
    let direction = sortConfig?.direction || 'asc';

    if (!sortConfig) {
      // Default sorting: Playoff Finish -> Wins -> PF
      const aFinish = parseFinish(a.playoff_finish);
      const bFinish = parseFinish(b.playoff_finish);
      if (aFinish !== bFinish) return aFinish - bFinish;
      const aWins = a.wins ?? 0;
      const bWins = b.wins ?? 0;
      if (aWins !== bWins) return bWins - aWins;
      const aPF = a.pf ?? a.pf_pg ?? 0;
      const bPF = b.pf ?? b.pf_pg ?? 0;
      return bPF - aPF;
    }

    const key = sortConfig.key;
    if (key === 'playoff_finish') {
      aVal = parseFinish(a.playoff_finish);
      bVal = parseFinish(b.playoff_finish);
    } else if (key === 'record') {
      aVal = a.wins ?? 0;
      bVal = b.wins ?? 0;
    } else if (key === 'pf') {
      aVal = a.pf ?? a.pf_pg ?? 0;
      bVal = b.pf ?? b.pf_pg ?? 0;
    } else if (key === 'pa') {
      aVal = a.pa ?? a.pa_pg ?? 0;
      bVal = b.pa ?? b.pa_pg ?? 0;
    } else {
      aVal = (a as any)[key];
      bVal = (b as any)[key];
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return <ArrowUpDown className={`w-3 h-3 ml-1 inline-block ${sortConfig.direction === 'desc' ? 'rotate-180' : ''} text-emerald-400`} />;
    }
    return <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-20 group-hover:opacity-100" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <Calendar className="w-10 h-10 text-emerald-400" />
          Season History
        </h1>
        
        <select 
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSortConfig(null);
          }}
          className="bg-slate-900 border border-slate-700 text-white text-lg rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none cursor-pointer"
        >
          {years.map(year => (
            <option key={year} value={year}>{year} Season</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('playoff_finish')}>
                  Standing {getSortIcon('playoff_finish')}
                </th>
                <th className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('team')}>
                  Team Name {getSortIcon('team')}
                </th>
                <th className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('owner')}>
                  Manager {getSortIcon('owner')}
                </th>
                <th className="px-6 py-4 text-right cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('record')}>
                  Record {getSortIcon('record')}
                </th>
                <th className="px-6 py-4 text-right cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('pf')}>
                  Points For {getSortIcon('pf')}
                </th>
                <th className="px-6 py-4 text-right cursor-pointer group hover:bg-slate-800 transition-colors" onClick={() => handleSort('pa')}>
                  Points Against {getSortIcon('pa')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSeason.map((team, index) => (
                <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    {team.playoff_finish ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        team.playoff_finish.includes('1st') ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 
                        team.playoff_finish.includes('2nd') ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' :
                        team.playoff_finish.includes('3rd') ? 'bg-amber-600/10 text-amber-600 border border-amber-600/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {team.playoff_finish.includes('1st') && <Medal className="w-3 h-3" />}
                        {team.playoff_finish}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white group-hover:text-emerald-400 transition-colors">{team.team}</td>
                  <td className="px-6 py-4">
                    <Link href={`/managers/${team.owner}`} className="hover:underline decoration-emerald-500 underline-offset-4">
                      {team.owner}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {team.wins !== undefined ? `${team.wins}-${team.losses ?? '?'}` : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {team.pf ? team.pf.toLocaleString(undefined, {minimumFractionDigits: 2}) : team.pf_pg ? `${team.pf_pg.toFixed(2)}/g` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400">
                    {team.pa ? team.pa.toLocaleString(undefined, {minimumFractionDigits: 2}) : team.pa_pg ? `${team.pa_pg.toFixed(2)}/g` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
