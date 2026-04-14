import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface TermSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

const defaultSections: TermSection[] = [
  { id: "1", title: "Acceptance of Terms", content: "By accessing or using Magicdose services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.", order: 1 },
  { id: "2", title: "Use of Services", content: "You agree to use our platform only for lawful purposes and in accordance with applicable pharmaceutical regulations. Unauthorized distribution or misuse of product information is prohibited.", order: 2 },
  { id: "3", title: "Orders & Payments", content: "All orders placed through the platform are subject to acceptance and availability. Prices are subject to change without prior notice. Payment terms are as agreed at the time of registration.", order: 3 },
  { id: "4", title: "Intellectual Property", content: "All content, trademarks, and data on this platform are the property of Magicdose Pharma. Reproduction or redistribution without written consent is strictly prohibited.", order: 4 },
  { id: "5", title: "Limitation of Liability", content: "Magicdose shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services.", order: 5 },
  { id: "6", title: "Governing Law", content: "These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of Mumbai courts.", order: 6 },
];

export default function TermsConditions() {
  const [sections, setSections] = useState<TermSection[]>(defaultSections);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TermSection | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const openAdd = () => { setEditing(null); setForm({ title: "", content: "" }); setModalOpen(true); };
  const openEdit = (s: TermSection) => { setEditing(s); setForm({ title: s.title, content: s.content }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) { toast.error("All fields are required"); return; }
    if (editing) {
      setSections((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
      toast.success("Section updated");
    } else {
      setSections((prev) => [...prev, { id: `tc_${Date.now()}`, ...form, order: prev.length + 1 }]);
      toast.success("Section added");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { setSections((prev) => prev.filter((s) => s.id !== id)); toast.success("Section deleted"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Terms & Conditions</h2>
          <p className="text-muted-foreground text-sm">Manage terms and conditions displayed to users.</p>
        </div>
        <PermissionGuard permission="edit_terms_conditions">
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Section</Button>
        </PermissionGuard>
      </div>

      <div className="space-y-4">
        {sections.sort((a, b) => a.order - b.order).map((section, idx) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{idx + 1}</span>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </div>
              <div className="flex gap-1">
                <PermissionGuard permission="edit_terms_conditions">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(section)}><Pencil className="h-4 w-4" /></Button>
                </PermissionGuard>
                <PermissionGuard permission="delete_terms_conditions">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(section.id)}><Trash2 className="h-4 w-4" /></Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Section</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Section title" /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Section content..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
