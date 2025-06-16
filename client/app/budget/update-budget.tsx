import React, { useState } from 'react';
import axios from 'axios';
import { View, Button, TextInput, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface UpdateBudgetProps {
  userId: string;
  budgetId: string;
  onSuccess?: (amount: string) => void;
}

const UpdateBudget: React.FC<UpdateBudgetProps> = ({ userId, budgetId, onSuccess }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [amount, setAmount] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleUpdateBudget = async () => {
    if (!startDate || !endDate || !amount) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await axios.patch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/update/${userId}/${budgetId}`, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        amount: Number(amount),
      });
      setSuccessMessage('Bütçe başarıyla güncellendi!');
      onSuccess?.(amount);
    } catch (error: any) {
      const errorResponse = error.response?.data?.message || 'Bütçe güncellenirken bir hata oluştu.';
      setErrorMessage(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Başlangıç Tarihi</Text>
      <Button title="Tarih Seç" onPress={() => setShowStartPicker(true)} />
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
      <Text style={styles.dateText}>{startDate?.toISOString().split('T')[0]}</Text>

      <Text style={styles.label}>Bitiş Tarihi</Text>
      <Button title="Tarih Seç" onPress={() => setShowEndPicker(true)} />
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
      <Text style={styles.dateText}>{endDate?.toISOString().split('T')[0]}</Text>

      <TextInput
        style={styles.input}
        placeholder="Bütçe Tutarı"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Bütçeyi Güncelle" onPress={handleUpdateBudget} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.loader} />}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'gray',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  dateText: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    fontSize: 16,
  },
  loader: {
    marginVertical: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
});

export default UpdateBudget;
