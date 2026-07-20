import type { ToolListing, Owner, UserAccount, Booking } from '../types';

export const mockOwners: Record<string, Owner> = {
  'owner-1': {
    id: 'owner-1',
    name: 'Marcus Vance',
    avatar: '/images/default-avatar.png',
    rating: 4.9,
    reviewsCount: 48,
    responseTime: 'Usually responds within 1 hour',
    responseRate: '100%',
    verified: true,
    memberSince: 'Oct 2023',
    city: 'Austin, TX — South Congress',
    bio: 'Mechanical engineer and prototyping enthusiast. I own industrial-grade fabrication and 3D printing equipment that sits idle on weekdays. Happy to share tips on print optimization!',
  },
  'owner-2': {
    id: 'owner-2',
    name: 'Elena Rostova',
    avatar: '/images/default-avatar.png',
    rating: 4.8,
    reviewsCount: 32,
    responseTime: 'Usually responds within 2 hours',
    responseRate: '98%',
    verified: true,
    memberSince: 'Jan 2024',
    city: 'Austin, TX — Eastside',
    bio: 'Custom furniture builder and woodworker. I maintain all my cutting tools and blades in razor-sharp condition. Treat them with respect and safety first!',
  },
  'owner-3': {
    id: 'owner-3',
    name: 'David K. Chen',
    avatar: '/images/default-avatar.png',
    rating: 4.7,
    reviewsCount: 19,
    responseTime: 'Usually responds within 3 hours',
    responseRate: '95%',
    verified: true,
    memberSince: 'Mar 2024',
    city: 'Austin, TX — North Loop',
    bio: 'Weekend landscaper and home renovation DIYer. Why spend ₹65,000 on a commercial pressure washer or tile saw for a 2-day patio job? Borrow mine anytime.',
  },
  'user-alex': {
    id: 'user-alex',
    name: 'Alex Rivera',
    avatar: '/images/default-avatar.png',
    rating: 4.9,
    reviewsCount: 14,
    responseTime: 'Usually responds within 1 hour',
    responseRate: '100%',
    verified: true,
    memberSince: 'Feb 2024',
    city: 'Austin, TX — Hyde Park',
    bio: 'Full-stack developer by day, home improver and woodworker on weekends. I love both lending out my Makita kit and renting heavy fabrication tools when I need them.',
  }
};

export const initialCurrentUser: UserAccount = {
  id: 'user-alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@assetex.io',
  phone: '+1 (512) 847-2930',
  avatar: '/images/default-avatar.png',
  city: 'Austin, TX — Hyde Park',
  bio: 'Full-stack developer by day, home improver and woodworker on weekends. I love both lending out my Makita kit and renting heavy fabrication tools when I need them.',
  rating: 4.9,
  reviewsCount: 14,
  verified: true,
  memberSince: 'Feb 2024',
};

