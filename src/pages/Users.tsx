import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableFilterConfig } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/PermissionGuard";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "distributor" | "mr";
  status: "active" | "pending" | "inactive";
  division: string;
  joinedAt: string;
}

// Mock data
const mockUsers: UserRow[] = Array.from({ length: 45 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "distributor" : "mr",
  status: i % 5 === 0 ? "pending" : i % 7 === 0 ? "inactive" : "active",
  division: ["Cardiology", "Neurology", "Oncology", "Dermatology"][i % 4],
  joinedAt: new Date(2025, i % 12, (i % 28) + 1).toLocaleDateString(),
}));

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  pending: "secondary",
  inactive: "destructive",
};

const columns: ColumnDef<UserRow, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="capitalize">{String(getValue())}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = String(getValue());
      return <Badge variant={statusVariant[s] ?? "outline"} className="capitalize">{s}</Badge>;
    },
  },
  { accessorKey: "division", header: "Division" },
  { accessorKey: "joinedAt", header: "Joined" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <PermissionGuard permission="edit_user" fallback="hide">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <UserCheck className="mr-2 h-4 w-4" /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <UserX className="mr-2 h-4 w-4" /> Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PermissionGuard>
    ),
  },
];

const filters: DataTableFilterConfig[] = [
  {
    columnId: "role",
    label: "Role",
    options: [
      { label: "Distributor", value: "distributor" },
      { label: "MR", value: "mr" },
    ],
  },
  {
    columnId: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

export default function Users() {
  const [isLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground text-sm">Manage distributors and medical representatives.</p>
        </div>
        <PermissionGuard permission="edit_user" fallback="disable">
          <Button>Add User</Button>
        </PermissionGuard>
      </div>

      <DataTable
        columns={columns}
        data={mockUsers}
        isLoading={isLoading}
        exportFilename="users"
        filters={filters}
        searchPlaceholder="Search users..."
      />
    </div>
  );
}
