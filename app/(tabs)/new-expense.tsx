import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ExpenseContext } from "@/contexts/ExpenseContext";

export default function NewExpense({ navigation }: any) {
  const { setExpenseAdded } = useContext(ExpenseContext)!;
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    try {
      setLoading(true);

      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        setErrorMessage("Kullanıcı kimliği bulunamadı!");
        setLoading(false);
        return;
      }

      if (!amount || !category) {
        setErrorMessage("Miktar ve kategori boş olamaz!");
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
        alert("Harcama başarıyla eklendi!");
        setAmount("");
        setCategory("");
        setDate(new Date());
        setExpenseAdded(prev => !prev);
      }

      setLoading(false);
    } catch (error) {
      const errorDetail = axios.isAxiosError(error)
        ? error.response?.data?.error || "Harcama eklenemedi!"
        : "Bir şeyler ters gitti!";
      setErrorMessage(errorDetail);
      console.error("Hata Detayı:", error);
      setLoading(false);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Harcama Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Miktar"
        placeholderTextColor="#555"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Kategori"
        placeholderTextColor="#555"
        value={category}
        onChangeText={setCategory}
      />

      <Pressable style={styles.dateButton} onPress={showDatepicker}>
        <Text style={styles.dateButtonText}>{date.toLocaleDateString("tr-TR")}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          locale="tr-TR"
        />
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Harcama ekleniyor...</Text>
        </View>
      ) : (
        <Pressable style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Harcama Ekle</Text>
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
    padding: 8,
    borderRadius: 14,
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
    margin:5,
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