export const initialListings: ToolListing[] = [
  {
    id: 'tool-1',
    title: 'Prusa i3 MK3S+ 3D Printer + Multi-Material Setup',
    category: '3D Printing & Fabrication',
    shortDescription: 'Legendary reliability with auto bed leveling and filament runout sensor. Perfect for precision parts and rapid prototyping.',
    description: 'The Original Prusa i3 MK3S+ is the gold standard of desktop 3D printing. This unit is meticulously calibrated with a PEI spring steel sheet that makes print removal effortless. Capable of printing PLA, PETG, ABS, and TPU flexible filaments. Comes with an SD card loaded with test models and slicing profile presets.',
    specs: [
      'Build Volume: 250 x 210 x 210 mm',
      'Layer Resolution: 0.05 - 0.35 mm',
      'Nozzle Size: 0.4mm E3D V6 All-Metal',
      'Includes 1kg PLA Spool & Tool Kit'
    ],
    image: '/images/1.png',
    images: [
      '/images/1.png'
    ],
    dailyRate: 2800,
    deposit: 12000,
    location: 'Austin, TX — South Congress',
    ownerId: 'owner-1',
    owner: mockOwners['owner-1'],
    status: 'active',
    rating: 4.9,
    reviewCount: 24,
    featured: true,
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Sam K.',
        authorAvatar: '/images/default-avatar.png',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Marcus had the printer tuned to perfection! Printed 12 custom drone frame brackets over the weekend without a single failed layer.'
      },
      {
        id: 'rev-2',
        authorName: 'Jessica T.',
        authorAvatar: '/images/default-avatar.png',
        rating: 5,
        date: '1 month ago',
        comment: 'Super easy pickup and Marcus gave a 5-minute walkthrough that made my first rental effortless. Will definitely rent again.'
      }
    ]
  },
  {
    id: 'tool-2',
    title: 'xTool D1 Pro 20W Diode Laser Engraver & Cutter',
    category: '3D Printing & Fabrication',
    shortDescription: 'High-accuracy industrial laser diode for engraving and cutting wood, acrylic, leather, and coated metals.',
    description: 'The xTool D1 Pro 20W is an ultra-precise diode laser cutter and engraver. Features dual red-cross laser focusing and ultra-fine 0.08 x 0.10 mm laser spot for astonishing detail. Can cleanly slice through 10mm basswood in a single pass. Includes honeycomb enclosure bed and air assist pump to prevent charring.',
    specs: [
      'Working Area: 430 x 390 mm (17 x 15.3 in)',
      'Laser Power: 20W Optical Output',
      'Includes Air Assist & Honeycomb Panel'
    ],
    image: '/images/2.png',
    images: [
      '/images/2.png'
    ],
    dailyRate: 3600,
    deposit: 16000,
    location: 'Austin, TX — South Congress',
    ownerId: 'owner-1',
    owner: mockOwners['owner-1'],
    status: 'active',
    rating: 4.8,
    reviewCount: 18,
    featured: true,
    reviews: [
      {
        id: 'rev-3',
        authorName: 'Chris M.',
        authorAvatar: '/images/default-avatar.png',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Used this to engrave custom leather wallets for groomsmen gifts. Clean cuts and excellent air assist!'
      }
    ]
  },
  {
    id: 'tool-3',
    title: 'Stihl MS 271 Farm Boss 20-inch Heavy Duty Chainsaw',
    category: 'Power Tools & Carpentry',
    shortDescription: 'High-performance workhorse for felling trees, clearing storm debris, and bucking firewood with ease.',
    description: 'The Stihl MS 271 Farm Boss is built for serious land clearing and storm cleanup. Equipped with a high-torque 50.2cc engine and anti-vibration system that keeps fatigue to a minimum during all-day use. Includes pre-sharpened low-kickback chain, bar scabbard, and safety helmet with mesh visor.',
    specs: [
      'Engine Displacement: 50.2 cc (3.46 bhp)',
      'Bar Length: 20 inches',
      'Safety Gear & Extra Chain Oil Included'
    ],
    image: '/images/3.png',
    images: [
      '/images/3.png'
    ],
    dailyRate: 4000,
    deposit: 15000,
    location: 'Austin, TX — Eastside',
    ownerId: 'owner-2',
    owner: mockOwners['owner-2'],
    status: 'active',
    rating: 4.9,
    reviewCount: 31,
    featured: true,
    reviews: [
      {
        id: 'rev-4',
        authorName: 'Brad H.',
        authorAvatar: '/images/default-avatar.png',
        rating: 5,
        date: '1 month ago',
        comment: 'Blade was sharp as a razor. Took down two fallen oak branches after the storm in under an hour. Elena provided chain oil too!'
      }
    ]
  },
  {
    id: 'tool-4',
    title: 'Bosch 1617EVSPK Router & Precision Router Table Combo',
    category: 'Power Tools & Carpentry',
    shortDescription: '2.25 HP electronic variable-speed wood router with fixed/plunge base and heavy-duty benchtop aluminum table.',
    description: 'Whether you are shaping custom cabinet doors, dadoes, or edge profiles, this Bosch router package delivers cabinet-shop accuracy. Includes both fixed and plunge bases, micro-fine height adjustment, and a rigid aluminum benchtop router table with featherboards and dust extraction port.',
    specs: [
      'Motor: 2.25 HP, 12 Amp Variable Speed (8,000 - 25,000 RPM)',
      'Collet Chucks: 1/4-inch and 1/2-inch included',
      'Precision Aluminum Router Table with Split Fence',
      'Includes 15-piece Carbide Router Bit Set'
    ],
    image: '/images/4.png',
    images: [
      '/images/4.png'
    ],
    dailyRate: 3200,
    deposit: 12000,
    location: 'Austin, TX — Eastside',
    ownerId: 'owner-2',
    owner: mockOwners['owner-2'],
    status: 'active',
    rating: 4.7,
    reviewCount: 15,
    reviews: []
  },
  {
    id: 'tool-5',
    title: 'DeWalt 14-inch Two-Speed Heavy Duty Wood Bandsaw',
    category: 'Power Tools & Carpentry',
    shortDescription: 'Precision resawing and intricate curves with 6-inch resaw capacity and cast-iron frame stability.',
    description: 'An indispensable carpentry machine that costs over ₹95,000 new. Perfect for resawing thick hardwood lumber into custom book-matched veneers or cutting smooth architectural curves. Features roller bearing guides, quick-tension release, and enclosed stand on locking caster wheels.',
    specs: [
      'Resaw Capacity: 6 inches vertical',
      'Throat Depth: 13.5 inches',
      'Motor: 1 HP TEFC Induction Motor',
      'Includes both 1/2" Resaw & 1/4" Curve Blades'
    ],
    image: '/images/5.png',
    images: [
      '/images/5.png'
    ],
    dailyRate: 5000,
    deposit: 20000,
    location: 'Austin, TX — Eastside',
    ownerId: 'owner-2',
    owner: mockOwners['owner-2'],
    status: 'active',
    rating: 4.9,
    reviewCount: 12,
    reviews: []
  },
  {
    id: 'tool-6',
    title: 'Honda HRX 21-inch 200cc Self-Propelled Mower with Select Drive',
    category: 'Gardening & Outdoor',
    shortDescription: 'Commercial-grade hydrostatic drive and twin blade microcut system for professional golf-course lawn results.',
    description: 'If you need to get your lawn or rental property in showroom shape without storing a massive mower all year, this Honda HRX is unmatched. Features twin blades that chop grass clippings into fine nutrients, variable speed self-propel control, and rust-proof NeXite cutting deck.',
    specs: [
      'Engine: Honda GCV200 201cc 4-Stroke',
      'Cutting Width: 21 inches (7 Height Adjustments)',
      'Drive System: Select Drive Variable Hydrostatic',
      'Includes Large Capacity Bag & Mulch Plug'
    ],
    image: '/images/6.png',
    images: [
      '/images/6.png'
    ],
    dailyRate: 2400,
    deposit: 8000,
    location: 'Austin, TX — North Loop',
    ownerId: 'owner-3',
    owner: mockOwners['owner-3'],
    status: 'active',
    rating: 4.8,
    reviewCount: 21,
    featured: true,
    reviews: []
  },
  {
    id: 'tool-7',
    title: 'Sun Joe SPX3000 2030 PSI Commercial Electric Pressure Washer',
    category: 'Gardening & Outdoor',
    shortDescription: 'High-pressure cleaning power for driveways, decks, brick facades, and vehicles with 5 quick-connect nozzles.',
    description: 'Strip away years of built-up grime, mildew, and old deck stain in hours. Equipped with a 14.5-amp motor generating up to 2030 PSI of cleaning force and dual detergent tanks for seamless switching between siding detergent and concrete degreaser.',
    specs: [
      'Maximum Pressure: 2030 PSI at 1.76 GPM',
      'Nozzle Tips: 0°, 15°, 25°, 40° & Soap Quick Connect',
      'Hose Length: 20 ft High-Pressure + 35 ft Power Cord',
      'Includes Foam Cannon Attachment'
    ],
    image: '/images/7.png',
    images: [
      '/images/7.png'
    ],
    dailyRate: 2200,
    deposit: 6500,
    location: 'Austin, TX — North Loop',
    ownerId: 'owner-3',
    owner: mockOwners['owner-3'],
    status: 'active',
    rating: 4.6,
    reviewCount: 16,
    reviews: []
  },
  {
    id: 'tool-8',
    title: 'RUBI Star-63 Professional 25-inch Tile & Porcelain Diamond Cutter',
    category: 'Home Improvement',
    shortDescription: 'Heavy-duty manual tile cutter with mobile breaker for precision cuts on porcelain, ceramic, and glass tiles.',
    description: 'Tiling a bathroom shower or kitchen backsplash? Don’t buy a tile cutter you will use once every decade. The RUBI Star-63 provides clean, chip-free straight and diagonal cuts on tiles up to 25 inches long and 1/2 inch thick with reinforced aluminum guides.',
    specs: [
      'Max Cutting Length: 25 inches (63 cm)',
      'Diagonal Cutting: up to 18x18 inch tile',
      'Scoring Wheel: 8mm Tungsten Carbide Diamond Wheel',
      'Includes Shock-Proof Carrying Case'
    ],
    image: '/images/8.png',
    images: [
      '/images/8.png'
    ],
    dailyRate: 2000,
    deposit: 8000,
    location: 'Austin, TX — North Loop',
    ownerId: 'owner-3',
    owner: mockOwners['owner-3'],
    status: 'active',
    rating: 4.9,
    reviewCount: 14,
    reviews: []
  },
  // Listings owned by the logged-in user Alex Rivera
  {
    id: 'tool-9',
    title: 'Makita 18V LXT Lithium-Ion Brushless Cordless 6-Tool Combo Kit',
    category: 'Power Tools & Carpentry',
    shortDescription: 'Complete professional impact driver, hammer drill, circular saw, reciprocating saw, grinder, and work light kit.',
    description: 'My trusted contractor-grade Makita brushless power tool kit. Perfect for framing, deck repairs, and plumbing work. Includes two fast-charging 5.0Ah 18V batteries, dual-port rapid charger, and heavy-duty rolling canvas contractor bag.',
    specs: [
      'Includes Brushless Impact Driver & Hammer Drill/Driver',
      'Includes 6-1/2" Circular Saw & Reciprocating Saw',
      'Includes 4-1/2" Cut-Off/Angle Grinder & LED Work Light',
      '2x 18V 5.0Ah Batteries + Rapid Charger Included'
    ],
    image: '/images/9.png',
    images: [
      '/images/9.png'
    ],
    dailyRate: 3200,
    deposit: 12000,
    location: 'Austin, TX — Hyde Park',
    ownerId: 'user-alex',
    owner: mockOwners['user-alex'],
    status: 'active',
    rating: 4.9,
    reviewCount: 9,
    reviews: []
  },
  {
    id: 'tool-10',
    title: 'DeWalt 12-inch Double-Bevel Sliding Compound Miter Saw + Stand',
    category: 'Power Tools & Carpentry',
    shortDescription: 'Precision trim work and crosscutting with XPS crosscut alignment LED system and rolling folding stand.',
    description: 'The ultimate saw for baseboards, crown molding, and structural lumber. The XPS LED worklight casts the blade shadow directly onto the wood for zero-error cuts every time. Comes mounted on a DeWalt heavy-duty rolling folding stand for instant setup.',
    specs: [
      'Blade Size: 12-inch 80-Tooth Fine Carbide Blade',
      'Crosscut Capacity: 2x14 inch lumber at 90 degrees',
      'Bevel Capacity: 49 degrees Left and Right with detents',
      'Includes Heavy Duty Mobile Rolling Stand'
    ],
    image: '/images/10.png',
    images: [
      '/images/10.png'
    ],
    dailyRate: 4400,
    deposit: 16000,
    location: 'Austin, TX — Hyde Park',
    ownerId: 'user-alex',
    owner: mockOwners['user-alex'],
    status: 'active',
    rating: 5.0,
    reviewCount: 5,
    reviews: []
  }
];

