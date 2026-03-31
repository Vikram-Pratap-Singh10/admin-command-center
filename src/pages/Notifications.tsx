import { useState } from "react";
import { mockNotifications, Notification } from "@/data/content-mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PermissionGuard } from "@/components/PermissionGuard";
import { useToast } from "@/hooks/use-toast";
import { Send, Bell, Users, User, Globe } from "lucide-react";

const TARGET_CONFIG = {
  all: { label: "Everyone", icon: Globe, color: "text-primary" },
  distributors: { label: "Distributors", icon: Users, color: "text-info" },
  mrs: { label: "Medical Reps", icon: User, color: "text-warning" },
};

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [form, setForm] = useState({ title: "", body: "", target: "all" as Notification["target"] });

  const sendNotification = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title: form.title,
      body: form.body,
      target: form.target,
      sentAt: new Date().toISOString(),
      status: "sent",
    };
    setNotifications((prev) => [notif, ...prev]);
    setForm({ title: "", body: "", target: "all" });
    toast({ title: "Notification sent successfully", description: `Sent to ${TARGET_CONFIG[form.target].label}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notification Center</h2>
        <p className="text-muted-foreground text-sm">Send push notifications to users via FCM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4" /> Compose Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Title</label>
                <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Notification title" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message</label>
                <Textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} rows={4} placeholder="Notification body..." maxLength={500} />
                <p className="text-xs text-muted-foreground text-right">{form.body.length}/500</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Target Audience</label>
                <Select value={form.target} onValueChange={(v) => setForm((p) => ({ ...p, target: v as Notification["target"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="distributors">Distributors Only</SelectItem>
                    <SelectItem value="mrs">Medical Reps Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <PermissionGuard permission="send_notifications">
                <Button className="w-full" onClick={sendNotification} disabled={!form.title.trim() || !form.body.trim()}>
                  <Send className="mr-1.5 h-3.5 w-3.5" /> Send Notification
                </Button>
              </PermissionGuard>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notification History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 divide-y">
              {notifications.map((notif) => {
                const config = TARGET_CONFIG[notif.target];
                const Icon = config.icon;
                return (
                  <div key={notif.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 min-w-0">
                        <div className={`rounded-lg p-2 bg-muted shrink-0 ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-[10px]">{config.label}</Badge>
                            <span className="text-[10px] text-muted-foreground">{new Date(notif.sentAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={notif.status === "sent" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                        {notif.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
