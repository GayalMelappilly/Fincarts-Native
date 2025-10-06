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
import { Video } from 'expo-av';
import { uploadToCloudinary } from '@/utils/cloudinary/upload';
import { useMutation } from '@tanstack/react-query';
import { addProduct, editProduct } from '@/services/productServices';
import { router, useLocalSearchParams } from 'expo-router';
import { Business, TopFishListing, useAuth } from '@/context/AuthContext';
import { FormInput } from './FormInput';
import { CategoryModal } from './CategoryModal';
import { StatusModal } from './StatusModal';

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

  const params = useLocalSearchParams();
  if (params.viewStatus === "add") {
    setView('add');
  } else if (params.viewStatus === "edit") {
    setView('edit');
  }

  const { sellerData, setSellerData } = useAuth();
  const screenWidth = Dimensions.get('window').width;

  const statusOptions = useMemo(() => [
    { value: 'active' as const, label: 'Active', color: '#10B981', icon: 'checkmark-circle' as const },
    { value: 'draft' as const, label: 'Draft', color: '#6B7280', icon: 'document-text' as const },
    { value: 'out_of_stock' as const, label: 'Out of Stock', color: '#EF4444', icon: 'ban' as const },
  ], []);

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log('Add product error : ', err);
    }
  });

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

  // Helper function to convert media to base64
  const convertMediaToBase64 = useCallback(async (uri: string): Promise<string> => {
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
      console.error('Error converting media to base64:', error);
      throw error;
    }
  }, []);

  // Helper function to determine if a URL is a video
  const isVideoUrl = useCallback((url: string): boolean => {
    return url.includes('/video/') || 
           url.includes('.mp4') || 
           url.includes('.mov') || 
           url.includes('.avi') || 
           url.includes('.webm') ||
           url.includes('.mkv') ||
           url.includes('.flv');
  }, []);

  // Updated media upload function that handles both images and videos
  const handleMediaUpload = useCallback(async (
    source: 'camera' | 'library' = 'library',
    mediaType: 'image' | 'video' | 'both' = 'both'
  ): Promise<void> => {
    if (!editableProduct) return;

    try {
      // Request permissions
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

      // Set media types based on selection
      let mediaTypes: ImagePicker.MediaTypeOptions;
      if (mediaType === 'image') {
        mediaTypes = ImagePicker.MediaTypeOptions.Images;
      } else if (mediaType === 'video') {
        mediaTypes = ImagePicker.MediaTypeOptions.Videos;
      } else {
        mediaTypes = ImagePicker.MediaTypeOptions.All;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            videoMaxDuration: 60, // 60 seconds max for videos
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            videoMaxDuration: 60,
          });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);
        const asset = result.assets[0];

        try {
          // Convert media to base64
          const base64Media = await convertMediaToBase64(asset.uri);
          
          // Determine if it's a video or image based on the asset type
          const isVideo = asset.type === 'video';
          const fileType = isVideo ? 'video' : 'image';
          
          // Upload to Cloudinary with the appropriate type
          const url = await uploadToCloudinary(base64Media, fileType);

          if (url) {
            // Add to images array (you might want to separate videos later)
            setEditableProduct({
              ...editableProduct,
              images: [...editableProduct.images, url]
            });
            
            Alert.alert('Success', `${isVideo ? 'Video' : 'Image'} uploaded successfully!`);
          } else {
            throw new Error('Failed to get media URL from server');
          }
        } catch (error) {
          console.error('Error uploading media:', error);
          Alert.alert('Upload Error', `Failed to upload ${asset.type}. Please try again.`);
        }
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Failed to select media. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [editableProduct, setEditableProduct, convertMediaToBase64]);

  // Show media source and type options
  const showMediaSourceOptions = useCallback((): void => {
    Alert.alert(
      'Add Media',
      'Choose media type and source',
      [
        {
          text: 'Take Photo',
          onPress: () => handleMediaUpload('camera', 'image'),
        },
        {
          text: 'Record Video',
          onPress: () => handleMediaUpload('camera', 'video'),
        },
        {
          text: 'Photo Library',
          onPress: () => handleMediaUpload('library', 'image'),
        },
        {
          text: 'Video Library',
          onPress: () => handleMediaUpload('library', 'video'),
        },
        {
          text: 'All Media',
          onPress: () => handleMediaUpload('library', 'both'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, [handleMediaUpload]);

  // Media preview component
  const renderMediaPreview = useCallback((mediaUrl: string, index: number) => {
    const isVideo = isVideoUrl(mediaUrl);
    
    return (
      <View key={`media-${index}`} className="w-1/3 p-1">
        <View className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {isVideo ? (
            <View className="w-full h-full relative">
              <Video
                source={{ uri: mediaUrl }}
                style={{ width: '100%', height: '100%' }}
                // resizeMode="cover"
                shouldPlay={false}
                isLooping={false}
                useNativeControls={false}
              />
              <View className="absolute inset-0 bg-black/20 items-center justify-center">
                <View className="bg-white/80 rounded-full p-2">
                  <Ionicons name="play" size={20} color="#374151" />
                </View>
              </View>
            </View>
          ) : (
            <Image source={{ uri: mediaUrl }} className="w-full h-full" resizeMode="cover" />
          )}
          
          <TouchableOpacity
            onPress={() => handleRemoveImage(index)}
            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
          >
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
          
          {/* Video indicator badge */}
          {isVideo && (
            <View className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
              <Text className="text-white text-xs font-medium">VIDEO</Text>
            </View>
          )}
        </View>
      </View>
    );
  }, [isVideoUrl]);

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
    if (!editableProduct?.size) {
      errors.size = 'Size is required';
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
        addMutation.mutate(editableProduct);
        Alert.alert('Success', 'Product added successfully!');
      } else {
        setProducts([editableProduct]);
        editMutation.mutate(editableProduct);
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

  // Remove image/video
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
    if (view == 'edit') {
      setView('list');
      router.push(`/edit-products`);
    } else if (view == 'add') {
      setView('list');
      router.push(`/products`);
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

              <View className="flex-1">
                <FormInput
                  label="Size"
                  value={editableProduct?.size || ''}
                  onChangeText={(text) => handleInputChange('size', text)}
                  placeholder="e.g., 2 inches"
                  required
                  error={formErrors.size}
                />
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

            {/* Media Section */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="bg-purple-50 p-3 rounded-full mr-4">
                    <Ionicons name="videocam" size={24} color="#8B5CF6" />
                  </View>
                  <Text className="text-xl font-bold text-gray-900">Media Gallery</Text>
                </View>
                <TouchableOpacity
                  onPress={showMediaSourceOptions}
                  className="bg-purple-50 px-4 py-2 rounded-xl"
                  disabled={uploading}
                >
                  <Text className="text-purple-700 font-semibold">Add Media</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap">
                {editableProduct?.images?.map((mediaUrl, index) => 
                  renderMediaPreview(mediaUrl, index)
                )}

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
                    onPress={showMediaSourceOptions}
                    className="w-1/3 p-1"
                  >
                    <View className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center">
                      <Ionicons name="add-circle" size={32} color="#9CA3AF" />
                      <Text className="text-xs text-gray-500 mt-2">Add Media</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-xs text-gray-500 mt-4">
                Upload high-quality images and videos. First media will be the main display. Videos limited to 60 seconds.
              </Text>
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
