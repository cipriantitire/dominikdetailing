import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { serviceTiers, serviceExtras } from "@/config/services";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroRequestForm from "@/components/home/HeroRequestForm";

const trustItems = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "Guaranteed Satisfaction",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Certified Professional",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    label: "5 Years of Experience",
  },
];

const reviews = [
  {
    name: "James M.",
    location: "Watford",
    text: "Dominik transformed my BMW inside and out. The attention to detail was incredible — every panel, every vent, every stitch. Worth every penny.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    location: "Richmond",
    text: "I have two kids and a dog. I didn't think my interior could look this clean again. The pet hair removal was flawless. Highly recommend.",
    rating: 5,
  },
  {
    name: "David K.",
    location: "Luton",
    text: "Had the ceramic coating done and the water beading is insane. Car stays cleaner for longer and washing is so much easier now.",
    rating: 5,
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
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=2000&q=80"
            alt="Premium car detailing in progress"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/80 via-[#090909]/60 to-[#090909]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 text-center md:px-6 md:pb-28 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#d63d2e] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Limited Time: 20% OFF First Service
          </span>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Premium car care. Mobile.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#d4d4d4] md:text-xl">
            Transform your vehicle with professional detailing, ceramic coating, and more. We come to your home or workplace across London.
          </p>

          <div className="mx-auto mt-10 max-w-4xl">
            <HeroRequestForm />
          </div>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#a3a3a3]">
            {trustItems.map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <span className="text-[#3b82f6]">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full border border-white/10 bg-[#151515] px-3 py-1 text-xs font-medium text-[#a3a3a3]">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Premium Auto Care{" "}
              <span className="text-[#3b82f6]">Services</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#a3a3a3]">
              From basic maintenance to complete transformations, we offer comprehensive automotive care services with premium quality guaranteed.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceTiers.map((service) => (
              <article
                key={service.id}
                className="group relative overflow-hidden rounded-lg border border-white/5 bg-[#111] transition hover:border-white/10"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {service.popular && (
                    <span className="absolute right-3 top-3 rounded bg-[#d63d2e] px-2.5 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <span className="text-sm font-semibold text-[#3b82f6]">
                      From &pound;{service.startingPrice}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#a3a3a3]">{service.shortDescription}</p>
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-[#d4d4d4]">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/book?service=${service.id}`}
                    className="mt-5 block rounded-md bg-[#3b82f6] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#2563eb]"
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Extras */}
      <section className="border-t border-white/5 bg-[#0c0c0c] px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            Extras &amp; Add-Ons
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceExtras.map((extra) => (
              <div
                key={extra.id}
                className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-[#111] p-5 text-center transition hover:border-white/10"
              >
                <span className="text-sm font-semibold text-white">{extra.name}</span>
                <span className="mt-1 text-sm font-bold text-[#3b82f6]">+&pound;{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After teaser */}
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full border border-white/10 bg-[#151515] px-3 py-1 text-xs font-medium text-[#a3a3a3]">
              Results
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              See the Difference
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
              Swipe-ready before and after shots from real jobs across London.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                before: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=600&q=80",
                after: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
                label: "Interior Deep Clean",
              },
              {
                before: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=80",
                after: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
                label: "Paint Enhancement",
              },
              {
                before: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80",
                after: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&w=600&q=80",
                label: "Ceramic Protection",
              },
            ].map((item) => (
              <div key={item.label} className="group relative overflow-hidden rounded-lg border border-white/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.after}
                    alt={`${item.label} after`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <Link
                    href="/gallery"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-[#3b82f6] transition hover:underline"
                  >
                    View full gallery
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-white/5 bg-[#0c0c0c] px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
              Real feedback from owners who trust us with their vehicles.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-lg border border-white/5 bg-[#111] p-6"
              >
                <div className="flex items-center gap-1 text-[#3b82f6]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#d4d4d4]">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-bold text-[#a3a3a3]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-[#525252]">{review.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full border border-white/10 bg-[#151515] px-3 py-1 text-xs font-medium text-[#a3a3a3]">
                Coverage
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Mobile Service Across London
              </h2>
              <p className="mt-4 text-[#a3a3a3]">
                We bring professional-grade equipment and products to your driveway, office car park, or preferred location. No need to travel.
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
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80"
                alt="London mobile car detailing service area"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-[#0c0c0c] px-4 py-20 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
              Quick answers to common questions. Still unsure? Call or WhatsApp us.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-white/5 bg-[#111] open:border-white/10"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-white transition hover:bg-[#151515]">
                  {faq.question}
                  <svg
                    className="h-4 w-4 shrink-0 text-[#a3a3a3] transition group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-[#a3a3a3]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/5 bg-[#111] p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to give your car the care it deserves?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
            Request a quote today. We will confirm availability and pricing within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </section>

      <SiteFooter />
    </div>
  );
}
