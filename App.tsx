// import React, { useState } from "react";
// import {
//   Button,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// // import UnityView from '@azesmway/react-native-unity'; // Temporarily commented out
// import SplashScreen from "./src/SplashScreen";
// import ForgotPasswordScreen from "./src/screens/auth/forgotPasswordScreen";
// import RegisterScreen from "./src/screens/auth/registerScreen";
// import ResetPasswordScreen from "./src/screens/auth/resetPasswordScreen";

// import LoginScreen from "./src/screens/auth/LoginScreen";
// import OnboardingScreen from "./src/screens/onboarding/OnboardingScreen";

// function App() {
//   const isDarkMode = useColorScheme() === "dark";
//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   // Temporarily commented out Unity-related code
//   // const unityRef = useRef<{
//   //   postMessage: (gameObject: string, methodName: string, message: string) => void;
//   // } | null>(null);
//   // const [showUnity, setShowUnity] = useState(false);
//   const [showSplash, setShowSplash] = useState(true);
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);

//   // Data to send to Unity - commented out
//   // const unityData = {
//   //   name: "I'm Stepa",
//   //   age: 25,
//   // };

//   // const jsonedData = JSON.stringify(unityData);

//   // Function to send data to Unity - commented out
//   // async function sendData(data: any) {
//   //   if (unityRef.current) {
//   //     try {
//   //       unityRef.current.postMessage('ReactToUnity', 'GetDatas', data);
//   //     } catch (error) {
//   //       console.error('Error sending message to Unity:', error);
//   //     }
//   //   }
//   // }

//   // useEffect(() => {
//   //   if (showUnity) {
//   //     sendData(jsonedData);
//   //   }
//   // }, [showUnity]);

//   const handleGetStarted = () => {
//     setShowSplash(false);
//     setShowOnboarding(true);
//   };

//   return (
//     <>
//       {showSplash ? (
//         <SplashScreen onGetStarted={handleGetStarted} />
//       ) : showOnboarding ? (
//         <OnboardingScreen
//           onDone={() => {
//             setShowOnboarding(false);
//             setShowLogin(true);
//           }}
//         />
//       ) : showLogin ? (
//         <LoginScreen
//           onLogin={() => {}}
//           onRegister={() => {
//             setShowLogin(false);
//             setShowRegister(true);
//           }}
//           onForgot={() => {
//             setShowLogin(false);
//             setShowForgotPassword(true);
//           }}
//         />
//       ) : showRegister ? (
//         <RegisterScreen
//           onRegister={() => {}}
//           onLogin={() => {
//             setShowRegister(false);
//             setShowLogin(true);
//           }}
//         />
//       ) : showForgotPassword ? (
//         <ForgotPasswordScreen
//           onSubmit={() => {
//             setShowForgotPassword(false);
//             setShowResetPassword(true);
//           }}
//           onLogin={() => {
//             setShowForgotPassword(false);
//             setShowLogin(true);
//           }}
//         />
//       ) : showResetPassword ? (
//         <ResetPasswordScreen
//           onReset={() => {}}
//           onLogin={() => {
//             setShowResetPassword(false);
//             setShowLogin(true);
//           }}
//         />
//       ) : (
//         <View style={styles.buttonContainer}>
//           <Text style={styles.welcomeText}>Welcome to Ultraverse! 🚀</Text>
//           <Text style={styles.subText}>
//             Unity integration temporarily disabled
//           </Text>
//           <Button
//             title="Rewatch Splash"
//             onPress={() => {
//               setShowOnboarding(false);
//               setShowLogin(false);
//               setShowRegister(false);
//               setShowForgotPassword(false);
//               setShowResetPassword(false);
//               setShowSplash(true);
//             }}
//           />
//         </View>
//       )}
//       {/* Temporarily commented out Unity view
//       ) : showUnity ? (
//         <UnityView
//           ref={unityRef}
//           style={styles.unityView}
//           onUnityMessage={(result: any) => {
//             console.log('Message received from Unity:', result.nativeEvent.message);
//           }}
//           onUnityLoaded={() => {
//             console.log('Unity loaded successfully!');
//           }}
//           onUnityUnloaded={() => {
//             console.log('Unity unloaded');
//           }}
//         />
//       ) : (
//         <View style={styles.buttonContainer}>
//           <Text style={styles.welcomeText}>Welcome to Unity Experience</Text>
//           <Button
//             title="Launch Unity"
//             onPress={() => setShowUnity(true)}
//           />
//         </View>
//       )}
//       */}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   unityView: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//     padding: 20,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#fff",
//     textAlign: "center",
//   },
//   subText: {
//     fontSize: 16,
//     color: "#888",
//     marginBottom: 30,
//     textAlign: "center",
//   },
// });

// export default App;

import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  return (
    <GestureHandlerRootView style={styles.mainAppContainer}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1,
  },
});
