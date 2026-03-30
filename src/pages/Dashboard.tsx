import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Orders", value: "1,284", change: "+12.5%", icon: ShoppingCart, trend: "up" as const },
  { label: "Active Distributors", value: "342", change: "+4.1%", icon: Users, trend: "up" as const },
  { label: "Products", value: "856", change: "+2.3%", icon: Package, trend: "up" as const },
  { label: "Revenue", value: "₹24.5L", change: "+18.2%", icon: TrendingUp, trend: "up" as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back. Here's an overview of your business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success font-medium mt-1">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Order management module coming in Phase 6.</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Distributor approvals module coming in Phase 4.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
