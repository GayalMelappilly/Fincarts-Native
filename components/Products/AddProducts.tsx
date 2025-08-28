import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '@/utils/cloudinary/upload';
import { useMutation } from '@tanstack/react-query';
import { addProduct, editProduct } from '@/services/productServices';
import { router, useLocalSearchParams } from 'expo-router';
import { Business, TopFishListing, useAuth } from '@/context/AuthContext';

// Updated types based on fish_listings schema
// export interface FishProduct {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   quantity_available: number;
//   category: string | null;
//   images: string[];
//   is_featured: boolean;
//   listing_status: 'active' | 'draft' | 'out_of_stock';
//   created_at: string;
//   updated_at: string;
//   age?: string;
//   size?: string;
//   color?: string;
//   breed?: string;
//   care_instructions: Record<string, string>;
//   dietary_requirements: Record<string, string>;
//   view_count?: number;
//   fish_categories?: { id: string, name: string };
// }

export type FishProductView = 'list' | 'add' | 'edit' | 'view';

interface Props {
  products: TopFishListing[] | undefined;
  setProducts: (products: TopFishListing[]) => void;
  editableProduct: TopFishListing | null;
  setEditableProduct: (editableProduct: TopFishListing | null) => void;
  view: FishProductView;
  setView: (view: FishProductView) => void;
  categories: { id: number; name: string }[];
  refetch: () => void;
  setLoading: (loading: boolean) => void;
}

// Move FormInputProps outside the component
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  required?: boolean;
  error?: string;
  leftIcon?: string;
}

// Move FormInput component outside and memoize it
const FormInput: React.FC<FormInputProps> = React.memo(({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  required = false,
  error,
  leftIcon
}) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-gray-700 mb-2">
      {label}{required && <Text className="text-red-500 ml-1">*</Text>}
    </Text>
    <View className="relative">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        className={`bg-gray-50 border rounded-2xl px-4 py-4 text-gray-900 text-base ${leftIcon ? 'pl-12' : ''
          } ${error ? 'border-red-300' : 'border-gray-200'} ${multiline ? 'h-24 text-top' : 'h-14'
          }`}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {leftIcon && (
        <View className="absolute left-4 top-4">
          <Ionicons name={leftIcon as any} size={20} color="#6B7280" />
        </View>
      )}
    </View>
    {error && (
      <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
    )}
  </View>
));

