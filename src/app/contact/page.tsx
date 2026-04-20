import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Get in <span className="text-[#3b82f6]">Touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
            Have a question or ready to book? Reach out however suits you best.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-[#111] p-8">
            <h2 className="text-xl font-semibold">Contact Details</h2>
            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <a href={siteConfig.phoneHref} className="mt-1 text-sm text-[#a3a3a3] hover:text-white">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="mt-1 text-sm text-[#a3a3a3] hover:text-white">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Service Area</p>
                  <p className="mt-1 text-sm text-[#a3a3a3]">{siteConfig.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Business Hours</p>
                  <p className="mt-1 text-sm text-[#a3a3a3]">{siteConfig.hours.weekday}</p>
                  <p className="text-sm text-[#a3a3a3]">{siteConfig.hours.saturday}</p>
                  <p className="text-sm text-[#d63d2e]">{siteConfig.hours.sunday}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-[#62c275] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#4da85e]"
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.phoneHref}
                className="rounded-md border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/25"
              >
                Call Now
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#111] p-8">
            <h2 className="text-xl font-semibold">Service Coverage</h2>
            <p className="mt-2 text-sm text-[#a3a3a3]">
              We cover London and surrounding areas. If you are unsure whether we service your location, send us a message.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {siteConfig.serviceArea.map((area) => (
                <span
                  key={area}
                  className="flex items-center gap-2 text-sm text-[#d4d4d4]"
                >
                  <svg className="h-4 w-4 text-[#62c275]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/book"
                className="block rounded-md bg-[#3b82f6] py-3 text-center text-sm font-bold text-white transition hover:bg-[#2563eb]"
              >
                Book a Service
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
