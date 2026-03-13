export const CATEGORY_PRICE_RANGES = {
    electronics: [
      { label: "Under ₦50k", min: 0, max: 50000 },
      { label: "₦50k - ₦200k", min: 50000, max: 200000 },
      { label: "₦200k - ₦600k", min: 200000, max: 600000 },
      { label: "Above ₦600k", min: 600000 },
    ],
  
    gadget: [
      { label: "Under ₦30k", min: 0, max: 30000 },
      { label: "₦30k - ₦100k", min: 30000, max: 100000 },
      { label: "₦100k - ₦300k", min: 100000, max: 300000 },
      { label: "Above ₦300k", min: 300000 },
    ],
  
    house: [
      { label: "Under ₦500k", min: 0, max: 500000 },
      { label: "₦500k - ₦2M", min: 500000, max: 2000000 },
      { label: "₦2M - ₦10M", min: 2000000, max: 10000000 },
      { label: "Above ₦10M", min: 10000000 },
    ],
  
    jobs: [
      { label: "Hourly (₦0 - ₦5k)", min: 0, max: 5000 },
      { label: "Weekly (₦5k - ₦50k)", min: 5000, max: 50000 },
      { label: "Monthly (₦50k+)", min: 50000 },
    ],
  
    default: [
      { label: "Low", min: 0, max: 50000 },
      { label: "Medium", min: 50000, max: 200000 },
      { label: "High", min: 200000 },
    ],
  };
  
  export function getPriceRanges(slug) {
    if (!slug) return CATEGORY_PRICE_RANGES.default;
  
    const key = slug.replace(/-/g, "").toLowerCase();
    return CATEGORY_PRICE_RANGES[key] || CATEGORY_PRICE_RANGES.default;
  }