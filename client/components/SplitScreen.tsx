import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SplitScreenProps {
    LeftComponent: React.JSX.Element;
    RightComponent: React.JSX.Element;
  }
  

const SplitScreen = (props: SplitScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftPane}>
        {props.LeftComponent}
      </View>

      <View style={styles.rightPane}>
        {props.RightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Vertical split
  },
  leftPane: {
    flex: 1, // Takes half the screen
    justifyContent: "center",
    alignItems: "center",
  },
  rightPane: {
    flex: 1, // Takes half the screen
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SplitScreen;
