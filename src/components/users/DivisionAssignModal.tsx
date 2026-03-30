import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { DIVISIONS } from "@/data/users-mock";
import type { Distributor } from "@/data/users-mock";

interface DivisionAssignModalProps {
  distributor: Distributor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, divisions: string[]) => void;
}

export const DivisionAssignModal: React.FC<DivisionAssignModalProps> = ({
  distributor,
  open,
  onOpenChange,
  onSave,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  React.useEffect(() => {
    if (distributor) setSelected(distributor.divisions);
  }, [distributor]);

  if (!distributor) return null;

  const toggle = (div: string) => {
    setSelected((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Divisions</DialogTitle>
          <DialogDescription>
            Select divisions for <span className="font-medium text-foreground">{distributor.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {DIVISIONS.map((div) => {
            const isSelected = selected.includes(div);
            return (
              <button
                key={div}
                onClick={() => toggle(div)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>{div}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {selected.map((d) => (
            <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
          ))}
          {selected.length === 0 && (
            <p className="text-xs text-muted-foreground">No divisions selected</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSave(distributor.id, selected); onOpenChange(false); }}>
            Save Divisions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
