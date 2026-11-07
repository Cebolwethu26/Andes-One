import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrencyCode,
  Wallet,
  Transaction,
  Beneficiary,
  ExchangeRate,
  AIAgent,
  ToastNotification,
  ActiveTab
} from '../types';

interface AndesContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  baseCurrency: CurrencyCode;
  setBaseCurrency: (currency: CurrencyCode) => void;
  hideBalances: boolean;
  setHideBalances: (hide: boolean) => void;
  wallets: Wallet[];
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  exchangeRates: Record<string, number>;
  liveRatesList: ExchangeRate[];
  aiAgents: AIAgent[];
  cardFrozen: boolean;
  toggleCardFrozen: () => void;
  cardSpendingLimit: number;
  setCardSpendingLimit: (limit: number) => void;
  notifications: ToastNotification[];
  dismissNotification: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  
  // Financial Actions
  executeExchange: (from: CurrencyCode, to: CurrencyCode, amountFrom: number) => { success: boolean; rate: number; amountTo: number; reference: string };
  executeTransfer: (data: {
    recipientName: string;
    accountNumber: string;
    bankName: string;
    currency: CurrencyCode;
    amount: number;
    reference: string;
    sourceCurrency: CurrencyCode;
  }) => { success: boolean; reference: string; convertedAmount: number };
  simulateDeposit: (currency: CurrencyCode, amount: number, senderName: string) => void;
  
  // Helper calculations
  convertCurrency: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
  getTotalPortfolioBalance: (targetCurrency?: CurrencyCode) => number;
  formatMoney: (amount: number, currency: CurrencyCode, forceShow?: boolean) => string;
  
  // Modals shortcuts state
  isExchangeModalOpen: boolean;
  setIsExchangeModalOpen: (open: boolean) => void;
  isSendModalOpen: boolean;
  setIsSendModalOpen: (open: boolean) => void;
  isReceiveModalOpen: boolean;
  setIsReceiveModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  isStatementModalOpen: boolean;
  setIsStatementModalOpen: (open: boolean) => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  executeWithdrawal: (data: {
    currency: CurrencyCode;
    amount: number;
    destination: string;
    account: string;
    method: string;
  }) => { success: boolean; reference: string };
  
  // Security
  is2FAEnabled: boolean;
  setIs2FAEnabled: (enabled: boolean) => void;
  isBiometricsEnabled: boolean;
  setIsBiometricsEnabled: (enabled: boolean) => void;
  isGeofencingEnabled: boolean;
  setIsGeofencingEnabled: (enabled: boolean) => void;
  isEmergencyLocked: boolean;
  toggleEmergencyLock: () => void;
  
  // AI Agents
  toggleAgent: (id: string) => void;
  triggerAgentScan: () => void;
  isScanningAgents: boolean;

  // Reset
  resetDemonstrationData: () => void;
}

// Initial demonstration rates relative to 1 ZAR
// 1 USD = 18.25 ZAR
// 1 GBP = 23.40 ZAR
// 1 EUR = 19.85 ZAR
// 1 KES = 0.141 ZAR (1 ZAR = 7.092 KES)
// 1 NGN = 0.011 ZAR (1 ZAR = 90.90 NGN, 1 USD = 1,659 NGN)
// 1 AED = 4.97 ZAR (1 USD = 3.6725 AED)
const RATES_TO_ZAR: Record<CurrencyCode, number> = {
  ZAR: 1,
  USD: 18.25,
  GBP: 23.40,
  EUR: 19.85,
  KES: 0.141,
  NGN: 0.011,
  AED: 4.97,
};

