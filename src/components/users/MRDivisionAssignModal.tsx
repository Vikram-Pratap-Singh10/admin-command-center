import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { DIVISIONS, type MedicalRep } from "@/data/users-mock";

interface MRDivisionAssignModalProps {
  mr: MedicalRep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, divisions: string[]) => void;
}

export const MRDivisionAssignModal: React.FC<MRDivisionAssignModalProps> = ({
  mr, open, onOpenChange, onSave,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => { if (mr) setSelected(mr.divisions ?? []); }, [mr]);

  if (!mr) return null;

  const toggle = (d: string) =>
    setSelected((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Divisions</DialogTitle>
          <DialogDescription>
            Select divisions for <span className="font-medium text-foreground">{mr.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {DIVISIONS.map((d) => {
            const on = selected.includes(d);
            return (
              <button key={d} onClick={() => toggle(d)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  on ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}>
                <span>{d}</span>
                {on && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {selected.map((d) => <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>)}
          {selected.length === 0 && <p className="text-xs text-muted-foreground">No divisions selected</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSave(mr.id, selected); onOpenChange(false); }}>Save Divisions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
