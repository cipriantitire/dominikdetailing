const serviceImagePaths = {
  'premium-detailing': '/service-images/Premium%20Detailing.png',
  'full-valet': '/service-images/Full%20Valet.png',
  'mini-valet': '/service-images/Mini%20Valet.png',
  'machine-polish': '/service-images/Machine%20Polish.png',
  'ceramic-coating': '/service-images/Ceramic%20Coating.png',
  'maintenance-wash': '/service-images/Maintenance%20Wash.png',
} as const;

export const serviceTiers = [
  {
    id: "premium-detailing",
    name: "Premium Detailing",
    shortDescription: "Complete interior and exterior deep clean",
    startingPrice: 250,
    durationMinutes: 300,
    features: [
      "Exterior pre-wash, hand wash & safe dry",
      "Full interior vacuum and deep-clean",
      "Engine bay cleaning",
      "Tyres dressed & rim care",
    ],
    image: serviceImagePaths["premium-detailing"],
    popular: true,
  },
  {
    id: "full-valet",
    name: "Full Valet",
    shortDescription: "Deep interior refresh with exterior clean",
    startingPrice: 200,
    durationMinutes: 240,
    features: [
      "Thorough interior vacuum and dust removal",
      "Seats, mats and carpets deep cleaned",
      "Dashboard, console and panels detailed",
      "Exterior wash with tyre and trim finish",
    ],
    image: serviceImagePaths["full-valet"],
    popular: false,
  },
  {
    id: "mini-valet",
    name: "Mini Valet",
    shortDescription: "Essential interior and exterior refresh",
    startingPrice: 120,
    durationMinutes: 120,
    features: [
      "Exterior hand wash and safe dry",
      "Interior vacuum and surface wipe-down",
      "Windows cleaned inside and out",
      "Tyres dressed for a clean finish",
    ],
    image: serviceImagePaths["mini-valet"],
    popular: false,
  },
  {
    id: "machine-polish",
    name: "Machine Polish",
    shortDescription: "Paint correction and gloss enhancement",
    startingPrice: 599,
    durationMinutes: 480,
    features: [
      "Paint decontamination before polishing",
      "Light swirl marks and haze reduced",
      "Gloss and depth significantly improved",
      "Protection applied after correction",
    ],
    image: serviceImagePaths["machine-polish"],
    popular: false,
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    shortDescription: "Durable paint protection and enhanced shine",
    startingPrice: 199,
    durationMinutes: 180,
    features: [
      "Hydrophobic protection against water and grime",
      "Easier maintenance and safer washing",
      "Improved gloss and slick finish",
      "Long-lasting protection for painted surfaces",
    ],
    image: serviceImagePaths["ceramic-coating"],
    popular: false,
  },
  {
    id: "maintenance-wash",
    name: "Maintenance Wash",
    shortDescription: "Regular upkeep for already cared-for vehicles",
    startingPrice: 79,
    durationMinutes: 90,
    features: [
      "Safe exterior wash and contact dry",
      "Wheels, tyres and arches cleaned",
      "Light interior vacuum and wipe-down",
      "Perfect for returning clients and regular care",
    ],
    image: serviceImagePaths["maintenance-wash"],
    popular: false,
  },
] as const;

export type ServiceTier = (typeof serviceTiers)[number]["id"];

export function getServiceTierById(id: string) {
  return serviceTiers.find((service) => service.id === id);
}

export function getServiceImagePath(serviceId: string) {
  return getServiceTierById(serviceId)?.image ?? '';
}

export function getServiceImageUrl(serviceId: string, siteUrl?: string | null) {
  const imagePath = getServiceImagePath(serviceId);
  if (!imagePath) return '';
  if (/^https?:\/\//.test(imagePath)) return imagePath;
  if (!siteUrl) return imagePath;
  return `${siteUrl.replace(/\/$/, '')}${imagePath}`;
}

export const serviceExtras = [
  { id: "clay-bar", name: "Clay Bar Decontamination", price: 39 },
  { id: "hydrophobic-windows", name: "Hydrophobic Window Treatment", price: 29 },
  { id: "headlight-restoration", name: "Headlight Restoration", price: 79 },
  { id: "leather-treatment", name: "Leather Treatment", price: 49 },
  { id: "stain-extraction", name: "Stain Extraction", price: 49 },
  { id: "pet-hair", name: "Pet Hair", price: 49 },
  { id: "mud-sand", name: "Mud / Sand", price: 39 },
  { id: "child-seats", name: "Child Seats", price: 29 },
  { id: "engine-bay", name: "Engine Bay Cleaning", price: 39 },
  { id: "odour-treatment", name: "Odour Treatment", price: 49 },
  { id: "heavily-soiled", name: "Heavily Soiled Interior", price: 79 },
  { id: "large-suv", name: "Large SUV / 7-seater", price: 45 },
] as const;

export type ServiceExtra = (typeof serviceExtras)[number]["id"];

export const timeWindows = [
  "Morning (8am - 12pm)",
  "Afternoon (12pm - 4pm)",
  "Evening (4pm - 6pm)",
] as const;
