import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { CheckVerified02, MessageChatSquare } from "@untitledui/icons";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
          <CheckVerified02 size={32} />
        </div>
        <h1 className="mt-6 text-[32px] font-bold tracking-tight text-balance md:text-[40px]">
          Request Received
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-[#686878]">
          Thank you for your booking request. We have received your details and will review availability shortly. You will hear back from us within 24 hours to confirm your appointment.
        </p>

        <div className="mt-8 w-full rounded-xl border border-white/[0.04] bg-[#0f0f14] p-6 text-left">
          <h2 className="text-[13px] font-semibold">What happens next?</h2>
          <ol className="mt-4 space-y-3 text-[13px] text-[#686878]">
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8]/10 text-[11px] font-bold text-[#1d4ed8]">1</span>
              We review your request and check our diary.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8]/10 text-[11px] font-bold text-[#1d4ed8]">2</span>
              We contact you to confirm or propose an alternative time.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8]/10 text-[11px] font-bold text-[#1d4ed8]">3</span>
              Once agreed, your booking is confirmed and added to our schedule.
            </li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 text-[13px] font-semibold text-white transition-[colors,transform] hover:bg-[#1e40af] active:scale-[0.96]"
          >
            Back to Home
          </Link>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-6 py-3 text-[13px] font-semibold text-white transition-[colors,transform,border-color] hover:border-white/20 hover:bg-white/[0.03] active:scale-[0.96]"
          >
            <MessageChatSquare size={16} />
            Message on WhatsApp
          </a>
        </div>

        <p className="mt-6 text-[12px] text-[#484855]">
          Need to make changes? Call us at{" "}
          <a href={siteConfig.phoneHref} className="text-[#686878] hover:text-white">
            {siteConfig.phone}
          </a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
