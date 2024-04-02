import React, { useState } from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Kayıt işlemleri burada gerçekleştirilebilir
    console.log('Kayıt işlemi: ', username, email, password);
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
          defaultValue={Username}
        />
        <TextInput
          placeholderTextColor={'#ff9cc7'}
          style={styles.input}
          placeholder="Password"
          onChangeText={newPassword => setPassword(newPassword)}
          defaultValue={Password}
          secureTextEntry={true} 
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Kayıt Ol</Text>
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
  button: {
    backgroundColor: 'rgba(230, 60, 147,0.6)',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: 'rgba(230, 60, 147,0.6)',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  input: {
    height: 40,
    width: '80%',
    backgroundColor: 'rgba(230, 60, 147,0.6)',
    margin: 15,
    padding: 10,
  },
});
