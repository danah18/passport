import { SendIcon } from "lucide-react";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

interface MessageInputProps {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const {width, height} = Dimensions.get("window");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{width: width * .8, marginLeft: width*.08}} className="flex items-center gap-2 p-2">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Respond here"
                className="flex-1 text-xs"
            />
            <Button
                type="submit"
                size="icon"
                disabled={!message.trim()}
                className="rounded-full bg-[hsl(var(--sent-message))] hover:bg-[hsl(var(--sent-message))/90]"
            >
                <SendIcon style={{color:"white"}} size={18} />
            </Button>
        </form>
    );
};

export default MessageInput;