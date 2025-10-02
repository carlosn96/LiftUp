'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send } from 'lucide-react';
import { askFinancialAdvisor, FinancialAdvisorInput } from '@/ai/flows/financial-advisor-flow';
import type { Message } from 'genkit';

interface FinancialAdvisorProps {
  onClose: () => void;
}

export function FinancialAdvisor({ onClose }: FinancialAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: [{ text: input }],
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
          role: m.role,
          content: m.content.map(c => ({ text: c.text || '' }))
      }));

      const responseText = await askFinancialAdvisor({ question: input, history });
      const assistantMessage: Message = {
        role: 'model',
        content: [{ text: responseText }],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        content: [{ text: 'Lo siento, algo salió mal. Por favor, inténtalo de nuevo.' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error al contactar al asesor de IA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[60vh] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Asesor Financiero IA</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-0">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content[0].text}</p>
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-xs rounded-lg px-4 py-2 bg-muted">
                      <p className="animate-pulse">...</p>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
