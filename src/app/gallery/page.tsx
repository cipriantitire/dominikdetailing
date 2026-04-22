import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import DomeGallery from "@/components/gallery/DomeGallery";
import { galleryItems } from "@/config/gallery";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main>
        {/* Intro — tight bottom padding so the dome sits immediately underneath */}
        <section className="px-4 pb-0 pt-24 text-center md:px-6 md:pb-4 md:pt-32">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            Gallery
          </span>
          <h1 className="mt-3 text-[32px] font-bold tracking-tight md:text-[48px]">
            Real cars. <span className="text-[#c5a059]">Real results.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-[#686878]">
            Every photo here is from an actual job — no stock imagery, no renders.
            Driveways, car parks, and garages across London. The finish speaks for itself.
          </p>
        </section>

        {/* DomeGallery — smaller radius so it fits fully in view on all breakpoints */}
        <section className="relative h-[82dvh] md:h-[58vh] md:min-h-[480px] md:max-h-[720px]">
          <DomeGallery
            images={galleryItems}
            segments={22}
            fit={0.38}
            fitBasis="auto"
            minRadius={320}
            padFactor={0.12}
            overlayBlurColor="#09090d"
            maxVerticalRotationDeg={4}
            dragSensitivity={26}
            enlargeTransitionMs={320}
            dragDampening={2.2}
            openedImageWidth="min(90vw, 420px)"
            openedImageHeight="min(70vh, 560px)"
            imageBorderRadius="14px"
            openedImageBorderRadius="14px"
            grayscale={false}
          />
          {/* Subtle interaction hint */}
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex justify-center">
            <span className="rounded-full border border-white/[0.06] bg-[#09090d]/60 px-4 py-1.5 text-[11px] font-medium tracking-wide text-[#9696a3] backdrop-blur-sm">
              Tap or drag to explore
            </span>
          </div>
        </section>

        {/* Supporting copy / Standards */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                Standards
              </span>
              <h2 className="mt-3 text-[24px] font-bold tracking-tight md:text-[32px]">
                Finish quality you can inspect
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#686878]">
                We photograph every job under natural and controlled light so you can see the
                result before you book. Swirl-free paint, crisp edges, and interiors that
                smell clean — not perfumed.
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-[#686878]">
                If something is not right, tell us within 48 hours and we will return to make
                it right. No forms, no fuss.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#1e40af] active:scale-[0.98]"
                >
                  Request a booking
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-6 py-3 text-[13px] font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.03]"
                >
                  View services
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[galleryItems[0], galleryItems[4], galleryItems[1], galleryItems[8]].map((item) => (
                <div
                  key={item.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.04]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    {item.category && (
                      <span className="mb-1 inline-block rounded bg-[#c5a059]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#c5a059]">
                        {item.category}
                      </span>
                    )}
                    <p className="text-[12px] font-semibold leading-snug">{item.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
