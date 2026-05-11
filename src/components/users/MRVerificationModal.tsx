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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import type { MedicalRep } from "@/data/users-mock";

interface MRVerificationModalProps {
  mr: MedicalRep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const MRVerificationModal: React.FC<MRVerificationModalProps> = ({
  mr,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!mr) return null;

  const handleReject = () => {
    if (showRejectForm) {
      onReject(mr.id, rejectReason);
      setRejectReason("");
      setShowRejectForm(false);
    } else {
      setShowRejectForm(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); setShowRejectForm(false); setRejectReason(""); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verify Medical Representative</DialogTitle>
          <DialogDescription>
            Review uploaded documents and approve or reject this MR.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Name</p><p className="font-medium">{mr.name}</p></div>
          <div><p className="text-muted-foreground">Distributor</p><p className="font-medium">{mr.distributorName}</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-medium">{mr.email}</p></div>
          <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{mr.phone}</p></div>
          <div><p className="text-muted-foreground">Territory</p><p className="font-medium">{mr.territory}</p></div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant="secondary" className="capitalize mt-0.5">{mr.status}</Badge>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="id">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id"><FileText className="mr-1.5 h-3.5 w-3.5" /> ID Proof</TabsTrigger>
            <TabsTrigger value="address"><FileText className="mr-1.5 h-3.5 w-3.5" /> Address Proof</TabsTrigger>
          </TabsList>
          <TabsContent value="id" className="mt-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="aspect-[4/3] rounded-md border bg-card flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">ID Proof Document</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="address" className="mt-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="aspect-[4/3] rounded-md border bg-card flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Address Proof Document</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {showRejectForm && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Rejection Reason</p>
            <Textarea placeholder="Please provide a reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
        )}

        <DialogFooter className="gap-2">
          {mr.status === "pending" && (
            <>
              <Button variant="destructive" onClick={handleReject} disabled={showRejectForm && !rejectReason.trim()}>
                <XCircle className="mr-1.5 h-4 w-4" />
                {showRejectForm ? "Confirm Reject" : "Reject"}
              </Button>
              {!showRejectForm && (
                <Button onClick={() => onApprove(mr.id)}>
                  <CheckCircle className="mr-1.5 h-4 w-4" /> Approve
                </Button>
              )}
            </>
          )}
          {showRejectForm && (
            <Button variant="outline" onClick={() => setShowRejectForm(false)}>Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
