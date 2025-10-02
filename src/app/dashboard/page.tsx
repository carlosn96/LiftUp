'use client';

import { useStore } from '@/store/use-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';
import type { Transaction } from '@/store/use-store';
import { TransactionForm } from '@/components/transactions/transaction-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, MoreHorizontal, PlusCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FinancialAdvisor } from '@/components/ai/financial-advisor';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, transactions, subscribeToTransactions, deleteTransaction } = useStore();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (user && firestore) {
      const unsubscribe = subscribeToTransactions(firestore, user.uid);
      return () => unsubscribe();
    }
  }, [user, firestore, subscribeToTransactions]);

  const handleLogout = async () => {
    if (!auth) return;
    await logout(auth);
    router.push('/');
  };

  const handleAddNew = () => {
    setSelectedTransaction(null);
    setIsTransactionDialogOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDialogOpen(true);
  };
  
  const handleDelete = async (transactionId: string) => {
    if (!firestore || !user) return;
    await deleteTransaction(firestore, user.uid, transactionId);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-xl font-bold font-headline text-foreground">
          LiftUp
        </h1>
        <div className='flex items-center gap-4'>
            <Link href="/education" passHref>
              <Button variant="link" className="hidden sm:block">Aprende</Button>
            </Link>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </p>
            <Button onClick={handleLogout} variant="outline" size="sm">Cerrar Sesión</Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Ingresos Totales</h3>
                <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Egresos Totales</h3>
                <p className="text-2xl font-bold">${totalExpense.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-sm font-medium text-muted-foreground">Beneficio Neto</h3>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${netProfit.toFixed(2)}</p>
            </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg font-semibold">Transacciones Recientes</h2>
            <Button onClick={handleAddNew} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay transacciones registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? 'Editar' : 'Agregar'} Transacción</DialogTitle>
          </DialogHeader>
          <TransactionForm 
            transaction={selectedTransaction} 
            onSuccess={() => setIsTransactionDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {isChatOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsChatOpen(false)} 
          />
          <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
            <FinancialAdvisor onClose={() => setIsChatOpen(false)} />
          </div>
        </>
      )}

      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-lg"
        size="icon"
      >
        {isChatOpen ? <X /> : <MessageSquare />}
        <span className="sr-only">Abrir Asesor Financiero</span>
      </Button>
    </div>
  );
}
