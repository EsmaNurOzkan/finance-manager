import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as SecureStore from 'expo-secure-store'; 
import axios from 'axios';
import { useRouter } from 'expo-router';

interface FormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<FormData>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const onLogin: SubmitHandler<FormData> = async (data) => {
    const trimmedEmail = data.email.trim(); 
    const trimmedPassword = data.password.trim();

    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`, { 
            email: trimmedEmail, 
            password: trimmedPassword 
        });

        if (response.data.token && response.data.user.id) {
            await SecureStore.setItemAsync('token', response.data.token);
            await SecureStore.setItemAsync('userId', response.data.user.id);

            setTimeout(async () => {
                await SecureStore.deleteItemAsync('token');
                console.log("Token süresi doldu, otomatik olarak silindi.");
            }, 43200000); 

            const savedToken = await SecureStore.getItemAsync('token');
            const savedUserId = await SecureStore.getItemAsync('userId');

            alert('Giriş başarılı!');
            router.push('/(tabs)');
        } else {
            alert('Login failed: Token or userId missing.');
        }
    } catch (error: any) {
        console.error('Login error:', error);

        if (error.response) {
            console.error('Error response:', error.response);
            console.error('Error data:', error.response.data);
            alert(error.response.data.message || 'Login failed!');
        } else if (error.request) {
            console.error('No response received. Request:', error.request);
            alert('Login failed: No response from server.');
        } else {
            console.error('Unexpected error:', error.message);
            alert('Login failed: An unexpected error occurred.');
        }
    }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hoş Geldiniz</Text>

      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email gerekli!',
          pattern: /^[^@]+@[^@]+\.[^@]+$/,
        }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Email"
              onBlur={onBlur}
              placeholderTextColor="#888"
              onChangeText={(text) => {
                const trimmedText = text.trim();
                setEmail(trimmedText);
                onChange(trimmedText);
              }}
              value={email}
              keyboardType="email-address"
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Parola gerekli!', minLength: 8 }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Parola"
              placeholderTextColor="#888"
              onBlur={onBlur}
              onChangeText={(text) => {
                setPassword(text);
                onChange(text);
              }}
              value={password}
              secureTextEntry
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onLogin)}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/auth/reset-password')}>
          <Text style={styles.linkText}>Şifremi Unuttum?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.linkText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  linkText: {
    color: '#1E90FF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
