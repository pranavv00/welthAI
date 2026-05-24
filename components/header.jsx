import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { CurrencyToggle } from "./currency-toggle";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <nav className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo-sm.png"}
            alt="Welth Logo"
            width={200}
            height={60}
            className="h-8 w-auto object-contain dark:invert dark:grayscale dark:contrast-125"
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center gap-6">
          <SignedOut>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/dashboard">
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/transaction/create">
                <PenBox size={16} />
                <span className="hidden md:inline">Add Transaction</span>
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="sm">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <CurrencyToggle />
          </SignedIn>
          <ThemeToggle />
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
