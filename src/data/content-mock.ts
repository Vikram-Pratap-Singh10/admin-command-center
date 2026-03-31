export interface VisualAid {
  id: string;
  title: string;
  type: "pdf" | "image";
  url: string;
  division: string;
  uploadedAt: string;
  fileSize: string;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
  visualAidIds: string[];
  createdAt: string;
  isPublished: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  target: "all" | "distributors" | "mrs";
  sentAt: string;
  status: "sent" | "draft";
}

const divisions = ["Cardiology", "Neurology", "Oncology", "Dermatology", "Orthopedics", "Gastroenterology", "Pulmonology", "Endocrinology"];

export const mockVisualAids: VisualAid[] = Array.from({ length: 24 }, (_, i) => ({
  id: `va-${i + 1}`,
  title: `${["Product Brochure", "Clinical Study", "Dosage Guide", "Mechanism of Action", "Patient Leaflet", "Comparison Chart"][i % 6]} - ${divisions[i % divisions.length]}`,
  type: i % 3 === 0 ? "pdf" : "image",
  url: "/placeholder.svg",
  division: divisions[i % divisions.length],
  uploadedAt: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
  fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
}));

export const mockSlides: Slide[] = Array.from({ length: 6 }, (_, i) => ({
  id: `slide-${i + 1}`,
  title: `${divisions[i % divisions.length]} Presentation Pack`,
  description: `Field sales presentation for ${divisions[i % divisions.length]} division products`,
  visualAidIds: mockVisualAids.filter((va) => va.division === divisions[i % divisions.length]).map((va) => va.id),
  createdAt: new Date(2025, i + 2, 15).toISOString(),
  isPublished: i % 3 !== 0,
}));

export const mockFAQs: FAQ[] = [
  { id: "faq-1", question: "How do I place a new order?", answer: "Navigate to the Orders section, click 'New Order', select products and quantities, then submit.", category: "Orders", order: 1, isPublished: true, updatedAt: "2025-06-01T00:00:00Z" },
  { id: "faq-2", question: "What is the return policy?", answer: "Products can be returned within 30 days if unopened and in original packaging. Contact support to initiate a return.", category: "Orders", order: 2, isPublished: true, updatedAt: "2025-06-01T00:00:00Z" },
  { id: "faq-3", question: "How are MRP and Actual Price different?", answer: "MRP is the maximum retail price shown to Medical Representatives. Actual Price is the discounted price shown to Distributors.", category: "Pricing", order: 1, isPublished: true, updatedAt: "2025-05-20T00:00:00Z" },
  { id: "faq-4", question: "How do I get verified as a distributor?", answer: "Upload your GST certificate and Drug License during registration. Our admin team will review and approve within 24-48 hours.", category: "Account", order: 1, isPublished: true, updatedAt: "2025-05-15T00:00:00Z" },
  { id: "faq-5", question: "Can I assign multiple divisions to my account?", answer: "Yes, once approved, an admin can assign multiple pharmaceutical divisions to your distributor account.", category: "Account", order: 2, isPublished: true, updatedAt: "2025-05-15T00:00:00Z" },
  { id: "faq-6", question: "How do I track my order?", answer: "Go to Orders and click on any order to see its real-time status timeline from Placed to Delivered.", category: "Orders", order: 3, isPublished: false, updatedAt: "2025-05-10T00:00:00Z" },
  { id: "faq-7", question: "What payment methods are accepted?", answer: "We accept bank transfers, UPI, and credit/debit card payments. Payment terms vary by distributor agreement.", category: "Pricing", order: 2, isPublished: true, updatedAt: "2025-05-05T00:00:00Z" },
  { id: "faq-8", question: "How do I download visual aids?", answer: "Navigate to the Visual Aids section, browse the gallery, and click the download button on any brochure or document.", category: "Content", order: 1, isPublished: true, updatedAt: "2025-04-28T00:00:00Z" },
];

export const mockNotifications: Notification[] = Array.from({ length: 10 }, (_, i) => ({
  id: `notif-${i + 1}`,
  title: `${["New Product Launch", "Price Update", "Order Reminder", "Policy Change", "Festival Offer"][i % 5]}`,
  body: `This is a notification about ${["new products", "pricing changes", "pending orders", "updated policies", "seasonal promotions"][i % 5]}.`,
  target: (["all", "distributors", "mrs"] as const)[i % 3],
  sentAt: new Date(2025, 5, 30 - i).toISOString(),
  status: i < 8 ? "sent" : "draft",
}));

export const FAQ_CATEGORIES = ["Orders", "Pricing", "Account", "Content", "General"];
