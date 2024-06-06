import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Checkbox from 'expo-checkbox';
import { Audio } from 'expo-av';

const Profile = () => {
  const user = auth.currentUser;
  const [showMyProfile, setShowMyProfile] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const soundRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserPoints(data.points || 0);
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

  const handlePasswordChange = () => {
    if (newPassword.length > 0) {
      user.updatePassword(newPassword).then(() => {
        alert('Password updated successfully.');
      }).catch((error) => {
        alert(error.message);
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(user => user.displayName && user.displayName.toLowerCase().includes(search.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const fetchPlans = async (userId) => {
    try {
      const plansSnapshot = await getDocs(collection(db, `users/${userId}/plans`));
      const userPlans = [];
      plansSnapshot.forEach((doc) => {
        const planData = doc.data();
        if (planData.public) {
          userPlans.push({ id: doc.id, ...planData });
        }
      });
      setPlans(userPlans);
    } catch (error) {
      console.error('Error fetching plans: ', error);
    }
  };

  const handleToggleComplete = async (plan) => {
    try {
      const planRef = doc(db, `users/${selectedUser.id}/plans`, plan.id);
      await updateDoc(planRef, { completed: !plan.completed });
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
        await updateDoc(doc(db, 'users', selectedUser.id), { points: selectedUser.points + pointsToAdd });
        setSelectedUser((prevUser) => ({ ...prevUser, points: prevUser.points + pointsToAdd }));
      }
      playSound();
    } catch (error) {
      console.error('Error toggling plan completion: ', error);
    }
  };

  const handleUserSelect = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      setSelectedUser({ id: userId, ...userDoc.data() });
      fetchPlans(userId);
    } catch (error) {
      console.error('Error selecting user: ', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ImageBackground source={require('../assets/profile.jpg')} style={styles.background}>
      <View style={styles.container}>
        {showMyProfile ? (
          <>
            <Text style={styles.label}>Name: {user.displayName}</Text>
            <Text style={styles.boldLabel}>Email: {user.email}</Text>
            <Text style={styles.boldLabel}>Points: {userPoints}</Text>
            {showPasswordFields && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
                  <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={() => setShowPasswordFields(true)}>
              <Text style={styles.buttonText}>Show Password Fields</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowMyProfile(false)}>
              <Text style={styles.buttonText}>Others</Text>
            </TouchableOpacity>
          </>
        ) : selectedUser ? (
          <>
            <Text style={styles.label}>Name: {selectedUser.displayName}</Text>
            <Text style={styles.boldLabel}>Points: {selectedUser.points}</Text>
            <TouchableOpacity style={styles.button} onPress={() => setSelectedUser(null)}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <FlatList
              data={plans}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.planItemContainer}>
                  <Text style={styles.planText}>{item.name}</Text>
                  <Checkbox
                    value={item.completed}
                    onValueChange={() => handleToggleComplete(item)}
                    color={item.completed ? '#e04091' : '#e04091'}
                  />
                </View>
              )}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Search Users"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => handleUserSelect(item.id)}
                >
                  <Text style={styles.userName}>{item.displayName}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.button} onPress={() => setShowMyProfile(true)}>
              <Text style={styles.buttonText}>My Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 255, 255, 0.5)',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  boldLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(255, 0, 127, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#e04091',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  userName: {
    fontSize: 18,
  },
  planItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  planText: {
    fontSize: 16,
    flex: 1,
  },
});

export default Profile;
