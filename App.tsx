

import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/appNavigator";

const App = () => {
  return (
    <GestureHandlerRootView style={styles.mainAppContainer}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  mainAppContainer: {
    flex: 1,
  },
});
