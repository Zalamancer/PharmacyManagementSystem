import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, ShoppingCart, CheckCircle, Filter } from 'lucide-react';
import { medicationCatalog } from '../../lib/mockData';

interface MedicationCatalogProps {
  onAddToCart: (medication: any) => void;
  cart: Set<string>;
}

export function MedicationCatalog({ onAddToCart, cart }: MedicationCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = Array.from(new Set(medicationCatalog.map(m => m.category)));

  const filteredMedications = medicationCatalog
    .filter(med => {
      const matchesSearch = 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.commonUses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || med.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medication Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medications, symptoms, or uses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600">
            Showing {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Medication Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedications.map(medication => (
          <Card key={medication.id} className="flex flex-col">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="flex-1">{medication.name}</h3>
                  <Badge variant="outline">{medication.category}</Badge>
                </div>
                <p className="text-sm text-gray-600">{medication.description}</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Common Uses */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Common Uses:</p>
                  <div className="flex flex-wrap gap-1">
                    {medication.commonUses.slice(0, 3).map((use, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dosages */}
                <div>
                  <p className="text-xs text-gray-600">Available: {medication.dosages.join(', ')}</p>
                </div>

                {/* Prescription Status */}
                <div>
                  {medication.requiresPrescription ? (
                    <Badge variant="outline">Prescription Required</Badge>
                  ) : (
                    <Badge variant="default">Over-the-Counter</Badge>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-2xl">${medication.price}</p>
                  {!medication.requiresPrescription && (
                    <p className="text-xs text-gray-600">No Rx needed</p>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => onAddToCart(medication)}
                  disabled={cart.has(medication.id)}
                >
                  {cart.has(medication.id) ? (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">No medications found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
