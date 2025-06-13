//user.budgets bos arrayse ya da doluysa fakat son girilmis butce ıtemının enddate'ini geçmişsek
//harcama ekyemezsınız uyarısı verılsın. ("Önce butce girişi yapmalısınız..")
//tarıh kutusunun sutunde tarıh yazmıyor ve stili çok kötu

import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

const AddExpense = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async () => {
    if (!amount || !category) {
      setSuccessMessage('Hata: Lütfen tüm alanları doldurun.');
      return;
    }

    if (!userId) {
      setSuccessMessage('Hata: Kullanıcı ID alınamadı.');
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/expenses/add/${userId}`, {
        amount: parseFloat(amount),
        category,
        date,
      });

      setSuccessMessage(response.data.message || 'Harcama başarıyla eklendi!');
      resetForm();
    } catch (error) {
      console.error('Axios Hatası:', error.response ? error.response.data : error.message);
      setSuccessMessage('Hata: Harcama eklenirken bir sorun oluştu: ' + (error.response ? error.response.data : error.message));
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDate(new Date());
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Yeni Harcama Ekle</Text>

        <TextInput
          label="Miktar (örnek: 50.00)"
          mode="outlined"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9.]/g, '');
            setAmount(numericValue);
          }}
          style={styles.input}
        />

        <TextInput
          label="Kategori (örnek: Yemek)"
          mode="outlined"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <TouchableOpacity>
          <ReactDatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            className="datePicker"
          />
        </TouchableOpacity>

        <Button title="Harcama Ekle" onPress={handleSubmit} />

        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AddExpense;
