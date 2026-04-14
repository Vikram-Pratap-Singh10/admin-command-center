import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface ContactEntry {
  id: string;
  type: "email" | "phone" | "address";
  label: string;
  value: string;
}

const defaultEntries: ContactEntry[] = [
  { id: "1", type: "email", label: "Support Email", value: "support@magicdose.in" },
  { id: "2", type: "email", label: "Sales Email", value: "sales@magicdose.in" },
  { id: "3", type: "phone", label: "Helpline", value: "+91 1800 123 4567" },
  { id: "4", type: "phone", label: "WhatsApp", value: "+91 98765 43210" },
  { id: "5", type: "address", label: "Head Office", value: "123, Pharma Tower, Mumbai, Maharashtra 400001" },
];

const typeIcons = { email: Mail, phone: Phone, address: MapPin };

export default function ContactUs() {
  const [entries, setEntries] = useState<ContactEntry[]>(defaultEntries);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContactEntry | null>(null);
  const [form, setForm] = useState({ type: "email" as ContactEntry["type"], label: "", value: "" });

  const openAdd = () => {
    setEditing(null);
    setForm({ type: "email", label: "", value: "" });
    setModalOpen(true);
  };

  const openEdit = (entry: ContactEntry) => {
    setEditing(entry);
    setForm({ type: entry.type, label: entry.label, value: entry.value });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.value.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (editing) {
      setEntries((prev) => prev.map((e) => (e.id === editing.id ? { ...e, ...form } : e)));
      toast.success("Contact entry updated");
    } else {
      setEntries((prev) => [{ id: `c_${Date.now()}`, ...form }, ...prev]);
      toast.success("Contact entry added");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Contact entry deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contact Us</h2>
          <p className="text-muted-foreground text-sm">Manage contact information displayed to users.</p>
        </div>
        <PermissionGuard permission="edit_contact_us">
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Entry</Button>
        </PermissionGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Entries</CardTitle>
          <CardDescription>Email addresses, phone numbers, and office locations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => {
                const Icon = typeIcons[entry.type];
                return (
                  <TableRow key={entry.id}>
                    <TableCell><span className="flex items-center gap-2 capitalize"><Icon className="h-4 w-4 text-muted-foreground" />{entry.type}</span></TableCell>
                    <TableCell className="font-medium">{entry.label}</TableCell>
                    <TableCell>{entry.value}</TableCell>
                    <TableCell className="text-right">
                      <PermissionGuard permission="edit_contact_us">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(entry)}><Pencil className="h-4 w-4" /></Button>
                      </PermissionGuard>
                      <PermissionGuard permission="delete_contact_us">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                      </PermissionGuard>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Contact Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContactEntry["type"] })}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="address">Address</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Support Email" />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              {form.type === "address" ? (
                <Textarea value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Full address" />
              ) : (
                <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "email" ? "email@example.com" : "+91 ..."} />
              )}
            </div>
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
