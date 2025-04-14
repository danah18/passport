import { APIProvider } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import React from "react";
import { Text, View } from "react-native";
import { cn } from "../../utils/libUtils.tsx";
import { AirplaneAnimation } from "../AirplaneAnimation.tsx";
import { PlaceAutocomplete } from "../PlaceAutocomplete.tsx";
import TextBlockListForChat from "../TextBlockListForChat.tsx";
import { OpeningMessageProps } from "./types/chatTypes.tsx";

const OpeningMessageBubble: React.FC<OpeningMessageProps> = ({ message, onCapsuleAdded, onCapsuleUpdated, setSplitState }) => {
    const isUser = message.sender === "user";
    const formattedTime = format(message.timestamp, "h:mm a");

    const [place, setPlace] = React.useState<google.maps.places.PlaceResult>();

    const handlePlaceSelect = React.useCallback((place: google.maps.places.PlaceResult | null) => {
        if (place) {
            setPlace(place);
        }
    }, [setPlace]);

    const textBlockListWithMotion = (
        <TextBlockListForChat
            place={place ?? null}
            onCapsuleUpdated={onCapsuleUpdated}
            onCapsuleAdded={onCapsuleAdded}
            setSplitState={setSplitState}
        />
    );

    return (
        <View
            className={cn(
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <View
                className={cn(
                    "max-w-[90%] rounded-2xl px-4 py-2 relative",
                    isUser
                        ? "bg-[hsl(var(--sent-message))] text-white rounded-tr-none animate-slide-in-right"
                        : "bg-[hsl(var(--received-message))] text-white rounded-tl-none animate-slide-in-left",
                    message.isNew && (isUser ? "animate-slide-in-right" : "animate-slide-in-left")
                )}
            >
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                        <AirplaneAnimation />
                        <Text style={{ fontSize: 16 }} className="mt-2 ml-2 text-white">{message.text}</Text>
                    </View>

                    <View className="mt-2 mb-1 text-black" style={{ width: "50%" }}>
                        <APIProvider
                            apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || ""}
                            solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                        >
                            <PlaceAutocomplete
                                onPlaceSelect={handlePlaceSelect}
                            />
                        </APIProvider>
                    </View>

                </View>

                <View
                    className={cn(
                        "text-xs mt-1",
                        isUser ? "text-blue-100" : "text-gray-500"
                    )}
                >
                    {formattedTime}
                </View>

                {place && 

                    <View
                        className={cn("mt-2")}
                    >
                        {/* Add on view styling animation here */}
                        <p>{`Amazing! Now, add the recs you received for ${place.name}: `}</p>
                        {textBlockListWithMotion}

                        <View
                            className={cn(
                                "text-xs mt-1",
                                isUser ? "text-blue-100" : "text-gray-500"
                            )}
                        >
                            {formattedTime}
                        </View>
                    </View>
            }
            </View>
        </View>
    );
};

export default OpeningMessageBubble;