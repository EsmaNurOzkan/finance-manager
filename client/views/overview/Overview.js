//butce kısmı cok fazla yer kaplıyor ustte ve kucuk yazsın ve ortalansın. yazıyla kutucuk ayrıksı durmasın

//user.expenses anlık erişilecek ki butce kutusundakı mıktar baslangıc miktarı-o ayki harcamalar


import React, { useState, useEffect } from 'react';
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
import { BACKEND_URL } from '@env';
import AddBudget from './budget/AddBudget';
import UpdateBudget from './budget/UpdateBudget';
import PieChartGraph from './PieChartGraph';
import Reporting from './Reporting';

const { height } = Dimensions.get('window');

const Overview = ({ userId }) => {
  const [budget, setBudget] = useState('');
  const [originalBudget, setOriginalBudget] = useState(0); // Orijinal bütçe
  const [placeholder, setPlaceholder] = useState('Aylık bütçenizi girin');
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [budgetId, setBudgetId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Aylık');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/budgets/get/${userId}`);
        if (response.status === 200 && response.data.budgets.length > 0) {
          const lastBudget = response.data.budgets[response.data.budgets.length - 1];
          const currentDate = new Date();
          if (new Date(lastBudget.endDate) >= currentDate) {
            setBudget(`${lastBudget.amount} ₺`);
            setOriginalBudget(lastBudget.amount); // Orijinal bütçeyi sakla
            setBudgetId(lastBudget._id);
            calculateRemainingBudget(lastBudget); // Harcamaları kontrol et
          } else {
            setBudget('');
            setPlaceholder('Aylık bütçenizi girin');
          }
        } else {
          setBudget('');
          setPlaceholder('Aylık bütçenizi girin');
        }
      } catch (error) {
        alert('Bütçe verileri alınırken bir hata oluştu');
      }
    };

    const calculateRemainingBudget = async (lastBudget) => {
      try {
        const expenseResponse = await axios.get(`${BACKEND_URL}/api/expenses/get/${userId}`);
        if (expenseResponse.status === 200) {
          const expenses = expenseResponse.data;
          const startDate = new Date(lastBudget.startDate);
          const endDate = new Date(lastBudget.endDate);

          // Bütçe aralığındaki harcamaları filtrele
          const filteredExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
          });

          // Harcamaların toplamını hesapla
          const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

          // Kalan bütçeyi güncelle
          const remainingBudget = lastBudget.amount - totalExpenses;
          setBudget(`${remainingBudget} ₺`);
        }
      } catch (error) {
        alert('Harcama verileri alınırken bir hata oluştu');
      }
    };

    fetchBudgets();
  }, [userId]);

  const handleBudgetClick = () => {
    setIsUpdateMode(!!budget);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSuccess = (newBudget) => {
    setBudget(`${newBudget} ₺`);
    setOriginalBudget(newBudget);
    handleModalClose();
  };

  const filters = ['Günlük', 'Haftalık', 'Aylık'];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Budget Section */}
        <View style={styles.budgetContainer}>
          <Text style={styles.label}>Bütçe</Text>
          <TouchableOpacity onPress={handleBudgetClick}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={budget}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        {/* Navbar */}
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
          <PieChartGraph userId={userId} period={selectedFilter} />
          <Reporting userId={userId} period={selectedFilter} />
        </View>

        {/* Modal for Budget */}
        <Modal visible={modalVisible} animationType="slide" onRequestClose={handleModalClose}>
          {isUpdateMode ? (
            <UpdateBudget userId={userId} budgetId={budgetId} onSuccess={handleSuccess} />
          ) : (
            <AddBudget userId={userId} onSuccess={handleSuccess} />
          )}
          <Button title="Kapat" onPress={handleModalClose} />
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    height: height * 0.7,
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  budgetContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    width: '80%',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    width: '90%',
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navItemSelected: {
    backgroundColor: '#0056b3',
  },
  navText: {
    fontSize: 16,
    color: '#fff',
  },
  navTextSelected: {
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
});

export default Overview;