const INITIAL_WALLETS: Wallet[] = [
  {
    currency: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    balance: 48500.00,
    country: 'South Africa',
    accountNumber: '9082 1442 88',
    sortOrRouting: '250655 (Andes Clearing)',
    ibanOrSwift: 'ANDESZAJJXXX',
    change24h: 0.42,
  },
  {
    currency: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    flag: '🇬🇧',
    balance: 1150.00,
    country: 'United Kingdom',
    accountNumber: '40918823',
    sortOrRouting: '04-00-04 (UK Clear)',
    ibanOrSwift: 'GB44 ANDE 0400 0440 9188 23',
    change24h: 0.15,
  },
  {
    currency: 'USD',
    name: 'United States Dollar',
    symbol: '$',
    flag: '🇺🇸',
    balance: 1800.00,
    country: 'United States',
    accountNumber: '8829 4410 931',
    sortOrRouting: '021000021 (ACH / Fedwire)',
    ibanOrSwift: 'US89 ANDE 0210 0002 1882 94',
    change24h: -0.28,
  },
  {
    currency: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    balance: 520.00,
    country: 'European Union',
    accountNumber: '9921 5501 32',
    sortOrRouting: 'SEPA Instant Clearing',
    ibanOrSwift: 'FR76 ANDE 3000 6000 0199 2155 0132 8',
    change24h: 0.08,
  },
  {
    currency: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    balance: 48709.22,
    country: 'Kenya',
    accountNumber: '0110 9482 711',
    sortOrRouting: 'Paybill: 440900 · Acc: ANDES-0084',
    ibanOrSwift: 'KES22 ANDE 0110 9482 7110 0',
    change24h: 1.12,
  },
  {
    currency: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    balance: 650000.00,
    country: 'Nigeria',
    accountNumber: '0129 4482 10',
    sortOrRouting: '035 (NIP Instant Clearing)',
    ibanOrSwift: 'ANDENGJJXXX',
    change24h: 0.85,
  },
  {
    currency: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    balance: 3200.00,
    country: 'United Arab Emirates',
    accountNumber: '7710 4920 182',
    sortOrRouting: 'DIFC UAEFTS Instant',
    ibanOrSwift: 'AE07 0330 0000 7710 4920 182',
    change24h: -0.05,
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-98421',
    date: 'Today, 14:28',
    description: 'The Silo Hotel & Rooftop',
    counterparty: 'The Silo Cape Town V&A',
    category: 'Dining',
    type: 'debit',
    amount: 3250.00,
    currency: 'ZAR',
    status: 'Completed',
    reference: 'ANDES-VAA-4891',
    fee: 0.00,
    method: 'Andes Obsidian Metal Card (NFC)',
    notes: 'Client celebration dinner · Table 12',
  },
  {
    id: 'TX-98420',
    date: 'Yesterday, 18:10',
    description: 'Currency Conversion (USD to ZAR)',
    counterparty: 'Andes Institutional FX Desk',
    category: 'FX Hedging',
    type: 'exchange',
    amount: 500.00,
    currency: 'USD',
    status: 'Completed',
    reference: 'FX-SWAP-9021-USDZAR',
    fee: 0.00,
    method: 'Instant Liquidity Swap',
    notes: 'Converted $500.00 to R9,125.00 at 18.25 rate lock',
  },
  {
    id: 'TX-98419',
    date: '04 Nov 2026',
    description: 'Heathrow Terminal 5 First Lounge Duty Free',
    counterparty: 'Harrods Aviation London',
    category: 'Travel',
    type: 'debit',
    amount: 285.50,
    currency: 'GBP',
    status: 'Completed',
    reference: 'POS-LHR-9941',
    fee: 0.00,
    method: 'Andes Global Card (Contactless)',
    notes: 'Travel allowance zero FX markup',
  },
  {
    id: 'TX-98418',
    date: '02 Nov 2026',
    description: 'Silicon Savannah Tech Advisory Payout',
    counterparty: 'Nairobi Ventures Ltd',
    category: 'Business',
    type: 'credit',
    amount: 35000.00,
    currency: 'KES',
    status: 'Completed',
    reference: 'MPESA-B2B-88310',
    fee: 0.00,
    method: 'M-Pesa Daraja Realtime Settlement',
    notes: 'Q4 Fintech advisory milestone payout',
  },
  {
    id: 'TX-98417',
    date: '30 Oct 2026',
    description: 'Anthropic & AWS Enterprise Compute',
    counterparty: 'Amazon Web Services Dublin',
    category: 'Subscription',
    type: 'debit',
    amount: 142.80,
    currency: 'EUR',
    status: 'Completed',
    reference: 'SEPA-DD-8812',
    fee: 0.00,
    method: 'Virtual Andes Card #9102',
    notes: 'Cloud architecture infrastructure recurring charge',
  },
  {
    id: 'TX-98416',
    date: '28 Oct 2026',
    description: 'Inward Wire: Zurich Private Wealth',
    counterparty: 'Banque Heritage SA Geneva',
    category: 'Deposit',
    type: 'credit',
    amount: 1200.00,
    currency: 'USD',
    status: 'Completed',
    reference: 'SWIFT-GPI-77291',
    fee: 0.00,
    method: 'SWIFT GPI Priority Wire',
    notes: 'Quarterly global portfolio distribution',
  },
  {
    id: 'TX-98415',
    date: '24 Oct 2026',
    description: 'Transfer to Marcus Vance',
    counterparty: 'Marcus Vance (JPMorgan)',
    category: 'Transfer',
    type: 'debit',
    amount: 450.00,
    currency: 'USD',
    status: 'Completed',
    reference: 'ACH-ANDES-22941',
    fee: 0.00,
    method: 'Andes Instant Wire Network',
    notes: 'Co-investment syndicate contribution',
  },
];

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-1',
    name: 'Claire Delacroix',
    bankName: 'Barclays Private Bank UK',
    accountNumber: '••• 8841',
    currency: 'GBP',
    avatarColor: 'from-[#D4AF37] to-[#8C6D23]',
    country: 'United Kingdom',
    type: 'Individual',
    lastUsed: '2 days ago',
  },
  {
    id: 'ben-2',
    name: 'Nairobi Ventures Ltd',
    bankName: 'Equity Bank Kenya · M-Pesa',
    accountNumber: '••• 9482',
    currency: 'KES',
    avatarColor: 'from-[#22c55e] to-[#15803d]',
    country: 'Kenya',
    type: 'Corporate',
    lastUsed: 'Nov 02',
  },
  {
    id: 'ben-3',
    name: 'Marcus Vance',
    bankName: 'JPMorgan Chase NY',
    accountNumber: '••• 1092',
    currency: 'USD',
    avatarColor: 'from-[#3b82f6] to-[#1d4ed8]',
    country: 'United States',
    type: 'Individual',
    lastUsed: 'Oct 24',
  },
  {
    id: 'ben-4',
    name: 'Sarah Mthembu',
    bankName: 'First National Bank SA',
    accountNumber: '••• 6201',
    currency: 'ZAR',
    avatarColor: 'from-[#f59e0b] to-[#b45309]',
    country: 'South Africa',
    type: 'Individual',
    lastUsed: 'Oct 19',
  },
  {
    id: 'ben-5',
    name: 'Atelier Saint-Honoré',
    bankName: 'BNP Paribas Paris',
    accountNumber: '••• 3319',
    currency: 'EUR',
    avatarColor: 'from-[#a855f7] to-[#7e22ce]',
    country: 'France',
    type: 'Corporate',
    lastUsed: 'Oct 12',
  },
];

