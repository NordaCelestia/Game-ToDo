import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';

const Planner = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [plans, setPlans] = useState([]);
    const [newPlanName, setNewPlanName] = useState('');

    const tarihSeciminiEleAl = (tarih) => {
        console.log('Seçilen tarih:', tarih);
        setSelectedDate(tarih);
    }

    const planiSil = (id) => {
        const yeniPlanlar = plans.filter(plan => plan.id !== id);
        setPlans(yeniPlanlar);
    }

    const yeniPlanEkle = () => {
        if (newPlanName.trim() !== '') {
            setPlans([...plans, { id: Date.now(), date: selectedDate.dateString, plan: newPlanName }]);
            setNewPlanName('');
        }
    }

    const PlanListesi = () => (
        <View>
            {plans.map((item) => (
                <View key={item.id} style={styles.planItem}>
                    <Text>{item.date}: {item.plan}</Text>
                    <TouchableOpacity onPress={() => planiSil(item.id)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Sil</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    return (
        <ImageBackground style={styles.container} source={require('../assets/planner.png')}>
            <LinearGradient
                colors={['rgba(230, 60, 147, 0.8)', 'rgba(230, 60, 147, 0.07)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Calendar onDayPress={tarihSeciminiEleAl} />

                <View style={styles.planInputContainer}>
                    <TextInput
                        style={styles.planInput}
                        placeholder="Plan adını girin"
                        value={newPlanName}
                        onChangeText={setNewPlanName}
                    />
                    <TouchableOpacity onPress={yeniPlanEkle} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Ekle</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.planListContainer}>
                    <Text style={styles.planListHeader}>Planned Events</Text>
                    <PlanListesi />
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
    planInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    planInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#e04091',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
    },
    planListContainer: {
        marginTop: 20,
    },
    planListHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff', // Text color added for better visibility on gradient background
    },
    planItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    deleteButton: {
        backgroundColor: '#e04091',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
    },
});

export default Planner;
