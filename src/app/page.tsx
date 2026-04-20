import Image from "next/image";
import Link from "next/link";

const services = [
  {
    name: "Maintenance detail",
    detail: "A careful refresh for cars that are already looked after.",
  },
  {
    name: "Deep interior reset",
    detail: "Seats, carpets, plastics, glass, and touch points cleaned properly.",
  },
  {
    name: "Paint enhancement",
    detail: "Gloss-focused exterior work for tired paint and dull finishes.",
  },
];

const steps = [
  "Tell us the vehicle, service, location, and preferred time.",
  "We review the request and confirm what fits the diary.",
  "Confirmed jobs go into the Dominik Detailing calendar.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <section className="grid min-h-screen grid-rows-[auto_1fr]">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-base font-semibold">
            Dominik Detailing
          </Link>
          <Link
            href="/book"
            className="rounded-md bg-[#f3f0e8] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:bg-white"
          >
            Request quote
          </Link>
        </header>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-8 md:grid-cols-[1fr_0.92fr] md:py-14">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-md border border-[#d63d2e]/50 px-3 py-1 text-sm font-medium text-[#f06a5d]">
              Mobile detailing for careful owners
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] md:text-6xl">
              Premium car care, requested in under two minutes.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#d7d7d7]">
              Submit the service, location, and preferred time. We confirm the
              final booking manually, so every job fits the day properly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="rounded-md bg-[#d63d2e] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#ec4b3a]"
              >
                Start a request
              </Link>
              <a
                href="tel:+440000000000"
                className="rounded-md border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-white/45"
              >
                Call the owner
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-md border border-white/10 bg-[#151515] md:min-h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1400&q=80"
              alt="Detailed black car in a clean studio"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010] px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.name}
              className="rounded-md border border-white/10 bg-[#151515] p-5"
            >
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="mt-3 leading-7 text-[#cfcfcf]">{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.7fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-[#62c275]">
              Quote-first booking
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Requests stay flexible until the owner confirms.
            </h2>
          </div>
          <ol className="grid gap-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="rounded-md border border-white/10 bg-[#151515] p-5"
              >
                <span className="text-sm font-semibold text-[#f06a5d]">
                  Step {index + 1}
                </span>
                <p className="mt-2 leading-7 text-[#e8e8e8]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
