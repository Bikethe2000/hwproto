import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { Analytics } from "@vercel/analytics/next"

import SiteLayout from './components/layout/SiteLayout';
import Home from './pages/Home';
import About from './pages/About';
import PCBDesign from './pages/Services/PCBDesign';
import CADDesign from './pages/Services/CADDesign';
import Printing3D from './pages/Services/Printing3D';
import MicroSoldering from './pages/Services/MicroSoldering';
import Engineering from './pages/Services/Engineering';
import Store from './pages/Store';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminPrintRequests from './pages/admin/AdminPrintRequests';
import AdminServices from './pages/admin/AdminServices';
import AdminOrders from './pages/admin/AdminOrders';
import OrderTracker from './pages/OrderTracker';
import AIChatbots from './pages/Services/AiChatbots';
import SmartHome from './pages/Services/SmartHome';
import WebDevelopment from './pages/Services/WebDevelopment';
import DashboardDev from './pages/Services/DashboardDev';
import MVPDev from './pages/Services/MVPDev';
import DynamicServicePage from "./pages/Services/DynamicServices";
import AdminAddNewAdmin from "./pages/admin/AdminAddNew";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/pcb-design" element={<PCBDesign />} />
        <Route path="/services/3d-cad" element={<CADDesign />} />
        <Route path="/services/3d-printing" element={<Printing3D />} />
        <Route path="/services/micro-soldering" element={<MicroSoldering />} />
        <Route path="/services/engineering" element={<Engineering />} />
        <Route path="/store" element={<Store />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track" element={<OrderTracker />} />
        <Route path="/services/ai-chatbots" element={<AIChatbots />} />
        <Route path="/services/smart-home" element={<SmartHome />} />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/dashboard-dev" element={<DashboardDev />} />
        <Route path="/services/mvp-dev" element={<MVPDev />} />
        <Route path="/services/:serviceKey" element={<DynamicServicePage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="print-requests" element={<AdminPrintRequests />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="add-admin" element={<AdminAddNewAdmin />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Analytics/>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App