export type GalleryItem = {
  src: string;
  alt: string;
  category?: string;
};

// Real gallery photography from completed jobs across London and surrounding areas.
// These are actual customer vehicles — not stock imagery or service marketing renders.
const realGalleryPhotos: GalleryItem[] = [
  // Full vehicle shots
  { src: "/gallery-photos/photo_1_2026-04-22_20-09-45.jpg", alt: "Mercedes-AMG GT R — full detail finish", category: "Full Detail" },
  { src: "/gallery-photos/photo_1_2026-04-22_20-10-03.jpg", alt: "Ferrari F355 Berlinetta — paint correction result", category: "Paint Correction" },
  { src: "/gallery-photos/photo_2_2026-04-22_20-09-45.jpg", alt: "Genesis G80 — ceramic coating aftercare", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_2_2026-04-22_20-10-03.jpg", alt: "Ferrari F355 — rear three-quarter after polish", category: "Paint Correction" },
  { src: "/gallery-photos/photo_3_2026-04-22_20-09-45.jpg", alt: "BMW M4 — exterior valet finish", category: "Full Valet" },
  { src: "/gallery-photos/photo_3_2026-04-22_20-10-03.jpg", alt: "Range Rover — deep clean completion", category: "Full Detail" },
  { src: "/gallery-photos/photo_4_2026-04-22_20-09-45.jpg", alt: "Porsche 911 — paint enhancement result", category: "Paint Correction" },
  { src: "/gallery-photos/photo_4_2026-04-22_20-10-03.jpg", alt: "Audi RS6 — exterior detail finish", category: "Full Detail" },
  { src: "/gallery-photos/photo_6_2026-04-22_20-09-45.jpg", alt: "Mercedes E-Class — premium detail", category: "Premium Detail" },
  { src: "/gallery-photos/photo_6_2026-04-22_20-10-03.jpg", alt: "BMW 5 Series — full valet completion", category: "Full Valet" },
  { src: "/gallery-photos/photo_7_2026-04-22_20-09-45.jpg", alt: "Tesla Model S — exterior ceramic protection", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_7_2026-04-22_20-10-03.jpg", alt: "Jaguar F-Type — paint correction finish", category: "Paint Correction" },
  { src: "/gallery-photos/photo_8_2026-04-22_20-09-45.jpg", alt: "Range Rover Sport — deep interior clean", category: "Interior" },
  { src: "/gallery-photos/photo_8_2026-04-22_20-10-03.jpg", alt: "Audi Q7 — full detail result", category: "Full Detail" },
  { src: "/gallery-photos/photo_9_2026-04-22_20-09-45.jpg", alt: "Porsche Cayenne — exterior valet", category: "Full Valet" },
  { src: "/gallery-photos/photo_9_2026-04-22_20-10-03.jpg", alt: "BMW X5 — ceramic coating result", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_10_2026-04-22_20-09-45.jpg", alt: "Mercedes C-Class — paint correction", category: "Paint Correction" },
  { src: "/gallery-photos/photo_10_2026-04-22_20-10-03.jpg", alt: "Volkswagen Golf R — full detail", category: "Full Detail" },
  { src: "/gallery-photos/photo_11_2026-04-22_20-09-45.jpg", alt: "Audi A5 — exterior detail", category: "Full Detail" },
  { src: "/gallery-photos/photo_11_2026-04-22_20-10-03.jpg", alt: "BMW 3 Series — premium valet finish", category: "Premium Detail" },
  { src: "/gallery-photos/photo_12_2026-04-22_20-09-45.jpg", alt: "Range Rover Velar — deep clean", category: "Full Detail" },
  { src: "/gallery-photos/photo_12_2026-04-22_20-10-03.jpg", alt: "Mercedes GLC — ceramic coating", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_13_2026-04-22_20-09-45.jpg", alt: "Porsche Panamera — paint enhancement", category: "Paint Correction" },
  { src: "/gallery-photos/photo_13_2026-04-22_20-10-03.jpg", alt: "Audi TT — full valet result", category: "Full Valet" },
  { src: "/gallery-photos/photo_14_2026-04-22_20-09-45.jpg", alt: "BMW M3 — exterior detail finish", category: "Full Detail" },
  { src: "/gallery-photos/photo_14_2026-04-22_20-10-03.jpg", alt: "Mercedes A-Class — maintenance wash", category: "Maintenance" },
  { src: "/gallery-photos/photo_15_2026-04-22_20-09-45.jpg", alt: "Jaguar XF — premium detail", category: "Premium Detail" },
  { src: "/gallery-photos/photo_15_2026-04-22_20-10-03.jpg", alt: "Volvo XC90 — full valet completion", category: "Full Valet" },
  { src: "/gallery-photos/photo_16_2026-04-22_20-09-45.jpg", alt: "Tesla Model 3 — ceramic coating", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_16_2026-04-22_20-10-03.jpg", alt: "BMW X3 — paint correction result", category: "Paint Correction" },
  { src: "/gallery-photos/photo_17_2026-04-22_20-09-45.jpg", alt: "Audi A6 — exterior detail", category: "Full Detail" },
  { src: "/gallery-photos/photo_17_2026-04-22_20-10-03.jpg", alt: "Mercedes S-Class — premium valet", category: "Premium Detail" },
  { src: "/gallery-photos/photo_18_2026-04-22_20-09-45.jpg", alt: "Range Rover Evoque — deep clean", category: "Full Detail" },
  { src: "/gallery-photos/photo_18_2026-04-22_20-10-03.jpg", alt: "Porsche Macan — ceramic coating", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_19_2026-04-22_20-09-45.jpg", alt: "BMW 7 Series — paint correction", category: "Paint Correction" },
  { src: "/gallery-photos/photo_19_2026-04-22_20-10-03.jpg", alt: "Audi Q5 — full detail result", category: "Full Detail" },
  { src: "/gallery-photos/photo_20_2026-04-22_20-09-45.jpg", alt: "Mercedes GLE — exterior valet", category: "Full Valet" },
  { src: "/gallery-photos/photo_20_2026-04-22_20-10-03.jpg", alt: "Jaguar E-Pace — maintenance wash", category: "Maintenance" },
  { src: "/gallery-photos/photo_21_2026-04-22_20-09-45.jpg", alt: "Tesla Model Y — ceramic coating", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_21_2026-04-22_20-10-03.jpg", alt: "BMW 4 Series — paint enhancement", category: "Paint Correction" },
  { src: "/gallery-photos/photo_22_2026-04-22_20-09-45.jpg", alt: "Audi A4 — full detail finish", category: "Full Detail" },
  { src: "/gallery-photos/photo_22_2026-04-22_20-10-03.jpg", alt: "Mercedes CLA — premium valet", category: "Premium Detail" },
  { src: "/gallery-photos/photo_23_2026-04-22_20-09-45.jpg", alt: "Porsche Taycan — exterior detail", category: "Full Detail" },
  { src: "/gallery-photos/photo_23_2026-04-22_20-10-03.jpg", alt: "BMW X1 — ceramic coating result", category: "Ceramic Coating" },
  { src: "/gallery-photos/photo_24_2026-04-22_20-10-03.jpg", alt: "Range Rover — deep interior clean", category: "Interior" },
  // Close-up / detail shots
  { src: "/gallery-photos/photo_5_2026-04-22_20-09-45.jpg", alt: "Paint correction — swirl removal close-up", category: "Paint Correction" },
  { src: "/gallery-photos/photo_5_2026-04-22_20-10-03.jpg", alt: "Ceramic coating — water beading test", category: "Ceramic Coating" },
];

// A small, opinionated gallery data source using local public asset URLs.
// Keep this file minimal — Kimi can consume `galleryItems` directly or call
// `getGalleryItems(siteUrl)` to get absolute URLs when needed.
export const galleryItems: GalleryItem[] = realGalleryPhotos;

export function getGalleryItems(siteUrl?: string): GalleryItem[] {
  if (!siteUrl) return galleryItems;
  return galleryItems.map((item) => ({
    ...item,
    src: /^https?:\/\//.test(item.src) ? item.src : `${siteUrl.replace(/\/$/, "")}${item.src}`,
  }));
}
