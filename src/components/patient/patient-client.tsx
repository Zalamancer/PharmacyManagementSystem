'use client';

import { useState } from 'react';
import type { Patient as PatientType, Prescription } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Pill,
  Calendar,
  CreditCard,
  Plus,
  Minus,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { unsafeDrugCombinations } from '@/lib/data';
import { format } from 'date-fns';

function getInteractionAlert(prescriptions: Prescription[]): string | null {
  const prescribedDrugs = prescriptions.map((p) => p.drug);
  for (const combo of unsafeDrugCombinations) {
    if (prescribedDrugs.includes(combo[0]) && prescribedDrugs.includes(combo[1])) {
      return `Potential interaction detected between ${combo[0]} and ${combo[1]}. Please consult a pharmacist.`;
    }
  }
  return null;
}

export function PatientClient({ patient: initialPatient }: { patient: PatientType }) {
  const [patient, setPatient] = useState(initialPatient);
  const { toast } = useToast();

  const handleUseDose = (prescriptionId: string) => {
    setPatient((prevPatient) => {
      const newPrescriptions = prevPatient.prescriptions.map((p) => {
        if (p.id === prescriptionId && p.quantity > 0) {
          const newQuantity = p.quantity - 1;
          if (newQuantity < 5 && newQuantity > 0) {
            toast({
              title: 'Refill Reminder',
              description: `${prevPatient.name} is running low on ${p.drug}. Only ${newQuantity} doses left.`,
            });
          }
          if (newQuantity === 0) {
             toast({
              variant: 'destructive',
              title: 'Out of Stock',
              description: `${prevPatient.name} is out of ${p.drug}.`,
            });
          }
          return { ...p, quantity: newQuantity };
        }
        return p;
      });
      return { ...prevPatient, prescriptions: newPrescriptions };
    });
  };
  
  const interactionAlert = getInteractionAlert(patient.prescriptions);

  return (
    <div className="flex flex-col gap-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col items-start bg-card p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-headline">{patient.name}</CardTitle>
              <CardDescription>
                Next Appointment: {format(new Date(patient.next_appointment), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {interactionAlert && (
          <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Interaction Warning</AlertTitle>
              <AlertDescription>{interactionAlert}</AlertDescription>
          </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Pill />Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.prescriptions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.drug}</TableCell>
                    <TableCell>{p.dosage_mg}mg</TableCell>
                    <TableCell>
                      <span className={`${p.quantity < 5 ? 'text-destructive font-bold' : ''}`}>{p.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleUseDose(p.id)} disabled={p.quantity === 0}>
                        <Minus className="h-3 w-3 mr-1"/> Use Dose
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar />Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                 {patient.appointments.length > 0 ? (
                    <ul className="space-y-2">
                        {patient.appointments.map(appt => (
                            <li key={appt.id} className="flex justify-between items-center text-sm">
                                <span>{appt.type}</span>
                                <span className="text-muted-foreground">{format(new Date(appt.date), 'MMM d, yyyy')}</span>
                            </li>
                        ))}
                    </ul>
                 ) : <p className="text-sm text-muted-foreground">No appointments scheduled.</p>}
                 <Button className="w-full mt-4" variant="secondary"><Plus className="h-4 w-4 mr-2" />Schedule New</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard />Billing</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.transactions.length > 0 ? (
                    <ul className="space-y-2">
                        {patient.transactions.map(t => (
                            <li key={t.id} className="flex justify-between items-center text-sm">
                                <span>{t.drug}</span>
                                <div className="text-right">
                                    <span className="font-medium">${t.amount.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground block">Co-pay: ${t.co_pay.toFixed(2)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                 ) : <p className="text-sm text-muted-foreground">No recent transactions.</p>}
                 <Button className="w-full mt-4" variant="secondary">Submit to Insurance</Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
