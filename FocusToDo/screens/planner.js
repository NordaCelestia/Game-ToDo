import React, { useState } from 'react';
import { StatusBar, ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient'; 

const Helpers = () => {
    const navigation = useNavigation(); 
}
const Planner = () => {
    const [selectedDate, setSelectedDate] = useState(null); 

    const tarihSeciminiEleAl = (tarih) => {
        console.log('Seçilen tarih:', tarih);
        setSelectedDate(tarih); 
        
    }

    return (
        <View style={styles.container}>
           
            <ImageBackground style={styles.background} source={require('../assets/planner.png')}>
                
                <LinearGradient
                    colors={['rgba(230, 60, 147, 0.8)', 'rgba(230, 60, 147, 0.07)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <Text style={styles.bottomUIText}>Planner Screen</Text>
                    {/* Seçilen tarihi göster */}
                    {selectedDate && <Text style={styles.bottomUIText}>Seçilen Tarih: {selectedDate.dateString}</Text>}
                </LinearGradient>
            </ImageBackground>
            
            <Calendar onDayPress={tarihSeciminiEleAl} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent', 
    },
    bottomUIText: {
      padding: 60,
      color: '#661433',
      fontSize: 20,
      fontWeight: 'bold',
      textShadowColor: 'rgba(250, 250, 250, 0.9)',
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 0.6,
    },
});

export default Planner;
