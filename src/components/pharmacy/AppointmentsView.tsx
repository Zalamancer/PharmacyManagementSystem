import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon, Video, User, Phone } from 'lucide-react';
import { patients } from '../../lib/mockData';

export function AppointmentsView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const allAppointments = patients.flatMap(patient => 
    patient.appointments.map(apt => ({ 
      ...apt, 
      patientName: patient.name,
      patientId: patient.id,
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingAppointments = allAppointments.filter(apt => 
    new Date(apt.date) >= new Date()
  );

  const appointmentsByType = {
    vaccination: allAppointments.filter(apt => apt.type.toLowerCase().includes('vaccination')).length,
    consultation: allAppointments.filter(apt => apt.type.toLowerCase().includes('consultation')).length,
    checkup: allAppointments.filter(apt => apt.type.toLowerCase().includes('check') || apt.type.toLowerCase().includes('pressure')).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Vaccinations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{appointmentsByType.vaccination}</p>
            <p className="text-xs text-gray-600">scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{appointmentsByType.consultation}</p>
            <p className="text-xs text-gray-600">scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{appointmentsByType.checkup}</p>
            <p className="text-xs text-gray-600">scheduled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Manage patient visits and consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map((apt, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          apt.type.toLowerCase().includes('vaccination') ? 'bg-purple-100' :
                          apt.type.toLowerCase().includes('consultation') ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                          {apt.type.toLowerCase().includes('consultation') ? (
                            <Video className="h-6 w-6 text-blue-600" />
                          ) : (
                            <CalendarIcon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3>{apt.type}</h3>
                            <Badge variant={apt.status === 'scheduled' ? 'default' : 'secondary'}>
                              {apt.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {apt.patientName}
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(apt.date).toLocaleDateString()}
                            </div>
                            {apt.time && (
                              <span>{apt.time}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {apt.type.toLowerCase().includes('consultation') && (
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-1" />
                            Join Call
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            <Button className="w-full">Schedule New Appointment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm">Quick Stats:</p>
              <div className="text-sm space-y-1 text-gray-600">
                <p>• Total appointments: {allAppointments.length}</p>
                <p>• This week: {allAppointments.filter(apt => {
                  const aptDate = new Date(apt.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return aptDate >= today && aptDate <= weekFromNow;
                }).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
