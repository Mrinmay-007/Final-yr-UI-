import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';

import { Platform } from 'react-native';
import { apiFetch } from '../../components/api';

export default function App() {
  const [image, setImage] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null); // reset previous prediction
    }
  };



const handleSubmit = async () => {
  if (!image) {
    alert("Please pick an image first!");
    return;
  }

  setLoading(true);
  const formData = new FormData();

  if (Platform.OS === "web") {
    // Web: convert to Blob
    const blob = await (await fetch(image)).blob();
    formData.append("file", blob, "image.jpg");
  } else {
    // Mobile: use URI object
    formData.append("file", {
      uri: image,
      name: "image.jpg",
      type: "image/jpeg",
    });
  }

  try {
    const data = await apiFetch("/predict", "POST", formData, true);
    setPrediction(data);
    // alert("Predicted successfully!");
  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + JSON.stringify(err));
  } finally {
    setLoading(false);
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an Image</Text>
      <Button title="Choose Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {/* {image && (
        <Button title="Predict" onPress={handleSubmit} disabled={loading} />
      )} */}
      {image && (
  <Button title="Predict" onPress={handleSubmit} disabled={loading} />
)}

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      {prediction && (
        <Text style={styles.prediction}>
          Class: {prediction.class}{"\n"}
          Confidence: {(prediction.confidence * 100).toFixed(2)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginTop: 20,
  },
  prediction: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
