
import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter reset code, Step 3: Set new password
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendResetCode = async () => {
    setLoading(true);
    if (!email) {
      setMessage('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/sendresetlink', { email });
      setMessage('A reset code has been sent to your email');
      setStep(2);
    } catch (error) {
      setMessage('An error occurred while sending the email');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verifycode', { email, resetCode });
      if (response.data.success) {
        setMessage('Code verified. Now you can reset your password.');
        setStep(3);
      } else {
        setMessage('Invalid code. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while verifying the code');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/resetpassword', { email, resetCode, newPassword });
      setMessage('Password has been reset successfully');
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (error) {
      setMessage('An error occurred while resetting the password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {step === 1 && (
        <>
          <Text>Enter your email address:</Text>
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 20, padding: 8 }}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Send Reset Code" onPress={handleSendResetCode} />
        </>
      )}

      {step === 2 && (
        <>
          <Text>Enter the reset code sent to your email:</Text>
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 20, padding: 8 }}
            placeholder="Reset Code"
            value={resetCode}
            onChangeText={setResetCode}
          />
          <Button title="Verify Code" onPress={handleVerifyCode} />
        </>
      )}

      {step === 3 && (
        <>
          <Text>Enter your new password:</Text>
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 20, padding: 8 }}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={{ borderBottomWidth: 1, marginBottom: 20, padding: 8 }}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button title="Reset Password" onPress={handleResetPassword} />
        </>
      )}

      {loading && <ActivityIndicator color="#0000ff" />}
      
      {message && <Text style={{ marginTop: 20, color: 'red' }}>{message}</Text>}
    </View>
  );
};

export default ResetPassword;
