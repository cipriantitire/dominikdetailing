"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { LogOut01, HomeLine } from "@untitledui/icons";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { session, isLoading, signOut } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !session && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isLoading, session, isLoginPage, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090d]">
        <div className="text-[13px] text-[#686878]">Loading...</div>
      </div>
    );
  }

  if (!session && !isLoginPage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#09090d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/bookings"
              className="text-[15px] font-semibold tracking-tight text-white"
            >
              Dominik<span className="font-light text-[#686878]">Detailing</span>
            </Link>
            <span className="hidden text-[11px] uppercase tracking-wider text-[#484855] sm:inline">
              Owner Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#9696a3] transition-colors hover:text-white hover:bg-white/[0.03] active:scale-[0.96]"
              aria-label="Go to website"
            >
              <HomeLine size={18} />
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.replace("/admin/login");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#dc2626] transition-colors hover:text-[#f87171] hover:bg-[#dc2626]/10 active:scale-[0.96]"
              aria-label="Sign out"
            >
              <LogOut01 size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
