import { useState } from "react";
import { mockFAQs, FAQ, FAQ_CATEGORIES } from "@/data/content-mock";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { PermissionGuard } from "@/components/PermissionGuard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, HelpCircle } from "lucide-react";

export default function FAQs() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState(mockFAQs);
  const [modal, setModal] = useState<{ open: boolean; faq?: FAQ }>({ open: false });
  const [form, setForm] = useState({ question: "", answer: "", category: "General", isPublished: true });
  const [categoryFilter, setCategoryFilter] = useState("all");

  const openModal = (faq?: FAQ) => {
    setModal({ open: true, faq });
    setForm(faq ? { question: faq.question, answer: faq.answer, category: faq.category, isPublished: faq.isPublished } : { question: "", answer: "", category: "General", isPublished: true });
  };

  const save = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    if (modal.faq) {
      setFaqs((prev) => prev.map((f) => f.id === modal.faq!.id ? { ...f, ...form, updatedAt: new Date().toISOString() } : f));
    } else {
      setFaqs((prev) => [...prev, { id: `faq-${Date.now()}`, ...form, order: prev.length + 1, updatedAt: new Date().toISOString() }]);
    }
    setModal({ open: false });
    toast({ title: `FAQ ${modal.faq ? "updated" : "created"}` });
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast({ title: "FAQ deleted" });
  };

  const filtered = categoryFilter === "all" ? faqs : faqs.filter((f) => f.category === categoryFilter);
  const grouped = filtered.reduce<Record<string, FAQ[]>>((acc, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">FAQ Management</h2>
          <p className="text-muted-foreground text-sm">Manage frequently asked questions</p>
        </div>
        <PermissionGuard permission="edit_faqs">
          <Button size="sm" onClick={() => openModal()}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add FAQ
          </Button>
        </PermissionGuard>
      </div>

      <div className="flex gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {FAQ_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="self-center">{filtered.length} FAQs</Badge>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <Card key={category}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">{category}</h3>
              <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
            </div>
            <Accordion type="multiple" className="w-full">
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-sm text-left hover:no-underline">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span>{faq.question}</span>
                      {!faq.isPublished && <Badge variant="outline" className="text-[10px]">Draft</Badge>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                    <PermissionGuard permission="edit_faqs">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openModal(faq)}>
                          <Pencil className="mr-1 h-3 w-3" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteFaq(faq.id)}>
                          <Trash2 className="mr-1 h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </PermissionGuard>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <Dialog open={modal.open} onOpenChange={(v) => !v && setModal({ open: false })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{modal.faq ? "Edit" : "Add"} FAQ</DialogTitle>
            <DialogDescription>{modal.faq ? "Update this FAQ entry" : "Create a new FAQ entry"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Question</label>
              <Input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} placeholder="e.g. How do I place an order?" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Answer</label>
              <Textarea value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} rows={4} placeholder="Detailed answer..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FAQ_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <label className="text-sm font-medium">Published</label>
              <Switch checked={form.isPublished} onCheckedChange={(v) => setForm((p) => ({ ...p, isPublished: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ open: false })}>Cancel</Button>
            <Button onClick={save} disabled={!form.question.trim() || !form.answer.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
