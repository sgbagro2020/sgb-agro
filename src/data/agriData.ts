import { Product, Service, Achievement, GalleryItem, Testimonial, FAQItem } from '../types';

import heroAgriBanner from '../assets/images/hero_agri_banner_1786001710249.jpg';
import sgbElevateAwardCeremony from '../assets/images/elevate_award_actual_1786095277705.jpg';
import elevateAwardBg from '../assets/images/elevate_award_bg_1786001740267.jpg';
import smartIrrigationMachinery from '../assets/images/smart_irrigation_machinery_1786001755337.jpg';

import trolleyImg1 from '../assets/images/sgb_brush_cutter_trolley_1_1786011204096.jpg';
import trolleyImg2 from '../assets/images/sgb_brush_cutter_trolley_2_1786011223432.jpg';
import trolleyImg3 from '../assets/images/sgb_brush_cutter_trolley_3_1786011242596.jpg';
import trolleyImg4 from '../assets/images/sgb_brush_cutter_trolley_4_1786011262338.jpg';
import trolleyImg5 from '../assets/images/sgb_brush_cutter_trolley_5_1786011285243.jpg';

import sgb143rImg1 from '../assets/images/sgb_143r_brush_1_1786013198161.jpg';
import sgb143rImg2 from '../assets/images/sgb_143r_brush_2_1786013211409.jpg';
import sgb143rImg3 from '../assets/images/sgb_143r_brush_3_1786013221489.jpg';
import sgb143rImg4 from '../assets/images/sgb_143r_brush_4_1786013232074.jpg';

import sgbBackpackImg1 from '../assets/images/sgb_backpack_trolley_1_1786013365348.jpg';
import sgbBackpackImg2 from '../assets/images/sgb_backpack_trolley_2_1786013385615.jpg';
import sgbBackpackImg3 from '../assets/images/sgb_backpack_trolley_3_1786013400490.jpg';

import sgbDumperImg1 from '../assets/images/sgb_dumper_wheelbarrow_1_1786013767619.jpg';
import sgbDumperImg2 from '../assets/images/sgb_dumper_wheelbarrow_2_1786013782389.jpg';
import sgbDumperImg3 from '../assets/images/sgb_dumper_wheelbarrow_3_1786013796533.jpg';

import sgbTapGoImg1 from '../assets/images/sgb_tap_go_head_1_1786013985121.jpg';
import sgbTapGoImg2 from '../assets/images/sgb_tap_go_head_2_1786013996139.jpg';
import sgbTapGoImg3 from '../assets/images/sgb_tap_go_head_3_1786014006992.jpg';

import sgbTillerImg1 from '../assets/images/sgb_tiller_attachment_1_1786014119838.jpg';
import sgbTillerImg2 from '../assets/images/sgb_tiller_attachment_2_1786014134844.jpg';
import sgbTillerImg3 from '../assets/images/sgb_tiller_attachment_3_1786014146100.jpg';

import sgbWheelBarrow95lImg1 from '../assets/images/sgb_wheelbarrow_1_1786014219237.jpg';
import sgbWheelBarrow95lImg2 from '../assets/images/sgb_wheelbarrow_2_1786014238156.jpg';
import sgbWheelBarrow95lImg3 from '../assets/images/sgb_wheelbarrow_3_1786014256058.jpg';

import sgbPlantProtectorImg1 from '../assets/images/sgb_plant_protector_1_1786014431686.jpg';
import sgbPlantProtectorImg2 from '../assets/images/sgb_plant_protector_2_1786014450637.jpg';

export const COMPANY_INFO = {
  name: "SGB AGRO INDUSTRIES",
  tagline: "Empowering Farmers Through Smart Agricultural Innovation",
  established: "2020",
  location: "Koppa, Karnataka",
  address: "Opp. Municipal Ground, Koppa Rural, Koppa, Karnataka 577126",
  phone: "08277009667",
  email: "info@sgbagroindustries.com",
  website: "https://sgbagroindustries.com",
  whatsapp: "918277009667",
  awardTitle: "Elevate 2024–25 Winner",
  awardIssuer: "Karnataka Innovation and Technology Society (KITS), Govt. of Karnataka",
  heroImage: heroAgriBanner,
  aboutImage: sgbElevateAwardCeremony,
  awardImage: elevateAwardBg,
  machineryImage: smartIrrigationMachinery
};

