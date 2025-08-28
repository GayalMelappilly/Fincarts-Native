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
    { id: 1, name: "Freshwater Fish" },
    { id: 2, name: "Saltwater Fish" },
    { id: 3, name: "Tropical Fish" },
    { id: 4, name: "Cold Water Fish" },
    { id: 5, name: "Game Fish" },
    { id: 6, name: "Aquarium Fish" },
    { id: 7, name: "Commercial Fish" },
    { id: 8, name: "Endangered Fish" },
    { id: 9, name: "Cichlids" },
    { id: 10, name: "Tetras" },
    { id: 11, name: "Gouramis" },
    { id: 12, name: "Catfish" },
    { id: 13, name: "Livebearers" },
    { id: 14, name: "Barbs" },
    { id: 15, name: "Rainbowfish" },
    { id: 16, name: "Killifish" },
    { id: 17, name: "Pufferfish" },
    { id: 18, name: "Sturgeon" },
    { id: 19, name: "Reef Fish" },
    { id: 20, name: "Pelagic Fish" },
    { id: 21, name: "Bottom Dwellers" },
    { id: 22, name: "Sharks & Rays" },
    { id: 23, name: "Eels" },
    { id: 24, name: "Groupers" },
    { id: 25, name: "Snappers" },
    { id: 26, name: "Tuna" },
    { id: 27, name: "Marlin" },
    { id: 28, name: "Seahorses" },
    { id: 29, name: "Angelfish" },
    { id: 30, name: "Bettas" },
    { id: 31, name: "Discus" },
    { id: 32, name: "Guppies" },
    { id: 33, name: "Mollies" },
    { id: 34, name: "Platies" },
    { id: 35, name: "Swordtails" },
    { id: 36, name: "Rasboras" },
    { id: 37, name: "Loaches" },
    { id: 38, name: "Plecos" },
    { id: 39, name: "Goldfish" },
    { id: 40, name: "Koi" },
    { id: 41, name: "Trout" },
    { id: 42, name: "Salmon" },
    { id: 43, name: "Whitefish" },
    { id: 44, name: "Sticklebacks" },
    { id: 45, name: "Bitterling" },
    { id: 46, name: "African Cichlids" },
    { id: 47, name: "South American Cichlids" },
    { id: 48, name: "Dwarf Cichlids" },
    { id: 49, name: "Oscars" },
    { id: 50, name: "Clownfish" },
    { id: 51, name: "Tangs" },
    { id: 52, name: "Butterflyfish" },
    { id: 53, name: "Angelfish (Marine)" },
    { id: 54, name: "Wrasses" },
    { id: 55, name: "Bass" },
    { id: 56, name: "Trout (Game)" },
    { id: 57, name: "Salmon (Game)" },
    { id: 58, name: "Pike" },
    { id: 59, name: "Tarpon" },
    { id: 60, name: "Bonefish" },
    { id: 61, name: 'Arowana' }
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