// Memoize CategoryModal component
const CategoryModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  categories: { id: number; name: string }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}> = React.memo(({ visible, onClose, categories, selectedCategory, onSelectCategory }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl max-h-96">
        <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-900">Select Category</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView className="max-h-80">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="flex-row items-center p-4 border-b border-gray-50"
              onPress={() => {
                onSelectCategory(category.name);
                onClose();
              }}
            >
              <View className="bg-blue-50 p-2 rounded-full mr-3">
                <Ionicons name="fish" size={20} color="#2563EB" />
              </View>
              <Text className="flex-1 text-gray-900 font-medium">{category.name}</Text>
              {selectedCategory === category.name && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
));

// Memoize StatusModal component
const StatusModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  selectedStatus: 'active' | 'draft' | 'out_of_stock';
  onSelectStatus: (status: 'active' | 'draft' | 'out_of_stock') => void;
}> = React.memo(({ visible, onClose, selectedStatus, onSelectStatus }) => {
  const statusOptions = [
    { value: 'active' as const, label: 'Active', color: '#10B981', icon: 'checkmark-circle' as const },
    { value: 'draft' as const, label: 'Draft', color: '#6B7280', icon: 'document-text' as const },
    { value: 'out_of_stock' as const, label: 'Out of Stock', color: '#EF4444', icon: 'ban' as const },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Listing Status</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.value}
                className="flex-row items-center p-4 rounded-xl mb-2"
                style={{ backgroundColor: selectedStatus === status.value ? `${status.color}15` : 'transparent' }}
                onPress={() => {
                  onSelectStatus(status.value);
                  onClose();
                }}
              >
                <View className="p-2 rounded-full mr-4" style={{ backgroundColor: `${status.color}20` }}>
                  <Ionicons name={status.icon as any} size={20} color={status.color} />
                </View>
                <Text className="flex-1 text-gray-900 font-medium">{status.label}</Text>
                {selectedStatus === status.value && (
                  <Ionicons name="checkmark-circle" size={24} color={status.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
});

const AddProductForm: React.FC<Props> = ({
  products,
  setProducts,
  editableProduct,
  setEditableProduct,
  view,
  setView,
  categories,
  refetch,
  setLoading
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const params = useLocalSearchParams()
  if (params.viewStatus === "add") {
    setView('add')
  } else if (params.viewStatus === "edit") {
    setView('edit')
  }

  const { sellerData, setSellerData } = useAuth()

  const screenWidth = Dimensions.get('window').width;

  // Status options memoized
  const statusOptions = useMemo(() => [
    { value: 'active' as const, label: 'Active', color: '#10B981', icon: 'checkmark-circle' as const },
    { value: 'draft' as const, label: 'Draft', color: '#6B7280', icon: 'document-text' as const },
    { value: 'out_of_stock' as const, label: 'Out of Stock', color: '#EF4444', icon: 'ban' as const },
  ], []);

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (err) => {
      console.log('Add product error : ', err)
    }
  })

  const editMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: (data) => {
      console.log(data);

      setSellerData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          topFishListings: prev.topFishListings.map((item) =>
            item.id === (params.id as string) ? (editableProduct as TopFishListing) : item
          ),
        };
      });

      router.push("/edit-products");
    },
    onError: (err) => {
      console.log("Edit product error : ", err);
    },
  });

  // Helper function to convert image to base64
  const convertImageToBase64 = useCallback(async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }, []);

  // Updated handleImageUpload function - MOVED BEFORE showImageSourceOptions
  const handleImageUpload = useCallback(async (source: 'camera' | 'library' = 'library'): Promise<void> => {
    if (!editableProduct) return;

    try {
      // Request permissions first
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (source === 'camera' && cameraStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to camera.');
        return;
      }

      if (source === 'library' && libraryStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to photo library.');
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        })
        : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);

        try {
          // Convert image to base64
          const base64Image = await convertImageToBase64(result.assets[0].uri);
          const url = await uploadToCloudinary(base64Image);

          if (url) {
            setEditableProduct({
              ...editableProduct,
              images: [...editableProduct.images, url]
            });
            Alert.alert('Success', 'Image uploaded successfully!');
          } else {
            throw new Error('Failed to get image URL from server');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [editableProduct, setEditableProduct, convertImageToBase64]);

  // Show image source options - NOW handleImageUpload is defined
  const showImageSourceOptions = useCallback((): void => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to add an image',
      [
        {
          text: 'Camera',
          onPress: () => handleImageUpload('camera'),
        },
        {
          text: 'Photo Library',
          onPress: () => handleImageUpload('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, [handleImageUpload]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!editableProduct?.name?.trim()) {
      errors.name = 'Fish name is required';
    }
    if (!editableProduct?.description?.trim()) {
      errors.description = 'Description is required';
    }
    if (!editableProduct?.price || editableProduct.price <= 0) {
      errors.price = 'Valid price is required';
    }
    if (!editableProduct?.quantityAvailable || editableProduct.quantityAvailable < 0) {
      errors.quantity_available = 'Valid quantity is required';
    }
    if (!editableProduct?.category) {
      errors.category = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editableProduct]);

  // Handle form submission
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!editableProduct || !validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    try {
      setLoading(true);

      if (view === 'add') {
        if (products && products?.length > 0) {
          setProducts([...products, editableProduct]);
        } else {
          setProducts([editableProduct]);
        }
        console.log('Product details : ', editableProduct);
        addMutation.mutate(editableProduct)
        Alert.alert('Success', 'Product added successfully!');
      } else {
        setProducts([editableProduct]);
        editMutation.mutate(editableProduct)
        Alert.alert('Success', 'Product updated successfully!');
      }

      setEditableProduct(null);
      setView('list');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [editableProduct, validateForm, view, products, setProducts, setEditableProduct, setView, setLoading]);

  // Handle input changes with useCallback
  const handleInputChange = useCallback((field: keyof TopFishListing, value: any): void => {
    if (!editableProduct) return;

    setEditableProduct({
      ...editableProduct,
      [field]: value
    });

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [editableProduct, formErrors, setEditableProduct]);

  // Handle care instructions
  const handleCareInstructionChange = useCallback((key: string, value: string): void => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      careInstructions: {
        ...editableProduct.careInstructions,
        [key]: value
      }
    });
  }, [editableProduct, setEditableProduct]);

  const addCareInstruction = useCallback((): void => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      careInstructions: {
        ...editableProduct.careInstructions,
        '': ''
      }
    });
  }, [editableProduct, setEditableProduct]);

  const removeCareInstruction = useCallback((key: string): void => {
    if (!editableProduct) return;
    const newInstructions = { ...editableProduct.careInstructions };
    delete newInstructions[key];
    setEditableProduct({
      ...editableProduct,
      careInstructions: newInstructions
    });
  }, [editableProduct, setEditableProduct]);

  // Handle dietary requirements
  const handleDietaryRequirementChange = useCallback((key: string, value: string): void => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      dietaryRequirements: {
        ...editableProduct.dietaryRequirements,
        [key]: value
      }
    });
  }, [editableProduct, setEditableProduct]);

  const addDietaryRequirement = useCallback((): void => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      dietaryRequirements: {
        ...editableProduct.dietaryRequirements,
        '': ''
      }
    });
  }, [editableProduct, setEditableProduct]);

  const removeDietaryRequirement = useCallback((key: string): void => {
    if (!editableProduct) return;
    const newRequirements = { ...editableProduct.dietaryRequirements };
    delete newRequirements[key];
    setEditableProduct({
      ...editableProduct,
      dietaryRequirements: newRequirements
    });
  }, [editableProduct, setEditableProduct]);

  // Remove image
  const handleRemoveImage = useCallback((index: number): void => {
    if (!editableProduct) return;
    const newImages = [...editableProduct.images];
    newImages.splice(index, 1);
    setEditableProduct({
      ...editableProduct,
      images: newImages
    });
  }, [editableProduct, setEditableProduct]);

  // Navigation handlers
  const handleGoBack = useCallback(() => {
    setEditableProduct(null);
    if(view == 'edit'){
      setView('list')
      router.push(`/edit-products`)
    }else if(view == 'add'){
      setView('list')
      router.push(`/products`)
    }
  }, [setEditableProduct, setView]);

  const handleCategoryModalClose = useCallback(() => {
    setShowCategoryModal(false);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    handleInputChange('category', category);
  }, [handleInputChange]);

  const handleStatusModalClose = useCallback(() => {
    setShowStatusModal(false);
  }, []);

  const handleStatusSelect = useCallback((status: 'active' | 'draft' | 'out_of_stock') => {
    handleInputChange('listingStatus', status);
  }, [handleInputChange]);

  // Memoized current status option
  const currentStatusOption = useMemo(() => {
    return statusOptions.find(s => s.value === editableProduct?.listingStatus);
  }, [statusOptions, editableProduct?.listingStatus]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-100">
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleGoBack}
                className="mr-4 p-2"
              >
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  {view === 'add' ? 'Add New Fish' : 'Edit Fish'}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Fill in the details below
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View className="p-6">
            {/* Basic Information Section */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center mb-6">
                <View className="bg-blue-50 p-3 rounded-full mr-4">
                  <Ionicons name="information-circle" size={24} color="#2563EB" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Basic Information</Text>
              </View>

              <FormInput
                label="Fish Name"
                value={editableProduct?.name || ''}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter fish name"
                required
                error={formErrors.name}
              />

              <FormInput
                label="Description"
                value={editableProduct?.description || ''}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Describe your fish..."
                multiline
                required
                error={formErrors.description}
              />

              <View className="flex-row space-x-4 gap-3">
                <View className="flex-1">
                  <FormInput
                    label="Price (₹)"
                    value={editableProduct?.price?.toString() || ''}
                    onChangeText={(text) => handleInputChange('price', parseFloat(text) || 0)}
                    placeholder="0.00"
                    keyboardType="numeric"
                    required
                    error={formErrors.price}
                    leftIcon="pricetag"
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    label="Quantity"
                    value={editableProduct?.quantityAvailable?.toString() || ''}
                    onChangeText={(text) => handleInputChange('quantityAvailable', parseInt(text) || 0)}
                    placeholder="0"
                    keyboardType="numeric"
                    required
                    error={formErrors.quantity_available}
                  />
                </View>
              </View>

              {/* Category Selection */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Category<Text className="text-red-500 ml-1">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCategoryModal(true)}
                  className={`bg-gray-50 border rounded-2xl px-4 py-4 flex-row items-center justify-between ${formErrors.category ? 'border-red-300' : 'border-gray-200'
                    }`}
                >
                  <Text className={`text-base ${editableProduct?.category ? 'text-gray-900' : 'text-gray-400'}`}>
                    {editableProduct?.category || 'Select category'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
                {formErrors.category && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">{formErrors.category}</Text>
                )}
              </View>

              {/* Status Selection */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Listing Status</Text>
                <TouchableOpacity
                  onPress={() => setShowStatusModal(true)}
                  className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    {currentStatusOption && (
                      <>
                        <Ionicons
                          name={currentStatusOption.icon as any}
                          size={20}
                          color={currentStatusOption.color}
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-base text-gray-900">
                          {currentStatusOption.label}
                        </Text>
                      </>
                    )}
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Featured Toggle */}
              <View className="flex-row items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <View className="flex-row items-center flex-1">
                  <View className="bg-amber-100 p-2 rounded-full mr-3">
                    <Ionicons name="star" size={20} color="#F59E0B" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold">Featured Product</Text>
                    <Text className="text-gray-600 text-sm">Show on homepage</Text>
                  </View>
                </View>
                <Switch
                  value={editableProduct?.isFeatured || false}
                  onValueChange={(value) => handleInputChange('isFeatured', value)}
                  trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                  thumbColor={editableProduct?.isFeatured ? '#F59E0B' : '#9CA3AF'}
                />
              </View>
            </View>

            {/* Fish Characteristics Section */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center mb-6">
                <View className="bg-green-50 p-3 rounded-full mr-4">
                  <Ionicons name="fish" size={24} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-gray-900">Fish Characteristics</Text>
              </View>

              <View className="flex-row space-x-4 mb-4 gap-2">
                <View className="flex-1">
                  <FormInput
                    label="Breed/Species"
                    value={editableProduct?.breed || ''}
                    onChangeText={(text) => handleInputChange('breed', text)}
                    placeholder="e.g., Angelfish"
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    label="Age"
                    value={editableProduct?.age || ''}
                    onChangeText={(text) => handleInputChange('age', text)}
                    placeholder="e.g., 6 months"
                  />
                </View>
              </View>

              <View className="flex-row space-x-4 gap-2">
                <View className="flex-1">
                  <FormInput
                    label="Size"
                    value={editableProduct?.size || ''}
                    onChangeText={(text) => handleInputChange('size', text)}
                    placeholder="e.g., 2 inches"
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    label="Color"
                    value={editableProduct?.color || ''}
                    onChangeText={(text) => handleInputChange('color', text)}
                    placeholder="e.g., Silver"
                  />
                </View>
              </View>
            </View>

            {/* Images Section */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="bg-purple-50 p-3 rounded-full mr-4">
                    <Ionicons name="images" size={24} color="#8B5CF6" />
                  </View>
                  <Text className="text-xl font-bold text-gray-900">Fish Images</Text>
                </View>
                <TouchableOpacity
                  onPress={showImageSourceOptions}
                  className="bg-purple-50 px-4 py-2 rounded-xl"
                  disabled={uploading}
                >
                  <Text className="text-purple-700 font-semibold">Add Image</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap">
                {editableProduct?.images?.map((image, index) => (
                  <View key={`image-${index}`} className="w-1/3 p-1">
                    <View className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                      <TouchableOpacity
                        onPress={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {uploading && (
                  <View className="w-1/3 p-1">
                    <View className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center">
                      <ActivityIndicator size="small" color="#8B5CF6" />
                      <Text className="text-xs text-gray-500 mt-2">Uploading...</Text>
                    </View>
                  </View>
                )}

                {(!editableProduct?.images || editableProduct.images.length < 6) && !uploading && (
                  <TouchableOpacity
                    onPress={showImageSourceOptions}
                    className="w-1/3 p-1"
                  >
                    <View className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center">
                      <Ionicons name="camera" size={32} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500 mt-2">Add Image</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-xs text-gray-500 mt-4">
                Upload high-quality images. First image will be the main display image.
              </Text>
            </View>

            {/* Care Instructions Section */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="bg-blue-50 p-3 rounded-full mr-4">
                    <Ionicons name="medical" size={24} color="#2563EB" />
                  </View>
                  <Text className="text-xl font-bold text-gray-900">Care Instructions</Text>
                </View>
                <TouchableOpacity
                  onPress={addCareInstruction}
                  className="bg-blue-50 px-4 py-2 rounded-xl"
                >
                  <Text className="text-blue-700 font-semibold">Add</Text>
                </TouchableOpacity>
              </View>

              {Object.entries(editableProduct?.careInstructions || {}).map(([key, value], index) => (
                <View key={`care-${index}`} className="flex-row items-center mb-4 space-x-2 gap-2">
                  <TextInput
                    placeholder="Topic (e.g., Tank Size)"
                    value={key}
                    onChangeText={(newKey) => {
                      if (!editableProduct) return;
                      const newInstructions = { ...editableProduct.careInstructions };
                      delete newInstructions[key];
                      newInstructions[newKey] = value;
                      setEditableProduct({
                        ...editableProduct,
                        careInstructions: newInstructions
                      });
                    }}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  />
                  <TextInput
                    placeholder="Instructions"
                    value={value}
                    onChangeText={(text) => handleCareInstructionChange(key, text)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={() => removeCareInstruction(key)}
                    className="bg-red-50 p-3 rounded-xl"
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Dietary Requirements Section */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="bg-orange-50 p-3 rounded-full mr-4">
                    <Ionicons name="restaurant" size={24} color="#EA580C" />
                  </View>
                  <Text className="text-xl font-bold text-gray-900">Dietary Requirements</Text>
                </View>
                <TouchableOpacity
                  onPress={addDietaryRequirement}
                  className="bg-orange-50 px-4 py-2 rounded-xl"
                >
                  <Text className="text-orange-700 font-semibold">Add</Text>
                </TouchableOpacity>
              </View>

              {Object.entries(editableProduct?.dietaryRequirements || {}).map(([key, value], index) => (
                <View key={`dietary-${index}`} className="flex-row items-center mb-4 space-x-2 gap-2">
                  <TextInput
                    placeholder="Type (e.g., Food Type)"
                    value={key}
                    onChangeText={(newKey) => {
                      if (!editableProduct) return;
                      const newRequirements = { ...editableProduct.dietaryRequirements };
                      delete newRequirements[key];
                      newRequirements[newKey] = value;
                      setEditableProduct({
                        ...editableProduct,
                        dietaryRequirements: newRequirements
                      });
                    }}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  />
                  <TextInput
                    placeholder="Details"
                    value={value}
                    onChangeText={(text) => handleDietaryRequirementChange(key, text)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={() => removeDietaryRequirement(key)}
                    className="bg-red-50 p-3 rounded-xl"
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="bg-white border-t border-gray-100 px-6 py-4">
          <View className="flex-row space-x-3 gap-3">
            <TouchableOpacity
              onPress={handleGoBack}
              className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
            >
              <Text className="text-gray-700 font-semibold text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 bg-blue-600 py-4 rounded-2xl items-center"
            >
              <Text className="text-white font-bold text-base">
                {view === 'add' ? 'Add Fish Listing' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modals */}
        <CategoryModal
          visible={showCategoryModal}
          onClose={handleCategoryModalClose}
          categories={categories}
          selectedCategory={editableProduct?.category || null}
          onSelectCategory={handleCategorySelect}
        />
        <StatusModal
          visible={showStatusModal}
          onClose={handleStatusModalClose}
          selectedStatus={editableProduct?.listingStatus || 'active'}
          onSelectStatus={handleStatusSelect}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProductForm;
