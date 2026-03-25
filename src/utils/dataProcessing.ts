import fflData from '../data/ffl_data.json';

export interface ManagerRecord {
  manager: string;
  wins: number;
  losses: number;
  pf_vs_avg: number;
  pa_vs_avg: number;
  championships: number;
  playoff_record: string;
}

export interface SeasonTeam {
  team: string;
  owner: string;
  wins?: number;
  losses?: number;
  pf?: number;
  pa?: number;
  pf_pg?: number;
  pa_pg?: number;
  playoff_finish?: string;
}

export interface FFLData {
  league_id: string;
  cumulative_records: ManagerRecord[];
  seasons: {
    [year: string]: SeasonTeam[];
  };
}

export const getLeagueData = (): FFLData => {
  return fflData as FFLData;
};

export const getCumulativeRecords = (): ManagerRecord[] => {
  return getLeagueData().cumulative_records.sort((a, b) => b.wins - a.wins);
};

export const getManagerStats = (managerName: string): ManagerRecord | undefined => {
  return getLeagueData().cumulative_records.find((m) => m.manager === managerName);
};

export const getSeasonData = (year: string): SeasonTeam[] => {
  return getLeagueData().seasons[year] || [];
};

export const getManagerHistory = (managerName: string) => {
  const history: { year: string; team: SeasonTeam }[] = [];
  const seasons = getLeagueData().seasons;
  
  for (const year of Object.keys(seasons).sort((a, b) => parseInt(a) - parseInt(b))) {
    const team = seasons[year].find((t) => t.owner === managerName);
    if (team) {
      history.push({ year, team });
    }
  }
  
  return history;
};

export const getCurrentManagers = (): string[] => {
  const season2023 = getSeasonData('2023');
  return season2023.map(t => t.owner);
};

// Advanced analytics helpers
export const getLuckIndex = () => {
  const currentManagers = getCurrentManagers();
  return getCumulativeRecords()
    .filter(record => currentManagers.includes(record.manager))
    .map((record) => ({
      name: record.manager,
      x: record.pf_vs_avg, // X-axis: Points For vs Avg
      y: record.pa_vs_avg, // Y-axis: Points Against vs Avg
    }));
};

export const getPlayoffClutchness = () => {
  const currentManagers = getCurrentManagers();
  return getCumulativeRecords()
    .filter(record => currentManagers.includes(record.manager))
    .map((record) => {
      const [wins, losses] = record.playoff_record.split('-').map(Number);
      const totalPlayoffGames = wins + losses;
      const playoffWinPct = totalPlayoffGames > 0 ? (wins / totalPlayoffGames) * 100 : 0;
      
      const totalRegularGames = record.wins + record.losses;
      const regularWinPct = totalRegularGames > 0 ? (record.wins / totalRegularGames) * 100 : 0;
      
      return {
        name: record.manager,
        playoffWinPct: parseFloat(playoffWinPct.toFixed(2)),
        regularWinPct: parseFloat(regularWinPct.toFixed(2)),
        differential: parseFloat((playoffWinPct - regularWinPct).toFixed(2))
      };
    }).sort((a, b) => b.differential - a.differential);
};