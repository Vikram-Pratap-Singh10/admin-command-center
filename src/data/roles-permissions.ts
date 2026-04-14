// Modules in the system that can have permissions
export const MODULES = [
  { key: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "users", label: "Users", icon: "Users" },
  { key: "products", label: "Products", icon: "Package" },
  { key: "orders", label: "Orders", icon: "ShoppingCart" },
  { key: "visual_aids", label: "Visual Aids", icon: "Image" },
  { key: "faqs", label: "FAQs", icon: "HelpCircle" },
  { key: "notifications", label: "Notifications", icon: "Bell" },
  { key: "settings", label: "Settings", icon: "Settings" },
  { key: "contact_us", label: "Contact Us", icon: "Phone" },
  { key: "privacy_policy", label: "Privacy Policy", icon: "Shield" },
  { key: "terms_conditions", label: "Terms & Conditions", icon: "FileText" },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];

// Actions available per module
export const ACTIONS = ["view", "create", "update", "delete", "export"] as const;
export type ActionKey = (typeof ACTIONS)[number];

// A role's permission set: which actions are allowed per module
export type ModulePermissions = Record<ActionKey, boolean>;
export type RolePermissionMap = Record<ModuleKey, ModulePermissions>;

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean; // system roles can't be deleted
  permissions: RolePermissionMap;
  createdAt: string;
}

// Helper to create a full-access permission set
function allPermissions(enabled: boolean): ModulePermissions {
  return { view: enabled, create: enabled, update: enabled, delete: enabled, export: enabled };
}

function buildPermMap(overrides: Partial<Record<ModuleKey, Partial<ModulePermissions>>>): RolePermissionMap {
  const base: RolePermissionMap = {} as RolePermissionMap;
  for (const mod of MODULES) {
    base[mod.key] = { ...allPermissions(false), ...overrides[mod.key] };
  }
  return base;
}

// Default system roles
export const DEFAULT_ROLES: Role[] = [
  {
    id: "role_super_admin",
    name: "Super Admin",
    description: "Full access to all modules and actions",
    isSystem: true,
    createdAt: "2025-01-01",
    permissions: buildPermMap({
      dashboard: allPermissions(true),
      users: allPermissions(true),
      products: allPermissions(true),
      orders: allPermissions(true),
      visual_aids: allPermissions(true),
      faqs: allPermissions(true),
      notifications: allPermissions(true),
      settings: allPermissions(true),
      contact_us: allPermissions(true),
      privacy_policy: allPermissions(true),
      terms_conditions: allPermissions(true),
    }),
  },
  {
    id: "role_admin",
    name: "Admin",
    description: "Manage most modules but cannot delete critical data",
    isSystem: true,
    createdAt: "2025-01-01",
    permissions: buildPermMap({
      dashboard: { view: true, create: false, update: false, delete: false, export: true },
      users: { view: true, create: true, update: true, delete: false, export: true },
      products: { view: true, create: true, update: true, delete: false, export: true },
      orders: { view: true, create: false, update: true, delete: false, export: true },
      visual_aids: { view: true, create: true, update: true, delete: false, export: false },
      faqs: { view: true, create: true, update: true, delete: false, export: false },
      notifications: { view: true, create: true, update: false, delete: false, export: false },
      settings: { view: true, create: false, update: false, delete: false, export: false },
      contact_us: { view: true, create: true, update: true, delete: false, export: false },
      privacy_policy: { view: true, create: true, update: true, delete: false, export: false },
      terms_conditions: { view: true, create: true, update: true, delete: false, export: false },
    }),
  },
  {
    id: "role_manager",
    name: "Manager",
    description: "View-only access with export capability",
    isSystem: true,
    createdAt: "2025-01-01",
    permissions: buildPermMap({
      dashboard: { view: true, create: false, update: false, delete: false, export: true },
      users: { view: true, create: false, update: false, delete: false, export: true },
      products: { view: true, create: false, update: false, delete: false, export: true },
      orders: { view: true, create: false, update: false, delete: false, export: true },
      visual_aids: { view: true, create: false, update: false, delete: false, export: false },
      faqs: { view: true, create: false, update: false, delete: false, export: false },
      notifications: { view: true, create: false, update: false, delete: false, export: false },
      settings: { view: true, create: false, update: false, delete: false, export: false },
      contact_us: { view: true, create: false, update: false, delete: false, export: false },
      privacy_policy: { view: true, create: false, update: false, delete: false, export: false },
      terms_conditions: { view: true, create: false, update: false, delete: false, export: false },
    }),
  },
];

// Persistence helpers using localStorage
const STORAGE_KEY = "magicdose_roles";

export function loadRoles(): Role[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [...DEFAULT_ROLES];
}

export function saveRoles(roles: Role[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
}

export function emptyPermissionMap(): RolePermissionMap {
  return buildPermMap({});
}
