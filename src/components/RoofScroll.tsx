"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";

export interface CompanyConfig {
  name: string;
  city: string;
  state: string;
  phone: string;
  logo: string;
  color: string;
}

interface RoofScrollProps {
  images: string[];
  companyConfig: CompanyConfig;
}

// ── Price Matrix ──────────────────────────────────────────────
const PRICES: Record<string, number[]> = {
  asphalt: [5000, 8000, 8000, 13000, 13000, 19000, 19000, 28000],
  metal:   [9000, 14000, 14000, 22000, 22000, 34000, 34000, 50000],
  tile:    [10000, 16000, 16000, 26000, 26000, 40000, 40000, 60000],
  flat:    [4000, 7000, 7000, 11000, 11000, 17000, 17000, 25000],
};

const SIZE_INDEX: Record<string, number> = {
  small: 0, medium: 2, large: 4, xl: 6,
};

function getEstimate(material: string, size: string, stories: string) {
  const base = PRICES[material] ?? PRICES.asphalt;
  const idx = SIZE_INDEX[size] ?? 0;
  let low = base[idx];
  let high = base[idx + 1];
  if (stories === "two") { low = Math.round(low * 1.15); high = Math.round(high * 1.15); }
  if (stories === "three") { low = Math.round(low * 1.3); high = Math.round(high * 1.3); }
  return { low, high };
}

function fmt(n: number) {
  return "$" + n.toLocaleString();
}

