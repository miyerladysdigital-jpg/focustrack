'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BottomNav } from '@/components/app/BottomNav';

export default function AppLayout({ children }: LayoutProps<'/app'>) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <div className="grid-tecnico flex min-h-dvh flex-col bg-[var(--bg)] [font-family:var(--font-body)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-[430px] flex-1 px-5 pb-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
