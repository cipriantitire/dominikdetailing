import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  ArrowRight,
  Phone,
} from "@untitledui/icons";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            Our Story
          </span>
          <h1 className="mt-3 text-[32px] font-bold tracking-tight md:text-[48px]">
            About <span className="text-[#1d4ed8]">Dominik Detailing</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-[#5a5a65]">
            Premium mobile car detailing built on attention to detail and honest service.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.04]">
            <Image
              src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80"
              alt="Dominik Detailing at work"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-[24px] font-bold tracking-tight md:text-[32px]">
              Mobile detailing done properly
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-[#5a5a65]">
              Dominik Detailing was founded on a simple belief: every car deserves to look its best, and every owner deserves a service they can trust. We bring professional-grade equipment, premium products, and years of experience directly to your door.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-[#5a5a65]">
              Whether you need a quick maintenance wash to keep your daily driver fresh, or a full paint correction and ceramic coating to protect your pride and joy, we treat every vehicle with the same meticulous care.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-[28px] font-bold text-[#1d4ed8]">5+</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#5a5a65]">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-[28px] font-bold text-[#1d4ed8]">500+</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#5a5a65]">Cars Detailed</p>
              </div>
              <div className="text-center">
                <p className="text-[28px] font-bold text-[#1d4ed8]">100%</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#5a5a65]">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Premium Products",
              text: "We use only professional-grade detailing products that are safe for your paint, trim, and interior surfaces.",
            },
            {
              title: "Fully Mobile",
              text: "No need to travel. We bring water, power, and everything needed to detail your car at your home or office.",
            },
            {
              title: "Honest Pricing",
              text: "Clear quotes upfront. No hidden fees. You know exactly what you are paying for before we start.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-6">
              <h3 className="text-[16px] font-semibold">{item.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[#5a5a65]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-[24px] font-bold tracking-tight md:text-[32px]">
            Ready to experience the difference?
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-8 py-3.5 text-[13px] font-bold text-white transition hover:bg-[#1e40af]"
            >
              Request a Quote
              <ArrowRight size={16} />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-8 py-3.5 text-[13px] font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.03]"
            >
              <Phone size={16} />
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
