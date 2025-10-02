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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  addTransaction: (db: Firestore, userId: string, transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (db: Firestore, userId: string, transaction: Transaction) => void;
  deleteTransaction: (db: Firestore, userId: string, transactionId: string) => void;
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
      const permissionError = new FirestorePermissionError({
        path: transactionsRef.path,
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
      set({ error: "No se pudieron cargar las transacciones." });
    });

    return unsubscribe;
  },
  addTransaction: (db: Firestore, userId: string, transaction: Omit<Transaction, 'id'>) => {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const data = {
      ...transaction,
      date: Timestamp.fromDate(new Date(transaction.date)),
    };
    addDoc(transactionsRef, data).catch(serverError => {
      const permissionError = new FirestorePermissionError({
        path: transactionsRef.path,
        operation: 'create',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  },
  updateTransaction: (db: Firestore, userId: string, transaction: Transaction) => {
    const transactionRef = doc(db, 'users', userId, 'transactions', transaction.id);
    const { id, ...dataToUpdate } = transaction;
    const data = {
        ...dataToUpdate,
        date: Timestamp.fromDate(new Date(dataToUpdate.date)),
    };
    updateDoc(transactionRef, data).catch(serverError => {
      const permissionError = new FirestorePermissionError({
        path: transactionRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  },
  deleteTransaction: (db: Firestore, userId: string, transactionId: string) => {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    deleteDoc(transactionRef).catch(serverError => {
      const permissionError = new FirestorePermissionError({
        path: transactionRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  },
}));
