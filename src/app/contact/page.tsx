import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  Phone,
  Mail01,
  MarkerPin01,
  Clock,
  ArrowRight,
  MessageChatSquare,
} from "@untitledui/icons";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            Reach Out
          </span>
          <h1 className="mt-3 text-[32px] font-bold tracking-tight md:text-[48px]">
            Get in <span className="text-[#1d4ed8]">Touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-[#5a5a65]">
            Have a question or ready to book? Reach out however suits you best.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-8">
            <h2 className="text-[18px] font-semibold">Contact Details</h2>
            <div className="mt-6 space-y-6">
              {[
                {
                  icon: <Phone size={20} />,
                  title: "Phone",
                  value: siteConfig.phone,
                  href: siteConfig.phoneHref,
                },
                {
                  icon: <Mail01 size={20} />,
                  title: "Email",
                  value: siteConfig.email,
                  href: `mailto:${siteConfig.email}`,
                },
                {
                  icon: <MarkerPin01 size={20} />,
                  title: "Service Area",
                  value: siteConfig.address,
                },
                {
                  icon: <Clock size={20} />,
                  title: "Business Hours",
                  value: `${siteConfig.hours.weekday}\n${siteConfig.hours.saturday}\n${siteConfig.hours.sunday}`,
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1d4ed8]/10 text-[#1d4ed8]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{item.title}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-0.5 whitespace-pre-line text-[13px] text-[#5a5a65] transition hover:text-[#8a8a95]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 whitespace-pre-line text-[13px] text-[#5a5a65]">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-5 py-2.5 text-[13px] font-semibold text-[#09090d] transition hover:bg-[#16a34a]"
              >
                <MessageChatSquare size={16} />
                WhatsApp
              </a>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.03]"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-8">
            <h2 className="text-[18px] font-semibold">Service Coverage</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5a5a65]">
              We cover London and surrounding areas. If you are unsure whether we service your location, send us a message.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {siteConfig.serviceArea.map((area) => (
                <span
                  key={area}
                  className="flex items-center gap-2 text-[13px] text-[#8a8a95]"
                >
                  <MarkerPin01 size={14} className="shrink-0 text-[#1d4ed8]" />
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#1e40af]"
              >
                Book a Service
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
