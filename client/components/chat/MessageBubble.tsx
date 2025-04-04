import { format } from "date-fns";
import React from "react";
import { cn } from "../../utils/libUtils.tsx";
import { MessageProps } from "./types/chatTypes.tsx";

const MessageBubble: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.sender === "user";
    const formattedTime = format(message.timestamp, "h:mm a");

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
                <p>{message.text}</p>
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