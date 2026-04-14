import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Image,
  HelpCircle,
  Bell,
  Settings,
  Pill,
  Phone,
  Shield,
  FileText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { ModuleKey } from "@/data/roles-permissions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  module: ModuleKey;
}

const mainNav: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, module: "dashboard" },
  { title: "Users", url: "/users", icon: Users, module: "users" },
  { title: "Products", url: "/products", icon: Package, module: "products" },
  { title: "Orders", url: "/orders", icon: ShoppingCart, module: "orders" },
];

const contentNav: NavItem[] = [
  { title: "Visual Aids", url: "/visual-aids", icon: Image, module: "visual_aids" },
  { title: "FAQs", url: "/faqs", icon: HelpCircle, module: "faqs" },
  { title: "Notifications", url: "/notifications", icon: Bell, module: "notifications" },
  { title: "Contact Us", url: "/contact-us", icon: Phone, module: "contact_us" },
  { title: "Privacy Policy", url: "/privacy-policy", icon: Shield, module: "privacy_policy" },
  { title: "Terms & Conditions", url: "/terms-conditions", icon: FileText, module: "terms_conditions" },
];

const systemNav: NavItem[] = [
  { title: "Settings", url: "/settings", icon: Settings, module: "settings" },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { canViewModule } = usePermissions();

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const filterByPermission = (items: NavItem[]) =>
    items.filter((item) => canViewModule(item.module));

  const renderGroup = (label: string, items: NavItem[]) => {
    const visible = filterByPermission(items);
    if (visible.length === 0) return null;

    return (
      <SidebarGroup>
        {!collapsed && (
          <SidebarGroupLabel className="text-sidebar-muted text-xs font-semibold uppercase tracking-wider">
            {label}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {visible.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    onClick={handleNavClick}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Pill className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">Magicdose</h1>
              <p className="text-[10px] text-sidebar-muted font-medium uppercase tracking-widest">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {renderGroup("Main", mainNav)}
        {renderGroup("Content", contentNav)}
        {renderGroup("System", systemNav)}
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-muted">© 2026 Magicdose Pharma</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
