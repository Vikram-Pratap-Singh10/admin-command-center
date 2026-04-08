import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category } from "@/data/products-mock";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useCallback, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().min(3).max(200),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  category?: Category;
  onClose: () => void;
  onSave: (category: Category) => void;
  onDelete?: (id: string) => void;
}

export function CategoryModal({ open, category, onClose, onSave, onDelete }: Props) {
  const [imageUrl, setImageUrl] = useState("/placeholder.svg");
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", isActive: true },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({ name: category.name, description: category.description, isActive: category.isActive });
        setImageUrl(category.imageUrl);
      } else {
        form.reset({ name: "", description: "", isActive: true });
        setImageUrl("/placeholder.svg");
      }
    }
  }, [open, category]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    }
  }, []);

  const onSubmit = (values: FormValues) => {
    onSave({
      id: category?.id ?? "",
      name: values.name,
      description: values.description,
      imageUrl,
      isActive: values.isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Edit" : "Add"} Category</DialogTitle>
          <DialogDescription>
            {category ? "Update category details" : "Add a new product category (e.g. Tablet, Capsule)"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. Tablet" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} placeholder="Category description..." rows={2} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Image Upload */}
            <div>
              <p className="text-sm font-medium mb-2">Category Image</p>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("cat-image-input")?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${isDragging ? "border-primary bg-accent" : "border-border hover:border-muted-foreground/50"}`}
              >
                {imageUrl && imageUrl !== "/placeholder.svg" ? (
                  <div className="relative inline-block">
                    <img src={imageUrl} alt="Category" className="h-20 w-20 object-cover rounded-md mx-auto" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImageUrl("/placeholder.svg"); }}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
                  </>
                )}
              </div>
              <input id="cat-image-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>

            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel className="mb-0">Active</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <DialogFooter className="gap-2">
              {category && onDelete && (
                <Button type="button" variant="destructive" onClick={() => onDelete(category.id)}>Delete</Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
