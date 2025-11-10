import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShoppingCart as CartIcon, Trash2, Plus, Minus } from 'lucide-react';
import { MedicationCatalogItem } from '../../lib/mockData';

interface CartItem {
  medication: MedicationCatalogItem;
  quantity: number;
  dosage: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (medicationId: string, quantity: number) => void;
  onRemove: (medicationId: string) => void;
  onCheckout: () => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemove, onCheckout }: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.medication.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CartIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CartIcon className="h-5 w-5" />
          Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.medication.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm">{item.medication.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.dosage}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {item.medication.category}
                    </p>
                    <p className="text-sm">${item.medication.price} each</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.medication.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.medication.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm">
                      ${(item.medication.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(item.medication.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span>Total</span>
            <span className="text-xl">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout */}
        <Button className="w-full" size="lg" onClick={onCheckout}>
          Proceed to Checkout
        </Button>
        <p className="text-xs text-center text-gray-600">
          Prescription medications require verification before checkout
        </p>
      </CardContent>
    </Card>
  );
}
