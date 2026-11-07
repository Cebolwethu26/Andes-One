import React, { useState } from 'react';
import { AndesProvider, useAndes } from './context/AndesContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationToast } from './components/NotificationToast';
import { ExchangeModal } from './components/modals/ExchangeModal';
import { SendMoneyModal } from './components/modals/SendMoneyModal';
import { ReceiveMoneyModal } from './components/modals/ReceiveMoneyModal';
import { WithdrawMoneyModal } from './components/modals/WithdrawMoneyModal';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { StatementModal } from './components/modals/StatementModal';

// Views
import { OverviewView } from './components/views/OverviewView';
import { WalletView } from './components/views/WalletView';
import { ExchangeView } from './components/views/ExchangeView';
import { TransfersView } from './components/views/TransfersView';
import { GlobalCardView } from './components/views/GlobalCardView';
import { AiAgentsView } from './components/views/AiAgentsView';
import { SecurityView } from './components/views/SecurityView';
import { TravelView } from './components/views/TravelView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab, isStatementModalOpen, setIsStatementModalOpen } = useAndes();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#080A0F] text-[#F8F6F0] flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'Overview' && <OverviewView />}
          {activeTab === 'My Wallet' && <WalletView />}
          {activeTab === 'Exchange' && <ExchangeView />}
          {activeTab === 'Transfers' && <TransfersView />}
          {activeTab === 'Global Card' && <GlobalCardView />}
          {activeTab === 'AI Agents' && <AiAgentsView />}
          {activeTab === 'Security Centre' && <SecurityView />}
          {activeTab === 'Travel' && <TravelView />}
          {activeTab === 'Settings' && <SettingsView />}
        </main>

        {/* Quiet Luxury Footer */}
        <footer className="border-t border-[#242D40] px-6 py-4 text-xs text-[#A8A69E] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080A0F]">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold tracking-wider text-white">ANDES ONE</span>
            <span aria-hidden="true">·</span>
            <span>A product of ANDES GLOBAL</span>
            <span aria-hidden="true">·</span>
            <span className="italic text-[#D4AF37]/80">One account. Every currency. Everywhere.</span>
          </div>

          <div className="text-[11px] text-neutral-400">
            Financial Technology Prototype · Demonstration Mode Only · No Real Banking Funds
          </div>
        </footer>
      </div>

      {/* Interactive Global Modals */}
      <ExchangeModal />
      <SendMoneyModal />
      <ReceiveMoneyModal />
      <WithdrawMoneyModal />
      <TransactionDetailModal />
      <StatementModal isOpen={isStatementModalOpen} onClose={() => setIsStatementModalOpen(false)} />

      {/* Realtime Feedback Notifications */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AndesProvider>
      <MainContent />
    </AndesProvider>
  );
}
