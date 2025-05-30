import React, { useState } from 'react';
import axios from 'axios';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, Modal, 
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, ScrollView 
} from 'react-native';
import { router, useRouter } from 'expo-router';


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
  const [isProcessing, setIsProcessing] = useState(false); 

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const handleSendCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/auth/send-code`, { email: trimmedEmail });
      setShowModal(true);
      setMessage('E-posta adresinize doğrulama kodu gönderildi.');
      setCodeSent(true);
    } catch (error) {
      setError('Kod gönderilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedVerificationCode = verificationCode.trim();

    if (trimmedPassword.length < 8) {
      setError('Şifreniz en az 8 karakter olmalıdır.');
      return;
    }

    if (!codeSent) {
      setError('Önce doğrulama kodu almanız gerekiyor.');
      return;
    }

    setIsProcessing(true); 

    try {
      await axios.post(`${backendUrl}/api/auth/register`, {
        username: trimmedUsername, 
        email: email.trim(), 
        password: trimmedPassword, 
        code: trimmedVerificationCode,
      });
      setMessage('Kayıt başarılı.');
      setShowModal(false);
      setError('');
      setTimeout(() => {
        router.push('./login');
      }, 1500);
    } catch (error) {
      setError('Kayıt sırasında hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false); 
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Kayıt Ol</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Kullanıcı Adı" 
          placeholderTextColor="#888"
          value={username} 
          onChangeText={setUsername} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="E-posta" 
          placeholderTextColor="#888"
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Şifre (En az 8 karakter)" 
          placeholderTextColor="#888"
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingText}> Kod gönderiliyor...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Modal animationType="slide" transparent visible={showModal} onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Doğrulama Kodu</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Doğrulama kodu" 
              placeholderTextColor="#888"
              value={verificationCode} 
              onChangeText={setVerificationCode} 
            />
            {loading && <ActivityIndicator size="small" color="#fff" />}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              {isProcessing ? ( 
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.loadingText}>Kontrol ediliyor, lütfen bekleyin...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Doğrula ve Kayıt Ol</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
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
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#00897B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#004D40',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    justifyContent:"center",
    textAlign:"center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },  
});

export default Register;
