'use client';

import { useStore } from '@/store/use-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { useEffect, useMemo, useState } from 'react';
import { Bell, TrendingUp, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Line,
  LineChart,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { FinancialAdvisor } from '@/components/ai/financial-advisor';

export default function DashboardPage() {
  const { user, transactions, subscribeToTransactions } = useStore();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  useEffect(() => {
    if (user && firestore) {
      const unsubscribe = subscribeToTransactions(firestore, user.uid);
      return () => unsubscribe();
    }
  }, [user, firestore, subscribeToTransactions]);


  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const monthlySales = useMemo(() => {
    const sales: { [key: string]: number } = {};
    transactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        const month = format(new Date(t.date as any), 'MMM', { locale: es });
        sales[month] = (sales[month] || 0) + t.amount;
      });

    const monthOrder = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    
    return monthOrder.map(month => ({
        month,
        total: sales[month] || 0,
    })).filter(d => d.total > 0);
  }, [transactions]);
  
  const expenseBreakdown = useMemo(() => {
    const categories: { [key: string]: number } = {
        'Costos Fijos': 0,
        'Costos Variables': 0,
        'Marketing': 0,
        'Otros': 0,
    };
    // This is placeholder logic. In a real app, transactions would have categories.
    transactions.filter(t => t.type === 'expense').forEach((t, i) => {
        const categoryKeys = Object.keys(categories);
        const category = categoryKeys[i % categoryKeys.length];
        categories[category] += t.amount;
    });

    return Object.keys(categories).map(name => ({
        name,
        value: categories[name],
        fill: `var(--color-${name.toLowerCase().replace(' ', '')})`,
    })).filter(item => item.value > 0);
  }, [transactions]);

  const breakEvenData = useMemo(() => {
    const data = [];
    const maxUnits = 100;
    const pricePerUnit = totalIncome / (transactions.filter(t => t.type === 'income').length || 1);
    const fixedCosts = totalExpense * 0.6; // 60% assumed fixed
    const variableCostPerUnit = (totalExpense * 0.4) / (transactions.filter(t => t.type === 'income').length || 1) ;

    for (let units = 0; units <= maxUnits; units += 10) {
        data.push({
            units,
            ingresos: units * pricePerUnit,
            costos: fixedCosts + (units * variableCostPerUnit),
        });
    }
    return data;
  }, [totalIncome, totalExpense, transactions]);


  const chartConfigSales = {
    total: {
      label: 'Ventas',
      color: 'hsl(var(--primary))',
    },
  };

  const chartConfigExpenses = {
    costosfijos: { label: 'Costos Fijos', color: 'hsl(var(--chart-1))' },
    costosvariables: { label: 'Costos Variables', color: 'hsl(var(--chart-2))' },
    marketing: { label: 'Marketing', color: 'hsl(var(--chart-3))' },
    otros: { label: 'Otros', color: 'hsl(var(--chart-4))' },
  };
  
  const chartConfigBreakEven = {
    ingresos: { label: 'Ingresos', color: 'hsl(var(--primary))' },
    costos: { label: 'Costos', color: 'hsl(var(--chart-1))' },
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
         <h1 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
          LiftUp
        </h1>
        <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
         <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Finanzas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ventas</CardDescription>
              <CardTitle className="text-3xl md:text-4xl">${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Egresos</CardDescription>
              <CardTitle className="text-3xl md:text-4xl">${totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Utilidad</CardDescription>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-3xl md:text-4xl">${netProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</CardTitle>
                    <TrendingUp className={`h-6 w-6 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}/>
                </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4 min-w-0">
                <CardHeader>
                    <CardTitle>Ventas</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfigSales} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={monthlySales}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="col-span-full lg:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 min-w-0">
                <Card className='min-w-0'>
                    <CardHeader>
                        <CardTitle>Gastos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[200px]">
                        <ChartContainer config={chartConfigExpenses} className="mx-auto aspect-square h-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={30} strokeWidth={5} />
                                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className='min-w-0'>
                    <CardHeader>
                        <CardTitle>Punto de equilibrio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfigBreakEven} className="h-[200px] w-full">
                            <LineChart accessibilityLayer data={breakEvenData} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="units" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value/1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Line dataKey="costos" type="monotone" stroke="var(--color-costos)" strokeWidth={2} dot={false} />
                                <Line dataKey="ingresos" type="monotone" stroke="var(--color-ingresos)" strokeWidth={2} dot={false} />
                                <ChartLegend content={<ChartLegendContent />} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Añadir Transacción</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <TransactionForm onSuccess={() => setIsSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Button
        onClick={() => setIsSheetOpen(true)}
        className="fixed bottom-4 right-20 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Añadir Transacción</span>
      </Button>

      <FinancialAdvisor />
    </div>
  );
}
