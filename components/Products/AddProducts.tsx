import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Updated types based on fish_listings schema
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
  fish_categories?: { id: string, name: string }
}

export type FishProductView = 'list' | 'add' | 'edit' | 'view';

interface Props {
  products: FishProduct[] | undefined;
  setProducts: (products: FishProduct[]) => void;
  editableProduct: FishProduct | null;
  setEditableProduct: (editableProduct: FishProduct | null) => void;
  view: FishProductView;
  setView: (view: FishProductView) => void;
  categories: { id: number; name: string }[];
  refetch: () => void;
  setLoading: (loading: boolean) => void;
}

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

  const screenWidth = Dimensions.get('window').width;

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active', color: '#10B981', icon: 'checkmark-circle' },
    { value: 'draft', label: 'Draft', color: '#6B7280', icon: 'document-text' },
    { value: 'out_of_stock', label: 'Out of Stock', color: '#EF4444', icon: 'ban' },
  ];

  useEffect(() => {
    console.log('Edit products while editing:', editableProduct);
  }, []);

  // Validation function
  const validateForm = (): boolean => {
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
    if (!editableProduct?.quantity_available || editableProduct.quantity_available < 0) {
      errors.quantity_available = 'Valid quantity is required';
    }
    if (!editableProduct?.category) {
      errors.category = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
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
        // addMutation.mutate(editableProduct)
        Alert.alert('Success', 'Product added successfully!');
      } else {
        setProducts([editableProduct]);
        // editMutation.mutate(editableProduct)
        Alert.alert('Success', 'Product updated successfully!');
      }

      setEditableProduct(null);
      setView('list');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!editableProduct) return;

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        // Simulate upload delay
        setTimeout(() => {
          const imageUri = result.assets[0].uri;
          setEditableProduct({
            ...editableProduct,
            images: [...editableProduct.images, imageUri]
          });
          setUploading(false);
        }, 1500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FishProduct, value: any) => {
    if (!editableProduct) return;

    setEditableProduct({
      ...editableProduct,
      [field]: value
    });

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle care instructions
  const handleCareInstructionChange = (key: string, value: string) => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      care_instructions: {
        ...editableProduct.care_instructions,
        [key]: value
      }
    });
  };

  const addCareInstruction = () => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      care_instructions: {
        ...editableProduct.care_instructions,
        '': ''
      }
    });
  };

  const removeCareInstruction = (key: string) => {
    if (!editableProduct) return;
    const newInstructions = { ...editableProduct.care_instructions };
    delete newInstructions[key];
    setEditableProduct({
      ...editableProduct,
      care_instructions: newInstructions
    });
  };

  // Handle dietary requirements
  const handleDietaryRequirementChange = (key: string, value: string) => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      dietary_requirements: {
        ...editableProduct.dietary_requirements,
        [key]: value
      }
    });
  };

  const addDietaryRequirement = () => {
    if (!editableProduct) return;
    setEditableProduct({
      ...editableProduct,
      dietary_requirements: {
        ...editableProduct.dietary_requirements,
        '': ''
      }
    });
  };

  const removeDietaryRequirement = (key: string) => {
    if (!editableProduct) return;
    const newRequirements = { ...editableProduct.dietary_requirements };
    delete newRequirements[key];
    setEditableProduct({
      ...editableProduct,
      dietary_requirements: newRequirements
    });
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    if (!editableProduct) return;
    const newImages = [...editableProduct.images];
    newImages.splice(index, 1);
    setEditableProduct({
      ...editableProduct,
      images: newImages
    });
  };

  // Input component with error handling
  const FormInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    keyboardType = 'default',
    multiline = false,
    required = false,
    error,
    leftIcon
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: any;
    multiline?: boolean;
    required?: boolean;
    error?: string;
    leftIcon?: string;
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
          className={`bg-gray-50 border rounded-2xl px-4 py-4 text-gray-900 text-base ${
            leftIcon ? 'pl-12' : ''
          } ${error ? 'border-red-300' : 'border-gray-200'} ${
            multiline ? 'h-24 text-top' : 'h-14'
          }`}
          placeholderTextColor="#9CA3AF"
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
  );

  // Category Modal
  const CategoryModal = () => (
    <Modal visible={showCategoryModal} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-96">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Select Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-80">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="flex-row items-center p-4 border-b border-gray-50"
                onPress={() => {
                  handleInputChange('category', category.name);
                  setShowCategoryModal(false);
                }}
              >
                <View className="bg-blue-50 p-2 rounded-full mr-3">
                  <Ionicons name="fish" size={20} color="#2563EB" />
                </View>
                <Text className="flex-1 text-gray-900 font-medium">{category.name}</Text>
                {editableProduct?.category === category.name && (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Status Modal
  const StatusModal = () => (
    <Modal visible={showStatusModal} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Listing Status</Text>
            <TouchableOpacity onPress={() => setShowStatusModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.value}
                className="flex-row items-center p-4 rounded-xl mb-2"
                style={{ backgroundColor: editableProduct?.listing_status === status.value ? `${status.color}15` : 'transparent' }}
                onPress={() => {
                  handleInputChange('listing_status', status.value);
                  setShowStatusModal(false);
                }}
              >
                <View className="p-2 rounded-full mr-4" style={{ backgroundColor: `${status.color}20` }}>
                  <Ionicons name={status.icon as any} size={20} color={status.color} />
                </View>
                <Text className="flex-1 text-gray-900 font-medium">{status.label}</Text>
                {editableProduct?.listing_status === status.value && (
                  <Ionicons name="checkmark-circle" size={24} color={status.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setEditableProduct(null);
                setView('list');
              }}
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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

            <View className="flex-row space-x-4">
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
                  value={editableProduct?.quantity_available?.toString() || ''}
                  onChangeText={(text) => handleInputChange('quantity_available', parseInt(text) || 0)}
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
                className={`bg-gray-50 border rounded-2xl px-4 py-4 flex-row items-center justify-between ${
                  formErrors.category ? 'border-red-300' : 'border-gray-200'
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
                  {statusOptions.find(s => s.value === editableProduct?.listing_status) && (
                    <>
                      <Ionicons 
                        name={statusOptions.find(s => s.value === editableProduct?.listing_status)?.icon as any} 
                        size={20} 
                        color={statusOptions.find(s => s.value === editableProduct?.listing_status)?.color} 
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-base text-gray-900">
                        {statusOptions.find(s => s.value === editableProduct?.listing_status)?.label}
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
                value={editableProduct?.is_featured || false}
                onValueChange={(value) => handleInputChange('is_featured', value)}
                trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                thumbColor={editableProduct?.is_featured ? '#F59E0B' : '#9CA3AF'}
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

            <View className="flex-row space-x-4 mb-4">
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

            <View className="flex-row space-x-4">
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
                onPress={handleImageUpload}
                className="bg-purple-50 px-4 py-2 rounded-xl"
                disabled={uploading}
              >
                <Text className="text-purple-700 font-semibold">Add Image</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap">
              {editableProduct?.images?.map((image, index) => (
                <View key={index} className="w-1/3 p-1">
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
                  onPress={handleImageUpload}
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

            {Object.entries(editableProduct?.care_instructions || {}).map(([key, value], index) => (
              <View key={index} className="flex-row items-center mb-4 space-x-2">
                <TextInput
                  placeholder="Topic (e.g., Tank Size)"
                  value={key}
                  onChangeText={(newKey) => {
                    const newInstructions = { ...editableProduct!.care_instructions };
                    delete newInstructions[key];
                    newInstructions[newKey] = value;
                    handleInputChange('care_instructions', newInstructions);
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

            {Object.entries(editableProduct?.dietary_requirements || {}).map(([key, value], index) => (
              <View key={index} className="flex-row items-center mb-4 space-x-2">
                <TextInput
                  placeholder="Type (e.g., Food Type)"
                  value={key}
                  onChangeText={(newKey) => {
                    const newRequirements = { ...editableProduct!.dietary_requirements };
                    delete newRequirements[key];
                    newRequirements[newKey] = value;
                    handleInputChange('dietary_requirements', newRequirements);
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
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => {
              setEditableProduct(null);
              setView('list');
            }}
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
      <CategoryModal />
      <StatusModal />
    </SafeAreaView>
  );
};

export default AddProductForm;