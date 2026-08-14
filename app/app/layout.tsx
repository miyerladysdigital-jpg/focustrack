import { BottomNav } from '@/components/app/BottomNav';

export default function AppLayout({ children }: LayoutProps<'/app'>) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] [font-family:var(--font-body)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-[430px] flex-1 px-5 pb-6 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
