'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
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
import type { Patient } from '@/lib/types';
import { AlertTriangle, ArrowRight, Bell, UserCheck, Users } from 'lucide-react';
import { format } from 'date-fns';

export function DashboardClient({ patients }: { patients: Patient[] }) {
  const patientsNeedingRefills = patients.filter((p) =>
    p.prescriptions.some((pr) => pr.quantity < 5)
  );

  const upcomingAppointments = patients
    .flatMap((p) =>
      p.appointments.map((a) => ({ ...a, patientName: p.name, patientId: p.id }))
    )
    .filter((a) => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently managing {patients.length} patients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refill Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientsNeedingRefills.length}</div>
            <p className="text-xs text-muted-foreground">
              {patientsNeedingRefills.length} patients need attention
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 3 appointments this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interaction Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              1 patient with potential drug interactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Prescriptions</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={patient.avatarUrl} />
                          <AvatarFallback>
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.prescriptions.length} active
                    </TableCell>
                    <TableCell className="text-center">
                      {patient.prescriptions.some((pr) => pr.quantity < 5) ? (
                        <Badge variant="destructive">Refill Needed</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-accent/50 text-accent-foreground/80">Stable</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(patient.next_appointment), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                       <Link href={`/patient/${patient.id}`} passHref>
                        <Button variant="ghost" size="sm">
                            View
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-4">
                    <div className="grid h-12 w-12 flex-shrink-0 place-content-center rounded-md bg-primary/10 text-primary">
                        <span className="text-xs font-semibold">{format(new Date(appt.date), 'MMM')}</span>
                        <span className="text-lg font-bold">{format(new Date(appt.date), 'd')}</span>
                    </div>
                    <div>
                      <p className="font-medium">{appt.patientName}</p>
                      <p className="text-sm text-muted-foreground">{appt.type}</p>
                    </div>
                    <Link href={`/patient/${appt.patientId}`} className="ml-auto">
                        <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming appointments.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
