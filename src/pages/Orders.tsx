import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockOrders, Order, OrderStatus } from "@/data/orders-mock";
import { OrderDetailModal } from "@/components/orders/OrderDetailModal";
import { ShoppingCart, Clock, Truck, CheckCircle2, IndianRupee } from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  placed: { label: "Placed", className: "status-badge-placed" },
  in_progress: { label: "In Progress", className: "status-badge-progress" },
  dispatched: { label: "Dispatched", className: "bg-primary/10 text-primary" },
  delivered: { label: "Delivered", className: "status-badge-delivered" },
};

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === "placed").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    revenue: orders.reduce((s, o) => s + o.totalAmount, 0),
  }), [orders]);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              statusHistory: [
                ...o.statusHistory,
                { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated to ${STATUS_CONFIG[newStatus].label}` },
              ],
            }
          : o
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus, statusHistory: [...prev.statusHistory, { status: newStatus, timestamp: new Date().toISOString(), note: `Status updated to ${STATUS_CONFIG[newStatus].label}` }] } : null
      );
    }
  };

  const summaryCards = [
    { title: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-primary" },
    { title: "Pending Orders", value: stats.pending, icon: Clock, color: "text-warning" },
    { title: "Dispatched Today", value: stats.dispatched, icon: Truck, color: "text-info" },
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, icon: IndianRupee, color: "text-success" },
  ];

  const columns: ColumnDef<Order>[] = useMemo(() => [
    { accessorKey: "orderNumber", header: "Order #" },
    { accessorKey: "customerName", header: "Customer" },
    {
      accessorKey: "customerType",
      header: "Type",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="capitalize">{getValue() as string}</Badge>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ getValue }) => (getValue() as Order["items"]).length,
      enableSorting: false,
    },
    {
      accessorKey: "totalAmount",
      header: "Amount (₹)",
      cell: ({ getValue }) => `₹${(getValue() as number).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as OrderStatus;
        const config = STATUS_CONFIG[status];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
      filterFn: (row, id, value) => row.original.status === value,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(row.original)}>
          View
        </Button>
      ),
    },
  ], []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
        <p className="text-muted-foreground text-sm">Track and manage all orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`rounded-lg p-2.5 bg-muted ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        data={orders}
        columns={columns}
        filters={[
          {
            columnId: "status",
            label: "Status",
            options: [
              { label: "Placed", value: "placed" },
              { label: "In Progress", value: "in_progress" },
              { label: "Dispatched", value: "dispatched" },
              { label: "Delivered", value: "delivered" },
            ],
          },
          {
            columnId: "customerType",
            label: "Customer Type",
            options: [
              { label: "Distributor", value: "distributor" },
              { label: "MR", value: "mr" },
            ],
          },
        ]}
        searchPlaceholder="Search orders..."
        exportFilename="orders"
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
