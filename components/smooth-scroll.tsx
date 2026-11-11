"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  // Hareket azaltma tercihinde Lenis devre dışı — tarayıcının doğal kaydırması kalır.
  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        anchors: { offset: -80 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
