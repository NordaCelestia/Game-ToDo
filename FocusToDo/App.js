import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './screens/welcome';
import loginscreen from './screens/loginscreen';
import appmain from './screens/appmain';
import Helpers from './screens/helpers';
import Planner from './screens/planner';
import app from '../FocusToDo/firebaseConfig'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="loginscreen" component={loginscreen} />
        <Stack.Screen name="appmain" component={appmain} />
        <Stack.Screen name="helpers" component={Helpers} />
        <Stack.Screen name="planner" component={Planner} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});