import React from 'react';
import { Claim } from '../types';
import { verifyClaim } from '../api';

interface ClaimsAdminProps {
  claims: Claim[];
  onRefresh: () => void;
}

export const ClaimsAdmin: React.FC<ClaimsAdminProps> = ({ claims, onRefresh }) => {
  const handleAction = async (claimId: number, approve: bool) => {
    try {
      await verifyClaim(claimId, approve);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      <div className="glass-panel rounded-3xl p-8 border border-slate-800">
        <h1 className="text-3xl font-extrabold text-white">Ownership Claims & Verification Desk</h1>
        <p className="text-sm text-slate-400 mt-1">Review proof of ownership submissions and approve item reunions.</p>
      </div>

      {claims.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <div className="text-4xl">📄</div>
          <h3 className="text-xl font-bold text-white">No Submitted Claims Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            When users initiate claims on found items, they will appear here for verification.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase">Claim #{claim.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      claim.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : claim.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                {claim.item && (
                  <h4 className="text-base font-bold text-white">
                    Item: {claim.item.title} (ID #{claim.item.id})
                  </h4>
                )}

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-400 font-semibold">Proof Description:</div>
                  <div className="text-slate-200">{claim.proof_description}</div>
                  {claim.verification_answer && (
                    <div className="pt-2 text-indigo-300">
                      <span className="font-semibold">Verification Answer:</span> {claim.verification_answer}
                    </div>
                  )}
                </div>
              </div>

              {claim.status === 'pending' ? (
                <div className="flex items-center space-x-3 self-end md:self-center">
                  <button
                    onClick={() => handleAction(claim.id, false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleAction(claim.id, true)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
                  >
                    Approve & Mark Reunited ✓
                  </button>
                </div>
              ) : (
                <div className="text-xs font-semibold text-slate-400">
                  Decision finalized: <span className="uppercase text-white">{claim.status}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
