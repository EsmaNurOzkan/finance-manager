// MainMenu.js
// responsıve degıl

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const MainMenu = ({ onSelectMenu }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  return (
    <View style={[styles.menuContainer, isSmallScreen && styles.menuContainerSmall]}>
      <TouchableOpacity style={styles.menuItem} onPress={() => onSelectMenu('new-expense')}>
        <Ionicons name="add-circle-outline" size={28} color="dodgerblue" />
        <Text style={styles.menuText}>Yeni Harcama Gir</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onSelectMenu('reminders')}>
        <Ionicons name="alarm-outline" size={28} color="dodgerblue" />
        <Text style={styles.menuText}>Anımsatıcılar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onSelectMenu('overview')}>
        <Ionicons name="bar-chart-outline" size={28} color="dodgerblue" />
        <Text style={styles.menuText}>Özet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onSelectMenu('financial-notes')}>
        <Ionicons name="document-text-outline" size={28} color="dodgerblue" />
        <Text style={styles.menuText}>Finansal Notlarım</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => onSelectMenu('forex-market')}>
        <Ionicons name="trending-up-outline" size={28} color="dodgerblue" />
        <Text style={styles.menuText}>Döviz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  menuContainerSmall: {
    flexWrap: 'wrap', // Ekran daraldıkça menü öğelerinin sarılmasını sağlar
    justifyContent: 'center',
  },
  menuItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10, // Dar ekranda menü öğeleri arasına boşluk ekler
  },
  menuText: {
    fontSize: 14,
    marginTop: 8,
    color: 'dodgerblue',
    fontWeight: '500',
  },
});

export default MainMenu;
