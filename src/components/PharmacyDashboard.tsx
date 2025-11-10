import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Pill, 
  Calendar, 
  Package, 
  DollarSign, 
  Settings,
  LogOut,
  Bell,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { PrescriptionManagement } from './pharmacy/PrescriptionManagement';
import { InventoryManagement } from './pharmacy/InventoryManagement';
import { AppointmentsView } from './pharmacy/AppointmentsView';
import { BillingView } from './pharmacy/BillingView';
import { PatientManagement } from './pharmacy/PatientManagement';
import { DashboardOverview } from './pharmacy/DashboardOverview';
import { AIInsights } from './pharmacy/AIInsights';
import { Chatbot } from './Chatbot';

interface PharmacyDashboardProps {
  onLogout: () => void;
}

export function PharmacyDashboard({ onLogout }: PharmacyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    { id: 1, message: '3 prescriptions need refill approval', type: 'warning' },
    { id: 2, message: '2 inventory items below reorder level', type: 'alert' },
    { id: 3, message: '5 appointments scheduled today', type: 'info' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1>Pharmacy Management System</h1>
                <p className="text-sm text-gray-600">Pharmacist Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2">
              <Pill className="h-4 w-4" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-2">
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsights />
          </TabsContent>

          <TabsContent value="prescriptions">
            <PrescriptionManagement />
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagement />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsView />
          </TabsContent>

          <TabsContent value="billing">
            <BillingView />
          </TabsContent>
        </Tabs>
      </div>
      <Chatbot userType="pharmacist" />
    </div>
  );
}
