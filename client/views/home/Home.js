//bıldırım zılı iconu konacak, pozısyonu sabıt olsun, tarihi yaklasan anımsatıcı varsa bıldırmek ıcın
//logout ıconu posızyonu sabıt olsun sag ustte olsun
// maınmenu responsıve degıl

import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainMenu from './main-menu/MainMenu.js';
import AddExpense from "../new-expense/AddExpense.js";
import GetNotes from "../financial-notes/GetNotes.js";
import GetReminders from "../reminders/GetReminders.js";
import Overview from "../overview/Overview.js";
import ForexMarket from "../forex-market/ForexMarket.js";

const Home = () => {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const menuThreshold = 320; 

  useFocusEffect(
    useCallback(() => {
      const checkAuthentication = async () => {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);

        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
      };
      checkAuthentication();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      Alert.alert('Çıkış Yapıldı', 'Başarıyla çıkış yapıldı!');
      setIsAuthenticated(false);
      setUserId(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Çıkış yaparken hata:', error);
      Alert.alert('Hata', 'Çıkış işlemi başarısız oldu!');
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const renderSelectedMenu = () => {
    switch (selectedMenu) {
      case 'new-expense':
        return <AddExpense />;
      case 'reminders':
        return <GetReminders userId={userId} />;
      case 'overview':
        return <Overview userId={userId} />;
      case 'financial-notes':
        return <GetNotes userId={userId} />;
      case 'forex-market':
        return <ForexMarket />;
      default:
        return <Text style={styles.welcomeText}>Hoşgeldiniz! Burası Homepage</Text>;
    }
  };

  const toggleMenu = () => {
    setIsMenuToggled(!isMenuToggled);
  };

  return (
    <View style={styles.container}>
      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
          <Icon name="logout" size={30} color="#000" />
        </TouchableOpacity>
      )}

      <View style={styles.contentContainer}>
        {renderSelectedMenu()}

        {!isAuthenticated && (
          <>
            <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
          </>
        )}

        {isAuthenticated && <Text style={styles.buttonText}>Oturum Açık</Text>}
      </View>

      <Animated.View style={[styles.menuContainer, { height: isMenuToggled || screenWidth < menuThreshold ? 0 : 80 }]}>
        <MainMenu onSelectMenu={(menu) => setSelectedMenu(menu)} />
        {screenWidth < menuThreshold && (
          <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
            <Text style={styles.buttonText}>{isMenuToggled ? 'Büyüt' : 'Küçült'}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
  },
  contentContainer: {
    overflow:"auto"
  },

  logoutIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
  },
  toggleButton: {
    backgroundColor: 'dodgerblue',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
