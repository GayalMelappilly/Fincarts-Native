import Footer from '@/components/Footer/Footer';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';

const AddProductScreen = () => {

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    weight: '',
    dimensions: '',
    shippingOptions: '',
  });

  return (
    <SafeAreaView className='flex-1 bg-gray-50 w-full h-full'>
      <ScrollView className='flex-1'>
        {/* Add New Product Section */}
        <View className='m-4 bg-white rounded-lg shadow-sm p-5'>
          <Text className='text-2xl font-bold text-gray-800 mb-4'>Add New Product</Text>

          <Text className='text-gray-700 font-medium mb-1'>Product Name</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-gray-800'
            placeholder="Enter product name"
            value={product.name}
            onChangeText={(text) => setProduct({ ...product, name: text })}
          />

          <Text className='text-gray-700 font-medium mb-1'>Description</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-gray-800 h-24'
            placeholder="Enter product description"
            multiline
            numberOfLines={4}
            value={product.description}
            onChangeText={(text) => setProduct({ ...product, description: text })}
          />

          <Text className='text-gray-700 font-medium mb-1'>Category</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-gray-800'
            placeholder="Enter product category"
            value={product.category}
            onChangeText={(text) => setProduct({ ...product, category: text })}
          />
        </View>

        {/* Photos Section */}
        <View className='m-4 bg-white rounded-lg shadow-sm p-5'>
          <Text className='text-xl font-bold text-gray-800 mb-4'>Photos</Text>

          <TouchableOpacity className='bg-blue-700 py-3 rounded-md items-center mb-4'>
            <Text className='text-white font-medium'>Upload Photos</Text>
          </TouchableOpacity>

          <View className='flex-row'>
            <View className='bg-gray-100 h-24 w-24 rounded-md mr-2 overflow-hidden'>
              {/* <Image 
                source={require('./assets/metal-rings.jpg')} 
                className='h-full w-full'
                resizeMode="cover"
              /> */}
            </View>
            <View className='bg-gray-100 h-24 w-24 rounded-md overflow-hidden'>
              {/* <Image 
                source={require('./assets/fish-texture.jpg')} 
                className='h-full w-full'
                resizeMode="cover"
              /> */}
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View className='m-4 bg-white rounded-lg shadow-sm p-5'>
          <Text className='text-xl font-bold text-gray-800 mb-4'>Pricing</Text>

          <Text className='text-gray-700 font-medium mb-1'>Price</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-gray-800'
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={product.price}
            onChangeText={(text) => setProduct({ ...product, price: text })}
          />

          <Text className='text-gray-700 font-medium mb-1'>Discount (%)</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-1 text-gray-800'
            placeholder="0"
            keyboardType="decimal-pad"
            value={product.discount}
            onChangeText={(text) => setProduct({ ...product, discount: text })}
          />
        </View>

        {/* Shipping Information */}
        <View className='m-4 bg-white rounded-lg shadow-sm p-5'>
          <Text className='text-xl font-bold text-gray-800 mb-4'>Shipping Information</Text>

          <Text className='text-gray-700 font-medium mb-1'>Weight (kg)</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-gray-800'
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={product.weight}
            onChangeText={(text) => setProduct({ ...product, weight: text })}
          />

          <Text className='text-gray-700 font-medium mb-1'>Dimensions (cm)</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-4 text-gray-800'
            placeholder="Enter dimensions L x W x H"
            value={product.dimensions}
            onChangeText={(text) => setProduct({ ...product, dimensions: text })}
          />

          <Text className='text-gray-700 font-medium mb-1'>Shipping Options</Text>
          <TextInput
            className='bg-gray-100 border border-gray-200 rounded-md p-3 mb-1 text-gray-800'
            placeholder="Enter shipping options"
            value={product.shippingOptions}
            onChangeText={(text) => setProduct({ ...product, shippingOptions: text })}
          />
        </View>

        {/* Preview Section */}
        <View className='m-4 bg-white rounded-lg shadow-sm p-5 mb-6'>
          <Text className='text-xl font-bold text-gray-800 mb-4'>Preview</Text>

          <View className='bg-gray-50 p-4 rounded-md border border-gray-200 mb-5'>
            <Text className='text-lg font-bold text-gray-800 mb-2'>Product Name: {product.name}</Text>
            <Text className='text-gray-700 mb-1'>Description: {product.description}</Text>
            <Text className='text-gray-700 mb-1'>Category: {product.category}</Text>
            <Text className='text-gray-700 mb-1'>Price: ${product.price}</Text>
            <Text className='text-gray-700 mb-1'>Discount: {product.discount}%</Text>
            <Text className='text-gray-700 mb-1'>Weight: {product.weight} kg</Text>
            <Text className='text-gray-700 mb-1'>Dimensions: {product.dimensions}</Text>
            <Text className='text-gray-700 mb-1'>Shipping Options: {product.shippingOptions}</Text>
          </View>
          <View className='flex-row gap-4'>
            <TouchableOpacity className='bg-green-700 flex-1 py-3 rounded-md items-center mb-4 p-5'>
              <Text className='text-white font-medium'>List Product</Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-gray-700 py-3 flex-1 rounded-md items-center mb-4 p-5'>
              <Text className='text-white font-medium'>Save as Draft</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddProductScreen