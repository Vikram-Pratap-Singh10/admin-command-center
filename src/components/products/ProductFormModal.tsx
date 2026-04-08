import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product, CATEGORY_NAMES } from "@/data/products-mock";
import { DIVISIONS } from "@/data/users-mock";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useCallback, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

const schema = z.object({
  name: z.string().min(2).max(100),
  division: z.string().min(1, "Select a division"),
  category: z.string().min(1, "Select a category"),
  description: z.string().min(5).max(500),
  mrp: z.coerce.number().positive("MRP must be positive"),
  actualPrice: z.coerce.number().positive("Actual price must be positive"),
  sku: z.string().min(3).max(20),
  stock: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  product?: Product;
  categories?: string[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductFormModal({ open, product, categories, onClose, onSave }: Props) {
  const [images, setImages] = useState<string[]>(["/placeholder.svg"]);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", division: "", category: "", description: "", mrp: 0, actualPrice: 0, sku: "", stock: 0, isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name, division: product.division, category: product.category,
          description: product.description,
          mrp: product.mrp, actualPrice: product.actualPrice, sku: product.sku,
          stock: product.stock, isActive: product.isActive,
        });
        setImages(product.images);
      } else {
        form.reset({ name: "", division: "", category: "", description: "", mrp: 0, actualPrice: 0, sku: "", stock: 0, isActive: true });
        setImages(["/placeholder.svg"]);
      }
    }
  }, [open, product]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Mock: In production, upload files to storage
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files.map(() => "/placeholder.svg")]);
    }
  }, []);

  const onSubmit = (values: FormValues) => {
    const p: Product = {
      id: product?.id ?? "",
      name: values.name,
      division: values.division,
      category: values.category,
      description: values.description,
      mrp: values.mrp,
      actualPrice: values.actualPrice,
      sku: values.sku,
      stock: values.stock,
      isActive: values.isActive,
      images,
      createdAt: product?.createdAt ?? new Date().toISOString(),
    };
    onSave(p);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit" : "Add"} Product</DialogTitle>
          <DialogDescription>
            {product ? "Update product details and pricing" : "Add a new product to the catalog"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Amlocard 5mg" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. SKU-1001" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="division" render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(categories ?? CATEGORY_NAMES).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} placeholder="Product description..." rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Dual Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="mrp" render={({ field }) => (
                <FormItem>
                  <FormLabel>MRP (₹) — Shown to MRs</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="actualPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Price (₹) — Shown to Distributors</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="stock" render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Drag & Drop Image Upload */}
            <div>
              <p className="text-sm font-medium mb-2">Product Images</p>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragging ? "border-primary bg-accent" : "border-border"}`}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop images here or click to upload</p>
              </div>
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-md border bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== idx))}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel className="mb-0">Active</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
