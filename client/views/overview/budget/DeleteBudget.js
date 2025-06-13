// client/views/overview/budget/DeleteBudget.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Text, View } from 'react-native';
import { BACKEND_URL } from '@env';

const DeleteBudget = ({ userId, budgetId, onSuccess }) => {
  const [success, setSuccess] = useState(null);

  const handleDeleteBudget = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/budgets/${userId}/${budgetId}`);
      setSuccess(true);
      onSuccess && onSuccess(); // Başarı durumunda onSuccess'i tetikle
    } catch (error) {
      setSuccess(false);
    }
  };

  return (
    <View>
      <Button title="Delete Budget" onPress={handleDeleteBudget} />
      {success === true && <Text style={{ color: 'green' }}>Budget deleted successfully!</Text>}
      {success === false && <Text style={{ color: 'red' }}>Failed to delete budget.</Text>}
    </View>
  );
};

export default DeleteBudget;
