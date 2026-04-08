import { DIVISIONS } from "./users-mock";

export interface Division {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  division: string;
  category: string;
  description: string;
  images: string[];
  mrp: number;
  actualPrice: number;
  sku: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export const mockDivisions: Division[] = DIVISIONS.map((name, i) => ({
  id: `div-${i + 1}`,
  name,
  description: `${name} pharmaceutical products and treatments`,
  imageUrl: "/placeholder.svg",
  productCount: Math.floor(Math.random() * 20) + 5,
  isActive: i % 7 !== 0,
}));

const productNames = [
  "Amlocard 5mg", "Neurex Plus", "Oncozyme 200mg", "Dermafix Cream",
  "Osteocare Tab", "Gastrozyme Cap", "Pulmovent Inhaler", "Thyrobalance 50mcg",
  "Cardiostat 10mg", "Braincalm Syrup", "Chemoguard 100mg", "Skinzeal Gel",
  "Flexijoint Tab", "Acidfree 20mg", "Broncoease 100mcg", "Gluconorm SR",
  "Heartshield 75mg", "Nervzon Forte", "Cellguard 500mg", "Dermashield Lotion",
  "Bonedense Cal", "Livergen Cap", "Asthalin 2mg", "Insulex 30/70",
  "Vasodil 5mg", "Memoryplus Tab", "Tumorkill 250mg", "Fungiclear Cream",
  "Calcibone D3", "Pantocid DSR",
];

export const CATEGORY_NAMES = [
  "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Gel", "Ointment",
  "Inhaler", "Drops", "Powder", "Lotion", "Suspension",
];

export const mockCategories: Category[] = CATEGORY_NAMES.map((name, i) => ({
  id: `cat-${i + 1}`,
  name,
  description: `${name} dosage form products`,
  imageUrl: "/placeholder.svg",
  isActive: true,
}));

export const mockProducts: Product[] = productNames.map((name, i) => ({
  id: `prod-${i + 1}`,
  name,
  division: DIVISIONS[i % DIVISIONS.length],
  category: CATEGORY_NAMES[i % CATEGORY_NAMES.length],
  description: `${name} - High quality pharmaceutical product for ${DIVISIONS[i % DIVISIONS.length].toLowerCase()} treatments.`,
  images: ["/placeholder.svg"],
  mrp: Math.round((Math.random() * 800 + 50) * 100) / 100,
  actualPrice: Math.round((Math.random() * 500 + 30) * 100) / 100,
  sku: `SKU-${String(1000 + i)}`,
  stock: Math.floor(Math.random() * 500) + 10,
  isActive: i % 8 !== 0,
  createdAt: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
}));
