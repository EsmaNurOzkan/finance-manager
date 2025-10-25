import React, { useState } from 'react';
import axios from 'axios';
import { View, Button, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface UpdateBudgetProps {
  userId: string;
  budgetId: string;
  onSuccess?: (amount: string) => void;
}

const UpdateBudget: React.FC<UpdateBudgetProps> = ({ userId, budgetId, onSuccess }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isValidDate = (dateStr: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const handleUpdateBudget = async () => {
    if (!startDate || !endDate || !amount) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage(null);
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      setErrorMessage('Please enter dates in YYYY-MM-DD format.');
      setSuccessMessage(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await axios.patch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/update/${userId}/${budgetId}`, {
        startDate,
        endDate,
        amount: Number(amount),
      });
      setSuccessMessage('Budget updated successfully!');
      onSuccess?.(amount);
    } catch (error: any) {
      const errorResponse = error.response?.data?.message || 'An error occurred while updating the budget.';
      setErrorMessage(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-06-17"
        value={startDate}
        onChangeText={setStartDate}
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
      />

      <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-06-30"
        value={endDate}
        onChangeText={setEndDate}
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
      />

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
