import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, TrendingUp, IndianRupee, BarChart3 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const stats = [
  { label: "Total Orders", value: "1,284", change: "+12.5%", icon: ShoppingCart },
  { label: "Active Distributors", value: "342", change: "+4.1%", icon: Users },
  { label: "Products", value: "856", change: "+2.3%", icon: Package },
  { label: "Revenue", value: "₹24.5L", change: "+18.2%", icon: TrendingUp },
];

const orderTrendData = [
  { month: "Jan", orders: 156, revenue: 180000 },
  { month: "Feb", orders: 189, revenue: 220000 },
  { month: "Mar", orders: 210, revenue: 265000 },
  { month: "Apr", orders: 178, revenue: 198000 },
  { month: "May", orders: 245, revenue: 310000 },
  { month: "Jun", orders: 290, revenue: 380000 },
  { month: "Jul", orders: 310, revenue: 420000 },
  { month: "Aug", orders: 275, revenue: 355000 },
  { month: "Sep", orders: 320, revenue: 450000 },
  { month: "Oct", orders: 348, revenue: 490000 },
  { month: "Nov", orders: 380, revenue: 530000 },
  { month: "Dec", orders: 410, revenue: 580000 },
];

const revenuePieData = [
  { name: "Cardiology", value: 35 },
  { name: "Oncology", value: 25 },
  { name: "Neurology", value: 18 },
  { name: "Dermatology", value: 12 },
  { name: "Others", value: 10 },
];

const PIE_COLORS = [
  "hsl(173, 58%, 32%)",
  "hsl(210, 80%, 52%)",
  "hsl(38, 92%, 50%)",
  "hsl(152, 60%, 40%)",
  "hsl(215, 15%, 50%)",
];

const userGrowthData = [
  { month: "Jan", distributors: 280, mrs: 420 },
  { month: "Feb", distributors: 290, mrs: 440 },
  { month: "Mar", distributors: 298, mrs: 465 },
  { month: "Apr", distributors: 305, mrs: 480 },
  { month: "May", distributors: 315, mrs: 510 },
  { month: "Jun", distributors: 322, mrs: 535 },
  { month: "Jul", distributors: 330, mrs: 560 },
  { month: "Aug", distributors: 335, mrs: 575 },
  { month: "Sep", distributors: 338, mrs: 590 },
  { month: "Oct", distributors: 340, mrs: 610 },
  { month: "Nov", distributors: 341, mrs: 625 },
  { month: "Dec", distributors: 342, mrs: 640 },
];

const topProducts = [
  { name: "Cardiomax 50mg", units: 4820, revenue: 482000 },
  { name: "Neurozen Plus", units: 3650, revenue: 547500 },
  { name: "DermaGlow Cream", units: 3200, revenue: 256000 },
  { name: "Oncoguard 100mg", units: 2100, revenue: 630000 },
  { name: "Livercare Syrup", units: 1950, revenue: 175500 },
];

const formatCurrency = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Welcome back. Here's an overview of your business.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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

      {/* Order Trends + Revenue Breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={orderTrendData}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(173, 58%, 32%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(173, 58%, 32%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: 8 }}
                  formatter={(value: number, name: string) => [name === "revenue" ? formatCurrency(value) : value, name === "revenue" ? "Revenue" : "Orders"]}
                />
                <Area type="monotone" dataKey="orders" stroke="hsl(173, 58%, 32%)" fill="url(#orderGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Revenue by Division</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenuePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {revenuePieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Growth + Top Products */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="distributors" name="Distributors" fill="hsl(173, 58%, 32%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mrs" name="Medical Reps" fill="hsl(210, 80%, 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, i) => {
                const maxUnits = topProducts[0].units;
                const pct = (product.units / maxUnits) * 100;
                return (
                  <div key={product.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate mr-2">
                        <span className="text-muted-foreground mr-1.5">#{i + 1}</span>
                        {product.name}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap">{product.units.toLocaleString()} units</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
