import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const Helpers = () => {
  const navigation = useNavigation();
  const [sounds, setSounds] = useState([]);

  const soundFiles = [
    { name: 'Lo-fi', file: require('../sounds/relaxing_lofi.mp3') },
    { name: 'Lo-fi 2', file: require('../sounds/relaxing_music.mp3') },
    { name: 'Minecraft music', file: require('../sounds/relaxing_mc.mp3') },
    { name: 'Midnight', file: require('../sounds/relaxing_midnight.mp3') },
    { name: 'Campfire', file: require('../sounds/relaxing_campfire.mp3') },
    { name: 'Rain', file: require('../sounds/relaxing_rain.mp3') },
  ];

  async function playSound(index) {
    const { file } = soundFiles[index];
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(file);
      setSounds(prevSounds => [...prevSounds, sound]);
      await sound.playAsync();
    } catch (error) {
      console.error("Error loading or playing sound", error);
    }
  }

  useEffect(() => {
    return () => {
      sounds.forEach(sound => sound.unloadAsync());
    };
  }, [sounds]);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/helpers.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.textcenter}>Here is some relaxing music for you!</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => playSound(0)}>
            <Text style={styles.buttonText}>{soundFiles[0].name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => playSound(1)}>
            <Text style={styles.buttonText}>{soundFiles[1].name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => playSound(2)}>
            <Text style={styles.buttonText}>{soundFiles[2].name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => playSound(3)}>
            <Text style={styles.buttonText}>{soundFiles[3].name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => playSound(4)}>
            <Text style={styles.buttonText}>{soundFiles[4].name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => playSound(5)}>
            <Text style={styles.buttonText}>{soundFiles[5].name}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textcenter: {
    color: '#fff2f4',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textShadowColor: 'rgba(50, 50, 100, 0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0.1,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#52bb', // Buton rengi burada ayarlanır
    borderRadius: 20, // Yumuşak kenarlar için border radius
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goBackButton: {
    backgroundColor: '#03DAC6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  }
});

export default Helpers;
