import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Sparkles, 
  AlertTriangle, 
  ShoppingCart, 
  Info,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { Patient } from '../../lib/mockData';

interface AIRecommendationsProps {
  patient: Patient;
  recommendations: any[];
  onAddToCart: (medication: any) => void;
  onBrowseCatalog: () => void;
}

export function AIRecommendations({ 
  patient, 
  recommendations, 
  onAddToCart,
  onBrowseCatalog 
}: AIRecommendationsProps) {
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  const handleAddToCart = (medication: any) => {
    setAddedToCart(prev => new Set(prev).add(medication.id));
    onAddToCart(medication);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle>Your Personalized Recommendations</CardTitle>
              <CardDescription>
                AI-powered suggestions based on your symptoms, medical history, and past experiences
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onBrowseCatalog}>
              Browse All Medications
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Card 
            key={rec.medication.id}
            className={rec.isAllergic ? 'border-red-300 bg-red-50' : ''}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {index === 0 && !rec.isAllergic && (
                        <Badge variant="default" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Top Pick
                        </Badge>
                      )}
                      <h3>{rec.medication.name}</h3>
                      <Badge variant="outline">{rec.medication.category}</Badge>
                      {!rec.medication.requiresPrescription && (
                        <Badge variant="secondary">OTC</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{rec.medication.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Starting at</p>
                    <p className="text-2xl">${rec.medication.price}</p>
                  </div>
                </div>

                {/* Allergy Warning */}
                {rec.isAllergic && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>⚠️ Allergy Warning:</strong> This medication may contain ingredients 
                      you're allergic to ({patient.allergies?.join(', ')}). Please consult your doctor.
                    </AlertDescription>
                  </Alert>
                )}

                {/* AI Confidence & Reasoning */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">AI Confidence Score</span>
                    </div>
                    <span className="text-sm">{rec.confidence}%</span>
                  </div>
                  <Progress value={rec.confidence} className="h-2" />
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>{rec.aiReason}</span>
                  </p>
                </div>

                {/* Previous Feedback */}
                {rec.previousFeedback && (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="text-sm mb-2">Your Previous Experience</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Effectiveness</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < rec.previousFeedback.effectiveness ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Overall Satisfaction</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < rec.previousFeedback.overallSatisfaction ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {rec.previousFeedback.sideEffects.length > 0 && (
                        <p className="text-xs text-gray-600 mt-2">
                          Side effects experienced: {rec.previousFeedback.sideEffects.join(', ')}
                        </p>
                      )}
                      {rec.previousFeedback.comments && (
                        <p className="text-xs text-gray-700 mt-2 italic">
                          "{rec.previousFeedback.comments}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Medication Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Common Uses</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.medication.commonUses.map((use: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Available Dosages</p>
                    <p>{rec.medication.dosages.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Possible Side Effects</p>
                    <p className="text-xs text-gray-700">
                      {rec.medication.sideEffects.slice(0, 2).join(', ')}
                      {rec.medication.sideEffects.length > 2 && '...'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(rec.medication)}
                    disabled={rec.isAllergic || addedToCart.has(rec.medication.id)}
                  >
                    {addedToCart.has(rec.medication.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Browse All */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Can't find what you're looking for?</h3>
              <p className="text-sm text-gray-600">Browse our complete medication catalog</p>
            </div>
            <Button variant="outline" onClick={onBrowseCatalog}>
              Browse Catalog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
