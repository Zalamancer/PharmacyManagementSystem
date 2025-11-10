import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { Patient, medicationCatalog } from '../../lib/mockData';

interface SymptomQuestionnaireProps {
  patient: Patient;
  onComplete: (recommendations: any[]) => void;
  onSkip: () => void;
}

const commonSymptoms = [
  'Headache',
  'Fever',
  'Cough',
  'Allergies',
  'Stomach pain',
  'Diarrhea',
  'Muscle pain',
  'Insomnia',
  'Chest congestion',
  'Nausea',
];

export function SymptomQuestionnaire({ patient, onComplete, onSkip }: SymptomQuestionnaireProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const generateRecommendations = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const recommendations: any[] = [];
      
      // Map symptoms to medications
      const symptomMedicationMap: { [key: string]: string[] } = {
        'Headache': ['Ibuprofen', 'Acetaminophen', 'Aspirin'],
        'Fever': ['Acetaminophen', 'Ibuprofen'],
        'Cough': ['Guaifenesin', 'Dextromethorphan'],
        'Allergies': ['Loratadine', 'Cetirizine', 'Diphenhydramine'],
        'Stomach pain': ['Omeprazole'],
        'Diarrhea': ['Loperamide'],
        'Muscle pain': ['Ibuprofen', 'Acetaminophen'],
        'Insomnia': ['Diphenhydramine'],
        'Chest congestion': ['Guaifenesin'],
        'Nausea': ['Omeprazole'],
      };
      
      // Collect all recommended medications
      const recommendedMedNames = new Set<string>();
      selectedSymptoms.forEach(symptom => {
        const meds = symptomMedicationMap[symptom] || [];
        meds.forEach(med => recommendedMedNames.add(med));
      });
      
      // Find medications from catalog
      recommendedMedNames.forEach(medName => {
        const medication = medicationCatalog.find(m => m.name === medName);
        if (medication) {
          // Check against allergies
          const isAllergic = patient.allergies?.some(allergy => 
            medication.contraindications.some(contra => 
              contra.toLowerCase().includes(allergy.toLowerCase())
            )
          );
          
          // Check against previous feedback
          const previousUse = patient.prescriptions.find(rx => 
            rx.drug.includes(medication.name)
          );
          
          let aiReason = `Recommended for ${selectedSymptoms.join(', ').toLowerCase()}`;
          let confidence = 85;
          
          if (previousUse?.feedback) {
            if (previousUse.feedback.overallSatisfaction >= 4) {
              aiReason = `You've used ${medication.name} before with good results (${previousUse.feedback.overallSatisfaction}/5 satisfaction)`;
              confidence = 95;
            } else if (previousUse.feedback.overallSatisfaction <= 2) {
              confidence = 60;
              aiReason = `Alternative option - previous medication had side effects`;
            }
          }
          
          // Check against medical history
          if (patient.medicalHistory?.previousMedications.some(prev => 
            prev.includes(medication.name)
          )) {
            confidence += 5;
            aiReason += '. Previously used successfully.';
          }
          
          recommendations.push({
            medication,
            aiReason,
            confidence,
            isAllergic,
            previousFeedback: previousUse?.feedback,
          });
        }
      });
      
      // Sort by confidence
      recommendations.sort((a, b) => b.confidence - a.confidence);
      
      setIsAnalyzing(false);
      onComplete(recommendations);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>AI-Powered Symptom Assessment</CardTitle>
              <CardDescription>
                Tell us about your symptoms and we'll recommend the best medications for you
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Info Alert */}
          {patient.allergies && patient.allergies.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p>Your profile shows allergies to: <strong>{patient.allergies.join(', ')}</strong></p>
                <p className="text-xs mt-1">We'll avoid recommending medications with these ingredients</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Symptoms Selection */}
          <div className="space-y-3">
            <div>
              <h3>What symptoms are you experiencing?</h3>
              <p className="text-sm text-gray-600">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonSymptoms.map(symptom => (
                <label
                  key={symptom}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Checkbox
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                  />
                  <span className="text-sm">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <label htmlFor="additional-info">
              <h3>Additional Information (Optional)</h3>
              <p className="text-sm text-gray-600">
                Any other details that might help us recommend the right medication?
              </p>
            </label>
            <Textarea
              id="additional-info"
              placeholder="E.g., symptom severity, duration, other medications you're taking..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
            />
          </div>

          {/* Previous Medication Performance */}
          {patient.prescriptions.some(rx => rx.feedback) && (
            <div className="space-y-3">
              <h3>Your Medication History</h3>
              <div className="space-y-2">
                {patient.prescriptions
                  .filter(rx => rx.feedback)
                  .map(rx => (
                    <Card key={rx.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">{rx.drug}</p>
                            <p className="text-xs text-gray-600">
                              Satisfaction: {rx.feedback!.overallSatisfaction}/5 ⭐
                            </p>
                          </div>
                          {rx.feedback!.overallSatisfaction >= 4 ? (
                            <Badge variant="default">Worked Well</Badge>
                          ) : rx.feedback!.overallSatisfaction <= 2 ? (
                            <Badge variant="destructive">Had Issues</Badge>
                          ) : (
                            <Badge variant="secondary">Moderate</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={generateRecommendations}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get AI Recommendations
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={onSkip}>
              Skip & Browse Catalog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
