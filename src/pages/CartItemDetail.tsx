import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/products-mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartItemDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getItem, updateQuantity, remove, add } = useCart();
  const isDistributor = user?.role === "admin" || user?.role === "super_admin";

  const item = productId ? getItem(productId) : undefined;
  const productFromCatalog = productId ? mockProducts.find((p) => p.id === productId) : undefined;
  const product = item?.product ?? productFromCatalog;

  if (!product) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/cart-list")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <Card><CardContent className="py-16 text-center text-muted-foreground">
          Product not found.
        </CardContent></Card>
      </div>
    );
  }

  const price = isDistributor ? product.actualPrice : product.mrp;
  const qty = item?.quantity ?? 0;
  const subtotal = price * qty;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/cart-list")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cart Item Details</h2>
            <p className="text-muted-foreground text-sm">{product.name}</p>
          </div>
        </div>
        {item && (
          <Button variant="outline" className="text-destructive" onClick={() => { remove(product.id); navigate("/cart-list"); }}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove from Cart
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {product.images[0] && product.images[0] !== "/placeholder.svg" ? (
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <Package className="h-20 w-20 text-muted-foreground" />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-square rounded border bg-muted overflow-hidden">
                    {src && src !== "/placeholder.svg" ? (
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="secondary">{product.division}</Badge>
                <Badge variant={product.isActive ? "default" : "outline"} className="capitalize">
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{product.description}</p>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">SKU</p><p className="font-medium font-mono">{product.sku}</p></div>
              <div><p className="text-xs text-muted-foreground">Stock</p><p className="font-medium">{product.stock} units</p></div>
              <div><p className="text-xs text-muted-foreground">MRP</p><p className="font-medium">₹{product.mrp.toFixed(2)}</p></div>
              <div><p className="text-xs text-muted-foreground">Actual Price</p><p className="font-medium">₹{product.actualPrice.toFixed(2)}</p></div>
              <div><p className="text-xs text-muted-foreground">Created</p><p className="font-medium">{product.createdAt}</p></div>
              {item && (
                <div><p className="text-xs text-muted-foreground">Added On</p><p className="font-medium">{new Date(item.addedAt).toLocaleString()}</p></div>
              )}
            </div>

            <Separator />

            <div className="rounded-lg border bg-accent/30 p-4 space-y-3">
              <p className="text-xs text-muted-foreground">Your Price ({isDistributor ? "Actual" : "MRP"})</p>
              <p className="text-3xl font-bold text-primary">₹{price.toFixed(2)}</p>

              {item ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Quantity</span>
                    <div className="flex items-center gap-1.5">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, -1)}>
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-base font-semibold w-8 text-center">{qty}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, 1)} disabled={qty >= product.stock}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="text-xl font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <Button className="w-full" onClick={() => { add(product); toast({ title: "Added to cart", description: product.name }); }}>
                  <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to Cart
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
