import React, { useState } from 'react';
import { Item } from '../types';
import { createClaim } from '../api';

interface ClaimModalProps {
  item: Item;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose, onSuccess }) => {
  const [proof, setProof] = useState('');
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof) {
      setError('Please provide proof or unique description details.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createClaim({
        item_id: item.id,
        proof_description: proof,
        verification_answer: verificationAnswer || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit claim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Claim Ownership</h3>
            <p className="text-xs text-slate-400">Verify details to claim "{item.title}"</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
            <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400">📍 {item.location}</p>
            </div>
          </div>

          {item.secret_verification_question && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Verification Question:
              </label>
              <p className="text-sm text-white font-medium">{item.secret_verification_question}</p>
              <input
                type="text"
                placeholder="Enter your secret answer..."
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Detailed Proof of Ownership *
            </label>
            <textarea
              rows={4}
              placeholder="Provide serial numbers, receipts, wallpaper details, contents inside the bag, or specific marks only the owner would know..."
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Submitting Claim...' : 'Submit Claim Request →'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
