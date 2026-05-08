"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import RoofScroll from "@/components/RoofScroll";
import type { CompanyConfig } from "@/components/RoofScroll";

const configs: Record<string, CompanyConfig> = {
  csroofing: {
    name: "CS Roofing & Gutters",
    city: "Charlotte",
    state: "NC",
    phone: "(704) 555-0123",
    logo: "/logos/cs-roofing.png",
    color: "#e85d04",
  },
  kingdomroofing: {
    name: "Kingdom Roofing",
    city: "Charlotte",
    state: "NC",
    phone: "(704) 555-0456",
    logo: "/logos/kingdom-roofing.png",
    color: "#e85d04",
  },
};

const defaultConfig: CompanyConfig = {
  name: "Your Roofing Company",
  city: "Your City",
  state: "XX",
  phone: "(555) 000-0000",
  logo: "/logos/default-roof-logo.png",
  color: "#e85d04",
};

function HomeInner() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const companyKey = searchParams.get("company") ?? "";
  const companyConfig = configs[companyKey] || defaultConfig;

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if (isLoading) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
    };
  }, [isLoading]);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  
  const images = useMemo(() => {
    const folder = isMobile ? "roofingmobile" : "sequence-1";
    const arr: string[] = [];
    for (let i = 1; i <= 120; i++) {
      const num = i.toString().padStart(3, "0");
      arr.push(`/${folder}/ezgif-frame-${num}.jpg`);
    }
    return arr;
  }, [isMobile]);

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <AnimatePresence>
        {isLoading && (
          <Preloader images={images} onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <RoofScroll images={images} companyConfig={companyConfig} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}