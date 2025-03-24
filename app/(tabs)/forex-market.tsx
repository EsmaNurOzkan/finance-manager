import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const { height } = Dimensions.get("window");

type ExchangeRate = [string, number];

const ForexMarket: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [animate, setAnimate] = useState<boolean>(false); 

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/currency/exchange-rates/tl`);
      setExchangeRates(Object.entries(response.data) as ExchangeRate[]);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setAnimate(false); 
      setTimeout(() => setAnimate(true), 100); 
    }, [])
  );

  return (
    <>
      <Text style={styles.title}>Döviz Kurları</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#00796B" />
          ) : (
            <View style={styles.gridContainer}>
              {exchangeRates.map(([currency, rate], index) => (
                <Animatable.View
                  key={currency}
                  animation={animate ? "fadeInUp" : undefined} 
                  delay={index * 100}
                  style={styles.card}
                >
                  <Text style={styles.currency}>{currency}</Text>
                  <Text style={styles.rate}>{rate}</Text>
                </Animatable.View>
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
    paddingBottom: 40,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#004D40",
    paddingTop: 40, 
    marginBottom: 15, 
  },
  gridContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    backgroundColor: "#00897B",
    padding: 16,
    marginBottom: 12, 
    width: "47%", 
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  rate: {
    fontSize: 18,
    color: "#E0F7FA",
    marginTop: 5,
  },
});


export default ForexMarket;
