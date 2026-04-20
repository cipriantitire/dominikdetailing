import Image from "next/image";
import Link from "next/link";
import { serviceTiers, serviceExtras } from "@/config/services";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Our <span className="text-[#3b82f6]">Services</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#a3a3a3]">
            Every service is performed to the same high standard, whether it is a quick maintenance wash or a full paint correction.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {serviceTiers.map((service) => (
            <article
              key={service.id}
              className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#111] md:flex-row"
            >
              <div className="relative h-56 shrink-0 md:h-auto md:w-72">
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
                  <h2 className="text-xl font-bold">{service.name}</h2>
                  <span className="rounded bg-[#3b82f6]/10 px-2 py-1 text-sm font-bold text-[#3b82f6]">
                    From &pound;{service.startingPrice}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#a3a3a3]">{service.shortDescription}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#d4d4d4]">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#62c275]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href={`/book?service=${service.id}`}
                    className="inline-block rounded-md bg-[#3b82f6] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            Extras &amp; Add-Ons
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[#a3a3a3]">
            Add these to any service to customise your detail.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceExtras.map((extra) => (
              <div
                key={extra.id}
                className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-[#111] p-6 text-center"
              >
                <span className="text-sm font-semibold text-white">{extra.name}</span>
                <span className="mt-2 text-lg font-bold text-[#3b82f6]">+&pound;{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
