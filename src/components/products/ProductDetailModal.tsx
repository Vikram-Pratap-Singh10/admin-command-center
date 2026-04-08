import { Product } from "@/data/products-mock";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useMemo } from "react";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

function generateStockHistory(product: Product) {
  const history: { date: string; change: number; stock: number; reason: string }[] = [];
  let current = product.stock;
  const reasons = ["Restocked", "Order fulfilled", "Returned", "Adjustment", "Order fulfilled", "Restocked"];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const change = i === 0 ? 0 : Math.floor(Math.random() * 100) - 40;
    const prev = current - change;
    history.push({
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      change,
      stock: i === 0 ? current : prev,
      reason: reasons[i],
    });
    if (i !== 0) current = prev;
  }
  return history.reverse();
}

export function ProductDetailModal({ open, product, onClose }: Props) {
  const stockHistory = useMemo(() => product ? generateStockHistory(product) : [], [product]);

  if (!product) return null;

  const margin = product.mrp > 0 ? ((product.mrp - product.actualPrice) / product.mrp * 100).toFixed(1) : "0";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {product.name}
          </DialogTitle>
          <DialogDescription>Product details, pricing, and stock history</DialogDescription>
        </DialogHeader>

        {/* Status & SKU row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={product.isActive ? "default" : "outline"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="secondary" className="font-mono">{product.sku}</Badge>
          <Badge variant="secondary">{product.category}</Badge>
          <Badge variant="secondary">{product.division}</Badge>
        </div>

        {/* Images */}
        <div>
          <p className="text-sm font-medium mb-2">Images</p>
          <div className="flex gap-2 flex-wrap">
            {product.images.map((img, idx) => (
              <div key={idx} className="w-20 h-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                {img === "/placeholder.svg" ? (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <p className="text-sm font-medium mb-1">Description</p>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <p className="text-sm font-medium mb-3">Pricing</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">MRP (for MRs)</p>
              <p className="text-lg font-bold text-foreground">₹{product.mrp.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Actual Price (for Distributors)</p>
              <p className="text-lg font-bold text-foreground">₹{product.actualPrice.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Margin</p>
              <p className="text-lg font-bold text-primary">{margin}%</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stock */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Current Stock</p>
            <Badge variant={product.stock < 50 ? "destructive" : "secondary"} className="font-mono text-sm">
              {product.stock} units
            </Badge>
          </div>
        </div>

        {/* Stock History */}
        <div>
          <p className="text-sm font-medium mb-3">Stock History</p>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2.5 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-2.5 font-medium text-muted-foreground">Reason</th>
                  <th className="text-right p-2.5 font-medium text-muted-foreground">Change</th>
                  <th className="text-right p-2.5 font-medium text-muted-foreground">Stock</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory.map((entry, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="p-2.5 text-muted-foreground">{entry.date}</td>
                    <td className="p-2.5">{entry.reason}</td>
                    <td className="p-2.5 text-right">
                      <span className={`inline-flex items-center gap-1 font-mono ${entry.change > 0 ? "text-green-600" : entry.change < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                        {entry.change > 0 ? <TrendingUp className="h-3 w-3" /> : entry.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        {entry.change > 0 ? `+${entry.change}` : entry.change}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono">{entry.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Meta */}
        <div className="text-xs text-muted-foreground pt-2">
          Created: {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
