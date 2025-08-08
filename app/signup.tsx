import SignupScreen from '@/components/SignUp/SignupScreen';
import { View } from 'react-native';

const Signup = () => {
  return (
    <View className={styles.container}>
      <SignupScreen />
    </View>
  );
};

const styles = {
  container: `items-center flex-1 justify-center`,
};

export default Signup
