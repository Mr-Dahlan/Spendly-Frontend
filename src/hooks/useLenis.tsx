// src/hooks/useLenis.ts
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis() {
  const containerRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: containerRef.current,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return { containerRef, lenisRef };
}