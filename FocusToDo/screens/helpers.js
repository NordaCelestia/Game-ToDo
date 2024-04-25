import React from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import YouTube from 'react-native-youtube'; // YouTube bileşenini ekleyin

const Helpers = () => {
  const navigation = useNavigation(); // Navigation'ı başlatın

  const goBack = () => {
    navigation.goBack(); // Önceki ekrana geri dön
  };

  return (
    <View style={styles.container}>
      {/* YouTube bileşenini burada kullanın */}
      <YouTube
        videoId="n61ULEU7CO0" // Göstermek istediğiniz YouTube videosunun ID'sini buraya ekleyin
        apiKey="AIzaSyDlZjZqwnFofkF1eh4wdg1dZqnlRskHNlI" // YouTube API anahtarınızı buraya ekleyin
        style={{ alignSelf: 'stretch', flex: 1 }}
      />
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
    width: '100%', // Ekranın genişliği kadar
    height: '100%', // Ekranın yüksekliği kadar
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
  // Diğer stiller buraya eklenebilir
});

export default Helpers;
