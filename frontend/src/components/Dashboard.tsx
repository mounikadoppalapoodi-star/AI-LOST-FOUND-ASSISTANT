import React from 'react';
import { DashboardStats, Item, Match } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  items: Item[];
  matches: Match[];
  setActiveTab: (tab: string) => void;
  onSelectItem: (item: Item) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  items,
  matches,
  setActiveTab,
  onSelectItem,
}) => {
  const recentLost = items.filter((i) => i.item_type === 'lost').slice(0, 3);
  const recentFound = items.filter((i) => i.item_type === 'found').slice(0, 3);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/40 border border-slate-800 p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Multimodal Match Engine Active</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Reconnecting People with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              What Matters Most
            </span>
          </h1>

          <p className="text-lg text-slate-300 font-light leading-relaxed">
            Report lost or found items in seconds. Our AI algorithm analyzes visual tags, spatial proximity, and semantic descriptions to instantly connect owners with their missing belongings.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('report')}
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Report Lost or Found Item</span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className="px-6 py-3.5 rounded-xl font-semibold text-indigo-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>View AI Matches ({matches.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Lost Items Reported</div>
          <div className="text-3xl font-extrabold text-white mt-2">{stats?.total_lost ?? 0}</div>
          <div className="text-xs text-indigo-400 mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5" /> Live open cases
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Found Items Reported</div>
          <div className="text-3xl font-extrabold text-white mt-2">{stats?.total_found ?? 0}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" /> Awaiting owners
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Matches Detected</div>
          <div className="text-3xl font-extrabold text-purple-300 mt-2">{stats?.active_matches ?? 0}</div>
          <div className="text-xs text-purple-400 mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5" /> High confidence
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Reunion Success Rate</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {stats?.success_rate_percent ?? 88.5}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Verified resolutions</div>
        </div>
      </div>

      {/* High-Match Spotlight Card */}
      {matches.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 bg-indigo-950/20 glow-indigo">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                ⚡
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Top Recommended AI Match</h3>
                <p className="text-xs text-slate-400">Our similarity engine identified a strong potential match</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('matches')}
              className="text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-lg transition-all"
            >
              Open Match Center →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Lost item side */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
              <img
                src={matches[0].lost_item.image_url}
                alt={matches[0].lost_item.title}
                className="w-20 h-20 rounded-lg object-cover border border-slate-700"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  LOST
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{matches[0].lost_item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">📍 {matches[0].lost_item.location}</p>
              </div>
            </div>

            {/* Found item side */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
              <img
                src={matches[0].found_item.image_url}
                alt={matches[0].found_item.title}
                className="w-20 h-20 rounded-lg object-cover border border-slate-700"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  FOUND
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{matches[0].found_item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">📍 {matches[0].found_item.location}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">Match Confidence: {matches[0].match_score}%</span>
            <span className="text-slate-400 line-clamp-1 max-w-md">{matches[0].ai_explanation}</span>
          </div>
        </div>
      )}

      {/* Recent Items Preview Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Recent Reports</h2>
          <button
            onClick={() => setActiveTab('feed')}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Explore All Items ({items.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase shadow-md ${
                      item.item_type === 'lost'
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.item_type}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-slate-200 backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {item.reward_amount && item.reward_amount > 0 ? (
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950 shadow-lg">
                    ${item.reward_amount} Reward
                  </span>
                ) : null}
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>📍 {item.location}</span>
                  <span className="text-indigo-400 font-semibold group-hover:underline">View details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
