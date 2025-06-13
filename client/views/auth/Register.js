

import React, { useState } from 'react';
import axios from 'axios';
import { 
  View, Text, TextInput, Button, Alert, Modal, 
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, ScrollView 
} from 'react-native';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/send-code', { email });
      setShowModal(true);
      setMessage('E-posta adresinize doğrulama kodu gönderildi.');
      setCodeSent(true);
    } catch (error) {
      setError(error.response?.status === 400 
        ? 'Bu e-posta zaten kayıtlı.' 
        : 'Kod gönderilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Şifreniz en az 8 karakter olmalıdır.');
      return;
    }

    if (!codeSent) {
      setError('Önce doğrulama kodu almanız gerekiyor.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username, email, password, code: verificationCode,
      });
      setMessage('Kayıt başarılı.');
      setShowModal(false);
      setError('');
    } catch {
      setError('Kayıt sırasında hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Kayıt Ol</Text>

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre (En az 8 karakter)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Kayıt Ol" onPress={handleSendCode} />

        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Modal
          animationType="slide"
          transparent
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Doğrulama Kodu</Text>
            <Text>E-postanıza gelen kodu girin.</Text>

            <TextInput
              style={styles.input}
              placeholder="Doğrulama kodu"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
            />

            {loading && <ActivityIndicator size="small" color="#0000ff" />}

            <Button title="Doğrula ve Kayıt Ol" onPress={handleSubmit} />
            <Button title="Kapat" onPress={() => setShowModal(false)} />
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Register;
