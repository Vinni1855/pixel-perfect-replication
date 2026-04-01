import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet_placed' | 'bet_won' | 'bet_lost';
  amount: number;
  method?: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: number;
  balance_after: number;
}

interface WalletStore {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number, method: string) => Promise<boolean>;
  withdraw: (amount: number, method: string) => Promise<boolean>;
  placeBet: (amount: number) => void;
  resolveBet: (amount: number, won: boolean) => void;
  getTransactionHistory: () => Transaction[];
  getTotalDeposited: () => number;
  getTotalWithdrawn: () => number;
  getTransactionsByType: (type: Transaction['type']) => Transaction[];
}

export const useWallet = create<WalletStore>()(
  persist(
    (set, get) => ({
      balance: 17100,
      transactions: [
        {
          id: 'initial',
          type: 'deposit',
          amount: 17100,
          method: 'Welcome Bonus',
          status: 'completed',
          description: 'Welcome Bonus',
          timestamp: Date.now() - 24 * 60 * 60 * 1000,
          balance_after: 17100,
        },
      ],

      deposit: async (amount: number, method: string) => {
        return new Promise((resolve) => {
          // Simular processamento de depósito
          setTimeout(() => {
            set((state) => {
              const newBalance = state.balance + amount;
              const transaction: Transaction = {
                id: `dep_${Date.now()}`,
                type: 'deposit',
                amount,
                method,
                status: 'completed',
                description: `Depósito via ${method}`,
                timestamp: Date.now(),
                balance_after: newBalance,
              };
              return {
                balance: newBalance,
                transactions: [transaction, ...state.transactions],
              };
            });
            resolve(true);
          }, 1500);
        });
      },

      withdraw: async (amount: number, method: string) => {
        const state = get();
        if (state.balance < amount) {
          return false;
        }

        return new Promise((resolve) => {
          // Simular processamento de saque
          setTimeout(() => {
            set((state) => {
              const newBalance = state.balance - amount;
              const transaction: Transaction = {
                id: `wth_${Date.now()}`,
                type: 'withdrawal',
                amount,
                method,
                status: 'completed',
                description: `Saque via ${method}`,
                timestamp: Date.now(),
                balance_after: newBalance,
              };
              return {
                balance: newBalance,
                transactions: [transaction, ...state.transactions],
              };
            });
            resolve(true);
          }, 1500);
        });
      },

      placeBet: (amount: number) => {
        set((state) => {
          const newBalance = state.balance - amount;
          const transaction: Transaction = {
            id: `bet_${Date.now()}`,
            type: 'bet_placed',
            amount,
            status: 'completed',
            description: 'Aposta colocada',
            timestamp: Date.now(),
            balance_after: newBalance,
          };
          return {
            balance: newBalance,
            transactions: [transaction, ...state.transactions],
          };
        });
      },

      resolveBet: (amount: number, won: boolean) => {
        set((state) => {
          const resultAmount = won ? amount : -amount;
          const newBalance = state.balance + resultAmount;
          const transaction: Transaction = {
            id: `bet_result_${Date.now()}`,
            type: won ? 'bet_won' : 'bet_lost',
            amount: Math.abs(resultAmount),
            status: 'completed',
            description: won ? 'Aposta vencida' : 'Aposta perdida',
            timestamp: Date.now(),
            balance_after: newBalance,
          };
          return {
            balance: newBalance,
            transactions: [transaction, ...state.transactions],
          };
        });
      },

      getTransactionHistory: () => get().transactions,

      getTotalDeposited: () => {
        return get().transactions
          .filter((t) => t.type === 'deposit' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalWithdrawn: () => {
        return get().transactions
          .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTransactionsByType: (type: Transaction['type']) => {
        return get().transactions.filter((t) => t.type === type);
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);
