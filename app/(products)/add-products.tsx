import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import AddProductScreen from '@/components/Products/AddProducts';
import { TopFishListing, useAuth } from '@/context/AuthContext';
import { useLocalSearchParams } from 'expo-router';

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
  const [products, setProducts] = useState<TopFishListing[]>([]);
  const [editableProduct, setEditableProduct] = useState<TopFishListing | null>(null);
  const [view, setView] = useState<FishProductView>('add');
  const [loading, setLoading] = useState(false);

  const { sellerData } = useAuth()

  // Mock categories data - replace with actual API call
  const [categories] = useState([
    { id: 1, name: "Acara" },
    { id: 2, name: "Algae Eater" },
    { id: 3, name: "Angelfish" },
    { id: 4, name: "Barb" },
    { id: 5, name: "Bass" },
    { id: 6, name: "Bettas (Fighter Fish)" },
    { id: 7, name: "Carp" },
    { id: 8, name: "Catfish" },
    { id: 9, name: "Corydora" },
    { id: 10, name: "Danio" },
    { id: 11, name: "Discus" },
    { id: 12, name: "Flowerhorn" },
    { id: 13, name: "Goldfish" },
    { id: 14, name: "Gourami" },
    { id: 15, name: "Guppy" },
    { id: 16, name: "Jewelfish" },
    { id: 17, name: "Koi" },
    { id: 18, name: "Loach" },
    { id: 19, name: "Minnow" },
    { id: 20, name: "Molly" },
    { id: 21, name: "Nutter" },
    { id: 22, name: "Oranda" },
    { id: 23, name: "Oscar" },
    { id: 24, name: "Platy" },
    { id: 25, name: "Pleco (Sucker Fish)" },
    { id: 26, name: "Polar Parrot" },
    { id: 27, name: "Shark" },
    { id: 28, name: "Snakehead" },
    { id: 29, name: "Swordtail" },
    { id: 30, name: "Tetra" },
    { id: 31, name: "Tilapia" },
    { id: 32, name: "Zebra" },

    // 🌊 Marine
    { id: 33, name: "Clownfish" },
    { id: 34, name: "Eels" },
    { id: 35, name: "Goby" },
    { id: 36, name: "Tang" },
    { id: 37, name: "Wrasse" },

    // 🐉 Monster
    { id: 38, name: "Arowana" },
    { id: 39, name: "Gar" },
    { id: 40, name: "Senegal" },

    // 🦞 Invertebrates
    { id: 41, name: "Lobster" },
    { id: 42, name: "Shrimps" }
  ]);

  const params = useLocalSearchParams()

  // Initialize a new product when component mounts
  useEffect(() => {
    console.log("REACHED : ", view)
    if (!editableProduct && view === 'add') {
      const newProduct = {
        id: ``,
        name: '',
        description: '',
        price: 0,
        quantityAvailable: 0,
        category: '',
        images: [],
        isFeatured: false,
        listingStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        age: '',
        size: '',
        color: '',
        breed: '',
        careInstructions: {
          'Tank Size': '',
          'Water Temperature': '',
          'pH Level': '',
        },
        dietaryRequirements: {
          'Food Type': '',
          'Feeding Frequency': '',
        },
        viewCount: 0,
        reviewCount: 0,
        stock: 0
      };
      setEditableProduct(newProduct as TopFishListing);
    }
    else if (view === 'edit') {
      const fishDetails = sellerData?.topFishListings.find((item) => item.id === params.id as string)
      console.log("The details of product to edit : ", fishDetails)
      if (fishDetails) {
        const newProduct = {
          id: fishDetails.id,
          name: fishDetails.name,
          description: fishDetails.description,
          price: fishDetails.price,
          quantityAvailable: fishDetails.stock,
          category: fishDetails.category,
          images: fishDetails.images,
          isFeatured: fishDetails.isFeatured,
          listingStatus: fishDetails.listingStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          age: fishDetails.age,
          size: fishDetails.size,
          color: fishDetails.color,
          breed: fishDetails.breed,
          careInstructions: fishDetails.careInstructions,
          dietaryRequirements: fishDetails.dietaryRequirements,
          viewCount: fishDetails.viewCount,
        };
        setEditableProduct(newProduct as TopFishListing);
      }
    }
  }, [view]);

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
  const handleProductUpdate = (updatedProducts: TopFishListing[]) => {
    setProducts(updatedProducts);
    console.log('Products updated:', updatedProducts);
  };

  // Handle editable product changes
  const handleEditableProductChange = (product: TopFishListing | null) => {
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