"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyboardNavProps {
  prevHref?: string;
  nextHref?: string;
  contentsHref: string;
}

export function KeyboardNav({ prevHref, nextHref, contentsHref }: KeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          if (prevHref) {
            e.preventDefault();
            router.push(prevHref);
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (nextHref) {
            e.preventDefault();
            router.push(nextHref);
          }
          break;
        case "ArrowUp":
        case "s":
        case "S":
          if (contentsHref) {
            e.preventDefault();
            router.push(contentsHref);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevHref, nextHref, contentsHref, router]);

  return null;
}