const INITIAL_RATES_LIST: ExchangeRate[] = [
  { pair: 'USD/ZAR', from: 'USD', to: 'ZAR', rate: 18.25, change24h: -0.32, high24h: 18.36, low24h: 18.18 },
  { pair: 'GBP/ZAR', from: 'GBP', to: 'ZAR', rate: 23.40, change24h: +0.24, high24h: 23.55, low24h: 23.28 },
  { pair: 'EUR/ZAR', from: 'EUR', to: 'ZAR', rate: 19.85, change24h: +0.12, high24h: 19.98, low24h: 19.79 },
  { pair: 'USD/KES', from: 'USD', to: 'KES', rate: 129.43, change24h: -0.15, high24h: 130.10, low24h: 129.20 },
  { pair: 'USD/NGN', from: 'USD', to: 'NGN', rate: 1659.00, change24h: +0.45, high24h: 1668.00, low24h: 1652.00 },
  { pair: 'USD/AED', from: 'USD', to: 'AED', rate: 3.6725, change24h: 0.00, high24h: 3.6730, low24h: 3.6720 },
  { pair: 'AED/ZAR', from: 'AED', to: 'ZAR', rate: 4.97, change24h: -0.12, high24h: 5.01, low24h: 4.94 },
  { pair: 'GBP/USD', from: 'GBP', to: 'USD', rate: 1.282, change24h: +0.41, high24h: 1.286, low24h: 1.278 },
  { pair: 'EUR/USD', from: 'EUR', to: 'USD', rate: 1.087, change24h: +0.09, high24h: 1.091, low24h: 1.084 },
  { pair: 'ZAR/KES', from: 'ZAR', to: 'KES', rate: 7.092, change24h: +0.65, high24h: 7.15, low24h: 7.02 },
  { pair: 'ZAR/NGN', from: 'ZAR', to: 'NGN', rate: 90.90, change24h: +0.55, high24h: 91.50, low24h: 90.10 },
];

