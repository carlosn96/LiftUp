# LiftUp - Tu Asesor Financiero Simplificado

LiftUp es una aplicación web diseñada para ayudar a microemprendedores, nuevos empresarios y estudiantes en Latinoamérica a gestionar sus finanzas de una manera simple e intuitiva. La aplicación permite registrar ingresos y egresos, visualizar un resumen financiero y obtener consejos de un asesor de IA.

## 🚀 Características Principales

- **Gestión de Transacciones:** Registra, edita y elimina tus ingresos y egresos fácilmente.
- **Dashboard Financiero:** Visualiza un resumen de tus finanzas con ingresos, egresos y beneficio neto.
- **Asesor de IA (LiftUp AI):** Un chatbot inteligente que ofrece consejos financieros y de negocio en un lenguaje sencillo y amigable.
- **Centro de Aprendizaje:** Una sección con artículos y guías sobre temas de interés para emprendedores.
- **Autenticación Segura:** Sistema de registro e inicio de sesión basado en Firebase Authentication.

## ✨ Tecnología Utilizada

Este proyecto está construido con un stack de tecnologías moderno y robusto:

- **Framework:** [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/)
- **Backend y Base de Datos:** [Firebase](https://firebase.google.com/) (Authentication y Firestore)
- **Funcionalidad IA:** [Google AI - Genkit](https://firebase.google.com/docs/genkit)
- **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🛠️ Cómo Empezar

Para ejecutar este proyecto en tu entorno de desarrollo local, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd <NOMBRE-DEL-PROYECTO>
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Firebase. Puedes encontrarlas en la configuración de tu proyecto en la consola de Firebase.

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:..
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

¡Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación en acción!
