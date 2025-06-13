import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { BACKEND_URL } from '@env';

const AddNote = ({ userId, onSuccess }) => {
  const [content, setContent] = useState(''); // Note content
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  // Function to handle note addition
  const handleAddNote = async () => {
    try {
      // Send a POST request to add the note
      const response = await axios.post(`${BACKEND_URL}/api/notes/add/${userId}`, {
        content,
      });

      console.log('Response:', response);  // Log the response for debugging

      if (response.status === 201) {
        setMessage('Finansal not başarıyla eklendi!');
        setMessageType('success');
        onSuccess(); // Callback function to refresh the notes list
      } else {
        setMessage('Not eklenemedi. Lütfen tekrar deneyin.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);  // Log the error for debugging
      setMessage('Not eklerken bir hata oluştu.');
      setMessageType('error');
    }

    // Clear the message after 2 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni bir not ekle</Text>

      <TextInput
        placeholder="Not içeriğini yazın"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />

      <Button title="Not Ekle" onPress={handleAddNote} />

      {message ? (
        <Text style={[styles.message, { color: messageType === 'success' ? 'green' : 'red' }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 5,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddNote;
