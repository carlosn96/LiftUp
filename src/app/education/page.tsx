import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: '5 Pasos para Formalizar tu Negocio en México',
    description: 'Aprende los requisitos y el proceso para registrar tu emprendimiento y operar de manera formal.',
    category: 'Formalización',
  },
  {
    title: '¿Qué es el Punto de Equilibrio y Cómo Calcularlo?',
    description: 'Una guía sencilla para entender cuántas ventas necesitas para empezar a generar ganancias.',
    category: 'Finanzas Básicas',
  },
  {
    title: 'SAT para Principiantes: Lo que Todo Emprendedor Debe Saber',
    description: 'Desmitifica el sistema tributario mexicano y entiende tus obligaciones fiscales básicas.',
    category: 'Impuestos',
  },
  {
    title: 'Cómo Fijar los Precios de tus Productos o Servicios',
    description: 'Estrategias y métodos para establecer precios competitivos que aseguren tu margen de ganancia.',
    category: 'Estrategia',
  },
  {
    title: 'Marketing Digital para Dummies: Atrae Clientes sin Gastar una Fortuna',
    description: 'Descubre herramientas y tácticas de bajo costo para promocionar tu negocio en línea.',
    category: 'Marketing',
  }
];

export default function EducationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <Link href="/dashboard" passHref>
          <button className="mr-4 p-2 rounded-full hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold font-headline">Centro de Aprendizaje</h1>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-center text-muted-foreground">
            Recursos y guías prácticas para llevar tu emprendimiento al siguiente nivel.
          </p>
          <div className="grid gap-6">
            {articles.map((article, index) => (
              <div key={index} className="rounded-lg border bg-card p-6 shadow-sm">
                <span className="text-sm font-semibold text-primary">{article.category}</span>
                <h2 className="mt-2 text-lg font-bold">{article.title}</h2>
                <p className="mt-2 text-muted-foreground">{article.description}</p>
                <button className="mt-4 text-sm font-semibold text-primary hover:underline">
                  Leer más (próximamente)
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
