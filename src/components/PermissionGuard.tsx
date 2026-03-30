import React from "react";
import { Permission, usePermissions } from "@/contexts/PermissionsContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PermissionGuardProps {
  /** Single permission or array (any match grants access by default) */
  permission?: Permission;
  permissions?: Permission[];
  /** If true, ALL permissions must match */
  requireAll?: boolean;
  /** "hide" removes from DOM, "disable" renders but disabled with tooltip */
  fallback?: "hide" | "disable";
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = "hide",
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const perms = permissions || (permission ? [permission] : []);
  if (perms.length === 0) return <>{children}</>;

  const allowed = requireAll ? hasAllPermissions(perms) : hasAnyPermission(perms);

  if (allowed) return <>{children}</>;

  if (fallback === "disable") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <span className="pointer-events-none opacity-40">{children}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">You don't have permission for this action</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return null;
};
