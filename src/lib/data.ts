export const siteConfig = {
  name: "Shade & Shine",
  tagline: "Premium Detailing & Tinting",
  location: "Norfolk County, ON",
  address: "276 Hillcrest Road, Simcoe, ON",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=276+Hillcrest+Road,+Simcoe,+ON",
  phone: "519-410-8304",
  email: "info@shadeandshine.ca",
  googleReviewsUrl: "https://g.co/kgs/zLodqUX",
  bookingUrl: "#book",
  social: {
    facebook: "https://www.facebook.com/shadeandshine",
    instagram: "https://www.instagram.com/shadeandshine",
  },
};

export const services = [
  {
    id: "detailing",
    title: "Auto Detailing",
    description:
      "Deep interior and exterior cleaning that restores your vehicle's showroom shine.",
    icon: "sparkles",
    features: ["Hand wash & decontamination", "Interior deep clean", "Engine bay detail"],
  },
  {
    id: "ceramic",
    title: "Feynlab Ceramic Coating",
    description:
      "Professional-grade ceramic protection with extreme gloss and long-lasting durability.",
    icon: "shield",
    features: ["Up to 5-year warranty", "Self-healing options", "VIN registration"],
  },
  {
    id: "tint",
    title: "Window Tint",
    description:
      "Enhance privacy, reduce glare, and protect your interior from harmful UV rays.",
    icon: "sun",
    features: ["Automotive & flat glass", "Legal compliance", "Lifetime warranty options"],
  },
  {
    id: "correction",
    title: "Paint Correction",
    description:
      "Remove swirls, scratches, and imperfections for a flawless mirror finish.",
    icon: "gem",
    features: ["Single & multi-stage", "Swirl removal", "Gloss enhancement"],
  },
  {
    id: "ppf",
    title: "Paint Protection Film",
    description:
      "Invisible shield against chips, scratches, and daily road wear.",
    icon: "layers",
    features: ["XPEL certified options", "Self-healing film", "Full front packages"],
  },
  {
    id: "wrap",
    title: "Vinyl Wraps",
    description:
      "Transform your vehicle with custom colors, finishes, and color-shifting designs.",
    icon: "palette",
    features: ["Color-shift wraps", "Matte & gloss finishes", "Custom branding"],
  },
];

export const ppfPackages = [
  {
    id: "bronze",
    name: "Bronze Package",
    price: 899.99,
    film: "XPEL Ultimate Plus PPF",
    description:
      "Essential protection for the areas that take the most impact. Shields partial hood and fenders from chips, bugs, and debris.",
    summary:
      "Partial front coverage for everyday drivers who want smart protection without overpaying.",
    features: ["Partial Hood", "Partial Fenders"],
    coverage: ["hoodPartial", "fendersPartial"],
    shields: 1,
  },
  {
    id: "silver",
    name: "Silver Package",
    price: 1299.99,
    film: "XPEL Ultimate Plus PPF",
    description:
      "Adds stronger coverage across the front end, including bumper and mirrors. Balanced protection with a clean, invisible finish.",
    summary:
      "Front-end film with full bumper and mirrors. The popular choice for Norfolk County drivers.",
    features: ["Partial Hood", "Full Front Bumper", "Partial Fenders", "Mirrors"],
    coverage: ["hoodPartial", "bumper", "fendersPartial", "mirrors"],
    shields: 2,
  },
  {
    id: "gold",
    name: "Gold Package",
    price: 1599.99,
    film: "XPEL Ultimate Plus PPF",
    description:
      "Full front coverage that defends your paint against highway wear, road rash, and rock chips from every angle.",
    summary:
      "Complete front-end coverage for lasting clarity and protection.",
    features: ["Full Hood", "Full Fenders", "Full Front Bumper", "Mirrors"],
    coverage: ["hood", "fenders", "bumper", "mirrors"],
    shields: 3,
  },
  {
    id: "platinum",
    name: "Platinum Package",
    price: 4499.99,
    film: "XPEL Ultimate Plus PPF",
    description:
      "The ultimate PPF package with full-body coverage and headlight protection. Every painted surface sealed for total defense.",
    summary:
      "Complete vehicle coverage. Full-body film protection for your paint.",
    features: [
      "Entire Vehicle",
      "Headlight Protection",
      "Doors & Rockers",
      "Rear Bumper",
      "Roof & Pillars",
      "All Painted Panels",
    ],
    coverage: [
      "bumper",
      "hood",
      "fenders",
      "mirrors",
      "headlights",
      "doors",
      "rockers",
      "rear",
      "roof",
    ],
    shields: 4,
  },
];

