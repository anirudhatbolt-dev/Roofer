"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader({
  images,
  onComplete,
}: {
  images: string[];
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loaded = 0;
    const total = images.length;
    if (total === 0) {
      onComplete();
      return;
    }

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        setProgress((loaded / total) * 100);
        if (loaded === total) {
          setTimeout(onComplete, 500); // small delay to see 100%
        }
      };
      img.onerror = () => {
        // Handle error by counting as loaded so it doesn't get stuck
        loaded++;
        setProgress((loaded / total) * 100);
        if (loaded === total) {
          setTimeout(onComplete, 500);
        }
      };
    });
  }, [images, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-64">
        <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest text-white">
          <span>Loading Experience</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
