import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, StyleSheet, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Audio } from 'expo-av';
import { addDoc, collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const Planner = () => {
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanDescription, setNewPlanDescription] = useState('');
    const [newPlanFrequency, setNewPlanFrequency] = useState('daily');
    const [newPlanPrivacy, setNewPlanPrivacy] = useState('public');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCompletedPlans, setShowCompletedPlans] = useState(false);
    const [userPoints, setUserPoints] = useState(0);

    const user = auth.currentUser;
    const soundRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/plans`), (snapshot) => {
            const loadedPlans = [];
            snapshot.forEach((doc) => {
                loadedPlans.push({ id: doc.id, ...doc.data() });
            });
            setPlans(loadedPlans);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.points) {
                        setUserPoints(data.points);
                    } else {
                        setUserPoints(0);
                    }
                }
            });
        }
    }, [user]);

    useEffect(() => {
        const loadSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(require('../sounds/done.mp3'));
                soundRef.current = sound;
            } catch (error) {
                console.error('Error loading sound: ', error);
            }
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const playSound = async () => {
        if (soundRef.current) {
            try {
                await soundRef.current.replayAsync();
            } catch (error) {
                console.error('Error playing sound: ', error);
            }
        }
    };

    const handleAddPlan = async () => {
        if (newPlanName.trim() !== '' && newPlanDescription.trim() !== '' && user) {
            try {
                await addDoc(collection(db, `users/${user.uid}/plans`), {
                    name: newPlanName,
                    description: newPlanDescription,
                    frequency: newPlanFrequency,
                    privacy: newPlanPrivacy,
                    completed: false,
                });
                setNewPlanName('');
                setNewPlanDescription('');
                setNewPlanFrequency('daily');
                setNewPlanPrivacy('public');
                setShowAddPlan(false);
            } catch (error) {
                console.error('Error adding plan: ', error);
            }
        }
    };

    const updateUserPoints = async (pointsToAdd) => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                points: userPoints + pointsToAdd,
            });
            setUserPoints(userPoints + pointsToAdd);
        }
    };

    const handleToggleComplete = async (plan) => {
        try {
            const planRef = doc(db, `users/${user.uid}/plans`, plan.id);
            await updateDoc(planRef, {
                completed: !plan.completed,
            });

            if (!plan.completed) {
                let pointsToAdd = 0;
                switch (plan.frequency) {
                    case 'daily':
                        pointsToAdd = 100;
                        break;
                    case 'weekly':
                        pointsToAdd = 200;
                        break;
                    case 'monthly':
                        pointsToAdd = 500;
                        break;
                    default:
                        pointsToAdd = 0;
                        break;
                }
                await updateUserPoints(pointsToAdd);
            }
            
            playSound();
        } catch (error) {
            console.error('Error toggling plan completion: ', error);
        }
    };

    const handleUpdatePlan = async () => {
        if (selectedPlan) {
            try {
                const planRef = doc(db, `users/${user.uid}/plans`, selectedPlan.id);
                await updateDoc(planRef, {
                    name: selectedPlan.name,
                    description: selectedPlan.description,
                    privacy: selectedPlan.privacy,
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
            await deleteDoc(doc(db, `users/${user.uid}/plans`, planId));
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

    const getFilteredPlans = () => {
        return plans.filter(plan => showCompletedPlans ? plan.completed : !plan.completed);
    };

    return (
        <ImageBackground style={styles.container} source={require('../assets/planner.png')}>
            <View style={styles.planListContainer}>
                <Text style={styles.planListHeader}>Planned Events</Text>
                {getFilteredPlans().map((item) => (
                    <View key={item.id} style={styles.planItemContainer}>
                        <View style={styles.planItem}>
                            <TouchableOpacity onPress={() => openModal(item)}>
                                <Text style={styles.planText}>{item.name}</Text>
                                <Text style={styles.planDescription}>{item.description}</Text>
                            </TouchableOpacity>
                        </View>
                        <Checkbox
                            value={item.completed}
                            onValueChange={() => handleToggleComplete(item)}
                            color={item.completed ? '#e04091' : '#e04091'}
                        />
                    </View>
                ))}
            </View>

            {showAddPlan && (
                <View style={styles.addPlanContainer}>
                    <TextInput
                        style={styles.planInput}
                        placeholder="Plan adını girin"
                        value={newPlanName}
                        onChangeText={setNewPlanName}
                    />
                    <TextInput
                        style={styles.planInput}
                        placeholder="Açıklama ekleyin"
                        value={newPlanDescription}
                        onChangeText={setNewPlanDescription}
                    />
                    <View style={styles.frequencyContainer}>
                        <TouchableOpacity onPress={() => setNewPlanFrequency('daily')} style={[styles.frequencyButton, newPlanFrequency === 'daily' && styles.selectedFrequency]}>
                            <Text style={styles.frequencyButtonText}>Daily</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setNewPlanFrequency('weekly')} style={[styles.frequencyButton, newPlanFrequency === 'weekly' && styles.selectedFrequency]}>
                            <Text style={styles.frequencyButtonText}>Weekly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setNewPlanFrequency('monthly')} style={[styles.frequencyButton, newPlanFrequency === 'monthly' && styles.selectedFrequency]}>
                            <Text style={styles.frequencyButtonText}>Monthly</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.privacyContainer}>
                        <TouchableOpacity onPress={() => setNewPlanPrivacy('public')} style={[styles.privacyButton, newPlanPrivacy === 'public' && styles.selectedPrivacy]}>
                            <Text style={styles.privacyButtonText}>Public</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setNewPlanPrivacy('private')} style={[styles.privacyButton, newPlanPrivacy === 'private' && styles.selectedPrivacy]}>
                            <Text style={styles.privacyButtonText}>Private</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleAddPlan} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            )}

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
                            <View style={styles.privacyContainer}>
                                <TouchableOpacity onPress={() => setSelectedPlan({ ...selectedPlan, privacy: 'public' })} style={[styles.privacyButton, selectedPlan.privacy === 'public' && styles.selectedPrivacy]}>
                                    <Text style={styles.privacyButtonText}>Public</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedPlan({ ...selectedPlan, privacy: 'private' })} style={[styles.privacyButton, selectedPlan.privacy === 'private' && styles.selectedPrivacy]}>
                                    <Text style={styles.privacyButtonText}>Private</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity onPress={handleUpdatePlan} style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeletePlan(selectedPlan.id)} style={[styles.modalButton, styles.deleteButton]}>
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <TouchableOpacity onPress={() => setShowAddPlan(true)} style={styles.addButtonBottomRight}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <View style={styles.footerButtons}>
                <TouchableOpacity onPress={() => setShowCompletedPlans(false)} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Active Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowCompletedPlans(true)} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>Completed Tasks</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addPlanContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        marginTop: 20,
    },
    planInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
        width: '100%',
    },
    planListContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    planListHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    planItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    planItem: {
        backgroundColor: 'rgba(255, 120, 200, 0.8)',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginRight: 10,
    },
    planText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    planDescription: {
        fontSize: 14,
        color: '#555',
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    modalButtonText: {
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
    },
    addButtonBottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 20,
        backgroundColor: '#e04091',
        borderRadius: 50,
    },
    footerButtons: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
    },
    footerButton: {
        backgroundColor: '#e04091',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginRight: 10,
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    frequencyContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    frequencyButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginHorizontal: 5,
    },
    selectedFrequency: {
        backgroundColor: '#e04091',
        borderColor: '#e04091',
    },  
    frequencyButtonText: {
        color: '#fff',
    },
    privacyContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    privacyButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginHorizontal: 5,
    },
    selectedPrivacy: {
        backgroundColor: '#e04091',
        borderColor: '#e04091',
    },
    privacyButtonText: {
        color: '#fff',
    },
});

export default Planner;
