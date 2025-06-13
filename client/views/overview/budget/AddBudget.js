//default enddate bugun ayın kacıysa bır sonrakı ayın o gunu olacak
//ayrıca su yazı olsun .... tarihine kadar geçerli net butceyı girin (noktalı yer:bugun ayın kacıysa bır sonrakı ayın o gunu )


import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BACKEND_URL } from '@env'; // Çevresel değişkenler

const AddBudget = ({ userId, onSuccess }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(null);

  const handleAddBudget = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/budgets/add/${userId}`, {
        startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
        endDate: endDate.toISOString().split('T')[0],
        amount: Number(amount),
      });
      setSuccess(true);
      onSuccess && onSuccess(amount); // Başarı durumunda ana bileşene haber ver
    } catch (error) {
      setSuccess(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlangıç Tarihi</Text>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy-MM-dd"
        className="react-datepicker"
      />

      <Text style={styles.label}>Bitiş Tarihi</Text>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="yyyy-MM-dd"
        className="react-datepicker"
      />

      <TextInput
        style={styles.input}
        placeholder="Bütçe Tutarı"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Bütçe Ekle" onPress={handleAddBudget} />
      {success === true && <Text style={{ color: 'green' }}>Bütçe başarıyla eklendi!</Text>}
      {success === false && <Text style={{ color: 'red' }}>Bütçe eklenirken hata oluştu.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    fontSize: 16,
  },
});

export default AddBudget;
