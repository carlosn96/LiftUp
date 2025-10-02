import { create } from 'zustand';
import { User, signOut } from 'firebase/auth';
import { Auth } from 'firebase/auth';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
};

type StoreState = {
  user: User | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: (auth: Auth) => Promise<void>;
};

export const useStore = create<StoreState>((set) => ({
  user: null,
  transactions: [],
  isLoading: true,
  error: null,
  setUser: (user) => {
    set({ user, isLoading: false });
  },
  logout: async (auth: Auth) => {
    await signOut(auth);
    set({ user: null, transactions: [] });
  },
}));