export type PricingTier = {
  sedan?: number;
  suv?: number;
  trucks?: number;
  vans?: number;
  small?: number;
  windshield?: number;
  allWindows?: number;
  single?: number;
  note?: string;
};

export type PricingPackage = {
  name: string;
  description: string;
  price?: number;
  duration?: string;
  warranty?: string;
  highlight?: boolean;
  quote?: boolean;
  comingSoon?: boolean;
  tiers?: PricingTier;
  features: string[];
  interior?: string[];
  exterior?: string[];
};

export type PricingCategory = {
  id: string;
  label: string;
  packages: PricingPackage[];
};

/** Kept for any legacy imports; mirrors ceramic tab. */
export const pricingPackages: PricingPackage[] = [
  {
    name: "Feynlab Ceramic Lite",
    description:
      "The original Feynlab ceramic coating, with brilliant gloss and solid 1-year protection.",
    price: 594.99,
    duration: "8 hrs",
    warranty: "1 Year",
    highlight: false,
    features: [
      "Full wash + decontamination",
      "Single stage paint correction",
      "Brilliant gloss protection",
      "VIN registration & digital warranty",
    ],
  },
  {
    name: "Feynlab Ceramic V3",
    description:
      "Extreme high gloss and durable 3-year coating with strong UV and chemical resistance.",
    price: 804.99,
    duration: "9 hrs",
    warranty: "3 Years",
    highlight: true,
    features: [
      "Full wash + decontamination",
      "Single stage paint correction",
      "Extreme high gloss finish",
      "UV & chemical resistance",
      "120° water bead angle",
    ],
  },
  {
    name: "Feynlab Ceramic ULTRA",
    description:
      "Self-healing properties and a 120-degree water bead angle in a top-tier 5-year coating.",
    price: 1144.99,
    duration: "10 hrs",
    warranty: "5 Years",
    highlight: false,
    features: [
      "One day turnaround",
      "Self-healing properties",
      "120° water bead angle",
      "Extreme gloss & UV protection",
      "Premium VIN warranty package",
    ],
  },
  {
    name: "Feynlab Self Heal Lite",
    description:
      "Self-healing technology with robust protection and an unmatched finish. Stronger than Ultra.",
    price: 1449.0,
    duration: "12 hrs",
    warranty: "5 Years",
    highlight: false,
    features: [
      "One day turnaround",
      "Self healing (60% of Heal Plus)",
      "Extreme high gloss",
      "120° water bead angle",
      "UV & chemical resistance",
    ],
  },
  {
    name: "Feynlab Glass Coating",
    description:
      "Better visibility and water repellency on glass with Feynlab glass coating.",
    tiers: { windshield: 84.99, allWindows: 204.99 },
    features: [
      "Windows polished with cerium oxide",
      "Professional Feynlab glass coating",
      "Enhanced visibility in rain",
      "Easier glass cleaning",
    ],
  },
];

