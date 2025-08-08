import AddProductScreen from '@/components/Products/AddProducts';
import { View } from 'react-native';

const AddProducts = () => {
  return (
    <View className={styles.container}>
      <AddProductScreen />
    </View>
  );
};

const styles = {
  container: `items-center flex-1 justify-center`,
};

export default AddProducts
