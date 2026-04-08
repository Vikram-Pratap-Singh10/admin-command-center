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
import { useEffect } from "react";

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
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", isActive: true },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({ name: category.name, description: category.description, isActive: category.isActive });
      } else {
        form.reset({ name: "", description: "", isActive: true });
      }
    }
  }, [open, category]);

  const onSubmit = (values: FormValues) => {
    onSave({
      id: category?.id ?? "",
      name: values.name,
      description: values.description,
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
