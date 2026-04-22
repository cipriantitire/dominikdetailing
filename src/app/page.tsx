import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { serviceTiers, serviceExtras } from "@/config/services";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroRequestForm from "@/components/home/HeroRequestForm";
import {
  ShieldTick,
  Award03,
  Star06,
  CheckVerified02,
  Calendar,
  ArrowRight,
  Phone,
} from "@untitledui/icons";

const reviews = [
  {
    name: "James M.",
    location: "Watford",
    text: "Dominik transformed my BMW inside and out. The attention to detail was incredible — every panel, every vent, every stitch. Worth every penny.",
  },
  {
    name: "Sarah L.",
    location: "Richmond",
    text: "I have two kids and a dog. I didn't think my interior could look this clean again. The pet hair removal was flawless. Highly recommend.",
  },
  {
    name: "David K.",
    location: "Luton",
    text: "Had the ceramic coating done and the water beading is insane. Car stays cleaner for longer and washing is so much easier now.",
  },
];

const faqs = [
  {
    question: "How does the booking process work?",
    answer:
      "Submit your preferred date, time, and service through our form. We review every request manually and confirm what fits the diary. You will hear back within 24 hours.",
  },
  {
    question: "Do I need to be present during the detail?",
    answer:
      "Not necessarily. As long as we have access to the vehicle and the keys, we can work while you are busy. Many customers leave the car at home or at work.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We cover London and surrounding areas including Luton, Watford, Harrow, Enfield, Croydon, Kingston, Richmond, and Heathrow. Contact us if you are unsure.",
  },
  {
    question: "How long does a full valet take?",
    answer:
      "A Full Valet typically takes 3-4 hours depending on vehicle size and condition. Premium Detailing and Machine Polish can take 4-8 hours. We will give you a time estimate when we confirm.",
  },
  {
    question: "Do you offer any guarantees?",
    answer:
      "Yes. If you are not satisfied with the result, let us know within 48 hours and we will make it right. Your satisfaction is our priority.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />

      {/* Hero — asymmetric, left-aligned */}
      <section className="relative min-h-[92svh] overflow-hidden md:min-h-[92vh]">
        <div className="absolute inset-0">
          {/* Desktop hero image */}
          <Image
            src="/hero-desktop.png"
            alt="Premium car detailing"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="hidden object-cover md:block"
          />
          {/* Mobile hero image */}
          <Image
            src="/hero-mobile-v2.png"
            alt="Premium car detailing"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090d] via-[#09090d]/50 to-[#09090d]/0" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 pt-12 text-center md:px-6 md:pb-24 md:pt-[120px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            <Star06 size={14} />
            Limited Time: 20% OFF First Service
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-[40px] font-bold leading-[1.05] tracking-tight md:text-[64px] lg:text-[72px]">
            Premium car care.
            <br />
            <span className="text-[#9696a3]">Mobile.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#9696a3] md:text-[17px]">
            Transform your vehicle with professional detailing, ceramic coating, and paint correction. We come to your home or workplace across London.
          </p>

          <div className="mt-10 w-full max-w-4xl">
            <HeroRequestForm />
          </div>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px] font-medium uppercase tracking-wider text-[#9696a3]">
            <span className="flex items-center gap-2">
              <ShieldTick size={15} className="text-[#c5a059]" />
              Satisfaction Guaranteed
            </span>
            <span className="flex items-center gap-2">
              <Award03 size={15} className="text-[#c5a059]" />
              Certified Professional
            </span>
            <span className="flex items-center gap-2">
              <CheckVerified02 size={15} className="text-[#c5a059]" />
              5 Years Experience
            </span>
          </div>
        </div>
      </section>

      {/* Services — 2-column asymmetric on desktop */}
      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                Our Services
              </span>
              <h2 className="mt-3 text-[32px] font-bold tracking-tight md:text-[44px]">
                Premium Auto Care
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-[#686878]">
              From basic maintenance to complete transformations. Every service is performed to the same meticulous standard.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceTiers.map((service) => (
                <article
                  key={service.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.04] bg-[#0f0f14] transition duration-300 hover:border-white/[0.08] hover:-translate-y-0.5"
                >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  {service.popular && (
                    <span className="absolute right-3 top-3 rounded bg-[#c5a059] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#09090d]">
                      Most Popular
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-[16px] font-semibold">{service.name}</h3>
                    <span className="text-[13px] font-bold text-[#1d4ed8]">
                      From &pound;{service.startingPrice}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-[#686878]">{service.shortDescription}</p>
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[13px] text-[#9696a3]">
                        <CheckVerified02 size={15} className="mt-0.5 shrink-0 text-[#1d4ed8]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5">
          <Link
            href={`/book?service=${service.id}`}
            className="block rounded-lg bg-[#1d4ed8] py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-[#1e40af] active:scale-[0.98]"
          >
            Request Booking
          </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Extras — horizontal scroll on mobile, grid on desktop */}
      <section className="border-y border-white/[0.04] bg-[#0a0a0f] px-4 py-24 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
              Add-Ons
            </span>
            <h2 className="mt-3 text-[28px] font-bold tracking-tight md:text-[36px]">
              Extras &amp; Add-Ons
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {serviceExtras.map((extra) => (
              <div
                key={extra.id}
                className="flex flex-col items-center justify-center rounded-xl border border-white/[0.04] bg-[#0f0f14] p-5 text-center transition hover:border-white/[0.08]"
              >
                <span className="text-[13px] font-medium text-white">{extra.name}</span>
                <span className="mt-1.5 text-[15px] font-bold text-[#c5a059]">+&pound;{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After — split layout */}
      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                Results
              </span>
              <h2 className="mt-3 text-[32px] font-bold tracking-tight md:text-[44px]">
                See the Difference
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#686878]">
                Real results from real jobs. Every vehicle receives the same meticulous attention, whether it is a daily driver or a weekend pride and joy.
              </p>
              <Link
                href="/gallery"
                className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#1d4ed8] transition hover:text-[#3b6cb7] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded"
              >
                View full gallery
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  src: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
                  label: "Interior Deep Clean",
                },
                {
                  src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
                  label: "Paint Enhancement",
                },
                {
                  src: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&w=600&q=80",
                  label: "Ceramic Protection",
                },
                {
                  src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
                  label: "Machine Polish",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.04]"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-[13px] font-semibold">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-white/[0.04] bg-[#0a0a0f] px-4 py-24 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
              Testimonials
            </span>
            <h2 className="mt-3 text-[32px] font-bold tracking-tight md:text-[44px]">
              What Our Clients Say
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-xl border border-white/[0.04] bg-[#0f0f14] p-6"
              >
                <div className="flex items-center gap-0.5 text-[#c5a059]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star06 key={i} size={14} />
                  ))}
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-[#9696a3]">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a20] text-[11px] font-bold text-[#686878]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{review.name}</p>
                    <p className="text-[11px] text-[#484855]">{review.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.04]">
              <Image
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80"
                alt="London mobile car detailing service area"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[center_35%] md:object-center"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                Coverage
              </span>
              <h2 className="mt-3 text-[32px] font-bold tracking-tight md:text-[44px]">
                Mobile Service Across London
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#686878]">
                We bring professional-grade equipment and products to your driveway, office car park, or preferred location. No need to travel.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {siteConfig.serviceArea.map((area) => (
                  <span
                    key={area}
                    className="flex items-center gap-2 text-[13px] text-[#9696a3]"
                  >
                    <CheckVerified02 size={14} className="shrink-0 text-[#1d4ed8]" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.04] bg-[#0a0a0f] px-4 py-24 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
              Process
            </span>
            <h2 className="mt-3 text-[32px] font-bold tracking-tight md:text-[44px]">
              How It Works
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Request",
                desc: "Fill in your details, preferred date, and service. Takes under two minutes.",
                icon: <Calendar size={22} />,
              },
              {
                step: "02",
                title: "Review",
                desc: "We review your request and confirm what fits the diary. No instant bookings — every job is checked.",
                icon: <CheckVerified02 size={22} />,
              },
              {
                step: "03",
                title: "Detail",
                desc: "We arrive at your location with everything needed. You get a spotless car without leaving home.",
                icon: <ShieldTick size={22} />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-white/[0.04] bg-[#0f0f14] p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#484855]">
                  Step {item.step}
                </span>
                <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1d4ed8]/10 text-[#1d4ed8]">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-[18px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#686878]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
              FAQ
            </span>
            <h2 className="mt-3 text-[32px] font-bold tracking-tight md:text-[44px]">
              Common Questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/[0.04] bg-[#0f0f14] transition open:border-white/[0.08]"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-[14px] font-semibold text-white transition hover:bg-[#141419] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded-xl">
                  {faq.question}
                  <svg
                    className="h-4 w-4 shrink-0 text-[#686878] transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-[13px] leading-relaxed text-[#686878]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/[0.04] bg-[#0f0f14] p-8 text-center md:p-14">
          <h2 className="text-[28px] font-bold tracking-tight md:text-[40px]">
            Ready to give your car the care it deserves?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-[#686878]">
            Request a booking today. We will confirm availability and pricing within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-8 py-3.5 text-[13px] font-bold text-white transition hover:bg-[#1e40af] active:scale-[0.98]"
            >
              Request Booking
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
      </section>

      <SiteFooter />
    </div>
  );
}
