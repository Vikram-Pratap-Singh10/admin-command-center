import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface PolicySection {
  id: string;
  title: string;
  content: string;
  order: number;
}

const defaultSections: PolicySection[] = [
  { id: "1", title: "Information We Collect", content: "We collect information you provide directly, such as your name, email address, phone number, and business details when you register or use our services.", order: 1 },
  { id: "2", title: "How We Use Your Information", content: "Your information is used to provide and improve our services, process orders, communicate updates, and ensure a personalized experience.", order: 2 },
  { id: "3", title: "Data Sharing & Disclosure", content: "We do not sell your personal data. We may share information with trusted partners for service delivery, legal compliance, or with your consent.", order: 3 },
  { id: "4", title: "Data Security", content: "We implement industry-standard security measures including encryption, secure servers, and regular audits to protect your information.", order: 4 },
  { id: "5", title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. Contact us at privacy@magicdose.in to exercise these rights.", order: 5 },
];

export default function PrivacyPolicy() {
  const [sections, setSections] = useState<PolicySection[]>(defaultSections);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PolicySection | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const openAdd = () => { setEditing(null); setForm({ title: "", content: "" }); setModalOpen(true); };
  const openEdit = (s: PolicySection) => { setEditing(s); setForm({ title: s.title, content: s.content }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) { toast.error("All fields are required"); return; }
    if (editing) {
      setSections((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
      toast.success("Section updated");
    } else {
      setSections((prev) => [...prev, { id: `pp_${Date.now()}`, ...form, order: prev.length + 1 }]);
      toast.success("Section added");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => { setSections((prev) => prev.filter((s) => s.id !== id)); toast.success("Section deleted"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Privacy Policy</h2>
          <p className="text-muted-foreground text-sm">Manage privacy policy sections displayed to users.</p>
        </div>
        <PermissionGuard permission="edit_privacy_policy">
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Section</Button>
        </PermissionGuard>
      </div>

      <div className="space-y-4">
        {sections.sort((a, b) => a.order - b.order).map((section, idx) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{idx + 1}</span>
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </div>
              </div>
              <div className="flex gap-1">
                <PermissionGuard permission="edit_privacy_policy">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(section)}><Pencil className="h-4 w-4" /></Button>
                </PermissionGuard>
                <PermissionGuard permission="delete_privacy_policy">
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
