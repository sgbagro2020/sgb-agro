import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  initDB,
  dbUsers,
  dbProducts,
  dbGalleryMedia,
  dbGalleryAlbums,
  dbBlogPosts,
  dbSiteSettings,
} from './index.js';
import { config } from '../config/index.js';
import { Product, GalleryMedia, GalleryAlbum, BlogPost } from './schema.js';

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seed check...');

  // 1. Seed Admin User
  const existingUsers = await dbUsers.getAll();
  if (existingUsers.length === 0) {
    const passwordHash = await bcrypt.hash(config.adminDefault.password, 10);
    const now = new Date().toISOString();
    await dbUsers.create({
      id: `usr_admin_${crypto.randomBytes(4).toString('hex')}`,
      username: 'admin',
      email: config.adminDefault.email.toLowerCase(),
      passwordHash,
      role: 'superadmin',
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✅ Default Admin user created: ${config.adminDefault.email}`);
  } else {
    console.log(`ℹ️ Admin user already exists (${existingUsers.length} found). Skipping user seed.`);
  }

  // 2. Seed Initial Products (Only if 0 products exist)
  const existingProducts = await dbProducts.getAll();
  if (existingProducts.length === 0) {
    console.log('📦 No products found in database. Seeding initial products...');
    const now = new Date().toISOString();

    const initialProducts: Product[] = [
      {
        id: 'prod_drip_01',
        title: 'SGB Premium Drip Irrigation Kit (1 Acre)',
        price: '14500',
        originalPrice: '18000',
        saveTag: 'Save ₹3,500',
        category: 'Drip Irrigation',
        image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80',
        ],
        shortDesc: 'Complete 1-acre drip irrigation setup engineered for maximum water efficiency and crop yield enhancement.',
        fullDesc: 'The SGB Premium Drip Irrigation Kit provides uniform water and nutrient delivery directly to crop root zones. Made from UV-stabilized virgin HDPE/LDPE material, resistant to clogging and high water pressure.',
        sku: 'SGB-DRIP-1AC',
        availability: 'In Stock',
        brand: 'SGB Agro',
        features: [
          'UV-stabilized 16mm lateral drip pipes with 30cm emitter spacing',
          'Screen filter with flush valve preventing clogging',
          'Hydro-cyclone sand separator ready',
          'Venturi injector for automated fertigation',
        ],
        specifications: {
          'Coverage Area': '1 Acre (approx. 4000 sq.m)',
          'Pipe Size': '16mm Main & Lateral',
          'Dripper Discharge': '2.0 LPH or 4.0 LPH',
          'Operating Pressure': '1.0 to 2.5 kg/cm²',
          'Warranty': '5 Years Manufacturer Warranty',
        },
        applications: [
          'Cotton, Sugarcane, Vegetables, Fruit Orchards (Pomegranate, Banana, Mango)',
        ],
        benefits: [
          'Saves up to 60% irrigation water',
          'Increases crop yield by 25-40%',
          'Reduces weed growth and labor expense',
        ],
        packageContents: [
          '1000m 16mm Drip Tape',
          '1x 2-inch Screen Filter',
          '1x 1-inch Venturi Injector assembly',
          'Joiners, Connectors, End Caps, Punch Tools',
        ],
        downloads: [
          { title: 'Drip Kit Installation Manual (PDF)', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: '2.4 MB' },
        ],
        badge: 'Best Seller',
        displayOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod_vermi_02',
        title: 'SGB Organic Bio Vermicompost Fertilizer (50 kg Bag)',
        price: '650',
        originalPrice: '850',
        saveTag: 'Save ₹200',
        category: 'Organic Fertilizers',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
        ],
        shortDesc: '100% pure organic worm-castings manure enriched with beneficial soil micro-flora.',
        fullDesc: 'SGB Organic Bio Vermicompost is processed using Eisenia fetida earthworms and organic cattle dung manure. Rich in NPK, micronutrients, humic acid, and soil-beneficial bacteria.',
        sku: 'SGB-VERMI-50KG',
        availability: 'In Stock',
        brand: 'SGB Agro',
        features: [
          '100% natural, chemical-free and non-toxic',
          'Improves soil water retention capacity',
          'Stimulates healthy root growth and flower blooming',
        ],
        specifications: {
          'Weight': '50 kg Bag',
          'Organic Carbon': '> 18%',
          'Total NPK': '1.5% N, 1.0% P, 1.5% K',
          'pH Range': '6.8 - 7.5',
          'Moisture Content': '15 - 20%',
        },
        applications: ['Kitchen gardening, Polyhouse crops, Fruit plants, Paddy, Wheat, Vegetables'],
        benefits: ['Restores soil health', 'Prevents root disease', 'Eco-friendly and sustainable'],
        packageContents: ['1x 50kg HDPE moisture-sealed bag'],
        downloads: [],
        badge: 'Top Rated',
        displayOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod_solar_03',
        title: 'SGB 5HP Submersible Solar Water Pump Set',
        price: '185000',
        originalPrice: '215000',
        saveTag: 'Save ₹30,000',
        category: 'Solar Agro Equipment',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        ],
        shortDesc: 'High efficiency 5HP solar powered pump setup for continuous farm irrigation without grid power dependency.',
        fullDesc: 'SGB 5HP Solar Water Pump system consists of high-efficiency Monocrystalline solar panels, MPPT solar pump controller, and stainless steel submersible pump.',
        sku: 'SGB-SOLAR-5HP',
        availability: 'In Stock',
        brand: 'SGB Solar',
        features: [
          'MPPT technology for maximum water output under low sunlight',
          'Dry run, overvoltage, and thermal protection',
          'SS304 grade pump casing for corrosion resistance',
        ],
        specifications: {
          'Power Rating': '5 HP (3.7 kW)',
          'Solar Array Capacity': '4800W Mono-PERC',
          'Max Head': '100 Meters',
          'Water Discharge': '1,20,000 Litres / Day',
          'Controller': 'IP65 MPPT Solar VFD',
        },
        applications: ['Borewell irrigation, Open well pumping, Canal water lift'],
        benefits: ['Zero electricity bills', '25 years panel performance warranty', 'Subsidy eligible design'],
        packageContents: ['1x 5HP SS Pump', '1x MPPT Controller', '16x 300W Solar Panels', 'Galvanized Mounting Structure'],
        downloads: [
          { title: 'Solar Pump Technical Datasheet (PDF)', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: '1.8 MB' },
        ],
        badge: 'Eco Friendly',
        displayOrder: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const p of initialProducts) {
      await dbProducts.create(p);
    }
    console.log(`✅ Seeded ${initialProducts.length} initial products.`);
  } else {
    console.log(`ℹ️ Products already present (${existingProducts.length} found). Skipping product seed.`);
  }

  // 3. Seed Initial Gallery Media & Albums (Only if 0 exist)
  const existingGallery = await dbGalleryMedia.getAll();
  if (existingGallery.length === 0) {
    console.log('🖼️ No gallery media found. Seeding gallery items & albums...');
    const galleryItems: GalleryMedia[] = [
      {
        id: 'gal_01',
        title: 'SGB Drip Irrigation Field Demonstration',
        caption: 'Automated drip setup installed at pomegranate orchard in Solapur.',
        category: 'Field Projects',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=1200&q=80',
        uploadDate: '2026-01-15',
        featured: true,
        hidden: false,
        order: 1,
      },
      {
        id: 'gal_02',
        title: 'Agro Expo 2026 Innovation Stall',
        caption: 'SGB Agro stall displaying solar pumps and smart fertigation units.',
        category: 'Exhibitions',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
        uploadDate: '2026-02-10',
        featured: true,
        hidden: false,
        order: 2,
      },
    ];

    for (const g of galleryItems) {
      await dbGalleryMedia.create(g);
    }

    const album: GalleryAlbum = {
      id: 'album_01',
      title: 'Farmer Success Stories & Field Installations',
      description: 'Glimpses of modern high-density farming projects equipped with SGB drip & solar systems.',
      coverImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=1200&q=80',
      uploadDate: '2026-02-12',
      media: [
        { id: 'item_1', title: 'Pomegranate Field', type: 'image', url: galleryItems[0].url, order: 1 },
        { id: 'item_2', title: 'Agro Stall Display', type: 'image', url: galleryItems[1].url, order: 2 },
      ],
    };
    await dbGalleryAlbums.create(album);

    console.log('✅ Seeded initial gallery media and album.');
  } else {
    console.log(`ℹ️ Gallery media already exists (${existingGallery.length} found). Skipping gallery seed.`);
  }

  // 4. Seed Initial Blog Posts (Only if 0 exist)
  const existingBlogs = await dbBlogPosts.getAll();
  if (existingBlogs.length === 0) {
    console.log('📝 No blog posts found. Seeding initial blog posts...');
    const now = new Date().toISOString();

    const initialBlogs: BlogPost[] = [
      {
        id: 'post_01',
        title: 'Modern Drip Irrigation Techniques for Maximum Crop Yield',
        shortDescription: 'Discover how precision water management with drip systems improves crop health, saves water, and cuts farming overheads.',
        content: `
          <h2>Why Precision Drip Irrigation Matters</h2>
          <p>Water scarcity is one of the biggest challenges facing modern agriculture. Traditional flood irrigation wastes up to 60% of water through evaporation and deep percolation.</p>
          <h3>Key Advantages of SGB Drip Systems</h3>
          <ul>
            <li>Direct water delivery to plant roots</li>
            <li>Fertigation capability reduces fertilizer wastage</li>
            <li>Minimizes weed proliferation</li>
          </ul>
          <p>Implementing smart drip technology can boost crop yields by up to 40% while slashing electricity and water bills.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80',
        slug: 'modern-drip-irrigation-techniques-for-maximum-crop-yield',
        published: true,
        uploadDate: '2026-02-01',
        displayOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'post_02',
        title: 'Role of Bio Vermicompost in Soil Health Restoration',
        shortDescription: 'Learn why organic farmers are switching to vermicompost to enrich soil organic carbon and increase crop resilience.',
        content: `
          <h2>Understanding Organic Carbon in Agriculture</h2>
          <p>Continuous synthetic fertilizer usage degrades soil organic carbon and damages natural earthworm populations.</p>
          <p>SGB Bio Vermicompost replenishes beneficial enzymes, nitrogen-fixing bacteria, and mycorrhizal fungi that make nutrients readily absorbable by plants.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1200&q=80',
        slug: 'role-of-bio-vermicompost-in-soil-health-restoration',
        published: true,
        uploadDate: '2026-02-08',
        displayOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const b of initialBlogs) {
      await dbBlogPosts.create(b);
    }
    console.log(`✅ Seeded ${initialBlogs.length} initial blog posts.`);
  } else {
    console.log(`ℹ️ Blog posts already exist (${existingBlogs.length} found). Skipping blog seed.`);
  }

  // 5. Ensure Site Settings initialized
  await dbSiteSettings.get();
  console.log('✅ Site settings verified.');

  console.log('🎉 Database seed check completed successfully!');
}

// Execute if run directly from CLI
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  initDB().then(() => seedDatabase()).catch(err => {
    console.error('Seed execution error:', err);
    process.exit(1);
  });
}
