import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ItemFeed } from './components/ItemFeed';
import { ItemReportWizard } from './components/ItemReportWizard';
import { AIMatchCenter } from './components/AIMatchCenter';
import { ClaimModal } from './components/ClaimModal';
import { ClaimsAdmin } from './components/ClaimsAdmin';
import { ItemDetailModal } from './components/ItemDetailModal';
import { getItems, getMatches, getClaims, getAdminStats } from './api';
import { Item, Match, Claim, DashboardStats } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [items, setItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [fetchedItems, fetchedMatches, fetchedClaims, fetchedStats] = await Promise.all([
        getItems(),
        getMatches(),
        getClaims(),
        getAdminStats(),
      ]);
      setItems(fetchedItems);
      setMatches(fetchedMatches);
      setClaims(fetchedClaims);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Failed to connect to backend:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchCount={matches.length}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-center space-x-2">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            items={items}
            matches={matches}
            setActiveTab={setActiveTab}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        )}

        {activeTab === 'feed' && (
          <ItemFeed
            items={items}
            onSelectItem={(item) => setSelectedItem(item)}
            onOpenReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'report' && (
          <ItemReportWizard
            onSuccess={(newItem) => {
              loadData();
              setActiveTab('feed');
              showNotification(`Report published! AI scanner ran against existing items.`);
            }}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'matches' && (
          <AIMatchCenter
            matches={matches}
            onRefresh={loadData}
            onInitiateClaim={(item) => setClaimingItem(item)}
          />
        )}

        {activeTab === 'claims' && (
          <ClaimsAdmin
            claims={claims}
            onRefresh={loadData}
          />
        )}

      </main>

      {/* Item Details Dialog */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onInitiateClaim={(item) => setClaimingItem(item)}
        />
      )}

      {/* Ownership Claim Modal */}
      {claimingItem && (
        <ClaimModal
          item={claimingItem}
          onClose={() => setClaimingItem(null)}
          onSuccess={() => {
            setClaimingItem(null);
            loadData();
            showNotification('Claim request submitted successfully! Pending verification.');
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 glass-panel py-8 mt-12 text-center text-xs text-slate-500 space-y-2">
        <div>FindIt AI — Multimodal Lost and Found Intelligence System</div>
        <div>FastAPI + SQLite + Sentence Transformer & Token Matching Algorithm</div>
      </footer>

    </div>
  );
};

export default App;
