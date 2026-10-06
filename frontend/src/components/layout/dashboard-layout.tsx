import type { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute -top-40 right-[8%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slower pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute -bottom-48 left-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-600/15 blur-3xl"
      />
      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