const INITIAL_AI_AGENTS: AIAgent[] = [
  {
    id: 'agent-fx-hedge',
    name: 'Andes Volatility Guard',
    tagline: 'Autonomous FX hedging & stop-loss protection',
    description: 'Monitors real-time interbank spreads on USD/ZAR and GBP/ZAR. Automatically reserves favorable rate locks when volatility exceeds standard deviation bounds.',
    enabled: true,
    status: 'monitoring',
    lastAction: 'Locked $500 rate at 18.25 (+0.4% above median) 18h ago',
    savingsGenerated: 'R3,450 saved this quarter',
    parameters: [
      { label: 'Target Pair', value: 'USD / ZAR' },
      { label: 'Threshold Alert', value: '18.40 ZAR' },
      { label: 'Liquidity Window', value: 'Instant Interbank' },
    ],
  },
  {
    id: 'agent-travel-optimizer',
    name: 'Global Spend Concierge',
    tagline: 'Multi-currency auto-routing & zero FX fee auditor',
    description: 'Automatically routes card charges to whichever wallet eliminates double currency conversions, saving up to 3.5% over traditional credit card issuer fees.',
    enabled: true,
    status: 'optimized',
    lastAction: 'Routed £285.50 directly from GBP wallet in London Heathrow',
    savingsGenerated: 'R1,280 saved on fees',
    parameters: [
      { label: 'Routing Strategy', value: 'Zero-Markup Native' },
      { label: 'Fallback Wallet', value: 'ZAR Master' },
      { label: 'Lounge Protocol', value: 'Priority VIP Active' },
    ],
  },
  {
    id: 'agent-treasury-sweep',
    name: 'Automated Treasury Sweeper',
    tagline: 'Overnight yield maximiser & idle balance balancer',
    description: 'Continuously sweeps idle operational cash across your 5 global wallets into short-term private liquidity vaults yielding institutional interest overnight.',
    enabled: true,
    status: 'idle',
    lastAction: 'Swept R25,000 into Andes 30-Day Liquidity Vault @ 8.25% p.a.',
    savingsGenerated: 'R892 yield accrued',
    parameters: [
      { label: 'Sweep Frequency', value: 'Daily 23:00 GMT+2' },
      { label: 'Minimum Buffer', value: 'R15,000.00' },
      { label: 'Yield Tier', value: 'Tier 1 Prime' },
    ],
  },
  {
    id: 'agent-fraud-shield',
    name: 'Quantum Anomaly Shield',
    tagline: 'Behavioral intelligence & geolocation biometric verification',
    description: 'Calculates physical impossibility travel velocity between card taps and authorizes high-value transfers through encrypted device-bound tokens.',
    enabled: true,
    status: 'monitoring',
    lastAction: 'Verified physical presence at The Silo Cape Town via GPS token',
    savingsGenerated: '0 anomalies detected',
    parameters: [
      { label: 'Risk Sensitivity', value: 'Ultra-High Strict' },
      { label: 'Max Single Tap', value: 'R10,000.00' },
      { label: 'Fencing', value: 'UK, SA, Kenya, France, USA' },
    ],
  },
];

const AndesContext = createContext<AndesContextType | undefined>(undefined);

