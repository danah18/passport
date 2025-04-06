import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Chat from "../../components/chat/Chat.tsx";

export default function Screen() {
const [googlePlace, setGooglePlace] = useState<google.maps.places.PlaceResult>();

return (
    <ScrollView>
        <Chat googlePlace={googlePlace} setGooglePlace={setGooglePlace} />
    
    </ScrollView>
  );
}
