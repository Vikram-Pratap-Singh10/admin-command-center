import React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Building2, Calendar, FolderTree } from "lucide-react";
import type { MedicalRep } from "@/data/users-mock";

interface MRDetailModalProps {
  mr: MedicalRep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  active: "default",
  pending: "secondary",
  rejected: "destructive",
  inactive: "outline",
};

export const MRDetailModal: React.FC<MRDetailModalProps> = ({ mr, open, onOpenChange }) => {
  if (!mr) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>{mr.name}</span>
            <Badge variant={statusVariant[mr.status] ?? "outline"} className="capitalize">{mr.status}</Badge>
          </DialogTitle>
          <DialogDescription>Medical Representative details</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2"><Mail className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{mr.email}</p></div></div>
          <div className="flex items-start gap-2"><Phone className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{mr.phone}</p></div></div>
          <div className="flex items-start gap-2"><Building2 className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Distributor</p><p className="font-medium">{mr.distributorName}</p></div></div>
          <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Territory</p><p className="font-medium">{mr.territory}</p></div></div>
          <div className="flex items-start gap-2"><Calendar className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Joined</p><p className="font-medium">{mr.joinedAt}</p></div></div>
          <div className="flex items-start gap-2"><FolderTree className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Primary Division</p><p className="font-medium">{mr.division}</p></div></div>
        </div>

        <Separator />

        <div>
          <p className="text-xs text-muted-foreground mb-2">Assigned Divisions</p>
          <div className="flex flex-wrap gap-1.5">
            {(mr.divisions ?? []).length > 0 ? (
              mr.divisions.map((d) => <Badge key={d} variant="outline">{d}</Badge>)
            ) : (
              <p className="text-xs text-muted-foreground">No divisions assigned</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
