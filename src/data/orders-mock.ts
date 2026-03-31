import { mockDistributors, mockMRs } from "./users-mock";
import { mockProducts } from "./products-mock";

export type OrderStatus = "placed" | "in_progress" | "dispatched" | "delivered";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StatusChange {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerType: "distributor" | "mr";
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  statusHistory: StatusChange[];
}

const statuses: OrderStatus[] = ["placed", "in_progress", "dispatched", "delivered"];

export const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const isDistributor = i % 3 !== 0;
  const customer = isDistributor
    ? mockDistributors[i % mockDistributors.length]
    : mockMRs[i % mockMRs.length];
  const status = statuses[i % statuses.length];
  const itemCount = (i % 4) + 1;

  const items: OrderItem[] = Array.from({ length: itemCount }, (_, j) => {
    const product = mockProducts[(i + j) % mockProducts.length];
    const qty = Math.floor(Math.random() * 10) + 1;
    const price = isDistributor ? product.actualPrice : product.mrp;
    return {
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: price,
      total: Math.round(qty * price * 100) / 100,
    };
  });

  const totalAmount = Math.round(items.reduce((s, it) => s + it.total, 0) * 100) / 100;
  const createdDate = new Date(2025, i % 12, (i % 28) + 1);

  const history: StatusChange[] = [
    { status: "placed", timestamp: createdDate.toISOString(), note: "Order placed" },
  ];
  const statusIndex = statuses.indexOf(status);
  if (statusIndex >= 1) history.push({ status: "in_progress", timestamp: new Date(createdDate.getTime() + 86400000).toISOString(), note: "Processing started" });
  if (statusIndex >= 2) history.push({ status: "dispatched", timestamp: new Date(createdDate.getTime() + 172800000).toISOString(), note: "Shipped via courier" });
  if (statusIndex >= 3) history.push({ status: "delivered", timestamp: new Date(createdDate.getTime() + 345600000).toISOString(), note: "Delivered successfully" });

  return {
    id: `order-${i + 1}`,
    orderNumber: `ORD-${String(10001 + i)}`,
    customerId: customer.id,
    customerName: customer.name,
    customerType: isDistributor ? "distributor" : "mr",
    status,
    items,
    totalAmount,
    createdAt: createdDate.toISOString(),
    statusHistory: history,
  };
});
