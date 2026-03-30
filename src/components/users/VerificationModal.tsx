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
import type { Distributor } from "@/data/users-mock";

interface VerificationModalProps {
  distributor: Distributor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  distributor,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!distributor) return null;

  const handleReject = () => {
    if (showRejectForm) {
      onReject(distributor.id, rejectReason);
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
          <DialogTitle>Verify Distributor</DialogTitle>
          <DialogDescription>
            Review uploaded documents and approve or reject this distributor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{distributor.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Company</p>
            <p className="font-medium">{distributor.company}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{distributor.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{distributor.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{distributor.city}, {distributor.state}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant={distributor.status === "pending" ? "secondary" : "default"} className="capitalize mt-0.5">
              {distributor.status}
            </Badge>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="gst">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gst">
              <FileText className="mr-1.5 h-3.5 w-3.5" /> GST Certificate
            </TabsTrigger>
            <TabsTrigger value="drug">
              <FileText className="mr-1.5 h-3.5 w-3.5" /> Drug License
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gst" className="mt-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground mb-2">GST Number: <span className="font-mono font-medium text-foreground">{distributor.gstNumber}</span></p>
              <div className="aspect-[4/3] rounded-md border bg-card flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">GST Certificate Document</p>
                  <p className="text-xs mt-1">Preview would appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="drug" className="mt-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground mb-2">License Number: <span className="font-mono font-medium text-foreground">{distributor.drugLicenseNumber}</span></p>
              <div className="aspect-[4/3] rounded-md border bg-card flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Drug License Document</p>
                  <p className="text-xs mt-1">Preview would appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {showRejectForm && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Rejection Reason</p>
            <Textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        )}

        <DialogFooter className="gap-2">
          {distributor.status === "pending" && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={showRejectForm && !rejectReason.trim()}
              >
                <XCircle className="mr-1.5 h-4 w-4" />
                {showRejectForm ? "Confirm Reject" : "Reject"}
              </Button>
              {!showRejectForm && (
                <Button onClick={() => onApprove(distributor.id)}>
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
