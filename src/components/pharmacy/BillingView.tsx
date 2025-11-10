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
import { Search, DollarSign, TrendingUp, FileText, Send } from 'lucide-react';
import { patients } from '../../lib/mockData';
import { toast } from 'sonner';

export function BillingView() {
  const [searchTerm, setSearchTerm] = useState('');

  const allTransactions = patients.flatMap(patient => 
    patient.transactions.map(txn => ({ 
      ...txn, 
      patientName: patient.name,
      patientId: patient.id,
      insuranceProvider: patient.insuranceProvider,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = allTransactions.filter(txn =>
    txn.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.drug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = allTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalCoPay = allTransactions.reduce((sum, txn) => sum + txn.co_pay, 0);
  const pendingClaims = allTransactions.filter(txn => txn.status === 'pending').length;
  const submittedClaims = allTransactions.filter(txn => txn.status === 'submitted').length;

  const handleSubmitClaim = (txn: any) => {
    toast.success(`Insurance claim submitted`, {
      description: `${txn.drug} for ${txn.patientName} - ${txn.insuranceProvider}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Co-Pay Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <p className="text-2xl">${totalCoPay.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Submitted Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-orange-600" />
              <p className="text-2xl">{submittedClaims}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <p className="text-2xl">{pendingClaims}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing & Transactions</CardTitle>
          <CardDescription>Manage patient billing and insurance claims</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Co-Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                    <TableCell>{txn.patientName}</TableCell>
                    <TableCell>{txn.drug}</TableCell>
                    <TableCell>{txn.insuranceProvider || 'N/A'}</TableCell>
                    <TableCell>${txn.amount.toFixed(2)}</TableCell>
                    <TableCell>${txn.co_pay.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        txn.status === 'paid' ? 'default' :
                        txn.status === 'submitted' ? 'secondary' : 'outline'
                      }>
                        {txn.status === 'paid' ? 'Paid' :
                         txn.status === 'submitted' ? 'Submitted' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {txn.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmitClaim(txn)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Submit Claim
                        </Button>
                      )}
                      {txn.status !== 'pending' && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
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
