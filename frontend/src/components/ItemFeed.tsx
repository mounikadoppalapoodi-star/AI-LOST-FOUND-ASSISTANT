import React, { useState } from 'react';
import { Item } from '../types';

interface ItemFeedProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenReport: () => void;
}

const CATEGORIES = ['All', 'Electronics', 'Pets', 'Jewelry', 'Bags', 'Documents', 'Keys', 'Wallet', 'Other'];

export const ItemFeed: React.FC<ItemFeedProps> = ({ items, onSelectItem, onOpenReport }) => {
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.item_type !== filterType) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchTags = item.tags?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Header Bar */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Lost & Found Directory</h1>
            <p className="text-sm text-slate-400">Search and filter active reports across all categories.</p>
          </div>

          <button
            onClick={onOpenReport}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all self-start md:self-auto"
          >
            + Report New Item
          </button>
        </div>

        {/* Search Input & Type Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          
          <div className="relative flex-1 w-full">
            <svg
              className="w-5 h-5 absolute left-4 top-3.5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by keywords, tags, or location (e.g. macbook, library, dog)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Lost / Found Toggle */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === 'lost' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lost Only ({items.filter(i => i.item_type === 'lost').length})
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === 'found' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Found Only ({items.filter(i => i.item_type === 'found').length})
            </button>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="text-xl font-bold text-white">No Matching Items Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords or switching categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase shadow-md ${
                      item.item_type === 'lost' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
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

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                </div>

                {item.tags && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.split(',').slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[180px]">📍 {item.location}</span>
                  <span className="text-indigo-400 font-semibold group-hover:underline">View details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
