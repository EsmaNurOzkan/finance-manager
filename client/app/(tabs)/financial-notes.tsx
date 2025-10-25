import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const FinancialNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [updatedContent, setUpdatedContent] = useState<string>('');
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await SecureStore.getItemAsync('userId');
      if (userId) {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notes/get/${userId}`
        );
        if (response.status === 200) {
          setNotes(response.data.notes);
        } else {
          setError('Failed to load the notes..');
        }
      } else {
        setError("User not found.");
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error occurred while connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
    Alert.alert('Error', 'Note content cannot be empty.');
      return;
    }
    setIsAddingNote(true);
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (userId) {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notes/add/${userId}`,
          { content: newNote },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          setNewNote('');
          setSuccessMessage('Note added successfully!');
          fetchNotes();
          setTimeout(() => {
            setSuccessMessage(null);
            setAddModalVisible(false);
          }, 1000); 
        } else {
        Alert.alert('Error', 'An error occurred while adding the note.');
        }
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'Error occurred while connecting to the server.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateNote = async () => {
  if (!updatedContent.trim()) {
    Alert.alert('Error', 'Updated note cannot be empty.');
    return;
  }
  try {
    const userId = await SecureStore.getItemAsync('userId');
    if (userId && editNoteId) {
      const response = await axios.patch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notes/update/${userId}/${editNoteId}`,
        { content: updatedContent },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        setSuccessMessage('Note updated successfully!');
        fetchNotes();
        setTimeout(() => {
          setSuccessMessage(null);
          setEditModalVisible(false);
        }, 1000); 
      } else {
        Alert.alert('Error', 'An error occurred while updating the note.');
      }
    }
  } catch (err) {
    console.error('Update Note Error:', err);
    Alert.alert('Error', 'An error occurred while connecting to the server.');
  }
};

  const handleDeleteNote = (noteId: string) => {
  Alert.alert(
    'Confirmation',
    'Are you sure you want to delete this note?',
    [
      {
        text: 'No',
        onPress: () => console.log('Deletion canceled'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const userId = await SecureStore.getItemAsync('userId');
            if (userId) {
              const response = await axios.delete(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notes/delete/${userId}/${noteId}`
              );
              if (response.status === 200) {
                fetchNotes();
                Alert.alert('Success', 'Note deleted successfully!');
              } else {
                Alert.alert('Error', 'An error occurred while deleting the note');
              }
            }
          } catch (err) {
            console.error('Delete Note Error:', err);
            Alert.alert('Error', 'An error occurred while connecting to the server.');
          }
        },
      },
    ],
    { cancelable: false }
  );
};


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Notes</Text>

      <View style={styles.addIconWrapper}>
        <TouchableOpacity
          style={styles.addIconContainer}
          onPress={() => setAddModalVisible(true)}
        >
          <Icon name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}

      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteContent}>{item.content}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => {
                setEditNoteId(item._id);
                setUpdatedContent(item.content);
                setEditModalVisible(true);
              }}>
                <Icon name="edit" size={20} color="#1E90FF" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteNote(item._id)}>
                <Icon name="delete" size={20} color="#FF6347" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          Add New Note
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter new note"
          value={newNote}
          onChangeText={setNewNote}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddNote}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setAddModalVisible(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
</Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          Update Note
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Update note"
          value={updatedContent}
          onChangeText={setUpdatedContent}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateNote}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 14,
    textAlign: 'center',
    color: '#333',
  },
  noteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  noteContent: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 80,
  },
  addIconWrapper: {
    alignItems: 'flex-end',
    margin: 10,
  },
  addIconContainer: {
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textInput: {
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  modalTitle: {
    margin: 5,
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    backgroundColor: '#6C757D', 
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 4,
    width: '40%', 
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
});

export default FinancialNotes;
