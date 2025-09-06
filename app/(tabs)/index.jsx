import { Text, View } from 'react-native';
// If using Expo Router, import your CSS file in the app/_layout.tsx file
import '../global.css';


export default function HomeScreen() {
  return (
   
<View style={{ backgroundColor: '#f1f5f9', borderRadius: 12, padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '500' }}>Welcome to Tailwind</Text>
    </View>

  );
}
