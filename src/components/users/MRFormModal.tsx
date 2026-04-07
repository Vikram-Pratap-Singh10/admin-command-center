import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIVISIONS, type Distributor, type MedicalRep } from "@/data/users-mock";

const territories = ["Mumbai", "Ahmedabad", "Bangalore", "Chennai", "New Delhi", "Jaipur"];

const mrSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  distributorId: z.string().min(1, "Distributor is required"),
  territory: z.string().min(1, "Territory is required"),
  division: z.string().min(1, "Division is required"),
});

type MRFormValues = z.infer<typeof mrSchema>;

interface MRFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mr: Omit<MedicalRep, "id" | "joinedAt" | "status" | "distributorName">) => void;
  distributors: Distributor[];
}

export const MRFormModal: React.FC<MRFormModalProps> = ({
  open,
  onOpenChange,
  onSave,
  distributors,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MRFormValues>({
    resolver: zodResolver(mrSchema),
    defaultValues: {
      name: "", email: "", phone: "",
      distributorId: "", territory: "", division: "",
    },
  });

  const onSubmit = (data: MRFormValues) => {
    onSave(data);
    reset();
    onOpenChange(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Medical Representative</DialogTitle>
          <DialogDescription>Register a new MR under a distributor.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="mr-name">Full Name *</Label>
              <Input id="mr-name" placeholder="Jane Smith" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mr-email">Email *</Label>
              <Input id="mr-email" type="email" placeholder="jane@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mr-phone">Phone *</Label>
              <Input id="mr-phone" placeholder="+91 91234 56789" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Distributor *</Label>
              <Select onValueChange={(v) => setValue("distributorId", v)} value={watch("distributorId")}>
                <SelectTrigger><SelectValue placeholder="Select distributor" /></SelectTrigger>
                <SelectContent>
                  {distributors
                    .filter((d) => d.status === "approved")
                    .map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} — {d.company}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.distributorId && <p className="text-xs text-destructive">{errors.distributorId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Division *</Label>
              <Select onValueChange={(v) => setValue("division", v)} value={watch("division")}>
                <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.division && <p className="text-xs text-destructive">{errors.division.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Territory *</Label>
              <Select onValueChange={(v) => setValue("territory", v)} value={watch("territory")}>
                <SelectTrigger><SelectValue placeholder="Select territory" /></SelectTrigger>
                <SelectContent>
                  {territories.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.territory && <p className="text-xs text-destructive">{errors.territory.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
            <Button type="submit">Add MR</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
