import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PermissionsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/visual-aids" element={<PlaceholderPage title="Visual Aids" />} />
                <Route path="/faqs" element={<PlaceholderPage title="FAQs" />} />
                <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />
                <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PermissionsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-sm">This module will be built in upcoming phases.</p>
    </div>
  );
}

export default App;
