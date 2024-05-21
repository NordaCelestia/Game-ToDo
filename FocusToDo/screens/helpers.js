import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const Helpers = () => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: 'https://www.youtube.com/embed/n61ULEU7CO0?si=ziwUdk9Z4-PGNBG8' }}
      />
      <Text style={styles.textcenter}>Welcome to Helpers page!</Text>
      <Button title="Go Back" onPress={goBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 140,
    height: 250, // Maintain 16:9 aspect ratio
  },
  textcenter: {
    color: '#fff2f4',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textShadowColor: 'rgba(250, 100, 250, 0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0.1,
    textAlign: 'center',
  },
});

export default Helpers;
