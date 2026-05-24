"use client";

import { useState, useEffect } from "react";
import { Bot, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWindow } from "./chat-window";
import { getOrCreateConversation } from "@/actions/chat";

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && !conversation && !isLoading) {
      setIsLoading(true);
      getOrCreateConversation()
        .then((conv) => {
          setConversation(conv);
        })
        .catch((err) => console.error("Failed to load chat:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, conversation, isLoading]);

  const handleToggle = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Expanded Chat Window */}
      {isOpen && !isMinimized && (
        <div className="animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
          {conversation ? (
            <ChatWindow 
              conversationId={conversation.id} 
              initialMessages={conversation.messages.map(m => ({
                id: m.id,
                role: m.role,
                content: m.content
              }))}
              onClose={handleClose}
              onMinimize={() => setIsMinimized(true)}
            />
          ) : (
            <div className="flex flex-col h-[550px] w-[350px] sm:w-[400px] bg-card border border-border rounded-2xl shadow-2xl items-center justify-center p-6 shadow-black/50 ring-1 ring-white/10">
              <Bot className="h-8 w-8 animate-pulse text-primary mb-4" />
              <p className="text-sm text-muted-foreground animate-pulse">Initializing Financial Assistant...</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      {(!isOpen || isMinimized) && (
        <Button
          onClick={handleToggle}
          className="h-14 w-14 rounded-full shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-300 relative group overflow-hidden bg-primary"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="h-6 w-6 text-primary-foreground relative z-10" />
          
          {/* Notification Dot */}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-background"></span>
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