export const initialBookings: Booking[] = [
  // Bookings where Alex is RENTING from others
  {
    id: 'book-101',
    toolId: 'tool-1',
    toolTitle: 'Prusa i3 MK3S+ 3D Printer + Multi-Material Setup',
    toolImage: '/images/1.png',
    toolCategory: '3D Printing & Fabrication',
    renterId: 'user-alex',
    renterName: 'Alex Rivera',
    renterAvatar: '/images/default-avatar.png',
    renterRating: 4.9,
    ownerId: 'owner-1',
    ownerName: 'Marcus Vance',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    days: 3,
    dailyRate: 2800,
    totalEstimate: 8400,
    status: 'Pending',
    message: 'Hi Marcus! I have a custom Raspberry Pi enclosure and keyboard chassis I need to print over the weekend. Will pick up Friday evening!',
    createdAt: '2026-07-15'
  },
  {
    id: 'book-102',
    toolId: 'tool-3',
    toolTitle: 'Stihl MS 271 Farm Boss 20-inch Heavy Duty Chainsaw',
    toolImage: '/images/3.png',
    toolCategory: 'Power Tools & Carpentry',
    renterId: 'user-alex',
    renterName: 'Alex Rivera',
    renterAvatar: '/images/default-avatar.png',
    renterRating: 4.9,
    ownerId: 'owner-2',
    ownerName: 'Elena Rostova',
    startDate: '2026-07-25',
    endDate: '2026-07-26',
    days: 2,
    dailyRate: 4000,
    totalEstimate: 8000,
    status: 'Approved',
    message: 'Need to clear a dead pecan branch in my backyard after the windstorm. Thanks Elena!',
    createdAt: '2026-07-14'
  },
  // Incoming Booking requests where others are renting ALEX's tools (so Alex can click Approve / Decline!)
  {
    id: 'book-201',
    toolId: 'tool-9',
    toolTitle: 'Makita 18V LXT Lithium-Ion Brushless Cordless 6-Tool Combo Kit',
    toolImage: '/images/9.png',
    toolCategory: 'Power Tools & Carpentry',
    renterId: 'renter-99',
    renterName: 'Jordan Taylor',
    renterAvatar: '/images/default-avatar.png',
    renterRating: 4.8,
    ownerId: 'user-alex',
    ownerName: 'Alex Rivera',
    startDate: '2026-07-18',
    endDate: '2026-07-19',
    days: 2,
    dailyRate: 3200,
    totalEstimate: 6400,
    status: 'Pending',
    message: 'Hey Alex! Building a raised cedar garden bed this weekend and could really use the circular saw and impact driver from your combo kit. Can pick up Saturday morning.',
    createdAt: '2026-07-15'
  },
  {
    id: 'book-202',
    toolId: 'tool-10',
    toolTitle: 'DeWalt 12-inch Double-Bevel Compound Miter Saw + Stand',
    toolImage: '/images/10.png',
    toolCategory: 'Power Tools & Carpentry',
    renterId: 'renter-88',
    renterName: 'Priya Patel',
    renterAvatar: '/images/default-avatar.png',
    renterRating: 5.0,
    ownerId: 'user-alex',
    ownerName: 'Alex Rivera',
    startDate: '2026-07-22',
    endDate: '2026-07-24',
    days: 3,
    dailyRate: 4400,
    totalEstimate: 13200,
    status: 'Pending',
    message: 'Doing custom crown molding in my dining room. I have a small truck so picking up the saw + stand will be easy!',
    createdAt: '2026-07-15'
  }
];