export const pricingCategories: PricingCategory[] = [
  {
    id: "ceramic",
    label: "Ceramic",
    packages: pricingPackages,
  },
  {
    id: "in-out",
    label: "In & Out",
    packages: [
      {
        name: "Standard In & Out",
        description: "A full clean for both the interior and exterior.",
        tiers: { sedan: 239.99, suv: 284.99 },
        features: [],
        interior: [
          "All surfaces scrubbed & cleaned",
          "Crevices blown out with compressed air",
          "Interior windows cleaned",
          "Light crevice cleaning",
          "Full vacuum including cracks and crevices",
          "Seat cleaning (leather & fabric)",
        ],
        exterior: [
          "Two-bucket hand wash",
          "Pre wash",
          "Foam cannon",
          "Door jamb wipe down",
          "Drying",
          "Wheel cleaning",
          "Exterior window cleaning",
        ],
      },
      {
        name: "Standard Plus In & Out",
        description:
          "Deeper interior cleaning plus exterior protection with wax.",
        tiers: { sedan: 329.99, suv: 399.99 },
        highlight: true,
        features: [],
        interior: [
          "Everything in Standard",
          "Leather conditioning",
          "Fresh scent",
          "Light carpet & upholstery shampoo",
          "Steam cleaning (vents & hard surfaces)",
          "Medium crevice cleaning",
          "Door jamb wipe down",
          "Mat shine",
        ],
        exterior: [
          "Everything in Standard",
          "Tire shine",
          "Bug removal",
          "Wheel well cleaning",
          "Wax for gloss",
        ],
      },
      {
        name: "Deluxe In & Out",
        description: "Our most thorough in & out package for a full refresh.",
        tiers: { sedan: 459.99, suv: 549.99 },
        features: [],
        interior: [
          "Everything in Standard Plus",
          "Heavy crevice cleaning",
          "Heavy carpet & upholstery shampoo",
          "Full stain extraction",
          "Console and glovebox deep clean",
          "Plastic and vinyl protectant",
        ],
        exterior: [
          "Everything in Standard Plus",
          "Clay bar with iron decon",
          "Machine-applied sealant wax",
          "Thorough wheel well cleaning",
          "Exhaust tip cleaning",
          "Paint decontamination",
          "Bug mark polishing on mirrors",
        ],
      },
    ],
  },
  {
    id: "interior",
    label: "Interior",
    packages: [
      {
        name: "Standard Interior",
        description: "A thorough interior clean to refresh the cabin.",
        tiers: { sedan: 169.99, suv: 199.99 },
        features: [
          "All surfaces scrubbed & cleaned",
          "Crevices blown out with compressed air",
          "Interior windows cleaned",
          "Light crevice cleaning",
          "Full vacuum including cracks and crevices",
          "Seat cleaning (leather & fabric)",
        ],
      },
      {
        name: "Standard Plus Interior",
        description: "A deeper interior detail when the cabin needs extra care.",
        tiers: { sedan: 199.99, suv: 234.99 },
        highlight: true,
        features: [
          "Everything in Standard",
          "Leather conditioning",
          "Fresh scent",
          "Light carpet & upholstery shampoo",
          "Steam cleaning (vents & hard surfaces)",
          "Medium crevice cleaning",
          "Door jamb wipe down",
          "Mat shine",
        ],
      },
      {
        name: "Deluxe Interior",
        description: "Our most complete interior package for a full cabin reset.",
        tiers: { sedan: 249.99, suv: 289.99 },
        features: [
          "Everything in Standard Plus",
          "Heavy crevice cleaning",
          "Heavy carpet & upholstery shampoo",
          "Full stain extraction",
          "Console and glovebox deep clean",
          "Plastic and vinyl protectant",
        ],
      },
    ],
  },
  {
    id: "exterior",
    label: "Exterior",
    packages: [
      {
        name: "Standard Exterior",
        description: "Safe hand wash for a clean, streak-free finish.",
        tiers: { sedan: 69.99, suv: 79.99 },
        features: [
          "Two-bucket hand wash",
          "Pre wash",
          "Foam cannon",
          "Door jamb wipe down",
          "Drying",
          "Wheel cleaning",
          "Exterior window cleaning",
        ],
      },
      {
        name: "Standard Plus Exterior (Wax)",
        description:
          "Adds gloss and a protective barrier against UV, dirt, and contaminants.",
        tiers: { sedan: 129.99, suv: 184.99 },
        highlight: true,
        features: [
          "Everything in Standard",
          "Tire shine",
          "Bug removal",
          "Wheel well cleaning",
          "Wax for gloss",
        ],
      },
      {
        name: "Deluxe Paint Decon",
        description:
          "Clay bar, iron decon, and sealant wax to revive and protect paint.",
        tiers: { sedan: 214.99, suv: 269.99 },
        features: [
          "Everything in Standard Plus",
          "Clay bar with iron decon",
          "Machine-applied sealant wax",
          "Thorough wheel well cleaning",
          "Exhaust tip cleaning",
          "Paint decontamination",
          "Bug mark polishing on mirrors",
        ],
      },
    ],
  },
  {
    id: "tint",
    label: "Window Tint",
    packages: [
      {
        name: "Sun Strip",
        description: "A windshield sun strip to cut glare.",
        tiers: { small: 69.99, suv: 94.99 },
        features: [
          "Professional installation",
          "Choice of VLT shade for the strip",
        ],
      },
      {
        name: "Standard Film (Full Car)",
        description:
          "Carbon film for heat rejection and UV protection. Request a quote for pricing.",
        quote: true,
        features: [
          "All side windows and rear windshield",
          "Carbon-based film (non-metallic)",
          "99% UV rejection",
          "Various VLT shades available",
          "Warrantied against fading and bubbling",
        ],
      },
      {
        name: "Standard Film (Front Windshield)",
        description:
          "Front windshield tint with quality carbon film. Request a quote for pricing.",
        quote: true,
        features: [
          "Full front windshield coverage",
          "Carbon-based film (non-metallic)",
          "99% UV rejection",
          "Reduces glare and heat",
          "Warrantied against fading and bubbling",
        ],
      },
      {
        name: "Standard Film (Two Front Windows)",
        description:
          "Driver and passenger front windows with carbon film. Request a quote for pricing.",
        quote: true,
        features: [
          "Driver and passenger front windows",
          "Carbon-based film (non-metallic)",
          "99% UV rejection",
          "Matches factory rear tint",
          "Warrantied against fading and bubbling",
        ],
      },
      {
        name: "Ceramic Film (Full Car)",
        description:
          "Ceramic film for superior heat rejection and clarity. Request a quote for pricing.",
        quote: true,
        features: [
          "All side windows and rear windshield",
          "Ceramic particle technology",
          "Superior IR heat rejection",
          "No signal interference",
          "99% UV rejection",
        ],
      },
      {
        name: "Ceramic Film (Front Windshield)",
        description:
          "Maximum heat rejection for the front windshield. Request a quote for pricing.",
        quote: true,
        features: [
          "Full front windshield coverage",
          "Ceramic particle technology",
          "Superior IR heat rejection",
          "No signal interference",
          "99% UV rejection",
        ],
      },
      {
        name: "Ceramic Film (Two Front Windows)",
        description:
          "Maximum heat rejection for the two front windows. Request a quote for pricing.",
        quote: true,
        features: [
          "Driver and passenger front windows",
          "Ceramic particle technology",
          "Superior IR heat rejection",
          "No signal interference",
          "99% UV rejection",
        ],
      },
    ],
  },
  {
    id: "addons",
    label: "Add-ons",
    packages: [
      {
        name: "Headliner Cleaning",
        description: "Removes stains and restores factory colour to the headliner.",
        price: 69.99,
        features: [],
      },
      {
        name: "Leather Conditioning & Cleaning",
        description: "Brings leather back to that factory shine and feel.",
        price: 34.99,
        features: [],
      },
      {
        name: "Full Shampoo / Stain Removal",
        description:
          "Thorough stain removal in carpets and seats. Price may vary with severity.",
        price: 104.99,
        features: [],
      },
      {
        name: "Intensive Pet Hair Removal",
        description: "Priced per seat area covered.",
        price: 14.99,
        features: ["Priced per seat area"],
      },
      {
        name: "Rubber Mat Shine",
        description: "Brings rubber mats back to factory shine.",
        price: 24.99,
        features: [],
      },
      {
        name: "Truck Bed Rinsing",
        description: "Rinses dirt and debris from the truck bed.",
        price: 24.99,
        features: [],
      },
      {
        name: "Headlight Restore",
        description: "Restores clarity and helps improve night visibility.",
        price: 69.99,
        features: [],
      },
      {
        name: "Shampoo / Stain Removal Per Seat",
        description: "Targeted shampoo and stain removal for individual seat areas.",
        price: 29.99,
        features: ["Priced per seat area"],
      },
      {
        name: "Under Carriage Rinse",
        description:
          "Removes salt and debris under the vehicle to help prevent rust.",
        price: 24.99,
        features: [
          "Removes salt and debris",
          "Helps prevent rust",
          "Cleans buildup on mechanical components",
        ],
      },
      {
        name: "Deep Gloss Sealant (Black Vehicles)",
        description: "Specialized sealant to deepen gloss on black paint.",
        comingSoon: true,
        features: ["Coming soon"],
      },
      {
        name: "Ozone Treatment",
        description: "Removes and neutralizes stubborn interior odours.",
        price: 49.99,
        features: [],
      },
    ],
  },
];

