export interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  gstNumber: string;
  drugLicenseNumber: string;
  gstDocUrl: string;
  drugLicenseDocUrl: string;
  status: "pending" | "approved" | "rejected" | "inactive";
  divisions: string[];
  mrCount: number;
  joinedAt: string;
  city: string;
  state: string;
}

export interface MedicalRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  distributorId: string;
  distributorName: string;
  status: "pending" | "approved" | "rejected" | "active" | "inactive";
  territory: string;
  division: string;
  divisions: string[];
  joinedAt: string;
  idProofUrl: string;
  addressProofUrl: string;
  city: string;
  state: string;
}

export const DIVISIONS = [
  "Cardiology",
  "Neurology",
  "Oncology",
  "Dermatology",
  "Orthopedics",
  "Gastroenterology",
  "Pulmonology",
  "Endocrinology",
];

const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi", "Rajasthan"];
const cities = ["Mumbai", "Ahmedabad", "Bangalore", "Chennai", "New Delhi", "Jaipur"];

export const mockDistributors: Distributor[] = Array.from({ length: 30 }, (_, i) => ({
  id: `dist-${i + 1}`,
  name: `Distributor ${i + 1}`,
  email: `distributor${i + 1}@pharma.com`,
  phone: `+91 98765 ${String(43210 + i).slice(0, 5)}`,
  company: `${["MedSupply", "PharmaHub", "HealthDist", "CureNet"][i % 4]} Pvt Ltd`,
  gstNumber: `29ABCDE${1000 + i}F1Z5`,
  drugLicenseNumber: `DL-${20 + (i % 10)}-${1000 + i}`,
  gstDocUrl: "/placeholder.svg",
  drugLicenseDocUrl: "/placeholder.svg",
  status: i % 5 === 0 ? "pending" : i % 7 === 0 ? "inactive" : i % 11 === 0 ? "rejected" : "approved",
  divisions: DIVISIONS.slice(0, (i % 3) + 1),
  mrCount: Math.floor(Math.random() * 15) + 1,
  joinedAt: new Date(2025, i % 12, (i % 28) + 1).toLocaleDateString(),
  city: cities[i % cities.length],
  state: states[i % states.length],
}));

export const mockMRs: MedicalRep[] = Array.from({ length: 60 }, (_, i) => {
  const distIndex = i % mockDistributors.length;
  return {
    id: `mr-${i + 1}`,
    name: `MR ${i + 1}`,
    email: `mr${i + 1}@pharma.com`,
    phone: `+91 91234 ${String(56780 + i).slice(0, 5)}`,
    distributorId: mockDistributors[distIndex].id,
    distributorName: mockDistributors[distIndex].name,
    status: i % 6 === 0 ? "inactive" : "active",
    territory: cities[i % cities.length],
    division: DIVISIONS[i % DIVISIONS.length],
    joinedAt: new Date(2025, (i + 3) % 12, (i % 28) + 1).toLocaleDateString(),
  };
});
