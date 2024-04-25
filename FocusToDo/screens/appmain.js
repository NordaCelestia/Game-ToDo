
import React, { useState } from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';



const Stack = createNativeStackNavigator();


export default function App() {
  const [isBottomUIExpanded, setIsBottomUIExpanded] = useState(false); 
  const navigation = useNavigation();
  const handlePress = () => {
    setIsBottomUIExpanded(!isBottomUIExpanded); 
  };

  const goToHelpersPage = () => {
    navigation.navigate("helpers");
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.background} source={require('../assets/wpmainfix.png')}>
        <Text style={styles.textcenter}>Welcome back!</Text>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={[styles.bottomUI, { height: isBottomUIExpanded ? 400 : 200 }]}
          >
            <LinearGradient 
              colors={['rgba(230, 60, 147,0.07)', 'rgba(230, 60, 147,0.8)']} 
              style={styles.gradient}
            >
              <View style={styles.centeredText}>
                <Text style={styles.bottomUIText}>Click here to start</Text>
              </View>
              {isBottomUIExpanded && (
                <View style={styles.buttonContainer}>
                  <View style={styles.upperButtons}>
                    <TouchableOpacity style={styles.button}>
                      <Text style={styles.buttonText}>Button 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Text style={styles.buttonText}>Button 2</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.lowerButtons}>
                    <TouchableOpacity style={styles.button}>
                      <Text style={styles.buttonText}>Button 3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.button} 
                      onPress={goToHelpersPage} // Navigate to Helpers page on button press
                    >
                      <Text style={styles.buttonText}>Helpers</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomUI: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  centeredText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomUIText: {
    padding: 60,
    color: '#fff2f4',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(250, 100, 250, 0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0.6,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  upperButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  lowerButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 40,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
