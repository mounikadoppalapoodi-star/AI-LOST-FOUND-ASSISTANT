import React, { useState } from 'react';
import { createItem } from '../api';
import { Item } from '../types';

interface ItemReportWizardProps {
  onSuccess: (newItem: Item) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Electronics',
  'Pets',
  'Jewelry',
  'Bags',
  'Documents',
  'Keys',
  'Wallet',
  'Other',
];

export const ItemReportWizard: React.FC<ItemReportWizardProps> = ({ onSuccess, onCancel }) => {
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [rewardAmount, setRewardAmount] = useState<number>(0);
  const [secretQuestion, setSecretQuestion] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto tag suggestion based on description & title
  const handleAutoTag = () => {
    const combined = `${title} ${description}`.toLowerCase();
    const words = Array.from(new Set(combined.match(/\w+/g) || []))
      .filter((w) => w.length > 3 && !['item', 'with', 'from', 'near', 'that', 'this', 'have'].includes(w));
    setTags(words.slice(0, 6).join(', '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError('Please fill in Title, Description, and Location.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const created = await createItem({
        title,
        description,
        category,
        item_type: itemType,
        location,
        image_url: imageUrl || undefined,
        tags: tags || undefined,
        reward_amount: Number(rewardAmount) || 0,
        secret_verification_question: secretQuestion || undefined,
      });

      onSuccess(created);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create item report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Report an Item</h2>
            <p className="text-sm text-slate-400">Fill in the details so our AI matching engine can pair your report.</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Lost vs Found Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setItemType('lost')}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 border ${
                  itemType === 'lost'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>🔍 I Lost Something</span>
              </button>

              <button
                type="button"
                onClick={() => setItemType('found')}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 border ${
                  itemType === 'found'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>🎁 I Found Something</span>
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Item Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Silver MacBook Pro 14''"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleAutoTag}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Location (City, Landmark, or Building) *
            </label>
            <input
              type="text"
              placeholder="e.g. Central Library Floor 3, North Reading Desk"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              placeholder="Include color, scratches, stickers, condition, and any unique distinguishing features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleAutoTag}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Image URL & AI Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Photo Image URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Provide a direct photo URL or leave empty for auto placeholder.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Visual Tags
                </label>
                <button
                  type="button"
                  onClick={handleAutoTag}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  ⚡ Auto-Extract Tags
                </button>
              </div>
              <input
                type="text"
                placeholder="silver, apple, macbook, sticker"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Reward & Verification Question */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
            {itemType === 'lost' && (
              <div>
                <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  Reward Amount ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className={itemType === 'lost' ? '' : 'col-span-2'}>
              <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
                Secret Ownership Verification Question (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. What picture is set as the lock screen?"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Claimants will need to answer this to prove ownership.</p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? 'Publishing & Scanning AI Matches...' : 'Submit & Trigger AI Scanner →'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
