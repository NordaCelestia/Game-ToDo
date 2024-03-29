import React, { useState, useEffect } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 

const Stack = createStackNavigator(); 
const MenuScreen = () => <View />; 

export default function Welcome() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const [buttonFadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, slideAnim, buttonFadeAnim]); 

  const handleButtonPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(buttonFadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground
        style={styles.background}
        source={require('../assets/wp.jpg')} 
        fadeDuration={300}>
        <Animated.Text
          style={[
            styles.WSText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          Ready to focus?
        </Animated.Text>

        <Animated.View style={[styles.buttonContainer, { opacity: buttonFadeAnim }]}>
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>Let's start</Text>
          </TouchableOpacity>
        </Animated.View>
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
  WSText: {
    color: 'white',
    fontSize: 25,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#eb5264',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
