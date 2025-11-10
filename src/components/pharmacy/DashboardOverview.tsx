import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Users, 
  Pill, 
  Calendar, 
  Package, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
} from 'lucide-react';
import { patients, inventory } from '../../lib/mockData';

export function DashboardOverview() {
  const totalPrescriptions = patients.reduce((sum, p) => sum + p.prescriptions.length, 0);
  const prescriptionsReady = patients.reduce((sum, p) => 
    sum + p.prescriptions.filter(rx => rx.status === 'ready').length, 0
  );
  const prescriptionsInProgress = patients.reduce((sum, p) => 
    sum + p.prescriptions.filter(rx => rx.status === 'in_progress').length, 0
  );
  const todayAppointments = patients.reduce((sum, p) => 
    sum + p.appointments.filter(apt => apt.date === '2025-11-10').length, 0
  );
  
  const lowStockItems = inventory.filter(item => item.quantity < item.reorderLevel);
  const expiringSoon = inventory.filter(item => {
    const expiryDate = new Date(item.expiration);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const totalRevenue = patients.reduce((sum, p) => 
    sum + p.transactions.reduce((tSum, t) => tSum + t.amount, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Alert Section */}
      {(lowStockItems.length > 0 || expiringSoon.length > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {lowStockItems.length > 0 && (
                <li>{lowStockItems.length} items below reorder level</li>
              )}
              {expiringSoon.length > 0 && (
                <li>{expiringSoon.length} items expiring within 30 days</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{patients.length}</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalPrescriptions}</div>
            <p className="text-xs text-muted-foreground">
              {prescriptionsReady} ready, {prescriptionsInProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Revenue (MTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Prescriptions</CardTitle>
            <CardDescription>Require attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patients.map(patient => 
              patient.prescriptions
                .filter(rx => rx.status === 'in_progress' || rx.status === 'pending')
                .map(rx => (
                  <div key={rx.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p>{patient.name}</p>
                      <p className="text-sm text-gray-600">{rx.drug}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={rx.status === 'in_progress' ? 'secondary' : 'outline'}>
                        {rx.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Due: {new Date(rx.nextFill).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.map(item => (
              <div key={item.drug} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p>{item.drug}</p>
                    <p className="text-sm text-gray-600">
                      Current: {item.quantity} | Reorder: {item.reorderLevel}
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
                <Progress 
                  value={(item.quantity / item.reorderLevel) * 100} 
                  className="h-2"
                />
              </div>
            ))}
            {expiringSoon.map(item => (
              <div key={item.drug + '-expiry'} className="flex items-center justify-between border-t pt-3">
                <div>
                  <p>{item.drug}</p>
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(item.expiration).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expiring Soon
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