// ── Quote Modal ───────────────────────────────────────────────
function QuoteModal({ open, onClose, config }: { open: boolean; onClose: () => void; config: CompanyConfig }) {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState("");
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [stories, setStories] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [slot, setSlot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const estimate = material && size && stories ? getEstimate(material, size, stories) : null;

  const steps = [
    {
      label: "Project Type",
      options: [
        { value: "replacement", label: "Full Replacement", icon: "🏠" },
        { value: "repair", label: "Roof Repair", icon: "🔧" },
        { value: "new", label: "New Construction", icon: "🏗️" },
      ],
      value: projectType,
      set: setProjectType,
    },
    {
      label: "Roof Material",
      options: [
        { value: "asphalt", label: "Asphalt Shingles", sub: "Most popular · Best value" },
        { value: "metal", label: "Metal Roofing", sub: "Longest lasting · Premium" },
        { value: "tile", label: "Tile Roofing", sub: "Great curb appeal" },
        { value: "flat", label: "Flat / TPO", sub: "Commercial · Low-slope" },
      ],
      value: material,
      set: setMaterial,
    },
    {
      label: "Home Size",
      options: [
        { value: "small", label: "Under 1,500 sqft", sub: "Small / cozy" },
        { value: "medium", label: "1,500 – 2,500 sqft", sub: "Average home" },
        { value: "large", label: "2,500 – 3,500 sqft", sub: "Large home" },
        { value: "xl", label: "3,500+ sqft", sub: "Estate" },
      ],
      value: size,
      set: setSize,
    },
    {
      label: "Stories",
      options: [
        { value: "one", label: "Single Story" },
        { value: "two", label: "Two Story" },
        { value: "three", label: "Three or More" },
      ],
      value: stories,
      set: setStories,
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / (steps.length + 1)) * 100;

  const handleSelect = (val: string) => {
    current.set(val);
    setTimeout(() => setStep((s) => s + 1), 280);
  };

  const today = ["2:00 PM", "4:00 PM", "6:00 PM"];
  const tomorrow = ["9:00 AM", "11:00 AM", "2:00 PM"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 p-8 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl leading-none transition-colors"
            >
              ×
            </button>

            {!submitted ? (
              <>
                {/* Company name header */}
                <p className="text-white/40 text-xs font-black tracking-[0.3em] uppercase mb-6">
                  {config.name}
                </p>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="h-0.5 bg-white/10 w-full">
                    <motion.div
                      className="h-full bg-white"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="mt-2 text-white/30 text-xs tracking-widest uppercase">
                    Step {Math.min(step + 1, steps.length)} of {steps.length}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {step < steps.length ? (
                    <motion.div
                      key={step}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <h3 className="text-2xl font-black uppercase tracking-wide text-white mb-6">
                        {current.label}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {current.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full text-left px-5 py-4 border transition-all duration-200 ${
                              current.value === opt.value
                                ? "border-white bg-white text-[#0a0a0a]"
                                : "border-white/20 text-white hover:border-white/60"
                            }`}
                          >
                            <span className="font-bold tracking-wide">
                              {"icon" in opt && `${opt.icon} `}{opt.label}
                            </span>
                            {"sub" in opt && opt.sub && (
                              <span className={`block text-sm mt-0.5 ${current.value === opt.value ? "text-black/50" : "text-white/40"}`}>
                                {opt.sub}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      {estimate && (
                        <div className="mb-6 text-center border border-white/20 py-6 px-4">
                          <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Your Estimate</p>
                          <p className="text-4xl font-black text-white">
                            {fmt(estimate.low)} — {fmt(estimate.high)}
                          </p>
                          <p className="text-white/30 text-xs mt-2">
                            Based on {config.city} market rates · Final quote depends on roof condition &amp; pitch
                          </p>
                        </div>
                      )}

                      <h3 className="text-xl font-black uppercase tracking-wide text-white mb-4">
                        Book Your Free Inspection
                      </h3>

                      <div className="flex flex-col gap-3 mb-4">
                        <input
                          value={name} onChange={e => setName(e.target.value)}
                          placeholder="First Name"
                          className="bg-transparent border border-white/20 text-white px-4 py-3 text-sm placeholder-white/30 focus:border-white/60 outline-none transition-colors"
                        />
                        <input
                          value={phone} onChange={e => setPhone(e.target.value)}
                          placeholder="Phone Number"
                          className="bg-transparent border border-white/20 text-white px-4 py-3 text-sm placeholder-white/30 focus:border-white/60 outline-none transition-colors"
                        />
                        <input
                          value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="bg-transparent border border-white/20 text-white px-4 py-3 text-sm placeholder-white/30 focus:border-white/60 outline-none transition-colors"
                        />
                      </div>

                      <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Pick a Time</p>
                      <div className="mb-2">
                        <p className="text-white/30 text-xs mb-2">Today</p>
                        <div className="flex gap-2 flex-wrap">
                          {today.map(t => (
                            <button key={t} onClick={() => setSlot(t)}
                              className={`px-4 py-2 text-xs border transition-all ${slot === t ? "bg-white text-[#0a0a0a] border-white" : "border-white/20 text-white hover:border-white/50"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-6">
                        <p className="text-white/30 text-xs mb-2">Tomorrow</p>
                        <div className="flex gap-2 flex-wrap">
                          {tomorrow.map(t => (
                            <button key={t} onClick={() => setSlot(t)}
                              className={`px-4 py-2 text-xs border transition-all ${slot === t ? "bg-white text-[#0a0a0a] border-white" : "border-white/20 text-white hover:border-white/50"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => { if (name && phone) setSubmitted(true); }}
                        disabled={!name || !phone}
                        className="w-full py-4 bg-white text-[#0a0a0a] font-black uppercase tracking-wider text-sm hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Book My Free Inspection →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-black uppercase text-white mb-2">
                  You&apos;re all set{name ? `, ${name}` : ""}!
                </h3>
                <p className="text-white/50 text-sm mb-6">
                  A {config.name} specialist will call you{slot ? ` at ${slot}` : " shortly"} to confirm your free inspection.
                </p>
                {estimate && (
                  <div className="border border-white/10 py-4 px-6 mb-6">
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Your Estimate</p>
                    <p className="text-3xl font-black text-white">{fmt(estimate.low)} — {fmt(estimate.high)}</p>
                    <p className="text-white/20 text-xs mt-1">Valid for 7 days</p>
                  </div>
                )}
                <button onClick={onClose} className="text-white/40 text-sm hover:text-white transition-colors">
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function RoofScroll({ images, companyConfig }: RoofScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const loadImages = async () => {
      const imgs = await Promise.all(
        images.map((src) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img);
          })
        )
      );
      setLoadedImages(imgs);
    };
    loadImages();
  }, [images]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, images.length - 1]);

  useEffect(() => {
    if (loadedImages.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    const render = () => {
      const index = Math.max(0, Math.min(Math.round(frameIndex.get()), loadedImages.length - 1));
      const img = loadedImages[index];
      if (img && img.width > 0) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);
        const imgRatio = img.width / img.height;
        const canvasRatio = rect.width / rect.height;
        let drawWidth, drawHeight, x, y;
        if (canvasRatio > imgRatio) {
          drawWidth = rect.width;
          drawHeight = img.height * (rect.width / img.width);
          x = 0;
          y = (rect.height - drawHeight) / 2;
        } else {
          drawHeight = rect.height;
          drawWidth = img.width * (rect.height / img.height);
          x = (rect.width - drawWidth) / 2;
          y = 0;
        }
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [loadedImages, frameIndex]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.12, 0.18], [0, -30]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [20, 0, 0, -20]);
  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.7, 0.8, 0.85], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.65, 0.7, 0.8, 0.85], [20, 0, 0, -20]);
  const text4Opacity = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]);
  const text4Y = useTransform(scrollYProgress, [0.85, 0.9, 1], [20, 0, 0]);
  const floatingOpacity = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);
  const floatingPointer = useTransform(scrollYProgress, [0.18, 0.25], ["none", "auto"]);
  const text1Display = useTransform(scrollYProgress, (v) => v > 0.2 ? "none" : "flex");

  return (
    <>
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} config={companyConfig} />

      <div ref={containerRef} className="relative h-[500vh] bg-[#0a0a0a]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

          {/* Floating top-right button */}
          <motion.div
            style={{ opacity: mounted ? floatingOpacity : 0, pointerEvents: floatingPointer }}
            className="absolute top-6 right-6 z-20"
          >
            <button
              onClick={() => setQuoteOpen(true)}
              className="px-5 py-2.5 bg-white text-[#0a0a0a] text-xs font-black tracking-widest uppercase hover:bg-gray-200 transition-all shadow-lg"
            >
              Get Estimate →
            </button>
          </motion.div>

          <div className="absolute inset-0 flex flex-col pointer-events-none">

            {/* Text 1 — visible on load */}
            <motion.div
  style={{ opacity: mounted ? text1Opacity : 1, y: mounted ? text1Y : 0, pointerEvents: "none", display: mounted ? text1Display : "flex" }}
  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
>
  <p className="mb-4 text-sm font-[800] tracking-[0.3em] text-white uppercase">
    {companyConfig.name} — {companyConfig.city}&apos;s Trusted Roofing Experts
  </p>
  <h2 className="text-5xl md:text-7xl font-[800] tracking-wide text-white uppercase drop-shadow-xl">
    Your roof is telling you something.
  </h2>
  <p className="mt-6 text-lg md:text-2xl text-white font-[800] drop-shadow-lg max-w-2xl">
    Most damage goes unnoticed until it&apos;s too late.
  </p>
  <motion.div
    className="mt-10 flex flex-col items-center gap-2"
    animate={{ y: [0, 8, 0] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
  >
    <p className="text-white text-xs tracking-[0.3em] uppercase font-[600]">Scroll</p>
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="26" rx="9" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
      <motion.rect
        x="8.5" y="5" width="3" height="6" rx="1.5" fill="white"
        animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  </motion.div>
</motion.div>

            {/* Text 2 */}
            <motion.div
              style={{ opacity: text2Opacity, y: text2Y }}
              className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-24"
            >
              <h2 className="text-4xl md:text-6xl font-[800] tracking-wide text-white uppercase drop-shadow-xl max-w-4xl">
                We show up before the storm wins.
              </h2>
              <p className="mt-6 text-lg md:text-2xl text-white font-[800] drop-shadow-lg">
                Fast response. Expert installation. Guaranteed.
              </p>
            </motion.div>

            {/* Text 3 */}
            <motion.div
              style={{ opacity: text3Opacity, y: text3Y }}
              className="absolute inset-0 flex flex-col items-end justify-center px-8 md:px-24 text-right"
            >
              <h2 className="text-4xl md:text-6xl font-[800] tracking-wide text-white uppercase drop-shadow-xl max-w-4xl">
                Built to last. Built to protect.
              </h2>
              <p className="mt-6 text-lg md:text-2xl text-white font-[800] drop-shadow-lg">
                Premium materials. Lifetime craftsmanship.
              </p>
            </motion.div>

            {/* Text 4 — CTA */}
            <motion.div
              style={{ opacity: text4Opacity, y: text4Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
            >
              <h2 className="text-3xl md:text-5xl font-[800] tracking-wide text-white uppercase drop-shadow-xl max-w-2xl">
                What will your new roof cost?
              </h2>
              <p className="mt-4 text-lg md:text-xl text-white font-[800]">
                Free estimate. No obligation. Results in 60 seconds.
              </p>
              <button
                onClick={() => setQuoteOpen(true)}
                // className="mt-8 px-10 py-5 bg-white text-[#0a0a0a] text-lg font-[800] tracking-wider uppercase hover:bg-gray-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] hover:scale-105 cursor-pointer"
              className="mt-8 px-6 py-4 md:px-10 md:py-5 bg-white text-[#0a0a0a] text-sm md:text-lg font-[800] tracking-wider uppercase hover:bg-gray-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Get My Instant Estimate →
              </button>
              <p className="mt-6 text-white text-sm tracking-widest font-[800]">
                {companyConfig.phone}
              </p>
              <p className="mt-3 text-white text-xs tracking-widest">
                © {companyConfig.name} · Licensed &amp; Insured · {companyConfig.city}, {companyConfig.state}
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}