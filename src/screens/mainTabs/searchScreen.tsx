import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";

const SearchScreen = () => {
  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Search</Text>
      </View>
    </UvScreenWrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});

