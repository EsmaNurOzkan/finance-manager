import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState<string>('');

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isEditDatePickerVisible, setEditDatePickerVisible] = useState(false);

  const SERVER_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) {
          setError('User ID not found.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${SERVER_URL}/api/reminders/get/${userId}`);
        setReminders(response.data.reminders);
      } catch (err) {
        setError('An error occurred while fetching reminders.');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleDeleteReminder = (reminderId: string) => {
    Alert.alert('Delete Confirmation', 'Are you sure you want to delete this reminder?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setIsProcessing(true);
            const userId = await SecureStore.getItemAsync('userId');
            if (!userId) return;

            await axios.delete(`${SERVER_URL}/api/reminders/delete/${userId}/${reminderId}`);
            setReminders((prevReminders) => prevReminders.filter((r) => r._id !== reminderId));

            setSuccessMessage('Reminder deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 2000);
          } catch (err) {
            setError('An error occurred while deleting the reminder.');
          } finally {
            setIsProcessing(false);
          }
        },
      },
    ]);
  };

  const handleAddReminder = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) return;

      const newReminder = {
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
      };

      const response = await axios.post(`${SERVER_URL}/api/reminders/add/${userId}`, newReminder);
      setReminders((prevReminders) => [...prevReminders, response.data]);
      setAddModalVisible(false);
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');

      setSuccessMessage('Reminder added successfully!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError('An error occurred while adding the new reminder.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateReminder = async () => {
    if (!selectedReminder) return;

    try {
      setIsProcessing(true);
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) return;

      const updatedReminder = {
        title: newTitle || selectedReminder.title,
        description: newDescription || selectedReminder.description,
        dueDate: newDueDate || selectedReminder.dueDate,
      };

      const response = await axios.patch(
        `${SERVER_URL}/api/reminders/update/${userId}/${selectedReminder._id}`,
        updatedReminder
      );

      setReminders((prevReminders) =>
        prevReminders.map((reminder) =>
          reminder._id === selectedReminder._id ? response.data : reminder
        )
      );

      setEditModalVisible(false);
      setSuccessMessage('Reminder updated successfully!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError('An error occurred while updating the reminder.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAddDate = (date: Date) => {
    setNewDueDate(date.toISOString());
    setDatePickerVisible(false);
  };

  const handleConfirmEditDate = (date: Date) => {
    setNewDueDate(date.toISOString());
    setEditDatePickerVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminders</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setNewTitle('');
          setNewDescription('');
          setNewDueDate('');
          setAddModalVisible(true);
        }}
      >
        <Icon name="plus" size={24} color="green" />
      </TouchableOpacity>

      {successMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{successMessage}</Text>
        </View>
      )}

      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <FlatList
        data={reminders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
          const today = new Date();
          const dueDate = new Date(item.dueDate);
          const timeDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isUrgent = timeDiff < 3;

          return (
            <View style={styles.reminderItem}>
              <View style={styles.reminderDetails}>
                <Text style={styles.reminderTitle}>
                  {item.title} {isUrgent && <Text style={{ color: 'red' }}>⚠️</Text>}
                </Text>
                <Text style={styles.reminderDescription}>{item.description}</Text>
                <Text style={styles.reminderDueDate}>
                  Due Date: {dueDate.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedReminder(item);
                    setNewTitle(item.title);
                    setNewDescription(item.description);
                    setNewDueDate(item.dueDate);
                    setEditModalVisible(true);
                  }}
                  style={styles.icon}
                >
                  <Icon name="pencil" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteReminder(item._id)} style={styles.icon}>
                  <Icon name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Reminder</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newDescription}
              onChangeText={setNewDescription}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.dateButtonText}>
                {newDueDate
                  ? new Date(newDueDate).toLocaleDateString()
                  : 'Select Due Date'}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              display="spinner"
              onConfirm={handleConfirmAddDate}
              onCancel={() => setDatePickerVisible(false)}
            />

            <View style={styles.modalButtons}>
              <Button title="Add" color="#003300" onPress={handleAddReminder} />
              <Button title="Close" color="#4B0000" onPress={() => setAddModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Reminder</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newDescription}
              onChangeText={setNewDescription}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setEditDatePickerVisible(true)}
            >
              <Text style={styles.dateButtonText}>
                {newDueDate
                  ? new Date(newDueDate).toLocaleDateString()
                  : 'Select Due Date'}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isEditDatePickerVisible}
              mode="date"
              display="spinner"
              onConfirm={handleConfirmEditDate}
              onCancel={() => setEditDatePickerVisible(false)}
            />

            <View style={styles.modalButtons}>
              <Button title="Update" color="#003300" onPress={handleUpdateReminder} />
              <Button title="Close" color="#4B0000" onPress={() => setEditModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  addButton: { alignSelf: 'flex-end', marginBottom: 20 },
  reminderItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderDetails: { flex: 1 },
  reminderTitle: { fontSize: 18, fontWeight: 'bold' },
  reminderDescription: { fontSize: 14, color: '#555' },
  reminderDueDate: { fontSize: 12, color: '#888' },
  iconsContainer: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginLeft: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red' },
  successMessageContainer: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successMessage: { color: 'white', textAlign: 'center' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalTitle: { margin: 5, fontWeight: 'bold', fontSize: 18 },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  dateButtonText: { color: '#007bff', fontWeight: 'bold' },
});
