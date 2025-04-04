import { APIProvider } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import React from "react";
import { Text, View } from "react-native";
import { cn } from "../../utils/libUtils.tsx";
import { AirplaneAnimation } from "../AirplaneAnimation.tsx";
import { PlaceAutocomplete } from "../PlaceAutocomplete.tsx";
import { MessageProps } from "./types/chatTypes.tsx";

const MessageBubble: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.sender === "user";
    const formattedTime = format(message.timestamp, "h:mm a");

    const handleAutocompletePlace = (place: google.maps.places.PlaceResult) => {
        //setGooglePlaceAutocomplete(place);
        console.log(place?.geometry?.location?.lat());
        console.log(place?.geometry?.location?.lng());
    };


    return (
        <div
            className={cn(
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 relative",
                    isUser
                        ? "bg-[hsl(var(--sent-message))] text-white rounded-tr-none animate-slide-in-right"
                        : "bg-[hsl(var(--received-message))] text-white rounded-tl-none animate-slide-in-left",
                    message.isNew && (isUser ? "animate-slide-in-right" : "animate-slide-in-left")
                )}
            >
                {message.id == "1" ?
                    (
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ flexDirection: "row" }}>
                                <AirplaneAnimation />
                                <Text className="mt-2 ml-1 text-white">{message.text}</Text>
                            </View>

                            <View className="mt-2 text-black">
                                <APIProvider
                                    apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || ""}
                                    solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                                >
                                    <PlaceAutocomplete
                                        onPlaceSelect={(place) => handleAutocompletePlace(place as google.maps.places.PlaceResult)}
                                    />
                                </APIProvider>
                            </View>
                            
                        </View>
                    
                    
                ) : <p>{message.text}</p> 
                }

                {message.id == "2" && 
                    <View style={{ flexDirection: "row" }}>
                        
                    </View>
                }

                <div
                    className={cn(
                        "text-xs mt-1",
                        isUser ? "text-blue-100" : "text-gray-500"
                    )}
                >
                    {formattedTime}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;