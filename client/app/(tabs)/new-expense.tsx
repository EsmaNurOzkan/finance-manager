import { ExpenseContext } from "@/contexts/ExpenseContext";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function NewExpense({ navigation }: any) {
  const { setExpenseAdded } = useContext(ExpenseContext)!;
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleAddExpense = async () => {
    try {
      setLoading(true);

      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        setErrorMessage("User ID not found!");
        setLoading(false);
        return;
      }

      const currentBudget = await SecureStore.getItemAsync("currentBudget");
      if (!currentBudget || parseFloat(currentBudget) <= 0) {
        setErrorMessage("Please enter your budget before adding any expenses!");
        setLoading(false);
        return;
      }

      if (!amount || !category) {
        setErrorMessage("Amount and category cannot be empty!");
        setLoading(false);
        return;
      }

      const expenseData = {
        amount: parseFloat(amount),
        category,
        date: date.toISOString(),
      };

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/add/${userId}`,
        expenseData
      );

      if (response.status === 201) {
        setErrorMessage("");
        alert("Expense added successfully!");
        setAmount("");
        setCategory("");
        setDate(new Date());
        setExpenseAdded((prev) => !prev);
      }

      setLoading(false);
    } catch (error) {
      const errorDetail = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to add expense!"
        : "Something went wrong!";
      setErrorMessage(errorDetail);
      console.error("Error Detail:", error);
      setLoading(false);
    }
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#555"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#555"
        value={category}
        onChangeText={setCategory}
      />

      <Pressable
        style={styles.dateButton}
        onPress={() => setDatePickerVisibility(true)}
      >
        <Text style={styles.dateButtonText}>
          📅 {date.toLocaleDateString("tr-TR")}
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
        date={date}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Adding expense...</Text>
        </View>
      ) : (
        <Pressable style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </Pressable>
      )}

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffcccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  errorText: {
    color: "#d9534f",
    textAlign: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});
