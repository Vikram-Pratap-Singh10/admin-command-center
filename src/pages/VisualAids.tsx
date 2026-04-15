import { useState, useMemo } from "react";
import { mockVisualAids, mockSlides, VisualAid, Slide } from "@/data/content-mock";
import { DIVISIONS } from "@/data/users-mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionGuard } from "@/components/PermissionGuard";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, FileText, ImageIcon, Download, Eye, Layers, GripVertical, Pencil, Trash2 } from "lucide-react";
import VisualAidFormModal from "@/components/visual-aids/VisualAidFormModal";
import VisualAidPreviewModal from "@/components/visual-aids/VisualAidPreviewModal";

export default function VisualAids() {
  const { toast } = useToast();
  const [aids, setAids] = useState(mockVisualAids);
  const [slides, setSlides] = useState(mockSlides);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [slideModal, setSlideModal] = useState<{ open: boolean; slide?: Slide }>({ open: false });
  const [slideTitle, setSlideTitle] = useState("");
  const [slideDesc, setSlideDesc] = useState("");
  const [selectedAids, setSelectedAids] = useState<string[]>([]);

  const [formModal, setFormModal] = useState<{ open: boolean; aid?: VisualAid }>({ open: false });
  const [previewModal, setPreviewModal] = useState<{ open: boolean; aid: VisualAid | null }>({ open: false, aid: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; aid: VisualAid | null }>({ open: false, aid: null });

  const filteredAids = useMemo(() => aids.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchDiv = divisionFilter === "all" || a.division === divisionFilter;
    return matchSearch && matchDiv;
  }), [aids, search, divisionFilter]);

  const openSlideModal = (slide?: Slide) => {
    setSlideModal({ open: true, slide });
    setSlideTitle(slide?.title ?? "");
    setSlideDesc(slide?.description ?? "");
    setSelectedAids(slide?.visualAidIds ?? []);
  };

  const saveSlide = () => {
    if (!slideTitle.trim()) return;
    const newSlide: Slide = {
      id: slideModal.slide?.id ?? `slide-${Date.now()}`,
      title: slideTitle,
      description: slideDesc,
      visualAidIds: selectedAids,
      createdAt: slideModal.slide?.createdAt ?? new Date().toISOString(),
      isPublished: slideModal.slide?.isPublished ?? false,
    };
    if (slideModal.slide) {
      setSlides((prev) => prev.map((s) => s.id === newSlide.id ? newSlide : s));
    } else {
      setSlides((prev) => [...prev, newSlide]);
    }
    setSlideModal({ open: false });
    toast({ title: `Slide ${slideModal.slide ? "updated" : "created"}` });
  };

  const toggleAid = (id: string) => setSelectedAids((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSaveAid = (aid: VisualAid) => {
    setAids((prev) => {
      const exists = prev.find((a) => a.id === aid.id);
      if (exists) return prev.map((a) => a.id === aid.id ? aid : a);
      return [aid, ...prev];
    });
    toast({ title: `Visual aid ${formModal.aid ? "updated" : "uploaded"}` });
  };

  const handleDeleteAid = () => {
    if (!deleteConfirm.aid) return;
    setAids((prev) => prev.filter((a) => a.id !== deleteConfirm.aid!.id));
    toast({ title: "Visual aid deleted", description: deleteConfirm.aid.title });
    setDeleteConfirm({ open: false, aid: null });
  };

  const handleDownload = (aid: VisualAid) => {
    const link = document.createElement("a");
    link.href = aid.url;
    link.download = `${aid.title}.${aid.type === "pdf" ? "pdf" : "png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download started", description: aid.title });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visual Aids & Slides</h2>
          <p className="text-muted-foreground text-sm">Manage marketing materials for field sales</p>
        </div>
      </div>

      <Tabs defaultValue="gallery">
        <TabsList>
          <TabsTrigger value="gallery" className="gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Gallery</TabsTrigger>
          <TabsTrigger value="slides" className="gap-1.5"><Layers className="h-3.5 w-3.5" /> Slide Packs</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search visual aids..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <PermissionGuard permission="edit_visual_aids">
              <Button size="sm" onClick={() => setFormModal({ open: true })}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Upload
              </Button>
            </PermissionGuard>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAids.map((aid) => (
              <Card key={aid.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                  {aid.url && aid.url !== "/placeholder.svg" && aid.type === "image" ? (
                    <img src={aid.url} alt={aid.title} className="h-full w-full object-cover" />
                  ) : aid.type === "pdf" ? (
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setPreviewModal({ open: true, aid })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleDownload(aid)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <PermissionGuard permission="edit_visual_aids">
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setFormModal({ open: true, aid })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                    <PermissionGuard permission="delete_visual_aids">
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteConfirm({ open: true, aid })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{aid.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <Badge variant="outline" className="text-[10px]">{aid.division}</Badge>
                    <span className="text-[10px] text-muted-foreground">{aid.fileSize}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredAids.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No visual aids found</div>
          )}
        </TabsContent>

        <TabsContent value="slides" className="space-y-4 mt-4">
          <PermissionGuard permission="edit_visual_aids">
            <Button size="sm" onClick={() => openSlideModal()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Slide Pack
            </Button>
          </PermissionGuard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map((slide) => (
              <Card key={slide.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{slide.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{slide.description}</p>
                    </div>
                    <Badge variant={slide.isPublished ? "default" : "outline"}>
                      {slide.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {slide.visualAidIds.length} visual aids · {new Date(slide.createdAt).toLocaleDateString()}
                    </span>
                    <PermissionGuard permission="edit_visual_aids">
                      <Button size="sm" variant="ghost" onClick={() => openSlideModal(slide)}>Edit</Button>
                    </PermissionGuard>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Slide Creator Modal */}
      <Dialog open={slideModal.open} onOpenChange={(v) => !v && setSlideModal({ open: false })}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{slideModal.slide ? "Edit" : "Create"} Slide Pack</DialogTitle>
            <DialogDescription>Group visual aids into a presentation pack for MRs</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={slideTitle} onChange={(e) => setSlideTitle(e.target.value)} placeholder="e.g. Cardiology Presentation Pack" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input value={slideDesc} onChange={(e) => setSlideDesc(e.target.value)} placeholder="Brief description..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Visual Aids ({selectedAids.length} selected)</label>
              <div className="border rounded-lg max-h-[300px] overflow-y-auto divide-y">
                {aids.map((aid) => (
                  <label key={aid.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                    <Checkbox checked={selectedAids.includes(aid.id)} onCheckedChange={() => toggleAid(aid.id)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{aid.title}</p>
                      <p className="text-xs text-muted-foreground">{aid.division} · {aid.type.toUpperCase()}</p>
                    </div>
                    {selectedAids.includes(aid.id) && <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlideModal({ open: false })}>Cancel</Button>
            <Button onClick={saveSlide} disabled={!slideTitle.trim()}>Save Slide Pack</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(v) => !v && setDeleteConfirm({ open: false, aid: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Visual Aid</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm.aid?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAid} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VisualAidFormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false })}
        onSave={handleSaveAid}
        aid={formModal.aid}
      />

      <VisualAidPreviewModal
        open={previewModal.open}
        onClose={() => setPreviewModal({ open: false, aid: null })}
        aid={previewModal.aid}
      />
    </div>
  );
}
