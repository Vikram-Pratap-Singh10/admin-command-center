import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableFilterConfig } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  FolderTree,
  Eye,
  Users as UsersIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { VerificationModal } from "@/components/users/VerificationModal";
import { DivisionAssignModal } from "@/components/users/DivisionAssignModal";
import { DistributorFormModal } from "@/components/users/DistributorFormModal";
import { MRFormModal } from "@/components/users/MRFormModal";
import {
  mockDistributors,
  mockMRs,
  type Distributor,
  type MedicalRep,
} from "@/data/users-mock";

// ─── Status badge helpers ───
const distStatusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
  inactive: "outline",
};

// ─── Distributor columns ───
function useDistributorColumns(
  onVerify: (d: Distributor) => void,
  onAssignDivisions: (d: Distributor) => void,
  onViewMRs: (d: Distributor) => void,
) {
  const columns: ColumnDef<Distributor, unknown>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "company", header: "Company" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = String(getValue());
        return <Badge variant={distStatusVariant[s] ?? "outline"} className="capitalize">{s}</Badge>;
      },
    },
    {
      accessorKey: "divisions",
      header: "Divisions",
      cell: ({ getValue }) => {
        const divs = getValue() as string[];
        if (!divs.length) return <span className="text-muted-foreground text-xs">None</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {divs.slice(0, 2).map((d) => (
              <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
            ))}
            {divs.length > 2 && (
              <Badge variant="outline" className="text-xs">+{divs.length - 2}</Badge>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "mrCount",
      header: "MRs",
      cell: ({ getValue }) => (
        <span className="font-medium">{String(getValue())}</span>
      ),
    },
    {
      accessorKey: "city",
      header: "Location",
      cell: ({ row }) => `${row.original.city}, ${row.original.state}`,
    },
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
              {row.original.status === "pending" && (
                <DropdownMenuItem onClick={() => onVerify(row.original)}>
                  <Eye className="mr-2 h-4 w-4" /> Verify Documents
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onAssignDivisions(row.original)}>
                <FolderTree className="mr-2 h-4 w-4" /> Assign Divisions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewMRs(row.original)}>
                <UsersIcon className="mr-2 h-4 w-4" /> View MRs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <UserX className="mr-2 h-4 w-4" /> Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PermissionGuard>
      ),
    },
  ];
  return columns;
}

// ─── MR columns ───
const mrStatusVariant: Record<string, "default" | "destructive"> = {
  active: "default",
  inactive: "destructive",
};

function useMRColumns(onToggle: (mr: MedicalRep) => void) {
  const columns: ColumnDef<MedicalRep, unknown>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "distributorName", header: "Distributor" },
    { accessorKey: "division", header: "Division" },
    { accessorKey: "territory", header: "Territory" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = String(getValue());
        return <Badge variant={mrStatusVariant[s] ?? "default"} className="capitalize">{s}</Badge>;
      },
    },
    { accessorKey: "joinedAt", header: "Joined" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <PermissionGuard permission="activate_mr" fallback="hide">
          <Button
            variant={row.original.status === "active" ? "outline" : "default"}
            size="sm"
            onClick={() => onToggle(row.original)}
          >
            {row.original.status === "active" ? (
              <><UserX className="mr-1.5 h-3.5 w-3.5" /> Deactivate</>
            ) : (
              <><UserCheck className="mr-1.5 h-3.5 w-3.5" /> Activate</>
            )}
          </Button>
        </PermissionGuard>
      ),
    },
  ];
  return columns;
}

