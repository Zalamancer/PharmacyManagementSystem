import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';
import { Search, Package, AlertTriangle, ShoppingCart, TrendingDown } from 'lucide-react';
import { inventory } from '../../lib/mockData';
import { toast } from 'sonner';

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item =>
    item.drug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity < item.reorderLevel);
  const expiringSoon = inventory.filter(item => {
    const expiryDate = new Date(item.expiration);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const handleReorder = (item: any) => {
    const reorderQty = item.reorderLevel * 2;
    toast.success(`Reorder initiated for ${item.drug}`, {
      description: `Quantity: ${reorderQty} | Supplier: ${item.supplier}`,
    });
  };

  const getDaysUntilExpiry = (expirationDate: string) => {
    const expiry = new Date(expirationDate);
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringSoon.length > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {lowStockItems.length > 0 && (
                <p><strong>{lowStockItems.length} items</strong> below reorder level</p>
              )}
              {expiringSoon.length > 0 && (
                <p><strong>{expiringSoon.length} items</strong> expiring within 30 days</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Track stock levels, expiration dates, and supplier information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by drug name or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl">{inventory.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl">{lowStockItems.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl">{expiringSoon.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockPercentage = (item.quantity / item.reorderLevel) * 100;
                  const daysUntilExpiry = getDaysUntilExpiry(item.expiration);
                  const isLowStock = item.quantity < item.reorderLevel;
                  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

                  return (
                    <TableRow key={item.drug}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.drug}
                          {item.isControlled && (
                            <Badge variant="destructive" className="text-xs">
                              Controlled
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={isLowStock ? 'text-red-600' : ''}>
                              {item.quantity}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(stockPercentage, 100)} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>
                        <div>
                          <p>{new Date(item.expiration).toLocaleDateString()}</p>
                          {isExpiringSoon && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {daysUntilExpiry} days
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>${item.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant={isLowStock ? 'default' : 'outline'}
                          onClick={() => handleReorder(item)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Reorder
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
