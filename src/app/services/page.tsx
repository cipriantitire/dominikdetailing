import Image from "next/image";
import Link from "next/link";
import { serviceTiers, serviceExtras } from "@/config/services";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { CheckVerified02, ArrowRight } from "@untitledui/icons";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            What We Offer
          </span>
          <h1 className="mt-3 text-[32px] font-bold tracking-tight md:text-[48px]">
            Our <span className="text-[#1d4ed8]">Services</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-[#686878]">
            Every service is performed to the same high standard, whether it is a quick maintenance wash or a full paint correction.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {serviceTiers.map((service) => (
            <article
              key={service.id}
              className="flex flex-col overflow-hidden rounded-xl border border-white/[0.04] bg-[#0f0f14] md:flex-row"
            >
              <div className="relative h-52 shrink-0 md:h-auto md:w-64">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-[18px] font-bold">{service.name}</h2>
                  <span className="rounded bg-[#1d4ed8]/10 px-2 py-1 text-[12px] font-bold text-[#1d4ed8]">
                    From &pound;{service.startingPrice}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-[#686878]">{service.shortDescription}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[13px] text-[#9696a3]">
                      <CheckVerified02 size={15} className="mt-0.5 shrink-0 text-[#22c55e]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href={`/book?service=${service.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1e40af] active:scale-[0.98]"
                  >
                    Request Booking
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-center text-[28px] font-bold tracking-tight md:text-[36px]">
            Extras &amp; Add-Ons
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[14px] text-[#686878]">
            Add these to any service to customise your detail.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {serviceExtras.map((extra) => (
              <div
                key={extra.id}
                className="flex flex-col items-center justify-center rounded-xl border border-white/[0.04] bg-[#0f0f14] p-6 text-center"
              >
                <span className="text-[13px] font-medium text-white">{extra.name}</span>
                <span className="mt-2 text-[18px] font-bold text-[#c5a059]">+&pound;{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
