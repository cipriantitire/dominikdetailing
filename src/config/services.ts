export const serviceTiers = [
  {
    id: "maintenance-detail",
    name: "Maintenance detail",
    startingPrice: 80,
    durationMinutes: 120,
  },
  {
    id: "deep-interior-reset",
    name: "Deep interior reset",
    startingPrice: 140,
    durationMinutes: 210,
  },
  {
    id: "paint-enhancement",
    name: "Paint enhancement",
    startingPrice: 220,
    durationMinutes: 300,
  },
] as const;

export const serviceExtras = [
  { id: "pet-hair", name: "Pet hair removal" },
  { id: "engine-bay", name: "Engine bay detail" },
  { id: "ceramic-sealant", name: "Ceramic sealant" },
] as const;
