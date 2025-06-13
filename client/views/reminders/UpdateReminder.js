import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { BACKEND_URL } from '@env';

const UpdateReminder = ({ userId, reminderId, onSuccess, existingReminder }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  // Bileşen yüklendiğinde mevcut hatırlatıcı bilgilerini ayarla
  useEffect(() => {
    if (existingReminder) {
      setTitle(existingReminder.title);
      setDescription(existingReminder.description);
      setDueDate(existingReminder.dueDate);
    }
  }, [existingReminder]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`${BACKEND_URL}/api/reminders/update/${userId}/${reminderId}`, {
        title,
        description,
        dueDate,
      });

      setMessage("Hatırlatıcı başarıyla güncellendi.");
      onSuccess(); // Güncelleme başarılıysa üst bileşene bilgi ver

      // Mesajı 2 saniye sonra temizle
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage("Hatırlatıcı güncellenirken hata oluştu.");
      console.error("Hatırlatıcı güncellenirken hata:", error);

      // Mesajı 2 saniye sonra temizle
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlık</Text>
      <TextInput
        style={styles.input}
        value={title} // Burada mevcut değeri gösteriyoruz
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={styles.input}
        value={description} // Burada mevcut değeri gösteriyoruz
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Son Tarih</Text>
      <TextInput
        style={styles.input}
        value={dueDate} // Burada mevcut değeri gösteriyoruz
        onChangeText={setDueDate}
      />

      <Button title="Hatırlatıcıyı Güncelle" onPress={handleUpdate} color="dodgerblue" />

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

export default UpdateReminder;
