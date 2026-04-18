"use client";

import { ChapterNav } from "./chapter-nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ClientChapterNavProps {
  workSlug: string;
  workTitle: string;
  prev?: { chapterSlug: string; title: string };
  next?: { chapterSlug: string; title: string };
}

export function ClientChapterNav({
  workSlug,
  workTitle,
  prev,
  next,
}: ClientChapterNavProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          if (prev) {
            e.preventDefault();
            router.push(`/works/${workSlug}/text/${prev.chapterSlug}`);
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (next) {
            e.preventDefault();
            router.push(`/works/${workSlug}/text/${next.chapterSlug}`);
          }
          break;
        case "ArrowUp":
        case "s":
        case "S":
        case "Escape":
          e.preventDefault();
          router.push(`/works/${workSlug}`);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [workSlug, prev, next, router]);

  return (
    <ChapterNav
      workSlug={workSlug}
      workTitle={workTitle}
      prev={prev}
      next={next}
    />
  );
}