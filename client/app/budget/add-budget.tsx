import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddBudgetProps {
  userId: string;
  onSuccess?: (amount: string) => void;
}

const AddBudget: React.FC<AddBudgetProps> = ({ userId, onSuccess }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [amount, setAmount] = useState<string>(''); 
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleAddBudget = async () => {
    if (!startDate || !endDate || !amount) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/add/${userId}`, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        amount: Number(amount),
      });
      Alert.alert('Başarılı', 'Bütçe başarıyla eklendi!');
      onSuccess?.(amount);
      setAmount('');
    } catch (error) {
      Alert.alert('Hata', 'Bütçe eklenirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlangıç Tarihi</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {startDate ? startDate.toLocaleDateString('tr-TR') : 'Tarih Seç'}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          locale="tr-TR" 
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Bitiş Tarihi</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {endDate ? endDate.toLocaleDateString('tr-TR') : 'Tarih Seç'}
        </Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          locale="tr-TR" 
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

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
  datePickerButton: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  datePickerText: {
    fontSize: 18,
    color: '#007AFF',
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
