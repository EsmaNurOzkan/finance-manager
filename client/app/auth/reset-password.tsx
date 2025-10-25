import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';

  const handleSendResetCode = async () => {
  setLoading(true);
  const trimmedEmail = email.trim();  
  if (!trimmedEmail) {
    setMessage('Please enter a valid email address!');
    setLoading(false);
    return;
  }

  try {
    await axios.post(`${backendUrl}/api/auth/sendresetlink`, { email: trimmedEmail });
    setMessage('A reset code has been sent to your email.');
    setStep(2);
  } catch (error) {
    setMessage('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleVerifyCode = async () => {
  setLoading(true);
  const trimmedResetCode = resetCode.trim();  
  try {
    const response = await axios.post(`${backendUrl}/api/auth/verifycode`, { email, resetCode: trimmedResetCode });
    if (response.data.success) {
      setMessage('Code verified! You can now reset your password.');
      setStep(3);
    } else {
      setMessage('Invalid code, please try again!');
    }
  } catch (error) {
    setMessage('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleResetPassword = async () => {
  setLoading(true);
  const trimmedNewPassword = newPassword.trim(); 
  const trimmedConfirmPassword = confirmPassword.trim();  

  if (trimmedNewPassword.length < 8) {
    setMessage('Password must be at least 8 characters!');
    setLoading(false);
    return;
  }

  if (trimmedNewPassword !== trimmedConfirmPassword) {
    setMessage('Passwords do not match!');
    setLoading(false);
    return;
  }

  try {
    await axios.post(`${backendUrl}/api/auth/resetpassword`, { email, resetCode, newPassword: trimmedNewPassword });
    setMessage('Your password has been successfully reset!');
    setTimeout(() => router.push('/auth/login'), 2000);
  } catch (error) {
    setMessage('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
  <View style={styles.container}>
    {step === 1 && (
      <>
        <Text style={styles.label}>Enter your email address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleSendResetCode}>
          <Text style={styles.buttonText}>Send reset code</Text>
        </TouchableOpacity>
      </>
    )}

    {step === 2 && (
      <>
        <Text style={styles.label}>Enter the reset code sent to your email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Reset code"
          placeholderTextColor="#999"
          value={resetCode}
          onChangeText={setResetCode}
        />
        <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
          <Text style={styles.buttonText}>Verify code</Text>
        </TouchableOpacity>
      </>
    )}

    {step === 3 && (
      <>
        <Text style={styles.label}>Enter your new password:</Text>
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset password</Text>
        </TouchableOpacity>
      </>
    )}

    {loading && <ActivityIndicator color="#6200EE" style={styles.loading} />}
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
  },
});

export default ResetPassword;
