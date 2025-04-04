export interface MessageType {
    id: string;
    text: string;
    sender: "user" | "other";
    timestamp: Date;
    isNew?: boolean;
}

export interface MessageProps {
    message: MessageType;
    handleAutocompletePlace: (place: google.maps.places.PlaceResult) => void;
}