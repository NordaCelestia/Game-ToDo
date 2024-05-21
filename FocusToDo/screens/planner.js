import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Planner = () => {
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'plans'), (snapshot) => {
            const loadedPlans = [];
            snapshot.forEach((doc) => {
                loadedPlans.push({ id: doc.id, ...doc.data() });
            });
            setPlans(loadedPlans);
        });

        return () => unsubscribe();
    }, []);

    const handleAddPlan = async () => {
        if (newPlanName.trim() !== '' && selectedDate) {
            try {
                const docRef = await addDoc(collection(db, 'plans'), {
                    name: newPlanName,
                    date: selectedDate.dateString,
                    description: '',
                });
                setNewPlanName('');
                setSelectedDate(null);
                setShowAddPlan(false);
            } catch (error) {
                console.error('Error adding plan: ', error);
            }
        }
    };

    const handleUpdatePlan = async () => {
        if (selectedPlan) {
            try {
                const planRef = doc(db, 'plans', selectedPlan.id);
                await updateDoc(planRef, {
                    name: selectedPlan.name,
                    description: selectedPlan.description,
                });
                setIsModalVisible(false);
                setSelectedPlan(null);
            } catch (error) {
                console.error('Error updating plan: ', error);
            }
        }
    };

    const handleDeletePlan = async (planId) => {
        try {
            await deleteDoc(doc(db, 'plans', planId));
            setIsModalVisible(false);
            setSelectedPlan(null);
        } catch (error) {
            console.error('Error deleting plan: ', error);
        }
    };

    const openModal = (plan) => {
        setSelectedPlan(plan);
        setIsModalVisible(true);
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
                        <TouchableOpacity key={item.id} onPress={() => openModal(item)} style={styles.planItem}>
                            <Text style={styles.planText}>{item.date}: {item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </LinearGradient>

            {selectedPlan && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setIsModalVisible(false);
                        setSelectedPlan(null);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Plan adını değiştirin"
                                value={selectedPlan.name}
                                onChangeText={(text) => setSelectedPlan({ ...selectedPlan, name: text })}
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Açıklama ekleyin"
                                value={selectedPlan.description}
                                onChangeText={(text) => setSelectedPlan({ ...selectedPlan, description: text })}
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity onPress={handleUpdatePlan} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Güncelle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeletePlan(selectedPlan.id)} style={[styles.modalButton, styles.deleteButton]}>
                                    <Text style={styles.modalButtonText}>Sil</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Kapat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
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
    planText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
        width: '100%',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#e04091',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    modalButtonText: {
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
    },
});

export default Planner;
