import { AiChatWidget } from "@/components/ai-chat/ai-chat-widget";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
      <AiChatWidget />
    </>
  );
};

export default MainLayout;
