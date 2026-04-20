import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            About <span className="text-[#3b82f6]">Dominik Detailing</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
            Premium mobile car detailing built on attention to detail and honest service.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5">
            <Image
              src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80"
              alt="Dominik Detailing at work"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Mobile detailing done properly
            </h2>
            <p className="mt-4 leading-relaxed text-[#a3a3a3]">
              Dominik Detailing was founded on a simple belief: every car deserves to look its best, and every owner deserves a service they can trust. We bring professional-grade equipment, premium products, and years of experience directly to your door.
            </p>
            <p className="mt-4 leading-relaxed text-[#a3a3a3]">
              Whether you need a quick maintenance wash to keep your daily driver fresh, or a full paint correction and ceramic coating to protect your pride and joy, we treat every vehicle with the same meticulous care.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3b82f6]">5+</p>
                <p className="mt-1 text-xs text-[#a3a3a3]">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3b82f6]">500+</p>
                <p className="mt-1 text-xs text-[#a3a3a3]">Cars Detailed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3b82f6]">100%</p>
                <p className="mt-1 text-xs text-[#a3a3a3]">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
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
            <div key={item.title} className="rounded-xl border border-white/5 bg-[#111] p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to experience the difference?
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-md bg-[#d63d2e] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#ec4b3a]"
            >
              Request a Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="rounded-md border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/25"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
