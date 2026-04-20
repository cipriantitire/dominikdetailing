import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center md:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#62c275]/10 text-[#62c275]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
          Request Received
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[#a3a3a3]">
          Thank you for your booking request. We have received your details and will review availability shortly. You will hear back from us within 24 hours to confirm your appointment.
        </p>

        <div className="mt-8 w-full rounded-xl border border-white/5 bg-[#111] p-6 text-left">
          <h2 className="text-sm font-semibold">What happens next?</h2>
          <ol className="mt-4 space-y-3 text-sm text-[#a3a3a3]">
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-xs font-bold text-[#3b82f6]">1</span>
              We review your request and check our diary.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-xs font-bold text-[#3b82f6]">2</span>
              We contact you to confirm or propose an alternative time.
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-xs font-bold text-[#3b82f6]">3</span>
              Once agreed, your booking is confirmed and added to our schedule.
            </li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-md bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
          >
            Back to Home
          </Link>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25"
          >
            Message on WhatsApp
          </a>
        </div>

        <p className="mt-6 text-sm text-[#525252]">
          Need to make changes? Call us at{" "}
          <a href={siteConfig.phoneHref} className="text-[#a3a3a3] hover:text-white">
            {siteConfig.phone}
          </a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
