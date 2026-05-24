import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />



      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Everything you need to manage your finances
            </h2>
            <p className="mt-3 text-muted-foreground">
              Powerful tools designed to give you complete control and
              visibility over your financial life.
            </p>
          </div>
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {featuresData.map((feature, index) => (
              <div key={index} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-16">
            How It Works
          </h2>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-12">
              {howItWorksData.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-none">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-foreground">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-16">
            What Our Users Say
          </h2>
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-6"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/50 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <div className="mt-8">
            <Button size="lg" className="px-8" asChild>
              <Link href="/dashboard">
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