export const whyChooseUs = [
  {
    title: "Expert Craftsmanship",
    description:
      "Certified technicians using industry-leading techniques and premium products for results that last.",
  },
  {
    title: "Attention to Detail",
    description:
      "Every surface gets careful attention, from carpets and crevices to paint, glass, and trim.",
  },
  {
    title: "Satisfaction Guaranteed",
    description:
      "We stand behind our work and aim to exceed expectations across Norfolk County and nearby areas.",
  },
];

export const wrapColors = [
  {
    id: "midnight",
    name: "Midnight Black",
    gradient: "from-zinc-900 via-zinc-800 to-black",
    accent: "#121318",
    image: "/wraps/midnight.png",
    shimmer: false,
  },
  {
    id: "arctic",
    name: "Arctic White",
    gradient: "from-slate-100 via-white to-zinc-200",
    accent: "#eceef2",
    image: "/wraps/arctic.png",
    shimmer: false,
  },
  {
    id: "crimson",
    name: "Crimson Red",
    gradient: "from-red-700 via-red-600 to-red-900",
    accent: "#a81622",
    image: "/wraps/crimson.png",
    shimmer: false,
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    gradient: "from-blue-600 via-blue-500 to-indigo-700",
    accent: "#1c4ea8",
    image: "/wraps/ocean.png",
    shimmer: false,
  },
  {
    id: "aurora",
    name: "Aurora Shift",
    gradient: "from-violet-600 via-fuchsia-500 to-cyan-400",
    accent: "#7830be",
    image: "/wraps/aurora.png",
    shimmer: true,
  },
  {
    id: "chameleon",
    name: "Chameleon",
    gradient: "from-emerald-400 via-amber-400 to-rose-500",
    accent: "#28aa6e",
    image: "/wraps/chameleon.png",
    shimmer: true,
  },
  {
    id: "satin-chrome",
    name: "Satin Chrome",
    gradient: "from-zinc-300 via-zinc-100 to-zinc-400",
    accent: "#9498a2",
    image: "/wraps/satin-chrome.png",
    shimmer: false,
  },
  {
    id: "matte-forge",
    name: "Matte Forge",
    gradient: "from-stone-600 via-stone-500 to-stone-700",
    accent: "#767068",
    image: "/wraps/matte-forge.png",
    shimmer: false,
  },
];

