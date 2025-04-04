import { APIProvider } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { motion } from "framer-motion";
import React from "react";
import { Text, View } from "react-native";
import { cn } from "../../utils/libUtils.tsx";
import { AirplaneAnimation } from "../AirplaneAnimation.tsx";
import { PlaceAutocomplete } from "../PlaceAutocomplete.tsx";
import TextBlockListForChat from "../TextBlockListForChat.tsx";
import { MessageProps } from "./types/chatTypes.tsx";

const OpeningMessageBubble: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.sender === "user";
    const formattedTime = format(message.timestamp, "h:mm a");

    const [place, setPlace] = React.useState<google.maps.places.PlaceResult>();

    const handlePlaceSelect = React.useCallback((place: google.maps.places.PlaceResult | null) => {
        if (place) {
            setPlace(place);
        }
    }, [setPlace]);

    const textBlockListWithMotion = (
        <View className="min-h-screen flex flex-col">
            <View className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <TextBlockListForChat
                        onCapsuleUpdated={() => {}}
                        onCapsuleAdded={() => {}}
                    />
                </motion.div>
            </View>
        </View>
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
                    "max-w-[80%] rounded-2xl px-4 py-2 relative",
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
                        className={cn("mt-2"
                        )}
                    >
                        {/* Add on view styling animation here */}
                        <p>{`Amazing! Did you receive any recs for ${place.name}? 💫`}</p>
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