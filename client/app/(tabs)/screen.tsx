import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function Screen() {
const [googlePlace, setGooglePlace] = useState<google.maps.places.PlaceResult>();

return (
    <ScrollView>
        {/* <Chat/> */}
    </ScrollView>
  );
}
