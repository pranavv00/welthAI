"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUserCurrency(currency) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await db.user.update({
      where: { clerkUserId: userId },
      data: { currency },
    });

    revalidatePath("/dashboard");
    revalidatePath("/account");
    revalidatePath("/transactions");
    
    return { success: true, currency: updatedUser.currency };
  } catch (error) {
    console.error("Error updating currency:", error);
    return { success: false, error: error.message };
  }
}
