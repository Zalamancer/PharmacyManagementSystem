'use client';

import { useState, useTransition } from 'react';
import { getPredictiveReordering } from '@/lib/actions';
import type { Inventory } from '@/lib/types';
import type { PredictReorderingOutput } from '@/ai/flows/predictive-reordering';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Sparkles, AlertTriangle } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function InventoryClient({ initialInventory }: { initialInventory: Inventory }) {
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<PredictReorderingOutput | null>(null);
  const { toast } = useToast();

  const handlePredictReordering = () => {
    startTransition(async () => {
      const result = await getPredictiveReordering();
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setPrediction(null);
      } else {
        setPrediction(result);
        toast({
          title: 'Success',
          description: 'AI-powered reordering predictions generated.',
        });
      }
    });
  };

  const inventoryArray = Object.entries(initialInventory).sort((a,b) => a[0].localeCompare(b[0]));

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Drug Inventory</CardTitle>
          <CardDescription>
            Current stock levels and expiration dates for all drugs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryArray.map(([name, item]) => {
                const isExpired = isPast(new Date(item.expiration));
                const isLowStock = item.quantity < item.lowStockThreshold;
                return (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>{isExpired ? 0 : item.quantity}</TableCell>
                    <TableCell>
                      {format(new Date(item.expiration), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      {isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : isLowStock ? (
                        <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-accent/50 text-accent-foreground/80">In Stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Predictive Reordering
            </CardTitle>
            <CardDescription>
              Use AI to predict reordering needs based on current inventory and patient prescriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePredictReordering} disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Run Prediction'
              )}
            </Button>
            {prediction && (
              <Accordion type="single" collapsible className="w-full mt-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>View AI Recommendations</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {Object.entries(prediction)
                        .filter(([, details]) => details.reorderQuantity > 0)
                        .map(([drug, details]) => (
                          <Alert key={drug}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Reorder {drug}</AlertTitle>
                            <AlertDescription>
                              Quantity: {details.reorderQuantity}. <br />
                              Reason: {details.reason}
                            </AlertDescription>
                          </Alert>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
