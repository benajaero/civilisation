"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = window.scrollY;
      const percent = Math.min(100, Math.max(0, (scrolled / scrollHeight) * 100));
      setProgress(percent);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  if (progress === 0) return null;

  return (
    <div className="reading-progress" aria-hidden="true">
      <div
        className="reading-progress__bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}