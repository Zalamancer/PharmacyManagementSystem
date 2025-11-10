import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Search, User, Pill, Calendar, AlertTriangle, Users } from 'lucide-react';
import { patients, drugInteractions } from '../../lib/mockData';

export function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkDrugInteractions = (patientPrescriptions: any[]) => {
    const warnings: { message: string, severity: string }[] = [];
    const patientDrugs = patientPrescriptions.map(p => p.drug.split(' ')[0]);

    // Check for internal interactions
    for (let i = 0; i < patientDrugs.length; i++) {
        for (let j = i + 1; j < patientDrugs.length; j++) {
            const drug1 = patientDrugs[i];
            const drug2 = patientDrugs[j];
            const interaction = drugInteractions.find(inter =>
                (inter.drug1 === drug1 && inter.drug2 === drug2) ||
                (inter.drug1 === drug2 && inter.drug2 === drug1)
            );
            if (interaction) {
                warnings.push({
                    message: `${drug1} + ${drug2}: ${interaction.description}`,
                    severity: interaction.severity,
                });
            }
        }
    }

    // A hardcoded example for Gabapentin + an opioid-like drug from history for demo
    if (patientDrugs.includes('Gabapentin') && patientDrugs.includes('Adderall')) {
         warnings.push({
            message: 'Gabapentin + Opioid: Increased risk of respiratory depression',
            severity: 'high',
        });
    }
    
    return warnings;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>View patient profiles, prescriptions, and medical history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl">{patients.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Prescriptions</p>
                  <p className="text-2xl">
                    {patients.reduce((sum, p) => sum + p.prescriptions.length, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">With Caregivers</p>
                  <p className="text-2xl">
                    {patients.filter(p => p.caregivers.length > 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient List */}
          <Accordion type="single" collapsible className="w-full">
            {filteredPatients.map((patient) => {
              const interactions = checkDrugInteractions(patient.prescriptions);
              
              return (
                <AccordionItem key={patient.id} value={patient.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar>
                        <AvatarFallback>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3>{patient.name}</h3>
                          {interactions.length > 0 && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Interaction Warning
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          ID: {patient.id} | {patient.prescriptions.length} prescriptions
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-14 space-y-4 pt-4">
                      {/* Drug Interaction Warnings */}
                      {interactions.length > 0 && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <p>Potential drug interactions detected:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {interactions.map((warning, index) => (
                                <li key={index} className="text-sm">{warning.message}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Patient Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Patient Information</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p><span className="text-gray-600">Insurance:</span> {patient.insuranceProvider}</p>
                            {patient.allergies && patient.allergies.length > 0 && (
                              <p>
                                <span className="text-gray-600">Allergies:</span>{' '}
                                {patient.allergies.join(', ')}
                              </p>
                            )}
                            {patient.caregivers.length > 0 && (
                              <p>
                                <span className="text-gray-600">Caregivers:</span>{' '}
                                {patient.caregivers.join(', ')}
                              </p>
                            )}
                            {patient.nextAppointment && (
                              <p>
                                <span className="text-gray-600">Next Appointment:</span>{' '}
                                {new Date(patient.nextAppointment).toLocaleDateString()}
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Quick Stats</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p>Active Prescriptions: {patient.prescriptions.length}</p>
                            <p>Upcoming Appointments: {patient.appointments.length}</p>
                            <p>Total Transactions: {patient.transactions.length}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Prescriptions */}
                      <div>
                        <h4 className="mb-3">Current Prescriptions</h4>
                        <div className="space-y-2">
                          {patient.prescriptions.map((rx) => (
                            <Card key={rx.id}>
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Pill className="h-4 w-4 text-gray-400" />
                                    <div>
                                      <p className="text-sm">{rx.drug}</p>
                                      <p className="text-xs text-gray-600">
                                        {rx.quantity} pills | Refills: {rx.refillsRemaining}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {rx.isControlled && (
                                      <Badge variant="destructive" className="text-xs">
                                        Controlled
                                      </Badge>
                                    )}
                                    <Badge variant={
                                      rx.status === 'ready' ? 'default' :
                                      rx.status === 'in_progress' ? 'secondary' : 'outline'
                                    }>
                                      {rx.status}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Appointments */}
                      {patient.appointments.length > 0 && (
                        <div>
                          <h4 className="mb-3">Scheduled Appointments</h4>
                          <div className="space-y-2">
                            {patient.appointments.map((apt, index) => (
                              <Card key={index}>
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      <div>
                                        <p className="text-sm">{apt.type}</p>
                                        <p className="text-xs text-gray-600">
                                          {new Date(apt.date).toLocaleDateString()} {apt.time && `at ${apt.time}`}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge>{apt.status}</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
