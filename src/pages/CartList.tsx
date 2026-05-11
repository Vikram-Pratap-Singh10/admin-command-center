import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Package, Plus, Minus, Trash2, Eye, ArrowLeft, CheckCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, updateQuantity, remove, clear, count } = useCart();
  const isDistributor = user?.role === "admin" || user?.role === "super_admin";
  const [search, setSearch] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const priceOf = (p: typeof items[number]["product"]) =>
    isDistributor ? p.actualPrice : p.mrp;

  const filtered = useMemo(() =>
    items.filter((i) => i.product.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const total = items.reduce((s, i) => s + priceOf(i.product) * i.quantity, 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    toast({ title: "Order placed successfully!", description: `${count} items · ₹${total.toFixed(2)}` });
  };

  const closeCheckout = () => {
    if (orderPlaced) {
      clear();
      setOrderPlaced(false);
    }
    setCheckoutOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/cart")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cart List</h2>
            <p className="text-muted-foreground text-sm">Review the products you've added to your cart</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cart")}>Continue Shopping</Button>
          <Button onClick={() => setCheckoutOpen(true)} disabled={items.length === 0}>
            <ShoppingCart className="mr-1.5 h-4 w-4" /> Checkout · ₹{total.toFixed(2)}
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Distinct Items</p>
          <p className="text-2xl font-bold">{items.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Units</p>
          <p className="text-2xl font-bold">{count}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Estimated Total</p>
          <p className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</p>
        </CardContent></Card>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Start adding products from the Add to Cart page.</p>
            <Button onClick={() => navigate("/cart")} className="mt-2">Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search cart items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Button variant="ghost" className="text-destructive" onClick={clear}>
                <Trash2 className="mr-1.5 h-4 w-4" /> Clear Cart
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const price = priceOf(item.product);
                  return (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {item.product.images[0] && item.product.images[0] !== "/placeholder.svg" ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{item.product.category}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{item.product.division}</Badge></TableCell>
                      <TableCell className="text-right">
                        <p className="font-medium">₹{price.toFixed(2)}</p>
                        {isDistributor && (
                          <p className="text-[10px] text-muted-foreground line-through">₹{item.product.mrp.toFixed(2)}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1.5">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, 1)} disabled={item.quantity >= item.product.stock}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₹{(price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigate(`/cart-list/${item.product.id}`)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(item.product.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Separator />
            <div className="flex items-center justify-end gap-6 px-2">
              <span className="text-sm text-muted-foreground">Total ({count} items)</span>
              <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={checkoutOpen} onOpenChange={(v) => !v && closeCheckout()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{orderPlaced ? "Order Confirmed" : "Confirm Order"}</DialogTitle>
            <DialogDescription>
              {orderPlaced ? "Your order has been placed successfully" : `Place order for ${count} item${count !== 1 ? "s" : ""}`}
            </DialogDescription>
          </DialogHeader>
          {orderPlaced ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="h-14 w-14 text-primary" />
              <p className="text-center font-semibold">Total paid: ₹{total.toFixed(2)}</p>
            </div>
          ) : (
            <div className="text-sm space-y-1 py-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{count}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span className="text-primary">₹{total.toFixed(2)}</span></div>
            </div>
          )}
          <DialogFooter>
            {orderPlaced ? (
              <Button onClick={closeCheckout}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
                <Button onClick={handleCheckout}>Place Order</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
