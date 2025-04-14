export interface MessageType {
    id: string;
    text: string;
    sender: "user" | "other";
    timestamp: Date;
    isNew?: boolean;
}

export interface MessageProps {
    message: MessageType;
}

export interface OpeningMessageProps {
    message: MessageType;
    setSplitState: React.Dispatch<React.SetStateAction<boolean>>;
    onCapsuleAdded: () => void;
    onCapsuleUpdated: () => void;
    setSetShowMessageInput: React.Dispatch<React.SetStateAction<boolean>>;
}