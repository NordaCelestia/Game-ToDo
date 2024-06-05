import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const Helpers = () => {
  const navigation = useNavigation();
  const [sounds, setSounds] = useState([]);
  const [showButtons, setShowButtons] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const goBack = () => {
    navigation.goBack();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimer(0);
  };

  const toggleView = () => {
    setShowButtons(!showButtons);
  };

  return (
    <ImageBackground
      source={require('../assets/helpers.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        
        {showButtons ? (
          <>
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
          </>
        ) : (
          
          <View style={styles.timerContainer}>
            
            <Text style={styles.timerText}>{timer} s</Text>
            <View style={styles.timerButtonRow}>
              <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
                <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButton} onPress={resetTimer}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={goBack}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => setShowButtons(true)}>
            <Text style={styles.buttonText}>Show Music Buttons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => setShowButtons(false)}>
            <Text style={styles.buttonText}>Show Timer</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#52bb',
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerButtonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  timerButton: {
    backgroundColor: '#03DAC6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',  // Adjusted width to leave some padding on the sides
    paddingHorizontal: 10, // Added padding to the sides
  },
  bottomButton: {
    backgroundColor: '#52bb',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15, // Adjusted padding to make buttons smaller
    marginHorizontal: 0, // Added margin to separate the buttons
    alignItems: 'center',
  },
});

export default Helpers;
