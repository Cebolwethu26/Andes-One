export type CurrencyCode = 'ZAR' | 'GBP' | 'USD' | 'EUR' | 'KES' | 'NGN' | 'AED';

export interface Wallet {
  currency: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  balance: number;
  country: string;
  accountNumber: string;
  sortOrRouting: string;
  ibanOrSwift: string;
  change24h: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  counterparty: string;
  category: 'Travel' | 'Dining' | 'FX Hedging' | 'Business' | 'Subscription' | 'Transfer' | 'Deposit' | 'Withdrawal';
  type: 'debit' | 'credit' | 'exchange';
  amount: number;
  currency: CurrencyCode;
  status: 'Completed' | 'Processing' | 'Scheduled';
  reference: string;
  fee: number;
  method: string;
  notes?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  currency: CurrencyCode;
  avatarColor: string;
  country: string;
  type: 'Individual' | 'Corporate';
  lastUsed?: string;
}

export interface ExchangeRate {
  pair: string;
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export interface AIAgent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  enabled: boolean;
  status: 'monitoring' | 'optimized' | 'idle' | 'triggered';
  lastAction: string;
  savingsGenerated: string;
  parameters: {
    label: string;
    value: string;
  }[];
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
}

export type ActiveTab =
  | 'Overview'
  | 'My Wallet'
  | 'Exchange'
  | 'Transfers'
  | 'Global Card'
  | 'AI Agents'
  | 'Security Centre'
  | 'Travel'
  | 'Settings';
