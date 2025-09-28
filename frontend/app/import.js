// frontend/app/import.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function ImportScreen() {
  const [fileName, setFileName] = useState("");
  const [invalidRows, setInvalidRows] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
    });

    if (res.type === "success") {
      setFileName(res.name);
      uploadFile(res);
    }
  };

  const uploadFile = async (res) => {
    try {
      let fileObj;
      if (res.file) {
        // For web, DocumentPicker may return file object
        fileObj = res.file;
      } else {
        // Convert URI to File object for web
        const blob = await fetch(res.uri).then((r) => r.blob());
        fileObj = new File([blob], res.name, { type: blob.type });
      }

      const formData = new FormData();
      formData.append("file", fileObj);

      const response = await fetch("http://localhost:5000/api/employees/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setSuccessMsg(`Inserted ${data.inserted} rows successfully`);
      setInvalidRows(data.invalidRows || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Upload Failed", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Import Employees</Text>
      <Button title="Select Excel File" onPress={pickFile} />

      {fileName ? <Text style={styles.file}>Selected File: {fileName}</Text> : null}
      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

      {invalidRows.length > 0 && (
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>Invalid Rows:</Text>
          {invalidRows.map((row) => (
            <Text key={row.row} style={styles.invalidText}>
              Row {row.row}: {row.errors.join(", ")}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  file: { marginTop: 12, fontSize: 16 },
  success: { marginTop: 8, fontSize: 16, color: "green" },
  invalidContainer: { marginTop: 16, width: "100%" },
  invalidTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  invalidText: { fontSize: 16, color: "red", marginBottom: 4 },
});
