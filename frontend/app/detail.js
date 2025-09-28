import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSearchParams } from "expo-router";

export default function DetailScreen() {
  const { emp } = useSearchParams();
  const employee = emp ? JSON.parse(emp) : null;

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Employee data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>
        {employee.firstName} {employee.lastName}
      </Text>

      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{employee.username}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{employee.email}</Text>

      <Text style={styles.label}>Mobile:</Text>
      <Text style={styles.value}>{employee.mobile}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  value: { fontSize: 16, color: "#333", marginTop: 4 },
  errorText: { textAlign: "center", marginTop: 20, color: "red" },
});
