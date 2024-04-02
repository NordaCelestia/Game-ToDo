import React, { useState } from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = () => {
    console.log(username, password);
    navigation.navigate("appmain");
  }

  const handleRegister = () => {
    console.log(username, email, password);
    
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.background} source={require('../assets/wp2.jpg')}>
        {isRegistering ? (
          <>
            <TextInput
              placeholder="Username"
              style={styles.input}
              onChangeText={text => setUsername(text)}
              value={username}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={text => setEmail(text)}
              value={email}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => setIsRegistering(false)}>
              <Text style={styles.buttonText}>Geri Dön</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.textcenter}>Let's Start Now!</Text>
            <TextInput
              placeholderTextColor={'#ff9cc7'}
              style={styles.input}
              placeholder="Username"
              onChangeText={newUsername => setUsername(newUsername)}
              defaultValue={username}
            />
            <TextInput
              placeholderTextColor={'#ff9cc7'}
              style={styles.input}
              placeholder="Password"
              onChangeText={newPassword => setPassword(newPassword)}
              defaultValue={password}
              secureTextEntry={true} 
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setIsRegistering(true)}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  buttonContainer: {
    flexDirection: 'row', 
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(230, 60, 147,0.6)',
    padding: 10,
    borderRadius: 5,
    width: '40%', 
    alignItems: 'center', 
    marginHorizontal: 10, 
  },
  textcenter: {
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: -30, 
  },
  input: {
    height: 40,
    width: '80%', 
    backgroundColor: 'rgba(230, 60, 147,0.6)', 
    margin: 15,
    padding: 10, 
  },
  buttonText: {
    color: '#FFF', 
    fontSize: 18, 
  },
  backButton: {
    backgroundColor: 'rgba(230, 60, 147,0.6)',
    padding: 10,
    borderRadius: 5,
    width: '40%', 
    alignItems: 'center', 
    marginTop: 20,
  },
});
