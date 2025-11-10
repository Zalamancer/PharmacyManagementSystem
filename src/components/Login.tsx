
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Pill, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (type: 'pharmacist' | 'patient', patientName?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [patientName, setPatientName] = useState('');
  const [pharmacistUsername, setPharmacistUsername] = useState('pharmacist@example.com');
  const [pharmacistPassword, setPharmacistPassword] = useState('password');
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handlePharmacistLogin = () => {
    setShowMFA(true);
  };

  const handleMFAVerification = () => {
    onLogin('pharmacist');
  };

  const handlePatientLogin = () => {
    if (patientName.trim()) {
      onLogin('patient', patientName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Pill className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle>Pharmacy Management System</CardTitle>
          <CardDescription>
            Secure access for healthcare professionals and patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient Portal</TabsTrigger>
              <TabsTrigger value="pharmacist">Pharmacist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  placeholder="Enter your name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePatientLogin()}
                />
              </div>
              <Button className="w-full" onClick={handlePatientLogin}>
                Access Patient Portal
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Demo: Try "Alice Johnson" or "Bob Smith"
              </p>
            </TabsContent>
            
            <TabsContent value="pharmacist" className="space-y-4">
              {!showMFA ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="pharmacist@example.com" 
                      value={pharmacistUsername}
                      onChange={(e) => setPharmacistUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={pharmacistPassword}
                      onChange={(e) => setPharmacistPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handlePharmacistLogin}>
                    Continue to MFA
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm">Multi-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Enter verification code</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mfa">Verification Code</Label>
                    <Input
                      id="mfa"
                      placeholder="000000"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      maxLength={6}
                      onKeyPress={(e) => e.key === 'Enter' && handleMFAVerification()}
                    />
                  </div>
                  <Button className="w-full" onClick={handleMFAVerification}>
                    Verify & Login
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowMFA(false)}>
                    Back
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
