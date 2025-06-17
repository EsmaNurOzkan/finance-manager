import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface AddBudgetProps {
  userId: string;
  onSuccess?: (amount: string) => void;
}

const AddBudget: React.FC<AddBudgetProps> = ({ userId, onSuccess }) => {
  const [startDate, setStartDate] = useState<string>(''); // artık string
  const [endDate, setEndDate] = useState<string>('');     // artık string
  const [amount, setAmount] = useState<string>('');

  // Basit tarih formatı kontrolü: YYYY-MM-DD
  const isValidDate = (dateStr: string) => {
    // Regex ile YYYY-MM-DD formatında olup olmadığını kontrol eder
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const handleAddBudget = async () => {
    if (!startDate || !endDate || !amount) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      Alert.alert('Hata', 'Lütfen tarihleri YYYY-AA-GG formatında girin.');
      return;
    }

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/add/${userId}`, {
        startDate,
        endDate,
        amount: Number(amount),
      });
      Alert.alert('Başarılı', 'Bütçe başarıyla eklendi!');
      onSuccess?.(amount);
      setStartDate('');
      setEndDate('');
      setAmount('');
    } catch (error) {
      Alert.alert('Hata', 'Bütçe eklenirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlangıç Tarihi (YYYY-AA-GG)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-06-17"
        placeholderTextColor="#888"
        value={startDate}
        onChangeText={setStartDate}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Bitiş Tarihi (YYYY-AA-GG)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-06-30"
        placeholderTextColor="#888"
        value={endDate}
        onChangeText={setEndDate}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Bütçe Tutarı</Text>
      <TextInput
        style={styles.input}
        placeholder="Bütçe tutarını girin"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddBudget}>
        <Text style={styles.addButtonText}>Bütçe Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    paddingTop: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddBudget;
