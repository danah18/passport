import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MoveLeft, MoveRight } from "lucide-react";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

interface SplitScreenProps {
    LeftComponent: React.JSX.Element;
    RightComponent: React.JSX.Element;
    setSplitState: React.Dispatch<React.SetStateAction<boolean>>;
}

const { width, height } = Dimensions.get('window');
  
const SplitScreen = (props: SplitScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftPane}>
        {props.LeftComponent}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={() => {router.replace('./map')}}>
            <MoveLeft style={{ marginRight: 8, color: 'white'}}/>
        </TouchableOpacity>
      
        <TouchableOpacity
            onPress={()=>{props.setSplitState(false)}}>
            <MoveRight style={{ marginTop: height*.83, marginRight: 8, color: 'white'}}/>
        </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: "column"
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