export const FEATURE_CARDS = [
  {
    id: "sustainable",
    icon: "Factory",
    title: "Manufactured In-House",
    description: "2 production units in Koppa, Karnataka, ensuring quality manufacturing and reliable agricultural equipment.",
    color: "from-emerald-600 to-green-700"
  },
  {
    id: "machinery",
    icon: "Truck",
    title: "Pan-India Delivery",
    description: "Shipped across India through trusted logistics partners including VRL Logistics and India Post.",
    color: "from-amber-600 to-orange-700"
  },
  {
    id: "irrigation",
    icon: "Wrench",
    title: "Saves Manual Labor",
    description: "Designed to reduce physical effort, improve productivity, and make farming operations faster and more efficient.",
    color: "from-blue-600 to-teal-700"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "sgb-brush-cutter-trolley",
    title: "SGB Side Pack Brush Cutter Trolley",
    price: "₹4,000.00",
    originalPrice: "₹5,000.00",
    category: "Garden Tools",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-BCT-001",
    availability: "In Stock",
    badge: "Best Seller",
    image: trolleyImg1,
    images: [trolleyImg1, trolleyImg2, trolleyImg3, trolleyImg4, trolleyImg5],
    shortDesc: "The SGB Brush Cutter Trolley is a heavy-duty mild steel attachment designed to convert a side-pack brush cutter into an easy-to-use push-type brush cutting machine. It reduces operator fatigue, improves balance, and makes long hours of grass cutting more comfortable and efficient. Built with durable materials, it is suitable for farms, plantations, gardens, estates, and roadside maintenance.",
    fullDesc: "The SGB Brush Cutter Trolley is a heavy-duty mild steel attachment designed to convert a side-pack brush cutter into an easy-to-use push-type brush cutting machine. It reduces operator fatigue, improves balance, and makes long hours of grass cutting more comfortable and efficient. Built with durable materials, it is suitable for farms, plantations, gardens, estates, and roadside maintenance.\n\nBy transferring the engine weight and cutter vibration from the operator's shoulders to large pneumatic wheels, the trolley allows effortless push-type clearing over uneven farm grounds, slopes, and dense brush. Powder-coated with rust-resistant paint for tropical climate endurance.",
    features: [
      "Heavy-duty mild steel construction",
      "Powder-coated finish for rust resistance",
      "Large pneumatic wheels for smooth movement",
      "Strong and durable frame",
      "Reduces operator fatigue",
      "Converts brush cutter into push-type operation",
      "Easy installation",
      "Stable and balanced design",
      "Suitable for all-day agricultural work",
      "Low maintenance"
    ],
    specifications: {
      "Frame Material": "Heavy-Duty Mild Steel Construction",
      "Surface Finish": "Rust-Resistant Powder Coating",
      "Wheel Type": "Large Heavy-Duty Pneumatic Rubber Tires",
      "Operation Type": "Converts Side-Pack to Push-Type Operation",
      "Compatibility": "Universal Side-Pack Brush Cutters",
      "Assembly": "Easy Clamp-On Bolt Installation Kit Included",
      "Maintenance": "Low Maintenance Sealed Wheel Bearings",
      "Manufacturer Warranty": "1-Year Official SGB Agro Warranty"
    },
    applications: [
      "Grass cutting",
      "Weed removal",
      "Coconut plantations",
      "Coffee plantations",
      "Tea estates",
      "Pepper farms",
      "Roadside maintenance",
      "Parks and gardens",
      "Agricultural fields",
      "Landscaping"
    ],
    benefits: [
      "Eliminates shoulder and back strain during long grass cutting sessions",
      "Large pneumatic wheels roll smoothly over hilly plantation terrain",
      "Heavy powder coating protects steel against monsoon moisture and rust",
      "Quick 10-minute attachment setup with included mounting hardware",
      "Dramatically increases daily weed clearing speed and worker productivity"
    ],
    packageContents: [
      "Brush Cutter Trolley",
      "Mounting Clamp",
      "Rubber Bushes",
      "Nut & Bolt Kit",
      "Installation Accessories"
    ],
    downloads: [
      { title: "SGB Brush Cutter Trolley Specification Sheet (PDF)", size: "1.4 MB" },
      { title: "Mounting & Assembly Guide (PDF)", size: "2.1 MB" }
    ]
  },
  {
    id: "sgb-143r-brush-cutter",
    title: "SGB 143R Brush Cutter – High Performance Grass Cutting Machine for Farmers",
    price: "₹16,000.00",
    originalPrice: "₹20,000.00",
    category: "Agricultural Machinery",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-143R-BC",
    availability: "In Stock",
    badge: "Featured Machine",
    image: sgb143rImg1,
    images: [sgb143rImg1, sgb143rImg2, sgb143rImg3, sgb143rImg4],
    shortDesc: "The SGB 143R Brush Cutter is a powerful and reliable agricultural machine designed for cutting grass, weeds, and bushes efficiently. Equipped with a stable carburetor and a high-quality gearbox, it delivers smooth engine performance, better fuel efficiency, and long-lasting durability. Designed for Indian farming conditions, it is ideal for agriculture fields, plantations, gardens, and landscaping work.",
    fullDesc: "The SGB 143R Brush Cutter is a powerful and reliable agricultural machine designed for cutting grass, weeds, and bushes efficiently. Equipped with a stable carburetor and a high-quality gearbox, it delivers smooth engine performance, better fuel efficiency, and long-lasting durability. Designed for Indian farming conditions, it is ideal for agriculture fields, plantations, gardens, and landscaping work.\n\nThe SGB 143R Brush Cutter is engineered to deliver maximum performance with minimum maintenance. Its reliable engine, efficient fuel consumption, and durable components make it an ideal choice for farmers and professionals looking for a dependable grass cutting solution.",
    features: [
      "Stable Carburetor for smooth engine performance",
      "High-quality heavy-duty gearbox",
      "Better fuel efficiency",
      "Easy rope starter system",
      "Tap & Go Aluminum Nylon Head",
      "Heavy-duty cutting blade",
      "Low vibration design",
      "Strong and durable construction",
      "Easy maintenance",
      "Suitable for continuous agricultural use"
    ],
    specifications: {
      "Engine Type": "2-Stroke High Performance Petrol Engine",
      "Displacement": "41.5 cc / High Torque Output",
      "Carburetor": "Stable Diaphragm Carburetor for Consistent Power",
      "Gearbox": "Heavy-Duty Heat-Treated Steel Gear Box",
      "Starter System": "Easy Rope Recoil Starter",
      "Cutting Width": "Standard 255mm Blade / Tap & Go Head",
      "Fuel Efficiency": "Optimized Low Fuel Consumption Design",
      "Manufacturer Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Agriculture Fields",
      "Coconut Plantations",
      "Coffee Estates",
      "Tea Gardens",
      "Landscaping",
      "Weed Removal",
      "Bush Clearing",
      "Garden Maintenance"
    ],
    benefits: [
      "Smooth engine performance",
      "Improved fuel efficiency",
      "Reduced operating costs",
      "Strong and durable gearbox",
      "Comfortable handling with low vibration",
      "Fast grass and weed cutting",
      "Long service life",
      "Ideal for Indian farming conditions"
    ],
    packageContents: [
      "SGB 143R Brush Cutter",
      "Heavy Duty Blade",
      "Tap & Go Nylon Head",
      "Tool Kit",
      "User Manual"
    ],
    downloads: [
      { title: "SGB 143R Brush Cutter User Manual & Safety Guide (PDF)", size: "2.8 MB" },
      { title: "Technical Datasheet & Maintenance Schedule (PDF)", size: "1.2 MB" }
    ]
  },
  {
    id: "sgb-backpack-trolley",
    title: "SGB Back Pack Trolley",
    price: "₹4,300.00",
    originalPrice: "₹5,000.00",
    category: "Agricultural Equipment",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-BPT-2024",
    availability: "In Stock",
    badge: "Farming Accessory",
    image: sgbBackpackImg1,
    images: [sgbBackpackImg1, sgbBackpackImg2, sgbBackpackImg3],
    shortDesc: "The SGB Back Pack Trolley is a practical agricultural accessory designed to improve mobility and convenience while carrying backpack agricultural equipment. Built for farmers and agricultural professionals, it helps reduce operator fatigue, provides better balance, and allows smoother movement during long working hours in farms, plantations, gardens, and landscaping applications.",
    fullDesc: "The SGB Back Pack Trolley is a practical agricultural accessory designed to improve mobility and convenience while carrying backpack agricultural equipment. Built for farmers and agricultural professionals, it helps reduce operator fatigue, provides better balance, and allows smoother movement during long working hours in farms, plantations, gardens, and landscaping applications.\n\nThe SGB Back Pack Trolley is designed to make agricultural work more comfortable and efficient by improving mobility and reducing physical strain. It is suitable for farmers looking for a reliable and durable support solution for everyday farming activities.",
    features: [
      "Strong and durable construction",
      "Easy to move and operate",
      "Comfortable support during field work",
      "Stable design for improved balance",
      "Heavy-duty wheels for smooth movement",
      "Suitable for agricultural applications",
      "Low maintenance",
      "Designed for long-lasting performance"
    ],
    specifications: {
      "Category": "Agricultural Equipment / Farming Accessories",
      "Frame Material": "Heavy-Duty Powder Coated Steel Frame",
      "Mobility": "All-Terrain Heavy-Duty Wheels",
      "Compatibility": "Universal Mounting for Backpack Equipment",
      "Maintenance": "Low Maintenance Construction",
      "Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Agriculture Fields",
      "Coconut Plantations",
      "Coffee Estates",
      "Tea Gardens",
      "Horticulture",
      "Landscaping",
      "Garden Maintenance",
      "Farm Operations"
    ],
    benefits: [
      "Easy transportation during field work",
      "Reduces operator fatigue",
      "Improves working comfort",
      "Durable construction",
      "Easy handling",
      "Suitable for regular agricultural use",
      "Reliable performance"
    ],
    packageContents: [
      "SGB Back Pack Trolley",
      "Mounting Accessories",
      "User Guide"
    ],
    downloads: [
      { title: "SGB Back Pack Trolley User Manual (PDF)", size: "1.1 MB" }
    ]
  },
  {
    id: "sgb-dumper-wheel-barrow",
    title: "SGB Dumper Wheel Barrow",
    price: "₹8,500.00",
    originalPrice: "₹9,000.00",
    saveTag: "Save ₹500",
    category: "Agricultural Equipment",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-DWB-9000",
    availability: "In Stock",
    badge: "Heavy Duty Dumper",
    image: sgbDumperImg1,
    images: [sgbDumperImg1, sgbDumperImg2, sgbDumperImg3],
    shortDesc: "The SGB Dumper Wheel Barrow is a heavy-duty material handling tool designed for quick and efficient loading, transportation, and unloading of farm produce, soil, manure, compost, fertilizers, sand, bricks, and construction materials. Its dumper mechanism enables effortless unloading, reducing manual labor while increasing productivity on farms and worksites.\n\nBuilt with a rugged steel frame and stable wheel support, the SGB Dumper Wheel Barrow provides smooth movement, excellent balance, and reliable performance on uneven agricultural and industrial surfaces.",
    fullDesc: "The SGB Dumper Wheel Barrow is a heavy-duty material handling tool designed for quick and efficient loading, transportation, and unloading of farm produce, soil, manure, compost, fertilizers, sand, bricks, and construction materials. Its dumper mechanism enables effortless unloading, reducing manual labor while increasing productivity on farms and worksites.\n\nBuilt with a rugged steel frame and stable wheel support, the SGB Dumper Wheel Barrow provides smooth movement, excellent balance, and reliable performance on uneven agricultural and industrial surfaces.\n\nThe SGB Dumper Wheel Barrow is engineered to simplify heavy material transportation with an efficient dumping mechanism that minimizes physical effort. Designed for farmers, landscapers, dairy operators, and construction professionals, it delivers durability, stability, and reliable performance for everyday use.",
    features: [
      "Heavy-duty steel construction",
      "High load carrying capacity",
      "Strong dumper tipping mechanism",
      "Easy unloading design",
      "Heavy-duty pneumatic wheel",
      "Smooth movement on rough surfaces",
      "Powder-coated corrosion-resistant finish",
      "Ergonomic handles",
      "Stable wheel support",
      "Long service life",
      "Low maintenance"
    ],
    specifications: {
      "Bucket Container": "Heavy-Duty Powder Coated Steel Tipping Container",
      "Mechanism": "Quick-Release Easy Dumper Tipping Mechanism",
      "Wheel Type": "All-Terrain Heavy-Duty Pneumatic Wheel",
      "Handles": "Ergonomic Rubber-Grip Steel Handles",
      "Finishing": "Corrosion-Resistant Industrial Powder Coating",
      "Manufacturer Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Agriculture Fields",
      "Dairy Farms",
      "Poultry Farms",
      "Compost Transport",
      "Cow Dung Handling",
      "Fertilizer Transport",
      "Soil & Sand Movement",
      "Garden Maintenance",
      "Landscaping",
      "Construction Sites",
      "Plantation Farms"
    ],
    benefits: [
      "Easy loading and unloading",
      "Saves labor and time",
      "High carrying capacity",
      "Durable heavy-duty construction",
      "Smooth movement on uneven ground",
      "Comfortable operation",
      "Long-lasting performance",
      "Suitable for agricultural and industrial applications"
    ],
    packageContents: [
      "SGB Dumper Wheel Barrow",
      "Wheel Assembly",
      "Handle Assembly",
      "Mounting Hardware",
      "User Guide"
    ],
    downloads: [
      { title: "SGB Dumper Wheel Barrow Spec Sheet & User Guide (PDF)", size: "1.4 MB" }
    ]
  },
  {
    id: "sgb-aluminum-tap-go-head",
    title: "SGB Aluminum Tap & Go Head for Brush Cutter",
    price: "₹600.00",
    originalPrice: "₹750.00",
    saveTag: "Save ₹150",
    category: "Brush Cutter Accessories",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-ATG-600",
    availability: "In Stock",
    badge: "Best Seller Accessory",
    image: sgbTapGoImg1,
    images: [sgbTapGoImg1, sgbTapGoImg2, sgbTapGoImg3],
    shortDesc: "The SGB Aluminum Tap & Go Head for Brush Cutter is a premium heavy-duty brush cutter attachment designed for fast, smooth, and uninterrupted grass and weed cutting. Featuring an advanced Tap & Go (Bump Feed) mechanism, it automatically releases nylon line with a simple tap, minimizing downtime and improving cutting efficiency.\n\nManufactured from premium-quality aluminum, it offers superior durability, excellent wear resistance, and reliable performance in demanding agricultural environments. Its universal design makes it compatible with most 35cc, 42cc, 43cc, and 52cc brush cutters, including both 2-stroke and 4-stroke machines.",
    fullDesc: "The SGB Aluminum Tap & Go Head for Brush Cutter is a premium heavy-duty brush cutter attachment designed for fast, smooth, and uninterrupted grass and weed cutting. Featuring an advanced Tap & Go (Bump Feed) mechanism, it automatically releases nylon line with a simple tap, minimizing downtime and improving cutting efficiency.\n\nManufactured from premium-quality aluminum, it offers superior durability, excellent wear resistance, and reliable performance in demanding agricultural environments. Its universal design makes it compatible with most 35cc, 42cc, 43cc, and 52cc brush cutters, including both 2-stroke and 4-stroke machines.\n\nThe SGB Aluminum Tap & Go Head is designed to improve productivity by reducing interruptions during cutting operations. Its durable aluminum construction, automatic line feeding mechanism, and universal compatibility make it an ideal choice for professional farmers, landscapers, and brush cutter operators.",
    features: [
      "Premium aluminum construction",
      "Tap & Go automatic nylon line feeding system",
      "Heavy-duty and durable design",
      "Universal compatibility",
      "High wear resistance",
      "Corrosion-resistant finish",
      "Easy installation",
      "Smooth cutting performance",
      "Low maintenance",
      "Long service life"
    ],
    specifications: {
      "Material": "Premium Aluminum Metal Construction",
      "Mechanism": "Tap & Go (Bump Feed) Automatic Line Feed",
      "Engine Compatibility": "35cc, 42cc, 43cc, 52cc (2-Stroke & 4-Stroke)",
      "Nylon Line": "Heavy-Duty Pre-installed Nylon Trimmer Line",
      "Mounting": "Universal Thread Fitting",
      "Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Grass Cutting",
      "Weed Removal",
      "Agricultural Fields",
      "Coconut Plantations",
      "Coffee Estates",
      "Tea Gardens",
      "Landscaping",
      "Garden Maintenance",
      "Roadside Grass Cutting",
      "Farm Maintenance"
    ],
    benefits: [
      "Faster grass cutting",
      "Automatic nylon line feeding",
      "Strong aluminum body",
      "Excellent durability",
      "Easy installation",
      "Compatible with multiple brush cutter models",
      "Reduced downtime",
      "Long-lasting performance"
    ],
    packageContents: [
      "SGB Aluminum Tap & Go Head",
      "Pre-installed Nylon Line",
      "User Guide"
    ],
    compatibility: [
      "35cc Brush Cutters",
      "42cc Brush Cutters",
      "43cc Brush Cutters",
      "52cc Brush Cutters",
      "2-Stroke Machines",
      "4-Stroke Machines"
    ],
    downloads: [
      { title: "SGB Aluminum Tap & Go Head User Guide (PDF)", size: "0.9 MB" }
    ]
  },
  {
    id: "sgb-brush-cutter-tiller-attachment",
    title: "SGB Brush Cutter Tiller Attachment",
    price: "₹3,100.00",
    originalPrice: "₹3,500.00",
    saveTag: "Save ₹400",
    category: "Brush Cutter Attachments",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-BCT-3100",
    availability: "In Stock",
    badge: "Mini Tiller Attachment",
    image: sgbTillerImg1,
    images: [sgbTillerImg1, sgbTillerImg2, sgbTillerImg3],
    shortDesc: "The SGB Brush Cutter Tiller Attachment is a heavy-duty cultivation accessory designed to convert compatible brush cutters into efficient mini tillers. It is ideal for loosening soil, preparing seed beds, removing weeds, and cultivating small farms, gardens, plantations, and horticultural fields. Built with a durable gearbox and hardened steel tines, it delivers reliable performance in demanding agricultural conditions.",
    fullDesc: "The SGB Brush Cutter Tiller Attachment is a heavy-duty cultivation accessory designed to convert compatible brush cutters into efficient mini tillers. It is ideal for loosening soil, preparing seed beds, removing weeds, and cultivating small farms, gardens, plantations, and horticultural fields. Built with a durable gearbox and hardened steel tines, it delivers reliable performance in demanding agricultural conditions.\n\nThe SGB Brush Cutter Tiller Attachment offers an economical solution for farmers by converting an existing brush cutter into a compact tilling machine. It helps reduce labor, improve productivity, and prepare soil quickly for planting, making it suitable for small and medium-scale farming operations.",
    features: [
      "Heavy-duty tiller attachment",
      "Strong hardened steel blades",
      "Durable gearbox construction",
      "Efficient soil cultivation",
      "Easy attachment installation",
      "Corrosion-resistant finish",
      "Low maintenance",
      "Smooth and reliable operation",
      "Strong frame construction",
      "Long service life"
    ],
    specifications: {
      "Gearbox": "Heavy-Duty Heat-Treated Gear Box",
      "Tiller Blades": "Hardened High-Carbon Steel Tines",
      "Transmission": "Stable High-Torque Power Transmission",
      "Mounting": "Universal Heavy-Duty Shaft Clamp System",
      "Machine Compatibility": "Supported 2-Stroke & 4-Stroke Brush Cutters",
      "Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Soil Preparation",
      "Garden Cultivation",
      "Vegetable Farming",
      "Horticulture",
      "Coffee Plantations",
      "Coconut Farms",
      "Tea Estates",
      "Nursery Beds",
      "Weed Removal",
      "Intercultivation Operations"
    ],
    benefits: [
      "Easy soil cultivation",
      "Saves labor and time",
      "Durable steel construction",
      "High tilling efficiency",
      "Easy installation",
      "Suitable for multiple farming applications",
      "Low maintenance",
      "Long-lasting performance"
    ],
    packageContents: [
      "SGB Brush Cutter Tiller Attachment",
      "Mounting Assembly",
      "Tiller Blade Set",
      "Installation Hardware",
      "User Guide"
    ],
    compatibility: [
      "Heavy-duty gearbox",
      "Hardened steel tiller blades",
      "Stable power transmission",
      "Strong mounting system",
      "Compatible with supported brush cutter models"
    ],
    downloads: [
      { title: "SGB Brush Cutter Tiller Attachment User Manual (PDF)", size: "1.3 MB" }
    ]
  },
  {
    id: "sgb-wheel-barrow-95-litre",
    title: "SGB Wheel Barrow (95 Litre)",
    price: "₹7,500.00",
    originalPrice: "₹8,000.00",
    saveTag: "Save ₹500",
    category: "Material Handling Equipment",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-WB-95L",
    availability: "In Stock",
    badge: "95 Litre Capacity",
    image: sgbWheelBarrow95lImg1,
    images: [sgbWheelBarrow95lImg1, sgbWheelBarrow95lImg2, sgbWheelBarrow95lImg3],
    shortDesc: "The SGB 95 Litre Wheel Barrow is a heavy-duty material handling tool designed for transporting agricultural produce, fertilizers, soil, compost, manure, construction materials, and other heavy loads with ease. Its balanced wheel design and strong steel body reduce operator effort while ensuring smooth movement across farms, gardens, plantations, and worksites.\n\nBuilt for daily agricultural and industrial use, the SGB Wheel Barrow combines durability, stability, and high carrying capacity, making it an ideal choice for farmers and professionals.",
    fullDesc: "The SGB 95 Litre Wheel Barrow is a heavy-duty material handling tool designed for transporting agricultural produce, fertilizers, soil, compost, manure, construction materials, and other heavy loads with ease. Its balanced wheel design and strong steel body reduce operator effort while ensuring smooth movement across farms, gardens, plantations, and worksites.\n\nBuilt for daily agricultural and industrial use, the SGB Wheel Barrow combines durability, stability, and high carrying capacity, making it an ideal choice for farmers and professionals.\n\nThe SGB 95 Litre Wheel Barrow is engineered for efficient material transportation with minimum physical effort. Its rugged construction, stable wheel support, and spacious load capacity help improve productivity while reducing labour during everyday agricultural and construction activities.",
    features: [
      "95-litre load capacity",
      "Heavy-duty steel body",
      "Strong tubular frame",
      "Balanced wheel design",
      "Heavy-duty pneumatic wheel",
      "Smooth movement on uneven surfaces",
      "Powder-coated rust-resistant finish",
      "Ergonomic handles",
      "High carrying capacity",
      "Low maintenance",
      "Long service life"
    ],
    specifications: {
      "Capacity": "95 Litres Heavy-Duty Load Capacity",
      "Body Material": "Powder-Coated High-Grade Steel Body",
      "Wheel": "Heavy-Duty All-Terrain Pneumatic Wheel",
      "Frame": "Reinforced Tubular Steel Support Frame",
      "Finishing": "Corrosion-Resistant Industrial Powder Coating",
      "Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Agriculture Fields",
      "Dairy Farms",
      "Poultry Farms",
      "Fertilizer Transport",
      "Compost Handling",
      "Soil Transport",
      "Sand & Gravel Movement",
      "Garden Maintenance",
      "Landscaping",
      "Construction Sites",
      "Plantation Farms"
    ],
    benefits: [
      "High carrying capacity",
      "Smooth and balanced movement",
      "Strong steel construction",
      "Saves labour and time",
      "Easy to handle",
      "Suitable for daily heavy-duty work",
      "Durable powder-coated finish",
      "Long-lasting performance"
    ],
    packageContents: [
      "SGB 95 Litre Wheel Barrow",
      "Wheel Assembly",
      "Handle Assembly",
      "Mounting Hardware",
      "User Guide"
    ],
    compatibility: [
      "Capacity: 95 Litres",
      "Heavy-duty steel body",
      "Pneumatic wheel",
      "Reinforced tubular frame",
      "Corrosion-resistant finish"
    ],
    downloads: [
      { title: "SGB 95 Litre Wheel Barrow Specification Sheet (PDF)", size: "1.1 MB" }
    ]
  },
  {
    id: "sgb-plant-protector-attachment",
    title: "SGB Plant Protector Attachment for Brush Cutter",
    price: "₹600.00",
    originalPrice: "₹800.00",
    saveTag: "Save ₹200",
    category: "Brush Cutter Accessories",
    brand: "SGB AGRO INDUSTRIES",
    sku: "SGB-PPA-600",
    availability: "In Stock",
    badge: "Crop Safety Guard",
    image: sgbPlantProtectorImg1,
    images: [sgbPlantProtectorImg1, sgbPlantProtectorImg2, sgbPlantProtectorImg1],
    shortDesc: "The SGB Plant Protector Attachment for Brush Cutter is a practical safety accessory designed to protect crops and young plants during grass and weed cutting operations. It creates a protective barrier between the cutting blade and valuable plants, allowing operators to remove weeds efficiently without damaging surrounding crops.\n\nManufactured using a strong 6 mm steel rod structure with a durable powder-coated finish, this attachment is ideal for precision farming, plantations, nurseries, and horticulture applications.",
    fullDesc: "The SGB Plant Protector Attachment for Brush Cutter is a practical safety accessory designed to protect crops and young plants during grass and weed cutting operations. It creates a protective barrier between the cutting blade and valuable plants, allowing operators to remove weeds efficiently without damaging surrounding crops.\n\nManufactured using a strong 6 mm steel rod structure with a durable powder-coated finish, this attachment is ideal for precision farming, plantations, nurseries, and horticulture applications.\n\nThe SGB Plant Protector Attachment helps farmers achieve safer and more accurate weed cutting by preventing accidental damage to crops. It improves operational efficiency, reduces crop loss, and supports modern farming practices through its simple yet effective protective design.",
    features: [
      "Heavy-duty 6 mm steel rod construction",
      "Protects crops from accidental blade contact",
      "Universal fitting design",
      "Powder-coated rust-resistant finish",
      "Strong and durable frame",
      "Easy installation",
      "Low maintenance",
      "Lightweight yet robust",
      "Long service life",
      "Designed for professional agricultural use"
    ],
    specifications: {
      "Structure": "Heavy-Duty 6 mm Solid Steel Rod Frame",
      "Finishing": "Corrosion-Resistant Industrial Powder Coating",
      "Mounting": "Universal Heavy-Duty Clamp System",
      "Engine Compatibility": "35cc, 42cc, 43cc, 52cc (2-Stroke & 4-Stroke)",
      "Warranty": "Official SGB AGRO INDUSTRIES Warranty"
    },
    applications: [
      "Arecanut Gardens",
      "Coconut Farms",
      "Vegetable Fields",
      "Nurseries",
      "Row Crop Cultivation",
      "Horticulture",
      "Tea Gardens",
      "Coffee Plantations",
      "Weed Removal",
      "Precision Farming"
    ],
    benefits: [
      "Prevents crop damage",
      "Improves cutting accuracy",
      "Easy to install",
      "Durable steel construction",
      "Universal compatibility",
      "Reduces crop loss",
      "Enhances operator confidence",
      "Long-lasting performance"
    ],
    packageContents: [
      "SGB Plant Protector Attachment",
      "Mounting Bracket",
      "Fastener Kit",
      "User Guide"
    ],
    compatibility: [
      "6 mm steel rod frame",
      "Powder-coated finish",
      "Universal mounting system",
      "Compatible with 35cc, 42cc, 43cc, and 52cc brush cutters",
      "Suitable for both 2-stroke and 4-stroke machines"
    ],
    downloads: [
      { title: "SGB Plant Protector Attachment Specification Sheet (PDF)", size: "0.8 MB" }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: "manufacturing",
    stepNumber: "01",
    title: "Agricultural Equipment Manufacturing",
    icon: "Factory",
    description: "Manufacturing durable and high-quality agricultural machinery designed for Indian farming conditions.",
    details: [
      "Heavy gauge durable steel construction",
      "Engineered for tough terrain & estate farming",
      "Strict quality control & performance testing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "consultation",
    stepNumber: "02",
    title: "Product Consultation",
    icon: "Users",
    description: "Helping farmers choose the right agricultural equipment based on their farming requirements.",
    details: [
      "Expert machinery selection guidance",
      "Tailored recommendations for crop type & terrain",
      "Clear cost & efficiency estimation"
    ],
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb12728?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "customization",
    stepNumber: "03",
    title: "Customized Equipment Solutions",
    icon: "Settings",
    description: "Designing and manufacturing customized agricultural equipment to meet specific customer needs.",
    details: [
      "Custom attachments & implements",
      "Specialized modifications for hill slopes",
      "Prototyping & tailored fabrication"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "delivery",
    stepNumber: "04",
    title: "Pan-India Delivery",
    icon: "Truck",
    description: "Safe and reliable delivery across India through trusted logistics partners.",
    details: [
      "Doorstep delivery across all states",
      "Secure protective packaging",
      "Dispatch coordination & tracking assistance"
    ],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "spare-parts",
    stepNumber: "05",
    title: "Spare Parts & Service Support",
    icon: "Wrench",
    description: "Providing genuine spare parts along with repair and maintenance support for SGB products and brush cutters.",
    details: [
      "100% genuine SGB replacement parts",
      "Brush cutter repair & overhaul",
      "Quick availability from Koppa workshop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "technical-guidance",
    stepNumber: "06",
    title: "Technical Guidance & After-Sales Assistance",
    icon: "LifeBuoy",
    description: "Helping customers with product usage, maintenance guidance, and technical assistance for long-term performance.",
    details: [
      "User operation & maintenance instruction",
      "Troubleshooting & operational tips",
      "Dedicated customer support assistance"
    ],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "elevate-2024",
    title: "Elevate 2024–25 Winner",
    subtitle: "Prestigious Innovation Grant Award",
    issuer: "Karnataka Innovation and Technology Society (KITS)",
    year: "2024 - 2025",
    description: "SGB AGRO INDUSTRIES was selected as a winning top-tier startup under the flagship ELEVATE program by the Department of Electronics, IT, Bt and S&T, Government of Karnataka for breakthrough innovations in hill-slope agricultural machinery and smart water conservation.",
    highlights: [
      "Recognized among top innovative Agri-Tech startups in Karnataka",
      "Government grant funding awarded for advanced R&D and commercial scaling",
      "Validated for high social impact on smallholder and plantation farmers",
      "Proprietary patent-pending machinery for difficult terrain"
    ],
    badge: "Government Recognized Award"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Sri Ramesh Gowda",
    location: "Koppa Rural, Chikkamagaluru",
    cropType: "Arecanut & Pepper Plantation",
    quote: "Installing SGB Agro Industries' micro drip irrigation changed our yield completely. Water flows uniformly even on our steep hill slopes, and electric bill dropped by 40%. Their Koppa team gives quick field service!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "test-2",
    name: "Manjunath Hegde",
    location: "Thirthahalli, Shimoga District",
    cropType: "Coffee & Cardamom Estate",
    quote: "The power tiller engineered by SGB Agro is extremely balanced and sturdy. Working in wet soil between coffee plants used to be exhausting, but this machine handles slope soil smoothly.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "test-3",
    name: "Smt. Kamala Bhat",
    location: "Sringeri, Karnataka",
    cropType: "Organic Spice & Vegetable Farm",
    quote: "Proud to support a local Koppa winner! SGB Agro's Elevate award is well deserved. Their smart GSM pump controller allows me to turn on irrigation right from my phone when away from the farm.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Where is SGB AGRO INDUSTRIES located?",
    answer: "Our manufacturing workshop and main administrative office are located at Opp. Municipal Ground, Koppa Rural, Koppa, Chikkamagaluru District, Karnataka - 577126.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "What is the significance of the Elevate 2024–25 Award?",
    answer: "Elevate is a flagship startup initiative by the Karnataka Innovation and Technology Society (KITS), Government of Karnataka. SGB AGRO INDUSTRIES was selected as a winner for pioneering smart agricultural machinery and water-saving technologies specifically suited for hilly terrain.",
    category: "Company"
  },
  {
    id: "faq-3",
    question: "Do you offer customized machinery for hilly or slope farming?",
    answer: "Yes! A core strength of SGB Agro Industries is custom engineering. We design and modify power tillers, sprayers, and irrigation layouts tailored to the unique slope gradients of coffee, arecanut, and tea estates.",
    category: "Products"
  },
  {
    id: "faq-4",
    question: "How do I request a product quotation or site inspection?",
    answer: "You can click any 'Request Quote' button on this website, fill out our quick contact form, call us directly at 08277009667, or send us a message on WhatsApp (+91 8277009667). Our field engineers will assist you immediately.",
    category: "Services"
  },
  {
    id: "faq-5",
    question: "Are your products eligible for Government Agricultural Subsidies?",
    answer: "Yes, many of our micro-irrigation systems and eligible machinery conform to BIS/ISO standards and qualify under Karnataka state agricultural subsidy schemes (Pradhan Mantri Krishi Sinchayee Yojana PMKSY / RKVY). Our team guides you through the documentation process.",
    category: "General"
  },
  {
    id: "faq-6",
    question: "What warranty and after-sales support do you provide?",
    answer: "All SGB Agro equipment comes with standard manufacturer warranties ranging from 1 to 5 years depending on the product line. We maintain a full inventory of original spare parts at our Koppa facility for rapid repairs.",
    category: "Support"
  }
];

export const STATS = [
  { value: 500, label: "Happy Farmers", suffix: "+" },
  { value: 100, label: "Projects Completed", suffix: "+" },
  { value: 5, label: "Product Categories", suffix: "+" },
  { value: 4, label: "Years Experience", suffix: "+" }
];
