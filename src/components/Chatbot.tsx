'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MessageCircle, Send, X, Bot, User, CornerDownLeft } from 'lucide-react';
import { chat, ChatInput } from '../ai/flows/chatbot';
import Textarea from 'react-textarea-autosize';

interface ChatbotProps {
  userType: 'patient' | 'pharmacist';
  userName?: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot({ userType, userName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: userType === 'patient' ? `Hi ${userName}! How can I help you today?` : 'Hello, Pharmacist. How can I assist you?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: ChatInput = {
        userType,
        userName,
        query: input,
        history: messages,
      };
      
      const response = await chat(chatInput);
      
      const modelMessage: Message = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-[400px] h-[500px] p-0 mr-4 mb-2 flex flex-col"
      >
        <Card className="flex flex-col h-full border-0">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'model' && (
                  <div className="bg-blue-600 p-2 rounded-full h-fit">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="bg-gray-200 p-2 rounded-full h-fit">
                    <User className="h-5 w-5 text-gray-700" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="bg-blue-600 p-2 rounded-full h-fit">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a question..."
              className="w-full pr-12 resize-none"
              rows={1}
              maxRows={4}
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
