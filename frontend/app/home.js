import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [employees, setEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all employees from backend
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees().finally(() => setRefreshing(false));
  };

  // Render each employee card
  const renderItem = ({ item }) => (
    <Link
      href={{ pathname: "/detail", params: { emp: JSON.stringify(item) } }}
      style={styles.card}
    >
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
      <Text>Email: {item.email}</Text>
      <Text>Mobile: {item.mobile}</Text>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={employees}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No employees found.</Text>
        }
      />

      <View style={styles.importContainer}>
        <Link href="/import" style={styles.importBtn}>
          <Text style={styles.importText}>Go to Import</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  importContainer: { marginTop: 16, alignItems: "center" },
  importBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  importText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
});
