import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UnityView from '@azesmway/react-native-unity';
import SplashScreen from './src/SplashScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const unityRef = useRef<{
    postMessage: (gameObject: string, methodName: string, message: string) => void;
  } | null>(null);
  const [showUnity, setShowUnity] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Data to send to Unity
  const unityData = {
    name: "I'm Stepa",
    age: 25,
  };

  const jsonedData = JSON.stringify(unityData);

  // Function to send data to Unity
  async function sendData(data: any) {
    if (unityRef.current) {
      try {
        unityRef.current.postMessage('ReactToUnity', 'GetDatas', data);
      } catch (error) {
        console.error('Error sending message to Unity:', error);
      }
    }
  }

  useEffect(() => {
    if (showUnity) {
      sendData(jsonedData);
    }
  }, [showUnity]);

  const handleGetStarted = () => {
    setShowSplash(false);
    setShowUnity(true);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onGetStarted={handleGetStarted} />
      ) : showUnity ? (
        <UnityView
          ref={unityRef}
          style={styles.unityView}
          onUnityMessage={(result: any) => {
            console.log('Message received from Unity:', result.nativeEvent.message);
          }}
          onUnityLoaded={() => {
            console.log('Unity loaded successfully!');
          }}
          onUnityUnloaded={() => {
            console.log('Unity unloaded');
          }}
        />
      ) : (
        <View style={styles.buttonContainer}>
          <Text style={styles.welcomeText}>Welcome to Unity Experience</Text>
          <Button
            title="Launch Unity"
            onPress={() => setShowUnity(true)}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  unityView: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;