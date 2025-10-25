import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface AddBudgetProps {
  userId: string;
  onSuccess?: (amount: string) => void;
}

const AddBudget: React.FC<AddBudgetProps> = ({ userId, onSuccess }) => {
  const [startDate, setStartDate] = useState<string>(''); // now string
  const [endDate, setEndDate] = useState<string>('');     // now string
  const [amount, setAmount] = useState<string>('');

  // Simple date format check: YYYY-MM-DD
  const isValidDate = (dateStr: string) => {
    // Checks if the string matches YYYY-MM-DD format
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const handleAddBudget = async () => {
    if (!startDate || !endDate || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      Alert.alert('Error', 'Please enter dates in YYYY-MM-DD format.');
      return;
    }

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/add/${userId}`, {
        startDate,
        endDate,
        amount: Number(amount),
      });
      Alert.alert('Success', 'Budget added successfully!');
      onSuccess?.(amount);
      setStartDate('');
      setEndDate('');
      setAmount('');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the budget.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-06-17"
        placeholderTextColor="#888"
        value={startDate}
        onChangeText={setStartDate}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-06-30"
        placeholderTextColor="#888"
        value={endDate}
        onChangeText={setEndDate}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Budget Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter budget amount"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddBudget}>
        <Text style={styles.addButtonText}>Add Budget</Text>
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
