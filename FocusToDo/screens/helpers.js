import React from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Helpers = () => {
  const navigation = useNavigation(); 

  const goBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      
      <ImageBackground style={styles.background} source={require('../assets/helpers.png')}>
        <Text>Welcome to Helpers page!</Text>
        <Button title="Go Back" onPress={goBack} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%', 
    height: '100%', 
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
  
});

export default Helpers;