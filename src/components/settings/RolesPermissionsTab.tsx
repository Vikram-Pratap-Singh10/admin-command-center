import { useState } from "react";
import { usePermissions } from "@/contexts/PermissionsContext";
import {
  Role,
  MODULES,
  ACTIONS,
  ModuleKey,
  ActionKey,
  emptyPermissionMap,
  RolePermissionMap,
} from "@/data/roles-permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Shield, ShieldCheck, Users } from "lucide-react";

export function RolesPermissionsTab() {
  const { roles, addRole, updateRole, deleteRole } = usePermissions();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Roles & Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Manage roles and assign granular permissions per module.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      {/* Roles List */}
      <div className="grid gap-4">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => setEditingRole(role)}
            onDelete={() => setDeleteTarget(role)}
          />
        ))}
      </div>

      {/* Create Dialog */}
      <RoleFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={(data) => {
          addRole(data);
          setIsCreateOpen(false);
          toast.success(`Role "${data.name}" created successfully`);
        }}
      />

      {/* Edit Dialog */}
      {editingRole && (
        <RoleFormDialog
          open={!!editingRole}
          onOpenChange={(open) => !open && setEditingRole(null)}
          role={editingRole}
          onSave={(data) => {
            updateRole(editingRole.id, data);
            setEditingRole(null);
            toast.success(`Role "${data.name}" updated successfully`);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{deleteTarget?.name}"? Users assigned to this role will lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  deleteRole(deleteTarget.id);
                  toast.success(`Role "${deleteTarget.name}" deleted`);
                  setDeleteTarget(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleCard({
  role,
  onEdit,
  onDelete,
}: {
  role: Role;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const moduleCount = MODULES.filter(
    (m) => role.permissions[m.key]?.view
  ).length;
  const totalPerms = MODULES.reduce((acc, m) => {
    return acc + ACTIONS.filter((a) => role.permissions[m.key]?.[a]).length;
  }, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              {role.isSystem ? (
                <ShieldCheck className="h-5 w-5 text-primary" />
              ) : (
                <Shield className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm">{role.name}</h4>
                {role.isSystem && (
                  <Badge variant="secondary" className="text-[10px]">System</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> {moduleCount} modules
                </span>
                <span className="text-xs text-muted-foreground">
                  {totalPerms} permissions active
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {!role.isSystem && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
  onSave: (data: { name: string; description: string; permissions: RolePermissionMap }) => void;
}) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [permissions, setPermissions] = useState<RolePermissionMap>(
    role?.permissions || emptyPermissionMap()
  );

  const togglePermission = (module: ModuleKey, action: ActionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const toggleModuleAll = (module: ModuleKey) => {
    const allEnabled = ACTIONS.every((a) => permissions[module][a]);
    setPermissions((prev) => ({
      ...prev,
      [module]: ACTIONS.reduce((acc, a) => ({ ...acc, [a]: !allEnabled }), {} as Record<ActionKey, boolean>),
    }));
  };

  const toggleActionAll = (action: ActionKey) => {
    const allEnabled = MODULES.every((m) => permissions[m.key][action]);
    setPermissions((prev) => {
      const updated = { ...prev };
      for (const m of MODULES) {
        updated[m.key] = { ...updated[m.key], [action]: !allEnabled };
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), permissions });
  };

  const isEditing = !!role;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify role details and permissions."
              : "Define a new role and assign module-level permissions."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g. Regional Manager"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-desc">Description</Label>
              <Textarea
                id="role-desc"
                placeholder="What this role is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 min-h-9 resize-none"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-sm mb-3">Permission Matrix</h4>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium min-w-[140px]">Module</th>
                    {ACTIONS.map((action) => (
                      <th key={action} className="p-3 text-center font-medium capitalize min-w-[80px]">
                        <button
                          type="button"
                          className="hover:text-primary transition-colors"
                          onClick={() => toggleActionAll(action)}
                          title={`Toggle all ${action}`}
                        >
                          {action}
                        </button>
                      </th>
                    ))}
                    <th className="p-3 text-center font-medium min-w-[60px]">All</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((mod, idx) => {
                    const allChecked = ACTIONS.every((a) => permissions[mod.key][a]);
                    return (
                      <tr key={mod.key} className={idx % 2 === 0 ? "" : "bg-muted/20"}>
                        <td className="p-3 font-medium">{mod.label}</td>
                        {ACTIONS.map((action) => (
                          <td key={action} className="p-3 text-center">
                            <Checkbox
                              checked={permissions[mod.key][action]}
                              onCheckedChange={() => togglePermission(mod.key, action)}
                            />
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <Checkbox
                            checked={allChecked}
                            onCheckedChange={() => toggleModuleAll(mod.key)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
