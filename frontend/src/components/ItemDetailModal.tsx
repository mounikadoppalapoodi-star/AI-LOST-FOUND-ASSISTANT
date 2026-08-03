import React from 'react';
import { Item } from '../types';

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
  onInitiateClaim: (item: Item) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onInitiateClaim }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                item.item_type === 'lost' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {item.item_type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
              {item.category}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 text-lg">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="rounded-2xl overflow-hidden border border-slate-800 h-64 bg-slate-900">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <p className="text-xs text-indigo-400 font-medium mt-1">📍 Reported Location: {item.location}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Description
              </span>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {item.description}
              </p>
            </div>

            {item.tags && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  AI Extracted Visual Tags
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-200">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.reward_amount && item.reward_amount > 0 ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                💰 Offered Reward: ${item.reward_amount} USD
              </div>
            ) : null}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Status: <span className="uppercase text-white font-bold">{item.status}</span></span>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInitiateClaim(item);
              }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20"
            >
              Claim Ownership / Contact Founder →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
