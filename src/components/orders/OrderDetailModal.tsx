import { Order, OrderStatus } from "@/data/orders-mock";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PermissionGuard } from "@/components/PermissionGuard";
import { CheckCircle2, Clock, Truck, Package, Circle } from "lucide-react";

const STATUS_ORDER: OrderStatus[] = ["placed", "in_progress", "dispatched", "delivered"];
const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed", in_progress: "In Progress", dispatched: "Dispatched", delivered: "Delivered",
};
const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  placed: Clock, in_progress: Package, dispatched: Truck, delivered: CheckCircle2,
};

interface Props {
  order: Order | null;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

export function OrderDetailModal({ order, onClose, onStatusUpdate }: Props) {
  if (!order) return null;

  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const nextStatuses = STATUS_ORDER.slice(currentIdx + 1);

  return (
    <Dialog open={!!order} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order {order.orderNumber}
          </DialogTitle>
          <DialogDescription>Order details, items, and status timeline</DialogDescription>
        </DialogHeader>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Customer</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <Badge variant="outline" className="capitalize">{order.customerType}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Order Date</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Amount</p>
            <p className="font-bold text-primary">₹{order.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div>
          <h4 className="font-semibold mb-3">Items ({order.items.length})</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2.5 font-medium">Product</th>
                  <th className="text-right p-2.5 font-medium">Qty</th>
                  <th className="text-right p-2.5 font-medium">Price</th>
                  <th className="text-right p-2.5 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2.5">{item.productName}</td>
                    <td className="p-2.5 text-right">{item.quantity}</td>
                    <td className="p-2.5 text-right">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-medium">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div>
          <h4 className="font-semibold mb-3">Status Timeline</h4>
          <div className="space-y-0">
            {STATUS_ORDER.map((status, i) => {
              const historyEntry = order.statusHistory.find((h) => h.status === status);
              const Icon = STATUS_ICONS[status];
              const isCompleted = !!historyEntry;
              const isCurrent = order.status === status;

              return (
                <div key={status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-1.5 ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                      {isCompleted ? <Icon className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    </div>
                    {i < STATUS_ORDER.length - 1 && (
                      <div className={`w-0.5 h-8 ${isCompleted ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-medium ${isCompleted ? "" : "text-muted-foreground"}`}>
                      {STATUS_LABELS[status]}
                    </p>
                    {historyEntry && (
                      <>
                        <p className="text-xs text-muted-foreground">{new Date(historyEntry.timestamp).toLocaleString()}</p>
                        {historyEntry.note && <p className="text-xs text-muted-foreground mt-0.5">{historyEntry.note}</p>}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Update */}
        {nextStatuses.length > 0 && (
          <>
            <Separator />
            <PermissionGuard permission="update_order_status">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">Update Status:</p>
                <Select onValueChange={(val) => onStatusUpdate(order.id, val as OrderStatus)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {nextStatuses.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PermissionGuard>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