export const AndesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Overview');
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('ZAR');
  const [hideBalances, setHideBalances] = useState<boolean>(false);
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [liveRatesList] = useState<ExchangeRate[]>(INITIAL_RATES_LIST);
  const [aiAgents, setAiAgents] = useState<AIAgent[]>(INITIAL_AI_AGENTS);
  
  // Card states
  const [cardFrozen, setCardFrozen] = useState<boolean>(false);
  const [cardSpendingLimit, setCardSpendingLimit] = useState<number>(75000);
  
  // Security
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState<boolean>(true);
  const [isGeofencingEnabled, setIsGeofencingEnabled] = useState<boolean>(true);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState<boolean>(false);
  
  // Modals
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState<boolean>(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState<boolean>(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Notifications
  const [notifications, setNotifications] = useState<ToastNotification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to ANDES ONE',
      message: 'Your institutional multi-currency account is active. Prototype demonstration mode is engaged.',
      type: 'info',
      timestamp: 'Just now',
    },
  ]);
  
  const [isScanningAgents, setIsScanningAgents] = useState<boolean>(false);

  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setNotifications((prev) => [
      { id, title, message, type, timestamp: 'Just now' },
      ...prev.slice(0, 5),
    ]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleCardFrozen = () => {
    setCardFrozen((prev) => {
      const next = !prev;
      addNotification(
        next ? 'Global Card Frozen' : 'Global Card Unfrozen',
        next
          ? 'Your physical and digital Andes cards have been frozen immediately.'
          : 'Your Andes card is active for global spending.',
        next ? 'warning' : 'success'
      );
      return next;
    });
  };

  const toggleEmergencyLock = () => {
    setIsEmergencyLocked((prev) => {
      const next = !prev;
      if (next) {
        setCardFrozen(true);
        addNotification(
          'Emergency Lockdown Activated',
          'All outbound transfers, card debits, and API keys are suspended.',
          'warning'
        );
      } else {
        addNotification(
          'Account Unlocked',
          'Standard access credentials restored.',
          'success'
        );
      }
      return next;
    });
  };

  // Convert amounts between currencies using RATES_TO_ZAR
  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    if (from === to) return amount;
    // from -> ZAR
    const zarValue = amount * RATES_TO_ZAR[from];
    // ZAR -> to
    const targetValue = zarValue / RATES_TO_ZAR[to];
    return targetValue;
  };

  // Calculate total portfolio balance in any desired currency
  const getTotalPortfolioBalance = (targetCurrency: CurrencyCode = baseCurrency): number => {
    const totalZar = wallets.reduce((acc, wallet) => {
      return acc + (wallet.balance * RATES_TO_ZAR[wallet.currency]);
    }, 0);
    return totalZar / RATES_TO_ZAR[targetCurrency];
  };

  const formatMoney = (amount: number, currency: CurrencyCode = baseCurrency, forceShow = false): string => {
    if (hideBalances && !forceShow) {
      return '••••••••';
    }
    const symbolMap: Record<CurrencyCode, string> = {
      ZAR: 'R ',
      GBP: '£',
      USD: '$',
      EUR: '€',
      KES: 'KSh ',
      NGN: '₦ ',
      AED: 'AED ',
    };
    const formattedNum = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbolMap[currency]}${formattedNum}`;
  };

  // Execute interactive Currency Exchange
  const executeExchange = (
    from: CurrencyCode,
    to: CurrencyCode,
    amountFrom: number
  ) => {
    const fromWallet = wallets.find((w) => w.currency === from);
    if (!fromWallet || fromWallet.balance < amountFrom) {
      addNotification('Exchange Failed', `Insufficient ${from} balance for this transaction.`, 'warning');
      return { success: false, rate: 0, amountTo: 0, reference: '' };
    }

    const rate = convertCurrency(1, from, to);
    const amountTo = amountFrom * rate;
    const reference = `FX-${Date.now().toString().slice(-6)}-${from}${to}`;

    // Update balances
    setWallets((prev) =>
      prev.map((w) => {
        if (w.currency === from) {
          return { ...w, balance: Number((w.balance - amountFrom).toFixed(2)) };
        }
        if (w.currency === to) {
          return { ...w, balance: Number((w.balance + amountTo).toFixed(2)) };
        }
        return w;
      })
    );

    // Add transaction record
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      date: 'Just now',
      description: `Currency Exchange (${from} to ${to})`,
      counterparty: 'Andes Institutional FX Desk',
      category: 'FX Hedging',
      type: 'exchange',
      amount: amountFrom,
      currency: from,
      status: 'Completed',
      reference,
      fee: 0.00,
      method: 'Instant Liquidity Swap',
      notes: `Exchanged ${formatMoney(amountFrom, from, true)} for ${formatMoney(amountTo, to, true)} at live rate 1 ${from} = ${rate.toFixed(4)} ${to}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification(
      'Currency Converted Successfully',
      `Exchanged ${formatMoney(amountFrom, from, true)} to ${formatMoney(amountTo, to, true)} at rate ${rate.toFixed(4)}.`,
      'success'
    );

    return { success: true, rate, amountTo, reference };
  };

  // Execute interactive Send Transfer
  const executeTransfer = (data: {
    recipientName: string;
    accountNumber: string;
    bankName: string;
    currency: CurrencyCode;
    amount: number;
    reference: string;
    sourceCurrency: CurrencyCode;
  }) => {
    const sourceWallet = wallets.find((w) => w.currency === data.sourceCurrency);
    
    // Amount to deduct from source wallet
    const amountToDeduct = data.currency === data.sourceCurrency
      ? data.amount
      : convertCurrency(data.amount, data.currency, data.sourceCurrency);

    if (!sourceWallet || sourceWallet.balance < amountToDeduct) {
      addNotification('Transfer Failed', `Insufficient ${data.sourceCurrency} funds in your wallet.`, 'warning');
      return { success: false, reference: '', convertedAmount: 0 };
    }

    const ref = data.reference || `TRF-${Date.now().toString().slice(-6)}`;

    // Deduct balance
    setWallets((prev) =>
      prev.map((w) => {
        if (w.currency === data.sourceCurrency) {
          return { ...w, balance: Number((w.balance - amountToDeduct).toFixed(2)) };
        }
        return w;
      })
    );

    // Add transaction
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      date: 'Just now',
      description: `Transfer to ${data.recipientName}`,
      counterparty: `${data.recipientName} (${data.bankName})`,
      category: 'Transfer',
      type: 'debit',
      amount: data.amount,
      currency: data.currency,
      status: 'Completed',
      reference: ref,
      fee: 0.00,
      method: 'Andes Global Instant Clearing',
      notes: `Sent to account ${data.accountNumber} at ${data.bankName}. Deducted ${formatMoney(amountToDeduct, data.sourceCurrency, true)}.`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification(
      'Transfer Sent Successfully',
      `${formatMoney(data.amount, data.currency, true)} dispatched to ${data.recipientName}. Receipt available in records.`,
      'success'
    );

    return { success: true, reference: ref, convertedAmount: amountToDeduct };
  };

  // Simulate incoming deposit into any currency wallet
  const simulateDeposit = (currency: CurrencyCode, amount: number, senderName: string) => {
    const ref = `DEP-${Date.now().toString().slice(-6)}`;

    setWallets((prev) =>
      prev.map((w) => {
        if (w.currency === currency) {
          return { ...w, balance: Number((w.balance + amount).toFixed(2)) };
        }
        return w;
      })
    );

    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      date: 'Just now',
      description: `Deposit from ${senderName}`,
      counterparty: senderName,
      category: 'Deposit',
      type: 'credit',
      amount,
      currency,
      status: 'Completed',
      reference: ref,
      fee: 0.00,
      method: 'Inbound Clearing Settlement',
      notes: `Received into ${currency} multi-currency account.`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification(
      'Deposit Credited',
      `Received ${formatMoney(amount, currency, true)} from ${senderName} into your ${currency} wallet.`,
      'success'
    );
  };

  // Simulate withdrawal from any currency wallet
  const executeWithdrawal = (data: {
    currency: CurrencyCode;
    amount: number;
    destination: string;
    account: string;
    method: string;
  }) => {
    const wallet = wallets.find((w) => w.currency === data.currency);
    if (!wallet || wallet.balance < data.amount) {
      addNotification('Withdrawal Failed', `Insufficient ${data.currency} balance.`, 'warning');
      return { success: false, reference: '' };
    }

    const reference = `WTH-${Date.now().toString().slice(-6)}-${data.currency}`;

    setWallets((prev) =>
      prev.map((w) => {
        if (w.currency === data.currency) {
          return { ...w, balance: Number((w.balance - data.amount).toFixed(2)) };
        }
        return w;
      })
    );

    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      date: 'Just now',
      description: `Withdrawal to ${data.destination}`,
      counterparty: `${data.destination} (${data.account})`,
      category: 'Withdrawal',
      type: 'debit',
      amount: data.amount,
      currency: data.currency,
      status: 'Completed',
      reference,
      fee: 0.00,
      method: data.method,
      notes: `Withdrawn to ${data.destination} via ${data.method}. Settled from ${data.currency} multi-currency vault.`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification(
      'Withdrawal Processed',
      `Withdrew ${formatMoney(data.amount, data.currency, true)} to ${data.destination}. Ref: ${reference}`,
      'success'
    );

    return { success: true, reference };
  };

  const toggleAgent = (id: string) => {
    setAiAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const next = !agent.enabled;
          addNotification(
            `${agent.name} ${next ? 'Activated' : 'Paused'}`,
            next ? 'Autonomous rule execution enabled.' : 'Agent put on standby.',
            next ? 'success' : 'info'
          );
          return { ...agent, enabled: next, status: next ? 'monitoring' : 'idle' };
        }
        return agent;
      })
    );
  };

  const triggerAgentScan = () => {
    setIsScanningAgents(true);
    addNotification('AI Agent Scan Initiated', 'Auditing interbank liquidity, multi-currency balances, and fee anomalies...', 'info');

    setTimeout(() => {
      setIsScanningAgents(false);
      addNotification(
        'AI Optimization Scan Complete',
        '3 active agents verified. All FX spreads nominal; estimated 1.8% savings preserved across transactions.',
        'success'
      );
    }, 1800);
  };

  const resetDemonstrationData = () => {
    setWallets(INITIAL_WALLETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setAiAgents(INITIAL_AI_AGENTS);
    setBaseCurrency('ZAR');
    setCardFrozen(false);
    setIsEmergencyLocked(false);
    addNotification('Demo Data Reset', 'All demonstration balances and history restored to original baseline (Total Portfolio: R125,450.00).', 'info');
  };

  return (
    <AndesContext.Provider
      value={{
        activeTab,
        setActiveTab,
        baseCurrency,
        setBaseCurrency,
        hideBalances,
        setHideBalances,
        wallets,
        transactions,
        beneficiaries,
        exchangeRates: RATES_TO_ZAR,
        liveRatesList,
        aiAgents,
        cardFrozen,
        toggleCardFrozen,
        cardSpendingLimit,
        setCardSpendingLimit,
        notifications,
        dismissNotification,
        addNotification,
        executeExchange,
        executeTransfer,
        simulateDeposit,
        executeWithdrawal,
        convertCurrency,
        getTotalPortfolioBalance,
        formatMoney,
        isExchangeModalOpen,
        setIsExchangeModalOpen,
        isSendModalOpen,
        setIsSendModalOpen,
        isReceiveModalOpen,
        setIsReceiveModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isStatementModalOpen,
        setIsStatementModalOpen,
        selectedTransaction,
        setSelectedTransaction,
        is2FAEnabled,
        setIs2FAEnabled,
        isBiometricsEnabled,
        setIsBiometricsEnabled,
        isGeofencingEnabled,
        setIsGeofencingEnabled,
        isEmergencyLocked,
        toggleEmergencyLock,
        toggleAgent,
        triggerAgentScan,
        isScanningAgents,
        resetDemonstrationData,
      }}
    >
      {children}
    </AndesContext.Provider>
  );
};

export const useAndes = () => {
  const context = useContext(AndesContext);
  if (!context) {
    throw new Error('useAndes must be used within an AndesProvider');
  }
  return context;
};
