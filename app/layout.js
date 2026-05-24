import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/components/currency-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth — Intelligent Financial Management",
  description:
    "Track, analyze, and optimize your spending with AI-powered insights. Multi-account support, receipt scanning, and budget planning.",
};

export default async function RootLayout({ children }) {
  let userCurrency = "USD";
  try {
    const { userId } = await auth();
    if (userId) {
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
      if (user && user.currency) {
        userCurrency = user.currency;
      }
    }
  } catch (e) {
    // Ignore auth errors during build or when not logged in
  }

  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <CurrencyProvider initialCurrency={userCurrency}>
              <Header />
              <main className="min-h-screen pt-16">{children}</main>
              <Toaster richColors />

              <footer className="border-t border-border bg-background">
                <div className="mx-auto max-w-7xl px-6 py-8">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} Welth. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        Privacy
                      </a>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        Terms
                      </a>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        Support
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </CurrencyProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
