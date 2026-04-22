"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Lock02, Mail01 } from "@untitledui/icons";

export default function AdminLoginPage() {
  const { signIn, session } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/admin/bookings");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/admin/bookings");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090d] px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/[0.04] bg-[#0f0f14] p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-[20px] font-bold tracking-tight text-white text-balance">
            Dominik Detailing
          </h1>
          <p className="mt-1 text-[13px] text-[#686878]">Owner Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#9696a3]">
              Email
            </label>
            <div className="mt-1.5 relative">
              <Mail01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484855]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] py-2.5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#484855] outline-none transition-colors focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20"
                placeholder="owner@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#9696a3]">
              Password
            </label>
            <div className="mt-1.5 relative">
              <Lock02 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484855]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-white/[0.06] bg-[#0a0a0f] py-2.5 pl-9 pr-3 text-[13px] text-white placeholder:text-[#484855] outline-none transition-colors focus:border-[#1d4ed8]/50 focus:ring-1 focus:ring-[#1d4ed8]/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/10 p-3 text-[12px] text-[#f87171]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full min-h-[40px] items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-50 active:scale-[0.96]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
