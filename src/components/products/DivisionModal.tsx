import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Division } from "@/data/products-mock";
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
  name: z.string().min(2, "Name is required").max(50),
  description: z.string().min(5, "Description is required").max(200),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  division?: Division;
  onClose: () => void;
  onSave: (division: Division) => void;
}

export function DivisionModal({ open, division, onClose, onSave }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", isActive: true },
  });

  useEffect(() => {
    if (open) {
      form.reset(division ? { name: division.name, description: division.description, isActive: division.isActive } : { name: "", description: "", isActive: true });
    }
  }, [open, division]);

  const onSubmit = (values: FormValues) => {
    onSave({
      id: division?.id ?? "",
      name: values.name,
      description: values.description,
      imageUrl: division?.imageUrl ?? "/placeholder.svg",
      productCount: division?.productCount ?? 0,
      isActive: values.isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{division ? "Edit" : "Add"} Division</DialogTitle>
          <DialogDescription>
            {division ? "Update division details" : "Create a new pharmaceutical division"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. Cardiology" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} placeholder="Brief description..." rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel className="mb-0">Active</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
