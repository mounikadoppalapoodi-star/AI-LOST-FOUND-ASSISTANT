import React, { useState } from 'react';
import { Match, Item } from '../types';
import { recalculateMatches } from '../api';

interface AIMatchCenterProps {
  matches: Match[];
  onRefresh: () => void;
  onInitiateClaim: (item: Item) => void;
}

export const AIMatchCenter: React.FC<AIMatchCenterProps> = ({
  matches,
  onRefresh,
  onInitiateClaim,
}) => {
  const [recalculating, setRecalculating] = useState(false);

  const handleRunRecalculate = async () => {
    try {
      setRecalculating(true);
      await recalculateMatches();
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <span>⚡ Multimodal Similarity Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Match Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time automated pairings between reported Lost and Found items.
          </p>
        </div>

        <button
          onClick={handleRunRecalculate}
          disabled={recalculating}
          className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all flex items-center space-x-2 self-start md:self-auto disabled:opacity-50"
        >
          <span>{recalculating ? 'Scanning Database...' : '⚡ Re-Run AI Matching Scanner'}</span>
        </button>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <div className="text-4xl">⚡</div>
          <h3 className="text-xl font-bold text-white">No Potential Matches Detected Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Report a lost or found item to trigger automatic similarity scanning.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-6"
            >
              
              {/* Match Score Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-4">
                  
                  {/* Score Ring Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-lg font-extrabold text-emerald-400 leading-none">
                      {match.match_score}%
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Match</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      AI Similarity Pair #{match.id}
                    </span>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">{match.ai_explanation}</p>
                  </div>

                </div>

                <button
                  onClick={() => onInitiateClaim(match.found_item)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Initiate Ownership Claim →
                </button>
              </div>

              {/* Side by Side Item Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Lost item */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white uppercase">
                      Lost Item Report
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID #{match.lost_item.id}</span>
                  </div>

                  <div className="flex space-x-4">
                    <img
                      src={match.lost_item.image_url}
                      alt={match.lost_item.title}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base">{match.lost_item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{match.lost_item.description}</p>
                      <p className="text-xs text-indigo-300 font-medium">📍 {match.lost_item.location}</p>
                    </div>
                  </div>
                </div>

                {/* Found item */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white uppercase">
                      Found Item Match
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID #{match.found_item.id}</span>
                  </div>

                  <div className="flex space-x-4">
                    <img
                      src={match.found_item.image_url}
                      alt={match.found_item.title}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base">{match.found_item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{match.found_item.description}</p>
                      <p className="text-xs text-emerald-300 font-medium">📍 {match.found_item.location}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
