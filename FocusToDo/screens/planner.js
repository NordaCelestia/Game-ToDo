import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Planner = () => {
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [plans, setPlans] = useState([]);

    const handleAddPlan = async () => {
        if (newPlanName.trim() !== '' && selectedDate) {
            try {
                const docRef = await addDoc(collection(db, 'plans'), {
                    name: newPlanName,
                    date: selectedDate.dateString,
                });
                setPlans([...plans, { id: docRef.id, name: newPlanName, date: selectedDate.dateString }]);
                setNewPlanName('');
                setSelectedDate(null);
                setShowAddPlan(false);
            } catch (error) {
                console.error('Error adding plan: ', error);
            }
        }
    };

    return (
        <ImageBackground style={styles.container} source={require('../assets/planner.png')}>
            <LinearGradient
                colors={['rgba(230, 60, 147, 0.8)', 'rgba(230, 60, 147, 0.07)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {!showAddPlan ? (
                    <TouchableOpacity onPress={() => setShowAddPlan(true)} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Plan Ekle</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.addPlanContainer}>
                        <TextInput
                            style={styles.planInput}
                            placeholder="Plan adını girin"
                            value={newPlanName}
                            onChangeText={setNewPlanName}
                        />
                        <Calendar
                            onDayPress={(day) => setSelectedDate(day)}
                            markedDates={selectedDate ? { [selectedDate.dateString]: { selected: true } } : {}}
                        />
                        <TouchableOpacity onPress={handleAddPlan} style={styles.addButton}>
                            <Text style={styles.addButtonText}>Ekle</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.planListContainer}>
                    <Text style={styles.planListHeader}>Planned Events</Text>
                    {plans.map((item) => (
                        <View key={item.id} style={styles.planItem}>
                            <Text>{item.date}: {item.name}</Text>
                        </View>
                    ))}
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#e04091',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
    },
    addPlanContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    planInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
        width: '80%',
    },
    planListContainer: {
        marginTop: 20,
    },
    planListHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    planItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default Planner;
