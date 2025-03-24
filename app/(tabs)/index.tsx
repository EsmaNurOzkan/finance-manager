import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const router = useRouter();
  const [hasUpcomingReminder, setHasUpcomingReminder] = useState(false);
  const [showReminderMessage, setShowReminderMessage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsAuthenticated(!!token); 
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if (!userId) return;
  
        const response = await axios.get( `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/reminders/get/${userId}`);
        const reminders = response.data.reminders || [];
  
        const now = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(now.getDate() + 3);
  
        const upcoming = reminders.some((reminder: { dueDate: string }) => {
          const reminderDate = new Date(reminder.dueDate);
          return reminderDate >= now && reminderDate <= threeDaysLater;
        });
  
        setHasUpcomingReminder(upcoming);
      } catch (error) {
        console.error("Hatırlatıcılar alınırken hata oluştu:", error);
      }
    };
  
    fetchReminders();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('userId');
      setIsAuthenticated(false); 
      router.push('/auth/login');
    } catch (error) {
      console.error("Çıkış işlemi sırasında bir hata oluştu:", error);
    }
  };

  const handleNotificationPress = () => {
    if (hasUpcomingReminder) { 
      setShowReminderMessage(true);
      setTimeout(() => {
        setShowReminderMessage(false);
        setHasUpcomingReminder(false);
      }, 2500);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Finans Takip</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationWrapper}>
            <MaterialIcons name="notifications" size={28} color="black" />
            {hasUpcomingReminder && <View style={styles.notificationDot} />}
          </TouchableOpacity>
          {isAuthenticated && (
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={28} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showReminderMessage && (
        <View style={styles.reminderMessage}>
          <Text>Yaklaşan/tarihi geçen anımsatıcınız var.</Text>
        </View>
      )}

      <View style={styles.main}>
        <Text style={styles.title}>Hoşgeldin!</Text>
        <Text style={styles.subtitle}>Bütçeni yönetmeye başla.</Text>
        
        {!isAuthenticated && ( 
          <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/login')}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  reminderMessage: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
