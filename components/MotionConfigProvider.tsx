'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// Respeta prefers-reduced-motion en TODA la app sin que cada componente tenga
// que llamar useReducedMotion() por su cuenta (UX regla 10, dura desde 09-SEGURIDAD).
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
