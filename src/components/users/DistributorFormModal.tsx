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
import { DIVISIONS, type Distributor } from "@/data/users-mock";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi", "Rajasthan"];
const cities = ["Mumbai", "Ahmedabad", "Bangalore", "Chennai", "New Delhi", "Jaipur"];

const distributorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  company: z.string().min(2, "Company name is required"),
  gstNumber: z.string().min(5, "GST number is required"),
  drugLicenseNumber: z.string().min(3, "Drug license number is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

type DistributorFormValues = z.infer<typeof distributorSchema>;

interface DistributorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (distributor: Omit<Distributor, "id" | "mrCount" | "joinedAt" | "gstDocUrl" | "drugLicenseDocUrl" | "status">) => void;
}

export const DistributorFormModal: React.FC<DistributorFormModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [selectedDivisions, setSelectedDivisions] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DistributorFormValues>({
    resolver: zodResolver(distributorSchema),
    defaultValues: {
      name: "", email: "", phone: "", company: "",
      gstNumber: "", drugLicenseNumber: "", city: "", state: "",
    },
  });

  const toggleDivision = (div: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    );
  };

  const onSubmit = (data: DistributorFormValues) => {
    onSave({ ...data, divisions: selectedDivisions });
    reset();
    setSelectedDivisions([]);
    onOpenChange(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) { reset(); setSelectedDivisions([]); }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Distributor</DialogTitle>
          <DialogDescription>Fill in details to register a new distributor.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dist-name">Full Name *</Label>
              <Input id="dist-name" placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dist-email">Email *</Label>
              <Input id="dist-email" type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dist-phone">Phone *</Label>
              <Input id="dist-phone" placeholder="+91 98765 43210" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dist-company">Company *</Label>
              <Input id="dist-company" placeholder="Pharma Pvt Ltd" {...register("company")} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dist-gst">GST Number *</Label>
              <Input id="dist-gst" placeholder="29ABCDE1234F1Z5" {...register("gstNumber")} />
              {errors.gstNumber && <p className="text-xs text-destructive">{errors.gstNumber.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dist-drug">Drug License No. *</Label>
              <Input id="dist-drug" placeholder="DL-20-1234" {...register("drugLicenseNumber")} />
              {errors.drugLicenseNumber && <p className="text-xs text-destructive">{errors.drugLicenseNumber.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>State *</Label>
              <Select onValueChange={(v) => setValue("state", v)} value={watch("state")}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Select onValueChange={(v) => setValue("city", v)} value={watch("city")}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Divisions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DIVISIONS.map((div) => {
                const isSelected = selectedDivisions.includes(div);
                return (
                  <button
                    key={div}
                    type="button"
                    onClick={() => toggleDivision(div)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors ${
                      isSelected
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{div}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
            {selectedDivisions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedDivisions.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs gap-1">
                    {d}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleDivision(d)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gst-doc">GST Certificate</Label>
              <Input id="gst-doc" type="file" accept=".pdf,.jpg,.png" className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="drug-doc">Drug License</Label>
              <Input id="drug-doc" type="file" accept=".pdf,.jpg,.png" className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
            <Button type="submit">Add Distributor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
