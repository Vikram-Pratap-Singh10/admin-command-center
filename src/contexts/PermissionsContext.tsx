import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Role,
  ModuleKey,
  ActionKey,
  loadRoles,
  saveRoles,
  emptyPermissionMap,
  MODULES,
} from "@/data/roles-permissions";

// Legacy permission type kept for backward compat with PermissionGuard
export type Permission =
  | "view_dashboard"
  | "view_users" | "edit_user" | "approve_distributor" | "activate_mr"
  | "view_products" | "edit_product" | "delete_product"
  | "view_orders" | "update_order_status" | "export_orders"
  | "view_visual_aids" | "edit_visual_aids"
  | "view_faqs" | "edit_faqs"
  | "send_notifications"
  | "view_settings" | "edit_settings"
  | "view_contact_us" | "edit_contact_us" | "delete_contact_us"
  | "view_privacy_policy" | "edit_privacy_policy" | "delete_privacy_policy"
  | "view_terms_conditions" | "edit_terms_conditions" | "delete_terms_conditions"
  | "delete_visual_aids";

// Map legacy permission strings to module+action pairs
const LEGACY_MAP: Record<Permission, { module: ModuleKey; action: ActionKey }> = {
  view_dashboard: { module: "dashboard", action: "view" },
  view_users: { module: "users", action: "view" },
  edit_user: { module: "users", action: "update" },
  approve_distributor: { module: "users", action: "update" },
  activate_mr: { module: "users", action: "update" },
  view_products: { module: "products", action: "view" },
  edit_product: { module: "products", action: "update" },
  delete_product: { module: "products", action: "delete" },
  view_orders: { module: "orders", action: "view" },
  update_order_status: { module: "orders", action: "update" },
  export_orders: { module: "orders", action: "export" },
  view_visual_aids: { module: "visual_aids", action: "view" },
  edit_visual_aids: { module: "visual_aids", action: "update" },
  delete_visual_aids: { module: "visual_aids", action: "delete" },
  view_faqs: { module: "faqs", action: "view" },
  edit_faqs: { module: "faqs", action: "update" },
  send_notifications: { module: "notifications", action: "create" },
  view_settings: { module: "settings", action: "view" },
  edit_settings: { module: "settings", action: "update" },
  view_contact_us: { module: "contact_us", action: "view" },
  edit_contact_us: { module: "contact_us", action: "update" },
  delete_contact_us: { module: "contact_us", action: "delete" },
  view_privacy_policy: { module: "privacy_policy", action: "view" },
  edit_privacy_policy: { module: "privacy_policy", action: "update" },
  delete_privacy_policy: { module: "privacy_policy", action: "delete" },
  view_terms_conditions: { module: "terms_conditions", action: "view" },
  edit_terms_conditions: { module: "terms_conditions", action: "update" },
  delete_terms_conditions: { module: "terms_conditions", action: "delete" },
};

interface PermissionsContextType {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  // New granular API
  canAccess: (module: ModuleKey, action: ActionKey) => boolean;
  canViewModule: (module: ModuleKey) => boolean;
  // Roles management
  roles: Role[];
  addRole: (role: Omit<Role, "id" | "createdAt" | "isSystem">) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  getUserRole: () => Role | null;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>(loadRoles);

  // Find the current user's role object
  const userRole = useMemo<Role | null>(() => {
    if (!user) return null;
    const roleName = user.role.replace("_", " ");
    return roles.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
        || r.name.toLowerCase().replace(/\s+/g, "_") === user.role.toLowerCase()
    ) || null;
  }, [user, roles]);

  const canAccess = useCallback((module: ModuleKey, action: ActionKey): boolean => {
    if (!userRole) return false;
    return userRole.permissions[module]?.[action] ?? false;
  }, [userRole]);

  const canViewModule = useCallback((module: ModuleKey): boolean => {
    return canAccess(module, "view");
  }, [canAccess]);

  // Legacy compatibility: derive Permission[] from role permissions
  const permissions = useMemo<Permission[]>(() => {
    if (!userRole) return [];
    const result: Permission[] = [];
    for (const [perm, mapping] of Object.entries(LEGACY_MAP)) {
      if (userRole.permissions[mapping.module]?.[mapping.action]) {
        result.push(perm as Permission);
      }
    }
    return result;
  }, [userRole]);

  const hasPermission = (p: Permission) => permissions.includes(p);
  const hasAnyPermission = (ps: Permission[]) => ps.some((p) => permissions.includes(p));
  const hasAllPermissions = (ps: Permission[]) => ps.every((p) => permissions.includes(p));

  const addRole = useCallback((roleData: Omit<Role, "id" | "createdAt" | "isSystem">) => {
    setRoles((prev) => {
      const newRole: Role = {
        ...roleData,
        id: `role_${Date.now()}`,
        isSystem: false,
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [...prev, newRole];
      saveRoles(updated);
      return updated;
    });
  }, []);

  const updateRole = useCallback((id: string, updates: Partial<Role>) => {
    setRoles((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      saveRoles(updated);
      return updated;
    });
  }, []);

  const deleteRole = useCallback((id: string) => {
    setRoles((prev) => {
      const updated = prev.filter((r) => r.id !== id || r.isSystem);
      saveRoles(updated);
      return updated;
    });
  }, []);

  const getUserRole = useCallback(() => userRole, [userRole]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccess,
        canViewModule,
        roles,
        addRole,
        updateRole,
        deleteRole,
        getUserRole,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
};
