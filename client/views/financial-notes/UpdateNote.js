// stil duzenlemesı: update ıcın bastırılan ınput kutusu cok kucuk


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { BACKEND_URL } from '@env';

const UpdateNote = ({ userId, noteId, onSuccess, existingNote }) => {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  // Bileşen yüklendiğinde mevcut hatırlatıcı bilgilerini ayarla
  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content);
    }
  }, [existingNote]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`${BACKEND_URL}/api/notes/update/${userId}/${noteId}`, {
        content
      });

      setMessage("Not başarıyla güncellendi.");
      onSuccess(); // Güncelleme başarılıysa üst bileşene bilgi ver

      // Mesajı 2 saniye sonra temizle
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage("Not güncellenirken hata oluştu.");
      console.error("Not güncellenirken hata:", error);

      // Mesajı 2 saniye sonra temizle
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <View style={styles.container}>
      

      <Text style={styles.label}>Not</Text>
      <TextInput
        style={styles.input}
        value={content} // Burada mevcut değeri gösteriyoruz
        onChangeText={setContent}
      />

      <Button title="Notu Güncelle" onPress={handleUpdate} color="dodgerblue" />

      {/* Mesaj alanı */}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: 'green', // Başarı mesajı için yeşil renk
    textAlign: 'center',
  },
});

export default UpdateNote;
