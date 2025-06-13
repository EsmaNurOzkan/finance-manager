import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { BACKEND_URL } from '@env';

const AddReminder = ({ userId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleAddReminder = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/reminders/add/${userId}`, {
        title,
        description,
        dueDate,
      });

      if (response.status === 201) {
        setMessage('Anımsatıcı başarıyla eklendi!');
        setMessageType('success');
        onSuccess(); // Başarılı olduğunda callback fonksiyonu tetikle
      } else {
        setMessage('Anımsatıcı eklenemedi. Lütfen tekrar deneyin.');
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      setMessage('Anımsatıcı ekleme sırasında bir hata oluştu.');
      setMessageType('error');
    }

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 2000);
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  return (
    <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Anımsatıcı Ekle</Text>

      <TextInput
        placeholder="Başlık"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
      />

      <TextInput
        placeholder="Açıklama"
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
      />

      <Text style={{ marginBottom: 5 }}>Son Tarih:</Text>
      <Button title="Tarih Seç" onPress={showDatePickerHandler} />

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={{ marginTop: 10, marginBottom: 10 }}>Seçilen Tarih: {dueDate.toLocaleDateString()}</Text>

      <Button title="Anımsatıcı Ekle" onPress={handleAddReminder} />

      {message ? (
        <Text style={{ color: messageType === 'success' ? 'green' : 'red', marginTop: 15 }}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

export default AddReminder;
