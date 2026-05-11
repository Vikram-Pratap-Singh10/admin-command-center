import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import VisualAids from "@/pages/VisualAids";
import Cart from "@/pages/Cart";
import CartList from "@/pages/CartList";
import CartItemDetail from "@/pages/CartItemDetail";
import FAQs from "@/pages/FAQs";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import ContactUs from "@/pages/ContactUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PermissionsProvider>
          <CartProvider>
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
                    <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                    <Route path="/users" element={<ErrorBoundary><Users /></ErrorBoundary>} />
                    <Route path="/products" element={<ErrorBoundary><Products /></ErrorBoundary>} />
                    <Route path="/orders" element={<ErrorBoundary><Orders /></ErrorBoundary>} />
                    <Route path="/visual-aids" element={<ErrorBoundary><VisualAids /></ErrorBoundary>} />
                    <Route path="/cart" element={<ErrorBoundary><Cart /></ErrorBoundary>} />
                    <Route path="/cart-list" element={<ErrorBoundary><CartList /></ErrorBoundary>} />
                    <Route path="/cart-list/:productId" element={<ErrorBoundary><CartItemDetail /></ErrorBoundary>} />
                    <Route path="/faqs" element={<ErrorBoundary><FAQs /></ErrorBoundary>} />
                    <Route path="/notifications" element={<ErrorBoundary><Notifications /></ErrorBoundary>} />
                    <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
                    <Route path="/contact-us" element={<ErrorBoundary><ContactUs /></ErrorBoundary>} />
                    <Route path="/privacy-policy" element={<ErrorBoundary><PrivacyPolicy /></ErrorBoundary>} />
                    <Route path="/terms-conditions" element={<ErrorBoundary><TermsConditions /></ErrorBoundary>} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </PermissionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
