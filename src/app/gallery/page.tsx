import Image from "next/image";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80",
    alt: "Premium exterior detail result",
    category: "Exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    alt: "Paint enhancement gloss finish",
    category: "Paint",
  },
  {
    src: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80",
    alt: "Interior deep clean before",
    category: "Interior",
  },
  {
    src: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&w=800&q=80",
    alt: "Machine polish correction",
    category: "Paint",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    alt: "Ceramic coating water beading",
    category: "Protection",
  },
  {
    src: "https://images.unsplash.com/photo-1520340356584-391a6c0cdc4d?auto=format&fit=crop&w=800&q=80",
    alt: "Wheel and tyre detail",
    category: "Exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80",
    alt: "Headlight restoration",
    category: "Exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    alt: "Engine bay cleaning",
    category: "Engine",
  },
  {
    src: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=800&q=80",
    alt: "Full valet complete",
    category: "Interior",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Our <span className="text-[#3b82f6]">Work</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#a3a3a3]">
            Real results from real jobs. Every vehicle receives the same meticulous attention.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/5 bg-[#111]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded bg-[#3b82f6]/20 px-2 py-0.5 text-xs font-medium text-[#3b82f6]">
                  {item.category}
                </span>
                <p className="mt-1 text-sm font-medium">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
