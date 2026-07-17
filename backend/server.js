import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Listing from './models/Listing.js';
import Booking from './models/Booking.js';

const __filename = (typeof import.meta !== 'undefined' && import.meta.url) 
  ? fileURLToPath(import.meta.url) 
  : (typeof __filename !== 'undefined' ? __filename : '');
const __dirname = __filename 
  ? path.dirname(__filename) 
  : (typeof __dirname !== 'undefined' ? __dirname : process.cwd());
dotenv.config({ path: path.join(__dirname, '.env') });
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'assetex_secure_jwt_secret_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assetex';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rewrite Netlify serverless function paths to match Express routes
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
    if (!req.url.startsWith('/')) req.url = '/' + req.url;
    if (!req.url.startsWith('/api')) req.url = '/api' + req.url;
  }
  next();
});

const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) { /* ignore read-only serverless filesystem /var/task error */ }
app.use('/api/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(uploadsDir));

let useMongoDB = false;
let cachedDb = null;

async function ensureMongoConnection() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    useMongoDB = true;
    return cachedDb;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('127.0.0.1')) {
    useMongoDB = false;
    return null;
  }
  try {
    cachedDb = await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false
    });
    useMongoDB = true;
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      for (const key of Object.keys(initialOwners)) {
        await User.create(initialOwners[key]);
      }
    }
    return cachedDb;
  } catch (err) {
    console.warn(`[WARNING] MongoDB not reachable (${err.message}).`);
    useMongoDB = false;
    return null;
  }
}

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/.netlify/functions/api')) {
    await ensureMongoConnection();
  }
  next();
});