export const beforeAfterProjects = [
  {
    id: 1,
    title: "Driver Cabin",
    vehicle: "GMC Sierra",
    service: "Standard Interior Detail",
    before: "/assets/projects/transforms/before-01.jpg",
    after: "/assets/projects/transforms/after-01.jpg",
  },
  {
    id: 2,
    title: "Passenger Cabin",
    vehicle: "Toyota RAV4",
    service: "Standard Plus Interior Detail",
    before: "/assets/projects/transforms/before-02.jpg",
    after: "/assets/projects/transforms/after-02.jpg",
  },
  {
    id: 3,
    title: "Passenger Cabin",
    vehicle: "Chevy Trax",
    service: "Standard In & Out Detail",
    before: "/assets/projects/transforms/before-03.jpg",
    after: "/assets/projects/transforms/after-03.jpg",
  },
];

export const galleryProjects = [
  {
    id: 1,
    title: "Ford F-150",
    service: "Standard Plus Detail",
    image: "/assets/projects/project-01.jpg",
  },
  {
    id: 2,
    title: "Mercedes Sprinter",
    service: "Ceramic Restoration",
    image: "/assets/projects/project-02.jpg",
  },
  {
    id: 3,
    title: "Chevy Trax",
    service: "Full Detail",
    image: "/assets/projects/project-03.jpg",
  },
  {
    id: 4,
    title: "Audi A7",
    service: "Window Tint",
    image: "/assets/projects/project-04.jpg",
  },
  {
    id: 5,
    title: "Ford Edge",
    service: "Interior Detail + Ceramic",
    image: "/assets/projects/project-05.jpg",
  },
  {
    id: 6,
    title: "GMC Sierra",
    service: "Interior Detail",
    image: "/assets/projects/project-06.jpg",
  },
  {
    id: 7,
    title: "Crownline 18ft",
    service: "Marine Restoration",
    image: "/assets/projects/project-07.jpg",
  },
  {
    id: 8,
    title: "Bayliner 24ft",
    service: "Cut & Polish",
    image: "/assets/projects/project-08.jpg",
  },
  {
    id: 9,
    title: "Harley-Davidson",
    service: "Ceramic Coating",
    image: "/assets/projects/project-09.jpg",
  },
];

export const reviews = [
  {
    name: "Shalanda Waite",
    location: "Norfolk County, ON",
    vehicle: "Sedan",
    rating: 5,
    text: "Couldn't be more happy with the results of my tint! Shade and Shine did a phenomenal job and I would recommend their services to anyone! My car was even picked up and delivered right back to my home!",
  },
  {
    name: "Freida Kralj",
    location: "Norfolk County, ON",
    vehicle: "SUV",
    rating: 5,
    text: "Best detail cleaning I have ever had. Connor takes pride in his work and goes beyond detailing. AMAZING!! The only place I will ever go to.",
  },
  {
    name: "Colton Whiteman",
    location: "Local Customer",
    vehicle: "Truck",
    rating: 5,
    text: "Amazing service and attention to detail! Shade and Shine was a pleasure to work with, and made sure everything was perfect. Would highly recommend them!",
  },
  {
    name: "Belinda K",
    location: "Norfolk County, ON",
    vehicle: "Ford F150",
    rating: 5,
    text: "Quick, thorough and friendly service. My truck looks better than she did the day we bought her.",
  },
  {
    name: "Krista S",
    location: "Simcoe, ON",
    vehicle: "Hyundai Tucson",
    rating: 5,
    text: "Amazing job. My SUV looks as good as the day I bought it. Can't wait until late spring to get the exterior done.",
  },
];

export const stats = [
  { value: "500+", label: "Vehicles Detailed" },
  { value: "5.0", label: "Google Rating" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction" },
];