// ─── Filter configs ───
const distributorFilters: DataTableFilterConfig[] = [
  {
    columnId: "status",
    label: "Status",
    options: [
      { label: "Approved", value: "approved" },
      { label: "Pending", value: "pending" },
      { label: "Rejected", value: "rejected" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

const mrFilters: DataTableFilterConfig[] = [
  {
    columnId: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

export default function Users() {
  const [distributors, setDistributors] = useState(mockDistributors);
  const [mrs, setMRs] = useState(mockMRs);

  // Modals
  const [verifyDist, setVerifyDist] = useState<Distributor | null>(null);
  const [divisionDist, setDivisionDist] = useState<Distributor | null>(null);
  const [showDistForm, setShowDistForm] = useState(false);
  const [showMRForm, setShowMRForm] = useState(false);

  // MR filter by distributor
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [activeTab, setActiveTab] = useState("distributors");

  const handleApprove = (id: string) => {
    setDistributors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "approved" as const } : d))
    );
    setVerifyDist(null);
    toast.success("Distributor approved successfully");
  };

  const handleReject = (id: string, reason: string) => {
    setDistributors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "rejected" as const } : d))
    );
    setVerifyDist(null);
    toast.error(`Distributor rejected: ${reason}`);
  };

  const handleDivisionSave = (id: string, divisions: string[]) => {
    setDistributors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, divisions } : d))
    );
    toast.success("Divisions updated successfully");
  };

  const handleAddDistributor = (data: Omit<Distributor, "id" | "mrCount" | "joinedAt" | "gstDocUrl" | "drugLicenseDocUrl" | "status">) => {
    const newDist: Distributor = {
      ...data,
      id: `dist-${Date.now()}`,
      mrCount: 0,
      joinedAt: new Date().toLocaleDateString(),
      gstDocUrl: "/placeholder.svg",
      drugLicenseDocUrl: "/placeholder.svg",
      status: "pending",
    };
    setDistributors((prev) => [newDist, ...prev]);
    toast.success("Distributor added successfully");
  };

  const handleAddMR = (data: Omit<MedicalRep, "id" | "joinedAt" | "status" | "distributorName">) => {
    const dist = distributors.find((d) => d.id === data.distributorId);
    const newMR: MedicalRep = {
      ...data,
      id: `mr-${Date.now()}`,
      distributorName: dist?.name ?? "Unknown",
      status: "active",
      joinedAt: new Date().toLocaleDateString(),
    };
    setMRs((prev) => [newMR, ...prev]);
    toast.success("Medical Representative added successfully");
  };

  const handleToggleMR = (mr: MedicalRep) => {
    setMRs((prev) =>
      prev.map((m) =>
        m.id === mr.id
          ? { ...m, status: m.status === "active" ? ("inactive" as const) : ("active" as const) }
          : m
      )
    );
    toast.success(`MR ${mr.status === "active" ? "deactivated" : "activated"}`);
  };

  const handleViewMRs = (d: Distributor) => {
    setSelectedDistributor(d);
    setActiveTab("mrs");
  };

  const filteredMRs = selectedDistributor
    ? mrs.filter((m) => m.distributorId === selectedDistributor.id)
    : mrs;

  const distributorColumns = useDistributorColumns(setVerifyDist, setDivisionDist, handleViewMRs);
  const mrColumns = useMRColumns(handleToggleMR);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage distributors and medical representatives.
          </p>
        </div>
        <PermissionGuard permission="edit_user" fallback="disable">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowMRForm(true)}>Add MR</Button>
            <Button onClick={() => setShowDistForm(true)}>Add Distributor</Button>
          </div>
        </PermissionGuard>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === "distributors") setSelectedDistributor(null); }}>
        <TabsList>
          <TabsTrigger value="distributors">Distributors</TabsTrigger>
          <TabsTrigger value="mrs">
            Medical Reps
            {selectedDistributor && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {selectedDistributor.name}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distributors" className="mt-4">
          <DataTable
            columns={distributorColumns}
            data={distributors}
            exportFilename="distributors"
            filters={distributorFilters}
            searchPlaceholder="Search distributors..."
          />
        </TabsContent>

        <TabsContent value="mrs" className="mt-4">
          {selectedDistributor && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border bg-accent/30 px-4 py-2.5 text-sm">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                Showing MRs under <span className="font-semibold">{selectedDistributor.name}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setSelectedDistributor(null)}
              >
                Show All MRs
              </Button>
            </div>
          )}
          <DataTable
            columns={mrColumns}
            data={filteredMRs}
            exportFilename="medical-reps"
            filters={mrFilters}
            searchPlaceholder="Search medical reps..."
          />
        </TabsContent>
      </Tabs>

      <VerificationModal
        distributor={verifyDist}
        open={!!verifyDist}
        onOpenChange={(open) => !open && setVerifyDist(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <DivisionAssignModal
        distributor={divisionDist}
        open={!!divisionDist}
        onOpenChange={(open) => !open && setDivisionDist(null)}
        onSave={handleDivisionSave}
      />
    </div>
  );
}