// Initial seed data for fallback OR seeding MongoDB
const initialOwners = {
  'owner-1': {
    id: 'owner-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@assetex.io',
    password: 'Assetex123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
    email: 'elena.rostova@assetex.io',
    password: 'Assetex123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
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
    email: 'david.chen@assetex.io',
    password: 'Assetex123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
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
    email: 'alex.rivera@assetex.io',
    password: 'Assetex123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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

const initialCurrentUser = {
  id: 'user-alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@assetex.io',
  phone: '+1 (512) 847-2930',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  city: 'Austin, TX — Hyde Park',
  bio: 'Full-stack developer by day, home improver and woodworker on weekends. I love both lending out my Makita kit and renting heavy fabrication tools when I need them.',
  rating: 4.9,
  reviewsCount: 14,
  verified: true,
  memberSince: 'Feb 2024',
};

const initialListings = [
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
    images: ['/images/1.png'],
    dailyRate: 2800,
    deposit: 12000,
    location: 'Austin, TX — South Congress',
    ownerId: 'owner-1',
    owner: initialOwners['owner-1'],
    status: 'active',
    rating: 4.9,
    reviewCount: 24,
    featured: true,
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Sam K.',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Marcus had the printer tuned to perfection! Printed 12 custom drone frame brackets over the weekend without a single failed layer.'
      },
      {
        id: 'rev-2',
        authorName: 'Jessica T.',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
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
    images: ['/images/2.png'],
    dailyRate: 3600,
    deposit: 16000,
    location: 'Austin, TX — South Congress',
    ownerId: 'owner-1',
    owner: initialOwners['owner-1'],
    status: 'active',
    rating: 4.8,
    reviewCount: 18,
    featured: true,
    reviews: [
      {
        id: 'rev-3',
        authorName: 'Chris M.',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
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
    images: ['/images/3.png'],
    dailyRate: 4000,
    deposit: 15000,
    location: 'Austin, TX — Eastside',
    ownerId: 'owner-2',
    owner: initialOwners['owner-2'],
    status: 'active',
    rating: 4.9,
    reviewCount: 31,
    featured: true,
    reviews: [
      {
        id: 'rev-4',
        authorName: 'Brad H.',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
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
    images: ['/images/4.png'],
    dailyRate: 3200,
    deposit: 12000,
    location: 'Austin, TX — Eastside',
    ownerId: 'owner-2',
    owner: initialOwners['owner-2'],
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
    images: ['/images/5.png'],
    dailyRate: 5000,
    deposit: 20000,
    location: 'Austin, TX — Eastside',
    ownerId: 'owner-2',
    owner: initialOwners['owner-2'],
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
    images: ['/images/6.png'],
    dailyRate: 2400,
    deposit: 8000,
    location: 'Austin, TX — North Loop',
    ownerId: 'owner-3',
    owner: initialOwners['owner-3'],
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
    images: ['/images/7.png'],
    dailyRate: 2200,
    deposit: 6500,
    location: 'Austin, TX — North Loop',
    ownerId: 'owner-3',
    owner: initialOwners['owner-3'],
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
    images: ['/images/8.png'],
    dailyRate: 2000,
    deposit: 8000,
    location: 'Austin, TX — North Loop',
    ownerId: 'owner-3',
    owner: initialOwners['owner-3'],
    status: 'active',
    rating: 4.9,
    reviewCount: 14,
    reviews: []
  },
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
    images: ['/images/9.png'],
    dailyRate: 3200,
    deposit: 12000,
    location: 'Austin, TX — Hyde Park',
    ownerId: 'user-alex',
    owner: initialOwners['user-alex'],
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
    images: ['/images/10.png'],
    dailyRate: 4400,
    deposit: 16000,
    location: 'Austin, TX — Hyde Park',
    ownerId: 'user-alex',
    owner: initialOwners['user-alex'],
    status: 'active',
    rating: 5.0,
    reviewCount: 5,
    reviews: []
  }
];

const initialBookings = [
  {
    id: 'book-101',
    toolId: 'tool-1',
    toolTitle: 'Prusa i3 MK3S+ 3D Printer + Multi-Material Setup',
    toolImage: '/images/1.png',
    toolCategory: '3D Printing & Fabrication',
    renterId: 'user-alex',
    renterName: 'Alex Rivera',
    renterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
    renterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
  {
    id: 'book-201',
    toolId: 'tool-9',
    toolTitle: 'Makita 18V LXT Lithium-Ion Brushless Cordless 6-Tool Combo Kit',
    toolImage: '/images/9.png',
    toolCategory: 'Power Tools & Carpentry',
    renterId: 'renter-99',
    renterName: 'Jordan Taylor',
    renterAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
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
    renterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
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

// Initial trigger for standalone server runs
ensureMongoConnection().catch(() => {});

// Helper functions for reading and writing local state (fallback when MongoDB is down)
function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  
  const defaultDb = {
    owners: initialOwners,
    currentUser: initialCurrentUser,
    listings: initialListings,
    bookings: initialBookings
  };
  writeDb(defaultDb);
  return defaultDb;
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// REST Routes

// Temporary diagnostic endpoint (remove after debugging)
app.get('/api/debug-connection', async (req, res) => {
  const uri = process.env.MONGODB_URI;
  const mongooseState = mongoose.connection.readyState;
  res.json({
    useMongoDB,
    mongooseState,
    hasUri: !!uri,
    uriPrefix: uri ? uri.substring(0, 30) + '...' : 'NOT SET',
    envKeys: Object.keys(process.env).filter(k => k.includes('MONGO') || k === 'NETLIFY' || k === 'LAMBDA_TASK_ROOT'),
    nodeEnv: process.env.NODE_ENV
  });
});

// Image Upload Endpoint
app.post('/api/upload', (req, res) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 data URL' });
    }
    const ext = matches[1].split('/')[1] || 'png';
    const safeName = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
    try {
      if (!process.env.NETLIFY && !process.env.LAMBDA_TASK_ROOT) {
        const buffer = Buffer.from(matches[2], 'base64');
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, buffer);
      }
    } catch (e) { /* ignore filesystem write error in serverless */ }
    return res.status(201).json({ url: dataUrl, success: true });
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

// 1. Auth / User endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (useMongoDB) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'No account found with this email. Please sign up first.' });
      }
      // Verify password against bcrypt hash
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      const userObj = user.toObject();
      delete userObj.password;
      return res.json({ ...userObj, token });
    } catch (err) {
      console.error('MongoDB login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Fallback — database not connected
  return res.status(503).json({ error: 'Database is not connected. Please try again later.' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, city, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  if (useMongoDB) {
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
      }
      const user = await User.create({
        id: `user-${Date.now()}`,
        name,
        email,
        phone: phone || '',
        city: city || 'Austin, TX — South Congress',
        bio: `New member of Assetex based in ${city || 'Austin, TX'}.`,
        rating: 5.0,
        reviewsCount: 0,
        verified: true,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        password
      });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      const userRes = user.toObject();
      delete userRes.password;
      return res.status(201).json({ ...userRes, token });
    } catch (err) {
      console.error('MongoDB signup error:', err);
      return res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
  }

  // Fallback — database not connected
  return res.status(503).json({ error: 'Database is not connected. Please try again later.' });
});

app.get('/api/auth/profile', async (req, res) => {
  if (useMongoDB) {
    try {
      let user = await User.findOne({ id: initialCurrentUser.id });
      if (!user) user = initialCurrentUser;
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Error fetching profile' });
    }
  }
  const db = readDb();
  res.json(db.currentUser);
});

app.put('/api/auth/profile', async (req, res) => {
  if (useMongoDB) {
    try {
      const id = req.body.id || initialCurrentUser.id;
      const updatedUser = await User.findOneAndUpdate({ id }, req.body, { new: true, upsert: true });
      return res.json(updatedUser);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  const db = readDb();
  if (!db.currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  db.currentUser = { ...db.currentUser, ...req.body };
  if (db.owners[db.currentUser.id]) {
    db.owners[db.currentUser.id] = { ...db.owners[db.currentUser.id], ...req.body };
  }
  writeDb(db);
  res.json(db.currentUser);
});

// 2. Listings endpoints
app.get('/api/listings', async (req, res) => {
  if (useMongoDB) {
    try {
      const listings = await Listing.find().sort({ createdAt: -1 });
      return res.json(listings);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch listings' });
    }
  }
  const db = readDb();
  res.json(db.listings);
});

app.post('/api/listings', async (req, res) => {
  const newId = `tool-${Date.now()}`;
  let ownerId = req.body.ownerId || initialCurrentUser.id;

  if (useMongoDB) {
    try {
      let ownerUser = await User.findOne({ id: ownerId });
      if (!ownerUser) ownerUser = initialCurrentUser;

      const ownerObj = req.body.owner || {
        id: ownerUser.id,
        name: ownerUser.name,
        avatar: ownerUser.avatar,
        rating: ownerUser.rating || 5.0,
        reviewsCount: ownerUser.reviewsCount || 0,
        responseTime: 'Usually responds within 1 hour',
        responseRate: '100%',
        verified: ownerUser.verified,
        memberSince: ownerUser.memberSince,
        city: ownerUser.city,
        bio: ownerUser.bio
      };

      const newListing = await Listing.create({
        ...req.body,
        id: newId,
        ownerId,
        owner: ownerObj,
        status: 'active',
        rating: 5.0,
        reviewCount: 0,
        reviews: []
      });
      return res.status(201).json(newListing);
    } catch (err) {
      console.error('Create listing MongoDB error:', err);
      return res.status(500).json({ error: 'Failed to create listing' });
    }
  }

  const db = readDb();
  if (!db.currentUser && !req.body.ownerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  ownerId = req.body.ownerId || (db.currentUser ? db.currentUser.id : initialCurrentUser.id);
  const owner = req.body.owner || db.owners[ownerId] || (db.currentUser && db.owners[db.currentUser.id] ? db.owners[db.currentUser.id] : {
    id: ownerId,
    name: db.currentUser ? db.currentUser.name : 'Atharv Mule',
    avatar: db.currentUser ? db.currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 0,
    responseTime: 'Usually responds within 1 hour',
    responseRate: '100%',
    verified: true,
    memberSince: '2026',
    city: req.body.location || 'Austin, TX',
    bio: 'Neighborhood lender on Assetex.'
  });

  if (db.currentUser && ownerId === db.currentUser.id) {
    db.owners[ownerId] = owner;
  }

  const newListing = {
    ...req.body,
    id: newId,
    ownerId,
    owner,
    status: 'active',
    rating: 5.0,
    reviewCount: 0,
    reviews: []
  };

  db.listings.unshift(newListing);
  writeDb(db);
  res.status(201).json(newListing);
});

app.put('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  if (useMongoDB) {
    try {
      const updated = await Listing.findOneAndUpdate({ id }, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Listing not found' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update listing' });
    }
  }

  const db = readDb();
  const index = db.listings.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  db.listings[index] = { ...db.listings[index], ...req.body };
  writeDb(db);
  res.json(db.listings[index]);
});

app.delete('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  if (useMongoDB) {
    try {
      await Listing.findOneAndDelete({ id });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete listing' });
    }
  }

  const db = readDb();
  db.listings = db.listings.filter(item => item.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 3. Bookings endpoints
app.get('/api/bookings', async (req, res) => {
  if (useMongoDB) {
    try {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json(bookings);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }
  const db = readDb();
  res.json(db.bookings);
});

app.post('/api/bookings', async (req, res) => {
  const { toolId, startDate, endDate, message } = req.body;

  if (useMongoDB) {
    try {
      let targetTool = await Listing.findOne({ id: toolId });
      if (!targetTool) {
        targetTool = {
          id: toolId,
          title: req.body.toolTitle || 'Equipment Rental',
          image: req.body.toolImage || '/images/1.png',
          category: req.body.toolCategory || 'General Equipment',
          dailyRate: req.body.dailyRate || 2800,
          ownerId: req.body.ownerId || 'user-alex',
          owner: { name: req.body.ownerName || 'Tool Owner' }
        };
      }

      const renterId = req.body.renterId || initialCurrentUser.id;
      let renter = await User.findOne({ id: renterId });
      const renterName = req.body.renterName || (renter ? renter.name : initialCurrentUser.name);
      const renterAvatar = req.body.renterAvatar || (renter ? renter.avatar : initialCurrentUser.avatar);
      const renterRating = req.body.renterRating || (renter ? renter.rating : 5.0);

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const days = req.body.days || Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const totalEstimate = req.body.totalEstimate || (days * (targetTool.dailyRate || 2800));

      const newBooking = await Booking.create({
        id: `book-${Date.now()}`,
        toolId: targetTool.id,
        toolTitle: targetTool.title,
        toolImage: targetTool.image,
        toolCategory: targetTool.category,
        renterId,
        renterName,
        renterAvatar,
        renterRating,
        ownerId: req.body.ownerId || targetTool.ownerId,
        ownerName: req.body.ownerName || targetTool.owner?.name || 'Tool Owner',
        startDate,
        endDate,
        days,
        dailyRate: targetTool.dailyRate,
        totalEstimate,
        status: 'Pending',
        message,
        createdAt: new Date().toISOString().split('T')[0]
      });
      return res.status(201).json(newBooking);
    } catch (err) {
      console.error('Create booking MongoDB error:', err);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  const db = readDb();
  let targetTool = db.listings.find(t => t.id === toolId);
  if (!targetTool) {
    targetTool = {
      id: toolId,
      title: req.body.toolTitle || 'Equipment Rental',
      image: req.body.toolImage || '/images/1.png',
      category: req.body.toolCategory || 'General Equipment',
      dailyRate: req.body.dailyRate || 2800,
      ownerId: req.body.ownerId || (db.currentUser ? db.currentUser.id : 'user-alex'),
      owner: { name: req.body.ownerName || 'Tool Owner' }
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = req.body.days || Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalEstimate = req.body.totalEstimate || (days * (targetTool.dailyRate || 2800));

  const renterId = req.body.renterId || (db.currentUser ? db.currentUser.id : 'user-alex');
  const renterName = req.body.renterName || (db.currentUser ? db.currentUser.name : 'Ayush');
  const renterAvatar = req.body.renterAvatar || (db.currentUser ? db.currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
  const renterRating = req.body.renterRating || 5.0;

  const newBooking = {
    id: `book-${Date.now()}`,
    toolId: targetTool.id,
    toolTitle: targetTool.title,
    toolImage: targetTool.image,
    toolCategory: targetTool.category,
    renterId,
    renterName,
    renterAvatar,
    renterRating,
    ownerId: req.body.ownerId || targetTool.ownerId,
    ownerName: req.body.ownerName || targetTool.owner?.name || 'Tool Owner',
    startDate,
    endDate,
    days,
    dailyRate: targetTool.dailyRate,
    totalEstimate,
    status: 'Pending',
    message,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.bookings.unshift(newBooking);
  writeDb(db);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (useMongoDB) {
    try {
      const updated = await Booking.findOneAndUpdate({ id }, { status }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Booking not found' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update booking status' });
    }
  }

  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  db.bookings[index].status = status;
  writeDb(db);
  res.json(db.bookings[index]);
});

if (!process.env.LAMBDA_TASK_ROOT && !process.env.NETLIFY && process.env.NODE_ENV !== 'production_lambda') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Assetex Backend server running on port ${PORT} across all interfaces (0.0.0.0)`);
  });
}

export default app;
