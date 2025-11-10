import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Pill, 
  LogOut, 
  Bell, 
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  Phone,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { patients, MedicationCatalogItem } from '../lib/mockData';
import { SymptomQuestionnaire } from './patient/SymptomQuestionnaire';
import { AIRecommendations } from './patient/AIRecommendations';
import { MedicationCatalog } from './patient/MedicationCatalog';
import { ShoppingCart as ShoppingCartView } from './patient/ShoppingCart';
import { toast } from 'sonner@2.0.3';

interface PatientPortalProps {
  patientName: string;
  onLogout: () => void;
}

interface CartItem {
  medication: MedicationCatalogItem;
  quantity: number;
  dosage: string;
}

export function PatientPortal({ patientName, onLogout }: PatientPortalProps) {
  const patient = patients.find(p => p.name === patientName);
  const [reminders, setReminders] = useState<string[]>([]);
  const [view, setView] = useState<'questionnaire' | 'recommendations' | 'catalog' | 'prescriptions'>('questionnaire');
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (patient) {
      const newReminders: string[] = [];
      
      // Check for low prescription quantities
      patient.prescriptions.forEach(rx => {
        if (rx.quantity < 10) {
          newReminders.push(`${rx.drug} is running low. Consider requesting a refill.`);
        }
        
        // Check if next fill is soon
        const nextFillDate = new Date(rx.nextFill);
        const today = new Date();
        const daysUntil = Math.ceil((nextFillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 7 && daysUntil > 0) {
          newReminders.push(`${rx.drug} refill due in ${daysUntil} days`);
        }
      });
      
      // Check for upcoming appointments
      patient.appointments.forEach(apt => {
        const aptDate = new Date(apt.date);
        const today = new Date();
        const daysUntil = Math.ceil((aptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 3 && daysUntil >= 0) {
          newReminders.push(`${apt.type} scheduled in ${daysUntil} days`);
        }
      });
      
      setReminders(newReminders);
    }
  }, [patient]);

  const handleQuestionnaireComplete = (recommendations: any[]) => {
    setAIRecommendations(recommendations);
    setView('recommendations');
  };

  const handleAddToCart = (medication: MedicationCatalogItem) => {
    const defaultDosage = medication.dosages[0];
    setCart(prev => {
      const existing = prev.find(item => item.medication.id === medication.id);
      if (existing) {
        return prev.map(item =>
          item.medication.id === medication.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medication, quantity: 1, dosage: defaultDosage }];
    });
    setCartIds(prev => new Set(prev).add(medication.id));
    toast.success(`${medication.name} added to cart`);
  };

  const handleUpdateQuantity = (medicationId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.medication.id === medicationId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (medicationId: string) => {
    setCart(prev => prev.filter(item => item.medication.id !== medicationId));
    setCartIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(medicationId);
      return newSet;
    });
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    toast.success('Order placed successfully!', {
      description: `${cart.length} item(s) - Total: $${cart.reduce((sum, item) => sum + (item.medication.price * item.quantity * 1.08), 0).toFixed(2)}`,
    });
    setCart([]);
    setCartIds(new Set());
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
            <CardDescription>Please try logging in again</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onLogout}>Back to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <h1>Patient Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {patient.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {view !== 'questionnaire' && (
                <Button
                  variant="outline"
                  onClick={() => setView('questionnaire')}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Recommendations
                </Button>
              )}
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                {reminders.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {reminders.length}
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

      {/* Content */}
      <div className="flex gap-6 p-6">
        <div className="flex-1">
          {view === 'questionnaire' && (
            <SymptomQuestionnaire
              patient={patient}
              onComplete={handleQuestionnaireComplete}
              onSkip={() => setView('catalog')}
            />
          )}

          {view === 'recommendations' && (
            <AIRecommendations
              patient={patient}
              recommendations={aiRecommendations}
              onAddToCart={handleAddToCart}
              onBrowseCatalog={() => setView('catalog')}
            />
          )}

          {view === 'catalog' && (
            <MedicationCatalog
              onAddToCart={handleAddToCart}
              cart={cartIds}
            />
          )}

          {view === 'prescriptions' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Reminders */}
              {reminders.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p>You have {reminders.length} reminder(s):</p>
                      <ul className="list-disc list-inside">
                        {reminders.map((reminder, index) => (
                          <li key={index} className="text-sm">{reminder}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="prescriptions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prescriptions">My Prescriptions</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="prescriptions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Prescriptions</CardTitle>
                      <CardDescription>
                        Manage your medications and view AI insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {patient.prescriptions.map((rx) => (
                        <Card key={rx.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3>{rx.drug}</h3>
                                  {rx.isControlled && (
                                    <Badge variant="destructive">Controlled</Badge>
                                  )}
                                  <Badge variant={
                                    rx.status === 'ready' ? 'default' :
                                    rx.status === 'in_progress' ? 'secondary' : 'outline'
                                  }>
                                    {rx.status === 'ready' ? 'Ready for Pickup' :
                                     rx.status === 'in_progress' ? 'In Progress' : 'Pending'}
                                  </Badge>
                                </div>
                                
                                {/* Feedback Display */}
                                {rx.feedback && (
                                  <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Sparkles className="h-4 w-4 text-blue-600" />
                                      <p className="text-sm">Your Feedback</p>
                                    </div>
                                    <div className="text-sm space-y-1">
                                      <p>Effectiveness: {Array.from({ length: 5 }).map((_, i) => i < rx.feedback!.effectiveness ? '⭐' : '☆').join('')}</p>
                                      <p>Satisfaction: {Array.from({ length: 5 }).map((_, i) => i < rx.feedback!.overallSatisfaction ? '⭐' : '☆').join('')}</p>
                                      {rx.feedback.sideEffects.length > 0 && (
                                        <p className="text-xs text-gray-600">
                                          Side effects: {rx.feedback.sideEffects.join(', ')}
                                        </p>
                                      )}
                                      {rx.feedback.comments && (
                                        <p className="text-xs italic">"{rx.feedback.comments}"</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <p>RX Number: {rx.rxNumber}</p>
                                    <p>Prescriber: {rx.prescriber}</p>
                                    <p>Quantity: {rx.quantity} pills</p>
                                  </div>
                                  <div>
                                    <p>Last Filled: {new Date(rx.lastFilled).toLocaleDateString()}</p>
                                    <p>Next Fill: {new Date(rx.nextFill).toLocaleDateString()}</p>
                                    <p>Refills Remaining: {rx.refillsRemaining}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" disabled={rx.status !== 'ready'}>
                                  Request Refill
                                </Button>
                                <Button size="sm" variant="outline">
                                  Provide Feedback
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Phone className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Need help?</p>
                            <p>Call Pharmacy</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Virtual Visit</p>
                            <p>Schedule Consult</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>View and manage your scheduled visits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {patient.appointments.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                      ) : (
                        patient.appointments.map((apt, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="bg-blue-100 p-3 rounded-lg">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3>{apt.type}</h3>
                                    <p className="text-sm text-gray-600">
                                      {new Date(apt.date).toLocaleDateString()} {apt.time && `at ${apt.time}`}
                                    </p>
                                    <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'}>
                                      {apt.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Reschedule</Button>
                                  <Button size="sm" variant="destructive">Cancel</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                      <Button className="w-full">Schedule New Appointment</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing & Transactions</CardTitle>
                      <CardDescription>
                        Insurance: {patient.insuranceProvider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {patient.transactions.map((txn, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                  <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <h3>{txn.drug}</h3>
                                  <p className="text-sm text-gray-600">
                                    Date: {new Date(txn.date).toLocaleDateString()}
                                  </p>
                                  <div className="flex gap-4 text-sm mt-1">
                                    <p>Total: ${txn.amount.toFixed(2)}</p>
                                    <p>Co-pay: ${txn.co_pay.toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                              <Badge variant={
                                txn.status === 'paid' ? 'default' :
                                txn.status === 'submitted' ? 'secondary' : 'outline'
                              }>
                                {txn.status === 'paid' ? 'Paid' :
                                 txn.status === 'submitted' ? 'Submitted to Insurance' : 'Pending'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Sidebar - Shopping Cart */}
        {(view === 'recommendations' || view === 'catalog') && (
          <div className="w-80 sticky top-24 self-start">
            <ShoppingCartView
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {view !== 'questionnaire' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-6xl mx-auto flex gap-2">
            <Button
              variant={view === 'catalog' ? 'default' : 'outline'}
              onClick={() => setView('catalog')}
              className="flex-1"
            >
              <Pill className="h-4 w-4 mr-2" />
              Browse Medications
            </Button>
            <Button
              variant={view === 'prescriptions' ? 'default' : 'outline'}
              onClick={() => setView('prescriptions')}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              My Prescriptions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
