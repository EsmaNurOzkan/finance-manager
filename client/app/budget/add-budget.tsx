import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface AddBudgetProps {
  userId: string;
  onSuccess?: (amount: string) => void;
}

const AddBudget: React.FC<AddBudgetProps> = ({ userId, onSuccess }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddBudget = async () => {
    if (!startDate || !endDate || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/add/${userId}`, {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        amount: Number(amount),
      });

      Alert.alert('Success', 'Budget added successfully!');
      onSuccess?.(amount);
      setStartDate(null);
      setEndDate(null);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the budget.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setStartPickerVisible(true)}
      >
        <Text style={styles.dateText}>
          {startDate ? formatDate(startDate) : 'Select start date'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDate(date);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setEndPickerVisible(true)}
      >
        <Text style={styles.dateText}>
          {endDate ? formatDate(endDate) : 'Select end date'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDate(date);
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />

      <Text style={styles.label}>Budget Amount</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: '#fff' }]}
        activeOpacity={1}
      >
        <TextInput
          style={styles.amountInput}
          placeholder="Enter budget amount"
          placeholderTextColor="#888"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </TouchableOpacity>

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
  dateButton: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  amountInput: {
    fontSize: 18,
    color: '#333',
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
