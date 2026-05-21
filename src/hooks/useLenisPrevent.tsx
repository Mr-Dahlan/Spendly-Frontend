// src/hooks/useLenisPrevent.ts
import { useCallback } from "react";

export function useLenisPrevent<T extends HTMLElement>() {
  return useCallback((el: T | null) => {
    if (!el) return;

    const controller = new AbortController();

    el.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;
        const canScrollUp = el.scrollTop > 0;
        const scrollingDown = e.deltaY > 0;

        if (
          (scrollingDown && canScrollDown) ||
          (!scrollingDown && canScrollUp)
        ) {
          e.stopPropagation();
        }
      },
      { passive: false, signal: controller.signal },
    );

    // return cleanup — React akan call ini saat element unmount
    return () => controller.abort();
  }, []);
}

