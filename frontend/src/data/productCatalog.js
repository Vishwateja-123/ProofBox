/**
 * Curated Product Catalog for ProofBox Frontend
 * Provides zero-latency offline matching with official Apple.com photography,
 * precise hex color swatches, storage/size variants, and default warranty coverage.
 */

export const CURATED_PRODUCTS = [
  {
    id: 'apple-iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    tagline: 'Titanium. So strong. So light. Built for Apple Intelligence.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 999,
    models: ['iPhone 16 Pro (6.3-inch)', 'iPhone 16 Pro Max (6.9-inch)'],
    colors: [
      {
        name: 'Desert Titanium',
        hex: '#C5B49F',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Natural Titanium',
        hex: '#9E9689',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'White Titanium',
        hex: '#F2F1ED',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-whitetitanium?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Black Titanium',
        hex: '#3C3B37',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-blacktitanium?wid=940&hei=1112&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '128gb', label: '128 GB', priceDelta: 0 },
      { id: '256gb', label: '256 GB', priceDelta: 100 },
      { id: '512gb', label: '512 GB', priceDelta: 300 },
      { id: '1tb', label: '1 TB', priceDelta: 500 }
    ],
    specs: ['A18 Pro chip', 'Grade 5 Titanium with textured matte glass', 'Camera Control button', '48MP Fusion Camera', 'USB-C with USB 3 speeds']
  },
  {
    id: 'apple-iphone-16',
    name: 'iPhone 16',
    brand: 'Apple',
    tagline: 'Hello, Apple Intelligence. New Camera Control. Vibrant color-infused glass.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 799,
    models: ['iPhone 16 (6.1-inch)', 'iPhone 16 Plus (6.7-inch)'],
    colors: [
      {
        name: 'Ultramarine',
        hex: '#4B6382',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Teal',
        hex: '#7BAEA8',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Pink',
        hex: '#E9B5C1',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-pink?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'White',
        hex: '#F5F5F7',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-white?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Black',
        hex: '#28282B',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=940&hei=1112&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '128gb', label: '128 GB', priceDelta: 0 },
      { id: '256gb', label: '256 GB', priceDelta: 100 },
      { id: '512gb', label: '512 GB', priceDelta: 300 }
    ],
    specs: ['A18 chip with 5-core GPU', 'Camera Control and Action button', '48MP Fusion 2x Telephoto', 'Super Retina XDR OLED']
  },
  {
    id: 'apple-iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    tagline: 'Titanium design, A17 Pro chip, customizable Action button.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 899,
    models: ['iPhone 15 Pro (6.1-inch)', 'iPhone 15 Pro Max (6.7-inch)'],
    colors: [
      {
        name: 'Natural Titanium',
        hex: '#9B958C',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Blue Titanium',
        hex: '#353B45',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'White Titanium',
        hex: '#E3E4E5',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-whitetitanium?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Black Titanium',
        hex: '#323234',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-blacktitanium?wid=940&hei=1112&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '128gb', label: '128 GB', priceDelta: 0 },
      { id: '256gb', label: '256 GB', priceDelta: 100 },
      { id: '512gb', label: '512 GB', priceDelta: 300 },
      { id: '1tb', label: '1 TB', priceDelta: 500 }
    ],
    specs: ['A17 Pro chip', 'Aerospace-grade titanium', 'Action button', 'Pro camera system']
  },
  {
    id: 'apple-macbook-air-m3',
    name: 'MacBook Air (M3)',
    brand: 'Apple',
    tagline: 'Lean. Mean. M3 machine. Strikingly thin with up to 18 hours of battery life.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 1099,
    models: ['13-inch MacBook Air', '15-inch MacBook Air'],
    colors: [
      {
        name: 'Midnight',
        hex: '#1E2530',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=png-alpha'
      },
      {
        name: 'Starlight',
        hex: '#F0EBE0',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-starlight-select-202402?wid=904&hei=840&fmt=png-alpha'
      },
      {
        name: 'Space Gray',
        hex: '#787679',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-spacegray-select-202402?wid=904&hei=840&fmt=png-alpha'
      },
      {
        name: 'Silver',
        hex: '#E3E4E5',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-silver-select-202402?wid=904&hei=840&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '256gb', label: '16GB Unified Memory / 256GB SSD', priceDelta: 0 },
      { id: '512gb', label: '16GB Unified Memory / 512GB SSD', priceDelta: 200 },
      { id: '1tb', label: '24GB Unified Memory / 1TB SSD', priceDelta: 600 }
    ],
    specs: ['Apple M3 8-core CPU, 10-core GPU', 'Liquid Retina display with True Tone', 'MagSafe 3 charging port', 'Fanless silent thermal design']
  },
  {
    id: 'apple-macbook-pro-m4',
    name: 'MacBook Pro (M4)',
    brand: 'Apple',
    tagline: 'A monster for pro workflows. Breakthrough power and Liquid Retina XDR.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 1599,
    models: ['14-inch MacBook Pro', '16-inch MacBook Pro'],
    colors: [
      {
        name: 'Space Black',
        hex: '#232426',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=png-alpha'
      },
      {
        name: 'Silver',
        hex: '#E3E4E5',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=904&hei=840&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '512gb', label: '16GB Unified Memory / 512GB SSD', priceDelta: 0 },
      { id: '1tb', label: '24GB Unified Memory / 1TB SSD', priceDelta: 400 },
      { id: '2tb', label: '48GB Unified Memory / 2TB SSD', priceDelta: 1000 }
    ],
    specs: ['Apple M4 / M4 Pro / M4 Max', 'Liquid Retina XDR display with 1600 nits peak', 'HDMI, SDXC, 3x Thunderbolt 5', 'Up to 24 hours battery life']
  },
  {
    id: 'apple-ipad-pro-m4',
    name: 'iPad Pro (M4)',
    brand: 'Apple',
    tagline: 'Impossibly thin. Outrageously powerful with Ultra Retina XDR OLED.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 999,
    models: ['11-inch Ultra Retina XDR', '13-inch Ultra Retina XDR'],
    colors: [
      {
        name: 'Space Black',
        hex: '#2B2B2D',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-spaceblack?wid=940&hei=1112&fmt=png-alpha'
      },
      {
        name: 'Silver',
        hex: '#E3E4E5',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-silver?wid=940&hei=1112&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '256gb', label: '256 GB (Wi-Fi)', priceDelta: 0 },
      { id: '512gb', label: '512 GB (Wi-Fi)', priceDelta: 200 },
      { id: '1tb-cell', label: '1 TB (Wi-Fi + Cellular)', priceDelta: 800 }
    ],
    specs: ['Tandem OLED Ultra Retina XDR display', 'Apple M4 chip', 'Apple Pencil Pro support', '5.1mm ultra-thin enclosure']
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10',
    brand: 'Apple',
    tagline: 'Thinscredible. Our biggest display ever and the thinnest design yet.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 399,
    models: ['42mm Case', '46mm Case'],
    colors: [
      {
        name: 'Jet Black Aluminum',
        hex: '#111213',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s10-case-unselect-gallery-1-202409_GEO_IN?wid=800&hei=800&fmt=png-alpha'
      },
      {
        name: 'Rose Gold Aluminum',
        hex: '#E7C5B8',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s10-case-unselect-gallery-2-202409_GEO_IN?wid=800&hei=800&fmt=png-alpha'
      },
      {
        name: 'Silver Aluminum',
        hex: '#E3E4E5',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s10-case-unselect-gallery-3-202409_GEO_IN?wid=800&hei=800&fmt=png-alpha'
      }
    ],
    variants: [
      { id: '42mm-gps', label: '42mm GPS', priceDelta: 0 },
      { id: '46mm-gps', label: '46mm GPS', priceDelta: 30 },
      { id: '46mm-cell', label: '46mm GPS + Cellular', priceDelta: 130 }
    ],
    specs: ['Wide-angle OLED Always-On display', 'S10 SiP with 4-core Neural Engine', 'Sleep apnea notifications', 'Fast charging: 80% in 30 min']
  },
  {
    id: 'apple-airpods-pro-2',
    name: 'AirPods Pro (2nd Gen)',
    brand: 'Apple',
    tagline: 'Up to 2x more Active Noise Cancellation. Hearing Health features.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 249,
    models: ['AirPods Pro (2nd gen) with MagSafe Case (USB-C)'],
    colors: [
      {
        name: 'White',
        hex: '#F5F5F7',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=800&hei=800&fmt=png-alpha'
      }
    ],
    variants: [
      { id: 'usbc', label: 'MagSafe Case (USB-C)', priceDelta: 0 }
    ],
    specs: ['H2 headphone chip', 'Pro-level Active Noise Cancellation', 'Adaptive Audio & Transparency mode', 'IP54 dust, sweat, and water resistance']
  },
  {
    id: 'apple-airpods-max',
    name: 'AirPods Max',
    brand: 'Apple',
    tagline: 'High-fidelity audio. Active Noise Cancellation with Transparency mode.',
    category: 'Electronics',
    defaultSeller: 'Apple Store',
    defaultWarrantyMonths: 12,
    basePrice: 549,
    models: ['AirPods Max (USB-C)'],
    colors: [
      {
        name: 'Midnight',
        hex: '#1C212A',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=800&hei=800&fmt=png-alpha'
      },
      {
        name: 'Starlight',
        hex: '#F0EDE6',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-starlight?wid=800&hei=800&fmt=png-alpha'
      },
      {
        name: 'Blue',
        hex: '#8FAABF',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-blue?wid=800&hei=800&fmt=png-alpha'
      },
      {
        name: 'Purple',
        hex: '#A89CB8',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-purple?wid=800&hei=800&fmt=png-alpha'
      },
      {
        name: 'Orange',
        hex: '#DF6B48',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-orange?wid=800&hei=800&fmt=png-alpha'
      }
    ],
    variants: [
      { id: 'usbc', label: 'USB-C Charging Edition', priceDelta: 0 }
    ],
    specs: ['Apple-designed 40mm dynamic driver', 'Computational audio with H1 chip in each cup', 'Knit-mesh canopy and memory foam ear cushions']
  },
  {
    id: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    tagline: 'Industry-leading noise cancellation with Auto NC Optimizer and 30-hour battery.',
    category: 'Electronics',
    defaultSeller: 'Amazon',
    defaultWarrantyMonths: 12,
    basePrice: 399,
    models: ['WH-1000XM5 Wireless Headphones'],
    colors: [
      {
        name: 'Black',
        hex: '#1A1A1A',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Silver / Platinum',
        hex: '#D3CFCA',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Midnight Blue',
        hex: '#1C2333',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
      }
    ],
    variants: [
      { id: 'standard', label: 'Wireless Noise Canceling', priceDelta: 0 }
    ],
    specs: ['Integrated Processor V1 + HD Noise Cancelling Processor QN1', '30-hour battery life with quick charging', 'Multipoint Bluetooth connection']
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    tagline: 'Titanium armor, built-in S Pen, and Galaxy AI photo intelligence.',
    category: 'Electronics',
    defaultSeller: 'Samsung Store',
    defaultWarrantyMonths: 12,
    basePrice: 1299,
    models: ['Galaxy S24 Ultra (6.8-inch Dynamic AMOLED 2X)'],
    colors: [
      {
        name: 'Titanium Gray',
        hex: '#7B7B79',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Titanium Black',
        hex: '#282828',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Titanium Violet',
        hex: '#5A5868',
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
      }
    ],
    variants: [
      { id: '256gb', label: '12GB RAM / 256GB Storage', priceDelta: 0 },
      { id: '512gb', label: '12GB RAM / 512GB Storage', priceDelta: 120 },
      { id: '1tb', label: '12GB RAM / 1TB Storage', priceDelta: 360 }
    ],
    specs: ['Snapdragon 8 Gen 3 for Galaxy', '200MP Quad Telephoto camera system', 'Embedded S Pen stylus', 'Corning Gorilla Armor anti-reflective glass']
  },
  {
    id: 'sony-playstation-5',
    name: 'PlayStation 5 Slim',
    brand: 'Sony',
    tagline: 'Play Has No Limits. Ultra-high-speed SSD, haptic feedback, and 3D audio.',
    category: 'Electronics',
    defaultSeller: 'Sony Center',
    defaultWarrantyMonths: 12,
    basePrice: 499,
    models: ['PlayStation 5 Slim Disc Edition', 'PlayStation 5 Slim Digital Edition'],
    colors: [
      {
        name: 'Classic White & Black',
        hex: '#EDEDED',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Midnight Black Shell',
        hex: '#18191B',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
      }
    ],
    variants: [
      { id: 'disc', label: '1 TB Storage (Disc Edition)', priceDelta: 0 },
      { id: 'digital', label: '1 TB Storage (Digital Edition)', priceDelta: -50 }
    ],
    specs: ['Custom AMD Zen 2 CPU & RDNA 2 GPU', 'Ultra-fast 1TB PCIe 4.0 SSD', 'DualSense wireless controller with adaptive triggers']
  },
  {
    id: 'dyson-v15-detect',
    name: 'Dyson V15 Detect',
    brand: 'Dyson',
    tagline: 'Most powerful, intelligent cordless vacuum with laser illumination.',
    category: 'Appliances',
    defaultSeller: 'Dyson Demo Store',
    defaultWarrantyMonths: 24,
    basePrice: 749,
    models: ['V15 Detect Absolute', 'V15 Detect Extra'],
    colors: [
      {
        name: 'Yellow / Iron',
        hex: '#E2AC36',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Gold / Iron',
        hex: '#B8860B',
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80'
      }
    ],
    variants: [
      { id: 'standard', label: 'Fluffy Optic + Digital Motorbar Heads', priceDelta: 0 }
    ],
    specs: ['Laser reveals microscopic dust', 'Piezo sensor counts and measures particles', 'Up to 60 minutes run time', '2-year Dyson official warranty']
  }
];
