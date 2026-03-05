import React, { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/appNavigator";
import { configureGoogleSignIn } from "./src/config/googleSignIn";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={styles.mainAppContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Provider store={store}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <AppNavigator />
        </Provider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
});
