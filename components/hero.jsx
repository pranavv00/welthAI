"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-24 pb-16 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
          Manage Your Finances{" "}
          <br className="hidden sm:inline" />
          with Intelligence
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" className="px-8 h-12 text-base" asChild>
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-5xl mt-16">
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg ring-1 ring-border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
