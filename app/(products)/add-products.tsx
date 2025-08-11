import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import AddProductScreen from '@/components/Products/AddProducts';

// Import or define the FishProduct interface
export interface FishProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity_available: number;
  category: string | null;
  images: string[];
  is_featured: boolean;
  listing_status: 'active' | 'draft' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  age?: string;
  size?: string;
  color?: string;
  breed?: string;
  care_instructions: Record<string, string>;
  dietary_requirements: Record<string, string>;
  view_count?: number;
  fish_categories?: { id: string, name: string };
}

export type FishProductView = 'list' | 'add' | 'edit' | 'view';

const AddProducts = () => {
  // State management for products
  const [products, setProducts] = useState<FishProduct[]>([]);
  const [editableProduct, setEditableProduct] = useState<FishProduct | null>(null);
  const [view, setView] = useState<FishProductView>('add');
  const [loading, setLoading] = useState(false);

  // Mock categories data - replace with actual API call
  const [categories] = useState([
    { id: 1, name: 'Tropical Fish' },
    { id: 2, name: 'Goldfish' },
    { id: 3, name: 'Angelfish' },
    { id: 4, name: 'Betta Fish' },
    { id: 5, name: 'Guppy' },
    { id: 6, name: 'Tetra' },
    { id: 7, name: 'Cichlid' },
    { id: 8, name: 'Marine Fish' },
    { id: 9, name: 'Koi Fish' },
    { id: 10, name: 'Catfish' },
  ]);

  // Initialize a new product when component mounts
  useEffect(() => {
    if (!editableProduct && view === 'add') {
      const newProduct: FishProduct = {
        id: `fish_${Date.now()}`,
        name: '',
        description: '',
        price: 0,
        quantity_available: 0,
        category: null,
        images: [],
        is_featured: false,
        listing_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        age: '',
        size: '',
        color: '',
        breed: '',
        care_instructions: {
          'Tank Size': '',
          'Water Temperature': '',
          'pH Level': '',
        },
        dietary_requirements: {
          'Food Type': '',
          'Feeding Frequency': '',
        },
        view_count: 0,
      };
      setEditableProduct(newProduct);
    }
  }, [view, editableProduct]);

  // Mock refetch function - replace with actual API call
  const refetch = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically fetch updated products from your API
      console.log('Refetching products...');
      
      setLoading(false);
    } catch (error) {
      console.error('Error refetching products:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to refresh products');
    }
  };

  // Handle navigation back to list (if needed)
  const handleBackToList = () => {
    setView('list');
    setEditableProduct(null);
  };

  // Handle product updates
  const handleProductUpdate = (updatedProducts: FishProduct[]) => {
    setProducts(updatedProducts);
    console.log('Products updated:', updatedProducts);
  };

  // Handle editable product changes
  const handleEditableProductChange = (product: FishProduct | null) => {
    setEditableProduct(product);
    if (product) {
      console.log('Editing product:', product);
    }
  };

  // Handle view changes
  const handleViewChange = (newView: FishProductView) => {
    setView(newView);
    console.log('View changed to:', newView);
  };

  // Handle loading state
  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <View className="flex-1">
      <AddProductScreen
        products={products}
        setProducts={handleProductUpdate}
        editableProduct={editableProduct}
        setEditableProduct={handleEditableProductChange}
        view={view}
        setView={handleViewChange}
        categories={categories}
        refetch={refetch}
        setLoading={handleLoadingChange}
      />
    </View>
  );
};

export default AddProducts;