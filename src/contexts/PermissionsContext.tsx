import React, { createContext, useContext, useMemo } from "react";
import { useAuth, User } from "@/contexts/AuthContext";

// All granular permissions in the system
export type Permission =
  | "view_dashboard"
  | "view_users"
  | "edit_user"
  | "approve_distributor"
  | "activate_mr"
  | "view_products"
  | "edit_product"
  | "delete_product"
  | "view_orders"
  | "update_order_status"
  | "export_orders"
  | "view_visual_aids"
  | "edit_visual_aids"
  | "view_faqs"
  | "edit_faqs"
  | "send_notifications"
  | "view_settings"
  | "edit_settings";

// Role → permissions mapping
const ROLE_PERMISSIONS: Record<User["role"], Permission[]> = {
  super_admin: [
    "view_dashboard", "view_users", "edit_user", "approve_distributor", "activate_mr",
    "view_products", "edit_product", "delete_product",
    "view_orders", "update_order_status", "export_orders",
    "view_visual_aids", "edit_visual_aids",
    "view_faqs", "edit_faqs",
    "send_notifications", "view_settings", "edit_settings",
  ],
  admin: [
    "view_dashboard", "view_users", "edit_user", "approve_distributor", "activate_mr",
    "view_products", "edit_product",
    "view_orders", "update_order_status", "export_orders",
    "view_visual_aids", "edit_visual_aids",
    "view_faqs", "edit_faqs",
    "send_notifications", "view_settings",
  ],
  manager: [
    "view_dashboard", "view_users",
    "view_products",
    "view_orders", "export_orders",
    "view_visual_aids",
    "view_faqs",
    "view_settings",
  ],
};

interface PermissionsContextType {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const permissions = useMemo<Permission[]>(() => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user]);

  const hasPermission = (p: Permission) => permissions.includes(p);
  const hasAnyPermission = (ps: Permission[]) => ps.some((p) => permissions.includes(p));
  const hasAllPermissions = (ps: Permission[]) => ps.every((p) => permissions.includes(p));

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission, hasAnyPermission, hasAllPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
};
