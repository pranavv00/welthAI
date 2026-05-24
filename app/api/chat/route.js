import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { db } from "@/lib/prisma";
import { getUserFinancialContext } from "@/actions/chat";
import { auth } from "@clerk/nextjs/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, conversationId } = await req.json();

    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Fetch live financial context
    const context = await getUserFinancialContext();
    if (!context) {
      return new Response("Could not load context", { status: 500 });
    }

    const systemPrompt = `You are a premium AI Financial Assistant integrated natively into the user's Expense Manager app.
Your tone is elegant, professional, intelligent, and highly supportive. Avoid generic advice; use the exact data provided.

User Context:
- Name: ${context.name}
- Currency: ${context.currency}
- Accounts: ${context.accounts.map((a) => `${a.name} (${a.type}): ${a.balance}`).join(", ")}
- Monthly Budget: ${context.currency} ${context.budget}
- Current Month Income: ${context.currency} ${context.monthlyIncome}
- Current Month Expenses: ${context.currency} ${context.monthlyExpenses}

Top 3 Spending Categories This Month:
${context.topCategories.length ? context.topCategories.map((c) => `- ${c}`).join("\n") : "None yet"}

Recurring Subscriptions:
${context.subscriptions.length ? context.subscriptions.map((s) => `- ${s}`).join("\n") : "None detected"}

Guidelines:
1. Provide actionable, data-driven advice. Use the exact numbers from the context.
2. Structure your answers with markdown (bolding key numbers, using bullet lists).
3. Do not financially shame the user; focus on optimization and health.
4. If they ask where to cut costs, specifically mention their highest spending category or subscriptions.
5. Keep responses concise as they are displayed in a compact side-panel.`;

    // Save user message to database
    const lastUserMessage = messages[messages.length - 1];
    if (conversationId && lastUserMessage.role === "user") {
      await db.message.create({
        data: {
          conversationId,
          role: "user",
          content: lastUserMessage.content,
        },
      });
    }

    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        // Save AI response to database
        if (conversationId) {
          await db.message.create({
            data: {
              conversationId,
              role: "assistant",
              content: text,
            },
          });
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
