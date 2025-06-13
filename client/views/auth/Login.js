// client/views/auth/Login.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });

      const { token, user } = response.data; // Yanıttan token ve user bilgilerini alıyoruz

      // Token ve userId'yi AsyncStorage'a kaydet
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', user.id); // Kullanıcı ID'sini saklıyoruz

      Alert.alert('Başarılı', 'Giriş başarılı!'); 

      // 2 saniye sonra Home ekranına yönlendir
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);

    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      Alert.alert('Giriş Yaparken Hata', 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        required
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} style={styles.link}>
        <Text style={styles.linkText}>Şifremi unuttum</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
        <Text style={styles.linkText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'DM Serif Text',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontFamily: 'Cormorant',
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Cormorant',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#007bff',
    fontFamily: 'Cormorant',
    fontWeight: '500',
  },
});

export default Login;
