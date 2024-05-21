import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: username,
        email: email,
      });

      console.log('User added with ID: ', user.uid);
      navigation.navigate('appmain');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Trying to sign in with', email, password); 
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Logged in with user ID: ', user.uid);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log('User data:', userDoc.data());
        navigation.navigate('appmain');
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error logging in: ', error.message);
    }
  };

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
              placeholder="Email"
              onChangeText={newEmail => setEmail(newEmail)}
              value={email}
            />
            <TextInput
              placeholderTextColor={'#ff9cc7'}
              style={styles.input}
              placeholder="Password"
              onChangeText={newPassword => setPassword(newPassword)}
              value={password}
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
