import { create } from 'zustand';
import { User, signOut } from 'firebase/auth';
import { Auth } from 'firebase/auth';
import {
  Firestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date | Timestamp;
};

type StoreState = {
  user: User | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: (auth: Auth) => Promise<void>;
  subscribeToTransactions: (db: Firestore, userId: string) => () => void;
  addTransaction: (db: Firestore, userId: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (db: Firestore, userId: string, transaction: Transaction) => Promise<void>;
  deleteTransaction: (db: Firestore, userId: string, transactionId: string) => Promise<void>;
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
  subscribeToTransactions: (db: Firestore, userId: string) => {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as Transaction;
      });
      set({ transactions: transactionsData });
    }, (error) => {
      console.error("Error al obtener transacciones: ", error);
      set({ error: "No se pudieron cargar las transacciones." });
    });

    return unsubscribe;
  },
  addTransaction: async (db: Firestore, userId: string, transaction: Omit<Transaction, 'id'>) => {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    await addDoc(transactionsRef, {
      ...transaction,
      date: Timestamp.fromDate(new Date(transaction.date)),
    });
  },
  updateTransaction: async (db: Firestore, userId: string, transaction: Transaction) => {
    const transactionRef = doc(db, 'users', userId, 'transactions', transaction.id);
    const { id, ...dataToUpdate } = transaction;
    await updateDoc(transactionRef, {
      ...dataToUpdate,
      date: Timestamp.fromDate(new Date(dataToUpdate.date)),
    });
  },
  deleteTransaction: async (db: Firestore, userId: string, transactionId: string) => {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(transactionRef);
  },
}));
