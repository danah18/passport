import { SendIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

interface MessageInputProps {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t bg-white">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
            />
            <Button
                type="submit"
                size="icon"
                disabled={!message.trim()}
                className="rounded-full bg-[hsl(var(--sent-message))] hover:bg-[hsl(var(--sent-message))/90]"
            >
                <SendIcon size={18} />
            </Button>
        </form>
    );
};

export default MessageInput;