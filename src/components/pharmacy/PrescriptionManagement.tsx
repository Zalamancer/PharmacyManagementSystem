import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, Filter, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { patients } from '../../lib/mockData';
import { toast } from 'sonner';

export function PrescriptionManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const allPrescriptions = patients.flatMap(patient => 
    patient.prescriptions.map(rx => ({ ...rx, patientName: patient.name, patientId: patient.id }))
  );

  const filteredPrescriptions = allPrescriptions.filter(rx => {
    const matchesSearch = 
      rx.drug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.rxNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (rxId: string, newStatus: string) => {
    toast.success(`Prescription ${rxId} status updated to ${newStatus}`);
  };

  const handleDispense = (rx: any) => {
    toast.success(`${rx.drug} dispensed to ${rx.patientName}`, {
      description: `RX #${rx.rxNumber} - ${rx.quantity} pills`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prescription Management</CardTitle>
          <CardDescription>View and manage all patient prescriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient, drug, or RX number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Ready for Pickup</p>
                  <p className="text-2xl">
                    {allPrescriptions.filter(rx => rx.status === 'ready').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl">
                    {allPrescriptions.filter(rx => rx.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl">
                    {allPrescriptions.filter(rx => rx.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RX Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Drug</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Prescriber</TableHead>
                  <TableHead>Next Fill</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((rx) => (
                  <TableRow key={rx.id}>
                    <TableCell>{rx.rxNumber}</TableCell>
                    <TableCell>{rx.patientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {rx.drug}
                        {rx.isControlled && (
                          <Badge variant="destructive" className="text-xs">
                            Controlled
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{rx.quantity}</TableCell>
                    <TableCell>{rx.prescriber}</TableCell>
                    <TableCell>{new Date(rx.nextFill).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        rx.status === 'ready' ? 'default' :
                        rx.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {rx.status === 'ready' ? 'Ready' :
                         rx.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {rx.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(rx.rxNumber, 'in_progress')}
                          >
                            Process
                          </Button>
                        )}
                        {rx.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(rx.rxNumber, 'ready')}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {rx.status === 'ready' && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleDispense(rx)}
                          >
                            Dispense
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
