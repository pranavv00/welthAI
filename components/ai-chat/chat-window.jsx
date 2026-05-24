"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { X, Minimize2, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function ChatWindow({ conversationId, initialMessages, onClose, onMinimize }) {
  const scrollRef = useRef(null);

  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading, error } = useChat({
    api: "/api/chat",
    body: {
      conversationId,
    },
    initialMessages: initialMessages || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", content: input });
    setInput("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const quickPrompts = [
    "Where can I cut costs?",
    "Why did I overspend?",
    "What subscriptions can I cancel?",
    "Show my biggest expense",
  ];

  return (
    <div className="flex flex-col h-[550px] w-[350px] sm:w-[400px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden shadow-black/50 ring-1 ring-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-full">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-none">Financial Assistant</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onMinimize}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-background/50" ref={scrollRef}>
        <div className="space-y-4 pr-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 pt-12">
              <div className="bg-primary/10 p-4 rounded-full">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Hi! I'm your AI financial assistant.<br/>Ask me anything about your spending, budgets, or savings.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-muted text-foreground rounded-tl-sm border border-border/50 shadow-sm'
                }`}>
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/80 prose-pre:border">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length > 0 && messages[messages.length - 1].role === 'user'] && (
            <div className="flex justify-start mb-4">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted border">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-muted rounded-tl-sm border border-border/50 shadow-sm flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 text-destructive text-xs px-3 py-2 rounded-xl border border-destructive/20 max-w-[85%] text-center">
                Error: {error.message || "Failed to fetch response"}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="px-4 py-2 bg-background/50 border-t border-border/50 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage({ role: "user", content: prompt })}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <Input
            value={input || ""}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary shadow-inner rounded-xl pr-10 resize-none h-10"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input?.trim()}
            className="shrink-0 rounded-xl h-10 w-10 shadow-sm transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
