import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AddBudget from '../budget/add-budget';
import UpdateBudget from '../budget/update-budget';
import PieChartGraph from '../pie-chart-graph';
import Reporting from '../reporting';
import { ExpenseContext } from "@/contexts/ExpenseContext";


const { height } = Dimensions.get('window');

interface Budget {
  amount: number;
  _id: string;
  startDate: string;
  endDate: string;
}

const Overview: React.FC = () => {
  const { expenseAdded, setExpenseAdded } = useContext(ExpenseContext)!;
  const [budget, setBudget] = useState<string>('');
  const [originalBudget, setOriginalBudget] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState<string>('Enter your monthly budget');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('Monthly');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync('userId');
        if (id) {
          setUserId(id);
        } else {
          alert('User ID not found.');
        }
      } catch (error) {
        console.error('User ID fetch error:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) {
      console.log('User ID not available, operation cancelled.');
      return;
    }

    const fetchBudgets = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/budgets/get/${userId}`);

        if (response.status === 200 && response.data.budgets.length > 0) {
          const lastBudget: Budget = response.data.budgets[response.data.budgets.length - 1];

          const currentDate = new Date();

          if (new Date(lastBudget.endDate) >= currentDate) {
            setBudget(`${lastBudget.amount} ₺`);
            setOriginalBudget(lastBudget.amount);
            setBudgetId(lastBudget._id);

            calculateRemainingBudget(lastBudget);
          } else {
            setBudget('');
            setPlaceholder('Enter your monthly budget');
          }
        } else {
          setBudget('');
          setPlaceholder('Enter your monthly budget');
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.response?.data || error.message);
          alert('An error occurred while fetching data from the server: ' + error.message);
        } else if (error instanceof Error) {
          console.error('General error:', error.message);
          alert('An unexpected error occurred: ' + error.message);
        } else {
          console.error('Unknown error:', error);
          alert('An unexpected error occurred.');
        }
      }
    };

    const calculateRemainingBudget = async (lastBudget: Budget) => {
      try {
        const expenseResponse = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/get/${userId}`);

        if (expenseResponse.status === 200) {
          const expenses = expenseResponse.data;

          const startDate = new Date(lastBudget.startDate);
          const endDate = new Date(lastBudget.endDate);

          const filteredExpenses = expenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
          });

          const totalExpenses = filteredExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);

          const remainingBudget = lastBudget.amount - totalExpenses;

          setBudget(`${remainingBudget} ₺`);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.response?.data || error.message);
          alert('An error occurred while fetching expense data: ' + error.message);
        } else if (error instanceof Error) {
          console.error('General error:', error.message);
          alert('An unexpected error occurred: ' + error.message);
        } else {
          console.error('Unknown error:', error);
          alert('An unexpected error occurred.');
        }
      }
    };

    fetchBudgets();
  }, [userId, expenseAdded]);

  const handleBudgetClick = () => {
    setIsUpdateMode(!!budget);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSuccess = (newBudget: string | number) => {
    const parsedBudget = typeof newBudget === 'string' ? parseFloat(newBudget) : newBudget;
    if (!isNaN(parsedBudget)) {
      setBudget(`${parsedBudget} ₺`);
      setOriginalBudget(parsedBudget);
    }
    handleModalClose();
  };

  const filters = ['Daily', 'Weekly', 'Monthly'];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.budgetContainer}>
          <Text style={styles.label}>BUDGET</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={budget}
            editable={true} 
            onFocus={handleBudgetClick} 
          />
        </View>

        <View style={styles.navbar}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.navItem,
                selectedFilter === filter && styles.navItemSelected,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.navText,
                  selectedFilter === filter && styles.navTextSelected,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <PieChartGraph period={selectedFilter} userId={userId} />
          <Reporting period={selectedFilter} userId={userId} />
        </View>

        <Modal visible={modalVisible} animationType="slide" onRequestClose={handleModalClose}>
          {isUpdateMode ? (
            <UpdateBudget userId={userId || ''} budgetId={budgetId!} onSuccess={handleSuccess} />
          ) : (
            <AddBudget userId={userId || ''} onSuccess={handleSuccess} />
          )}
          <Button title="Close" onPress={handleModalClose} />
        </Modal>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  budgetContainer: {
    textAlign:"center",
    justifyContent: "center",
    alignItems:"center",
    marginBottom: 20,
  },
  label: {
    textAlign:"center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    width: "50%",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#f8f8f8',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  navItemSelected: {
    backgroundColor: '#007bff',
  },
  navText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  navTextSelected: {
    color: '#fff',
  },
  chartContainer: {
    marginTop: 20,
  },
});

export default Overview;
