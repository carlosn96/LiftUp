'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, CornerDownLeft, X } from 'lucide-react';
import { askFinancialAdvisor, FinancialAdvisorInput } from '@/ai/flows/financial-advisor-flow';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function FinancialAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', content: '¡Hola! Soy LiftUp AI. ¿En qué puedo ayudarte hoy con las finanzas de tu negocio?' }
      ]);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }]
      }));
      
      const advisorInput: FinancialAdvisorInput = {
        question: input,
        history: historyForApi
      };

      const response = await askFinancialAdvisor(advisorInput);
      const botMessage: Message = { role: 'model', content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', content: 'Lo siento, algo salió mal. Por favor, intenta de nuevo.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 z-[9998]"
        aria-label="Abrir chat de asesor financiero"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {isOpen && (
         <>
            <div className="fixed inset-0 bg-black/40 z-[9999]" onClick={toggleOpen}></div>
            <Card className="fixed bottom-20 right-4 w-[380px] h-[500px] flex flex-col shadow-2xl z-[9999]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Asesor Financiero AI</CardTitle>
                 <Button variant="ghost" size="icon" onClick={toggleOpen}>
                    <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="flex flex-col gap-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-2 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'model' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-word">{message.content}</p>
                        </div>
                         {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                     {isLoading && (
                        <div className="flex gap-2 justify-start">
                           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <CornerDownLeft className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
        </>
      )}
    </>
  );
}
