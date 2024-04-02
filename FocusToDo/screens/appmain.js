import React from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Background } from '@react-navigation/elements';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.background} source={require('../assets/wpmainfix.png')}>
        <Text style={styles.textcenter}>Welcome back!</Text>
        <LinearGradient 
          colors={['rgba(230, 60, 147,0.07)', 'rgba(230, 60, 147,0.8)']} 
          style={styles.bottomUI}
        >
          {<Text style={styles.bottomUIText}>selam</Text>}
        </LinearGradient>
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
  textcenter: {
    color: '#fff2f4',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -550,
    textShadowColor: 'rgba(250, 100, 250, 0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0.1,
  },
  bottomUI: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomUIText: {
    color: '#fff2f4',
    fontSize: 20,
    fontWeight: 'bold',
    
    textShadowColor: 'rgba(250, 100, 250, 0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0.6,
  },
});
