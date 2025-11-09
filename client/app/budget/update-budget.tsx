import React, { useState } from 'react';
import axios from 'axios';
import { View, Button, TextInput, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface UpdateBudgetProps {
  userId: string;
  budgetId: string;
  onSuccess?: (amount: string) => void;
}

const UpdateBudget: React.FC<UpdateBudgetProps> = ({ userId, budgetId, onSuccess }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateBudget = async () => {
    if (!startDate || !endDate || !amount) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage(null);
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
      setSuccessMessage('Budget updated successfully!');
      onSuccess?.(amount);
      setStartDate(null);
      setEndDate(null);
      setAmount('');
    } catch (error: any) {
      const errorResponse = error.response?.data?.message || 'An error occurred while updating the budget.';
      setErrorMessage(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {startDate ? startDate.toISOString().split('T')[0] : 'Select Start Date'}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {endDate ? endDate.toISOString().split('T')[0] : 'Select End Date'}
        </Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Budget Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Button title="Update Budget" onPress={handleUpdateBudget} disabled={loading} />

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
    color: 'white',
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  loader: {
    marginVertical: 10,
  },
  successText: {
    color: 'lightgreen',
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
