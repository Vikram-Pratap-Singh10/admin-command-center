import { useState } from "react";
import { VisualAid } from "@/data/content-mock";
import { DIVISIONS } from "@/data/users-mock";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (aid: VisualAid) => void;
  aid?: VisualAid;
}

export default function VisualAidFormModal({ open, onClose, onSave, aid }: Props) {
  const [title, setTitle] = useState(aid?.title ?? "");
  const [type, setType] = useState<"pdf" | "image">(aid?.type ?? "image");
  const [division, setDivision] = useState(aid?.division ?? "");
  const [filePreview, setFilePreview] = useState<string | null>(aid?.url && aid.url !== "/placeholder.svg" ? aid.url : null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(aid?.fileSize ?? "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    if (file.type.startsWith("image/")) {
      setType("image");
      setFilePreview(URL.createObjectURL(file));
    } else {
      setType("pdf");
      setFilePreview(null);
    }
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleSave = () => {
    if (!title.trim() || !division) return;
    onSave({
      id: aid?.id ?? `va-${Date.now()}`,
      title,
      type,
      url: filePreview ?? "/placeholder.svg",
      division,
      uploadedAt: aid?.uploadedAt ?? new Date().toISOString(),
      fileSize: fileSize || "0.5 MB",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{aid ? "Edit" : "Upload"} Visual Aid</DialogTitle>
          <DialogDescription>Fill in the details and upload a file</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Product Brochure - Cardiology" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Division</label>
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">File</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              {filePreview ? (
                <div className="relative inline-block">
                  <img src={filePreview} alt="Preview" className="max-h-32 rounded mx-auto" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={(e) => { e.stopPropagation(); setFilePreview(null); setFileName(""); }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : fileName ? (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-muted-foreground">{fileSize}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click or drag to upload an image or PDF</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(v) => setType(v as "pdf" | "image")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !division}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
