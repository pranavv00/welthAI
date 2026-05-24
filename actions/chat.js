"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserFinancialContext() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      accounts: true,
      budgets: true,
    },
  });

  if (!user) return null;

  // Get current month transactions
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: startOfMonth },
    },
    orderBy: { date: "desc" },
  });

  let totalExpenses = 0;
  let totalIncome = 0;
  const categoryTotals = {};

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    if (t.type === "EXPENSE") {
      totalExpenses += amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    } else {
      totalIncome += amount;
    }
  });

  const recurring = await db.transaction.findMany({
    where: {
      userId: user.id,
      isRecurring: true,
    },
    distinct: ["description"],
  });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amt]) => `${cat}: ${amt.toFixed(2)}`);

  return {
    name: user.name || "User",
    currency: user.currency,
    accounts: user.accounts.map((a) => ({
      name: a.name,
      balance: Number(a.balance).toFixed(2),
      type: a.type,
    })),
    budget: user.budgets ? Number(user.budgets.amount).toFixed(2) : "Not set",
    monthlyExpenses: totalExpenses.toFixed(2),
    monthlyIncome: totalIncome.toFixed(2),
    topCategories,
    subscriptions: recurring.map((r) => `${r.description} (${Number(r.amount).toFixed(2)})`),
  };
}

export async function getOrCreateConversation() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Get most recent conversation
  let conversation = await db.conversation.findFirst({
    where: { userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!conversation) {
    conversation = await db.conversation.create({
      data: {
        userId: user.id,
        title: "Financial Assistant",
      },
      include: {
        messages: true,
      },
    });
  }

  return conversation;
}
