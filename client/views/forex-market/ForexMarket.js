//anımasyonlu bastırma
//kısaltma yerıne sembol bastırma
//en yaygın dovız brıımlerını kullanma(server tarafında ayarlanması gerekebılır)

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import axios from "axios";
import { BACKEND_URL } from "@env";

const { height } = Dimensions.get('window');

const ForexMarket = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/currency/exchange-rates/tl`);
        setExchangeRates(Object.entries(response.data)); // Veriyi listeye çeviriyoruz
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []); // useEffect, sadece bileşen ilk kez render edildiğinde çalışacak

  return (
    <>
    <Text style={styles.title}>Döviz Kurları</Text>
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color="#00796B" />
        ) : (
          <View style={styles.gridContainer}>
            {exchangeRates.map(([currency, rate]) => (
              <View style={styles.card} key={currency}>
                <Text style={styles.currency}>{currency}</Text>
                <Text style={styles.rate}>{rate}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems:"center"
  },

  title: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginVertical: 10,
  },
  gridContainer: {
    marginTop:10,
    height: height * 0.6,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#00796B",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: "1%",
    width: "30%",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  currency: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  rate: {
    fontSize: 16,
    color: "#E0F7FA",
  },
});

export default ForexMarket;
