import OrdersScreen from '@/components/Orders/Ordes';
import ProductsScreen from '@/components/Products/Products';
import { View } from 'react-native';

const Products = () => {
  return (
    <View className="items-center flex-1 justify-center">
      <ProductsScreen />
    </View>
  );
};

export default Products;
