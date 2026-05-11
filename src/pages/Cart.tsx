import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts, Product } from "@/data/products-mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Search, Plus, Minus, ShoppingCart, Trash2, Package, Eye, List } from "lucide-react";
import { DIVISIONS } from "@/data/users-mock";
import { CATEGORY_NAMES } from "@/data/products-mock";

export default function Cart() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { add, updateQuantity, remove, getQuantity, count, items } = useCart();
  const isDistributor = user?.role === "admin" || user?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = useMemo(() => mockProducts.filter((p) => {
    if (!p.isActive) return false;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchDiv = divisionFilter === "all" || p.division === divisionFilter;
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchDiv && matchCat;
  }), [search, divisionFilter, categoryFilter]);

  const addToCart = (product: Product) => {
    add(product);
    toast({ title: "Added to cart", description: product.name });
  };

  const cartTotal = useMemo(() => items.reduce((sum, item) => {
    const price = isDistributor ? item.product.actualPrice : item.product.mrp;
    return sum + price * item.quantity;
  }, 0), [items, isDistributor]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add to Cart</h2>
          <p className="text-muted-foreground text-sm">Browse products and add them to your cart list</p>
        </div>
        <Button
          variant={count > 0 ? "default" : "outline"}
          onClick={() => navigate("/cart-list")}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          View Cart List ({count})
          {count > 0 && <span className="ml-1">· ₹{cartTotal.toFixed(2)}</span>}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={divisionFilter} onValueChange={setDivisionFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const qty = getQuantity(product.id);
          const price = isDistributor ? product.actualPrice : product.mrp;
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {product.images[0] && product.images[0] !== "/placeholder.svg" ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-12 w-12 text-muted-foreground" />
                )}
                {qty > 0 && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">{qty} in cart</Badge>
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 left-2 h-7 w-7 opacity-90"
                  onClick={() => navigate(`/cart-list/${product.id}`)}
                  title="View details"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{product.division}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">₹{price.toFixed(2)}</p>
                    {isDistributor && (
                      <p className="text-[10px] text-muted-foreground line-through">MRP: ₹{product.mrp.toFixed(2)}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Stock: {product.stock}</span>
                </div>
                {qty === 0 ? (
                  <Button size="sm" className="w-full" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, -1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-sm font-semibold">{qty}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, 1)} disabled={qty >= product.stock}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => remove(product.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No products found</div>
      )}
    </div>
  );
}

  const handleCheckout = () => {
    setOrderPlaced(true);
    toast({ title: "Order placed successfully!", description: `${cartCount} items · ₹${cartTotal.toFixed(2)}` });
  };

  const handleCloseCheckout = () => {
    if (orderPlaced) {
      clearCart();
      setOrderPlaced(false);
    }
    setCheckoutOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add to Cart</h2>
          <p className="text-muted-foreground text-sm">Browse products and add them to your order</p>
        </div>
        <Button
          variant={cartCount > 0 ? "default" : "outline"}
          onClick={() => setCheckoutOpen(true)}
          disabled={cartCount === 0}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart ({cartCount})
          {cartCount > 0 && <span className="ml-1">· ₹{cartTotal.toFixed(2)}</span>}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={divisionFilter} onValueChange={setDivisionFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Divisions</SelectItem>
            {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const qty = getCartQuantity(product.id);
          const price = isDistributor ? product.actualPrice : product.mrp;
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {product.images[0] && product.images[0] !== "/placeholder.svg" ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-12 w-12 text-muted-foreground" />
                )}
                {qty > 0 && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">{qty} in cart</Badge>
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{product.division}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">₹{price.toFixed(2)}</p>
                    {isDistributor && (
                      <p className="text-[10px] text-muted-foreground line-through">MRP: ₹{product.mrp.toFixed(2)}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Stock: {product.stock}</span>
                </div>
                {qty === 0 ? (
                  <Button size="sm" className="w-full" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, -1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-sm font-semibold">{qty}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQuantity(product.id, 1)} disabled={qty >= product.stock}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeFromCart(product.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No products found</div>
      )}

      {/* Checkout / Cart Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={(v) => !v && handleCloseCheckout()}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{orderPlaced ? "Order Confirmed" : "Your Cart"}</DialogTitle>
            <DialogDescription>
              {orderPlaced ? "Your order has been placed successfully" : `${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart`}
            </DialogDescription>
          </DialogHeader>

          {orderPlaced ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle className="h-16 w-16 text-primary" />
              <div className="text-center">
                <p className="text-lg font-semibold">Thank you for your order!</p>
                <p className="text-sm text-muted-foreground mt-1">Order total: ₹{cartTotal.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">You can track your order in the Orders section.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const price = isDistributor ? item.product.actualPrice : item.product.mrp;
                return (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-12 w-12 bg-muted rounded flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold w-20 text-right">₹{(price * item.quantity).toFixed(2)}</p>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
              <Separator />
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-muted-foreground">Subtotal ({cartCount} items)</p>
                <p className="text-lg font-bold">₹{cartTotal.toFixed(2)}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            {orderPlaced ? (
              <Button onClick={handleCloseCheckout}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { clearCart(); setCheckoutOpen(false); }}>Clear Cart</Button>
                <Button onClick={handleCheckout} disabled={cart.length === 0}>
                  Place Order · ₹{cartTotal.toFixed(2)}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
