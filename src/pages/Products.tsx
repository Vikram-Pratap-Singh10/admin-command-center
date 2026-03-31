import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionGuard } from "@/components/PermissionGuard";
import { mockProducts, mockDivisions, Product, Division } from "@/data/products-mock";
import { DIVISIONS } from "@/data/users-mock";
import { DivisionModal } from "@/components/products/DivisionModal";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { Package, Layers, Plus, Trash2, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState(mockProducts);
  const [divisions, setDivisions] = useState(mockDivisions);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [divisionModal, setDivisionModal] = useState<{ open: boolean; division?: Division }>({ open: false });
  const [productModal, setProductModal] = useState<{ open: boolean; product?: Product }>({ open: false });

  const handleBulkAction = (action: "deactivate" | "delete") => {
    if (selectedProducts.length === 0) return;
    if (action === "delete") {
      setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
      toast({ title: `${selectedProducts.length} products deleted` });
    } else {
      setProducts((prev) => prev.map((p) => selectedProducts.includes(p.id) ? { ...p, isActive: false } : p));
      toast({ title: `${selectedProducts.length} products deactivated` });
    }
    setSelectedProducts([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const productColumns: ColumnDef<Product>[] = useMemo(() => [
    {
      id: "select",
      header: () => null,
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProducts.includes(row.original.id)}
          onCheckedChange={() => toggleSelect(row.original.id)}
        />
      ),
      size: 40,
    },
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "division", header: "Division" },
    {
      accessorKey: "mrp",
      header: "MRP (₹)",
      cell: ({ getValue }) => `₹${(getValue() as number).toFixed(2)}`,
    },
    {
      accessorKey: "actualPrice",
      header: "Actual Price (₹)",
      cell: ({ getValue }) => `₹${(getValue() as number).toFixed(2)}`,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ getValue }) => {
        const stock = getValue() as number;
        return (
          <Badge variant={stock < 50 ? "destructive" : "secondary"} className="font-mono">
            {stock}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "default" : "outline"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (value === "active") return row.original.isActive;
        if (value === "inactive") return !row.original.isActive;
        return true;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <PermissionGuard permission="edit_product">
          <Button size="sm" variant="ghost" onClick={() => setProductModal({ open: true, product: row.original })}>
            Edit
          </Button>
        </PermissionGuard>
      ),
    },
  ], [selectedProducts]);

  const divisionColumns: ColumnDef<Division>[] = useMemo(() => [
    { accessorKey: "name", header: "Division" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "productCount", header: "Products" },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "default" : "outline"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <PermissionGuard permission="edit_product">
          <Button size="sm" variant="ghost" onClick={() => setDivisionModal({ open: true, division: row.original })}>
            Edit
          </Button>
        </PermissionGuard>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products & Divisions</h2>
          <p className="text-muted-foreground text-sm">Manage your pharmaceutical product catalog</p>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products" className="gap-1.5"><Package className="h-3.5 w-3.5" /> Products</TabsTrigger>
          <TabsTrigger value="divisions" className="gap-1.5"><Layers className="h-3.5 w-3.5" /> Divisions</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <PermissionGuard permission="edit_product">
              <Button size="sm" onClick={() => setProductModal({ open: true })}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Product
              </Button>
            </PermissionGuard>
            {selectedProducts.length > 0 && (
              <>
                <PermissionGuard permission="edit_product">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")}>
                    <Ban className="mr-1.5 h-3.5 w-3.5" /> Deactivate ({selectedProducts.length})
                  </Button>
                </PermissionGuard>
                <PermissionGuard permission="delete_product">
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete ({selectedProducts.length})
                  </Button>
                </PermissionGuard>
              </>
            )}
          </div>
          <DataTable
            data={products}
            columns={productColumns}
            filters={[
              { columnId: "division", label: "Division", options: DIVISIONS.map((d) => ({ label: d, value: d })) },
              { columnId: "isActive", label: "Status", options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
            ]}
            searchPlaceholder="Search products..."
            exportFilename="products"
          />
        </TabsContent>

        <TabsContent value="divisions" className="space-y-4 mt-4">
          <PermissionGuard permission="edit_product">
            <Button size="sm" onClick={() => setDivisionModal({ open: true })}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Division
            </Button>
          </PermissionGuard>
          <DataTable
            data={divisions}
            columns={divisionColumns}
            filters={[]}
            searchPlaceholder="Search divisions..."
            exportFilename="divisions"
          />
        </TabsContent>
      </Tabs>

      <DivisionModal
        open={divisionModal.open}
        division={divisionModal.division}
        onClose={() => setDivisionModal({ open: false })}
        onSave={(div) => {
          if (divisionModal.division) {
            setDivisions((prev) => prev.map((d) => (d.id === div.id ? div : d)));
          } else {
            setDivisions((prev) => [...prev, { ...div, id: `div-${Date.now()}`, productCount: 0 }]);
          }
          setDivisionModal({ open: false });
          toast({ title: `Division ${divisionModal.division ? "updated" : "created"}` });
        }}
      />

      <ProductFormModal
        open={productModal.open}
        product={productModal.product}
        onClose={() => setProductModal({ open: false })}
        onSave={(prod) => {
          if (productModal.product) {
            setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
          } else {
            setProducts((prev) => [...prev, { ...prod, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() }]);
          }
          setProductModal({ open: false });
          toast({ title: `Product ${productModal.product ? "updated" : "created"}` });
        }}
      />
    </div>
  );
}
