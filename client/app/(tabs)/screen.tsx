import React from "react";
import { Text, View } from "react-native";
import Chat from "../../components/chat/Chat.tsx";

export default function Screen() {
return (
    <View>
        <Text style={{color: "white"}}>my chat</Text>
        <Chat />
        <Text style={{ color: "white" }}>screen chat</Text>
    </View>
  );
}
