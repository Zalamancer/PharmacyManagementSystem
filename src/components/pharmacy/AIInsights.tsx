import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Info,
} from 'lucide-react';
import { patients } from '../../lib/mockData';

export function AIInsights() {
  // Analyze patient feedback
  const patientInsights = patients.map(patient => {
    const prescriptionsWithFeedback = patient.prescriptions.filter(rx => rx.feedback);
    
    const insights: any[] = [];
    
    prescriptionsWithFeedback.forEach(rx => {
      const feedback = rx.feedback!;
      
      // Low satisfaction - suggest alternative
      if (feedback.overallSatisfaction <= 2) {
        insights.push({
          type: 'concern',
          severity: 'high',
          patientName: patient.name,
          patientId: patient.id,
          currentMedication: rx.drug,
          issue: `Low satisfaction (${feedback.overallSatisfaction}/5)`,
          sideEffects: feedback.sideEffects,
          suggestion: generateAlternativeSuggestion(rx.drug, patient),
          confidence: 85,
        });
      }
      
      // Moderate satisfaction with side effects
      if (feedback.overallSatisfaction === 3 && feedback.sideEffects.length > 0) {
        insights.push({
          type: 'warning',
          severity: 'medium',
          patientName: patient.name,
          patientId: patient.id,
          currentMedication: rx.drug,
          issue: `Experiencing side effects: ${feedback.sideEffects.join(', ')}`,
          suggestion: generateDosageAdjustmentSuggestion(rx.drug, patient),
          confidence: 75,
        });
      }
      
      // High satisfaction - positive reinforcement
      if (feedback.overallSatisfaction >= 4 && feedback.sideEffects.length === 0) {
        insights.push({
          type: 'success',
          severity: 'low',
          patientName: patient.name,
          patientId: patient.id,
          currentMedication: rx.drug,
          issue: `Working well (${feedback.overallSatisfaction}/5)`,
          suggestion: 'Continue current treatment plan',
          confidence: 95,
        });
      }
    });
    
    return { patient, insights };
  }).filter(p => p.insights.length > 0);

  const allInsights = patientInsights.flatMap(p => p.insights);
  const concernCount = allInsights.filter(i => i.type === 'concern').length;
  const warningCount = allInsights.filter(i => i.type === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>AI-Powered Patient Insights</CardTitle>
              <CardDescription>
                Medication effectiveness analysis and recommendations based on patient feedback
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl">{concernCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Needs Attention</p>
                  <p className="text-2xl">{warningCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Doing Well</p>
                  <p className="text-2xl">
                    {allInsights.filter(i => i.type === 'success').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient-Specific Insights */}
      {patientInsights.map(({ patient, insights }) => (
        <Card key={patient.id}>
          <CardHeader>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription>
              Patient ID: {patient.id} | {insights.length} insight{insights.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <Card 
                key={index}
                className={
                  insight.type === 'concern' ? 'border-red-300 bg-red-50' :
                  insight.type === 'warning' ? 'border-orange-300 bg-orange-50' :
                  'border-green-300 bg-green-50'
                }
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {insight.type === 'concern' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {insight.type === 'warning' && <Info className="h-4 w-4 text-orange-600" />}
                          {insight.type === 'success' && <ThumbsUp className="h-4 w-4 text-green-600" />}
                          <h4 className="text-sm">{insight.currentMedication}</h4>
                        </div>
                        <p className="text-sm text-gray-700">{insight.issue}</p>
                      </div>
                      <Badge variant={
                        insight.type === 'concern' ? 'destructive' :
                        insight.type === 'warning' ? 'secondary' : 'default'
                      }>
                        {insight.severity === 'high' ? 'High Priority' :
                         insight.severity === 'medium' ? 'Medium' : 'Monitoring'}
                      </Badge>
                    </div>

                    {/* Side Effects */}
                    {insight.sideEffects && insight.sideEffects.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <ThumbsDown className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">Reported Side Effects:</p>
                          <p className="text-gray-800">{insight.sideEffects.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {/* AI Recommendation */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">AI Recommendation</span>
                        </div>
                        <span className="text-xs text-gray-600">{insight.confidence}% confidence</span>
                      </div>
                      <Progress value={insight.confidence} className="h-2" />
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <p className="text-sm">{insight.suggestion}</p>
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Patient History Context */}
                    {patient.medicalHistory && (
                      <div className="text-xs text-gray-600 pt-2 border-t">
                        <p>Chronic Conditions: {patient.medicalHistory.chronicConditions.join(', ')}</p>
                        {patient.allergies && patient.allergies.length > 0 && (
                          <p>Allergies: {patient.allergies.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}

      {patientInsights.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No patient feedback available yet</p>
            <p className="text-sm text-gray-500 mt-2">
              AI insights will appear here once patients provide medication feedback
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function generateAlternativeSuggestion(currentDrug: string, patient: any): string {
  const drugClass: { [key: string]: string[] } = {
    'Adderall': ['Consider Vyvanse 30mg or Strattera 40mg as alternatives for ADHD management'],
    'Metformin': ['Consider switching to Metformin ER (extended-release) to reduce GI side effects, or discuss Jardiance/Ozempic with prescriber'],
    'Lisinopril': ['Consider alternative ACE inhibitor (Enalapril) or ARB class (Losartan) if side effects persist'],
  };

  const baseDrug = currentDrug.split(' ')[0];
  return drugClass[baseDrug] || `Consult with prescriber about alternative medications in the same therapeutic class`;
}

function generateDosageAdjustmentSuggestion(currentDrug: string, patient: any): string {
  return `Consider dosage adjustment or timing modification. Recommend consultation with prescriber to optimize treatment while minimizing side effects.`;
}
