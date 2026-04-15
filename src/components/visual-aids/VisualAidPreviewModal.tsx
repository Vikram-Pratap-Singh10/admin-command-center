import { VisualAid } from "@/data/content-mock";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, ImageIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  aid: VisualAid | null;
}

export default function VisualAidPreviewModal({ open, onClose, aid }: Props) {
  if (!aid) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = aid.url;
    link.download = `${aid.title}.${aid.type === "pdf" ? "pdf" : "png"}`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{aid.title}</DialogTitle>
          <DialogDescription>Preview of visual aid content</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-[16/10] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {aid.url && aid.url !== "/placeholder.svg" ? (
              aid.type === "image" ? (
                <img src={aid.url} alt={aid.title} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <FileText className="h-16 w-16" />
                  <p className="text-sm">PDF document preview</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                {aid.type === "pdf" ? <FileText className="h-16 w-16" /> : <ImageIcon className="h-16 w-16" />}
                <p className="text-sm">No preview available</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{aid.division}</Badge>
            <Badge variant="secondary">{aid.type.toUpperCase()}</Badge>
            <span className="text-xs text-muted-foreground">{aid.fileSize}</span>
            <span className="text-xs text-muted-foreground">Uploaded {new Date(aid.uploadedAt).toLocaleDateString()}</span>
            <Button size="sm" className="ml-auto" onClick={handleDownload}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
