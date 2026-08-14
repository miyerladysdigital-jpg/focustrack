'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarClock, Inbox, TrendingUp, User } from 'lucide-react';

const TABS = [
  { href: '/app', label: 'Hoy', icon: CalendarClock },
  { href: '/app/buzon', label: 'Buzón', icon: Inbox },
  { href: '/app/semana', label: 'Semana', icon: TrendingUp },
  { href: '/app/cuenta', label: 'Cuenta', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-10 border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[430px] items-stretch justify-between px-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === '/app' ? pathname === '/app' : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex h-14 flex-1 flex-col items-center justify-center gap-1 [touch-action:manipulation]"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}
              />
              <span className={`text-[11px] font-medium ${active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
