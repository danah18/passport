import { useState } from "react";
import { MessageType } from "../components/chat/types/chatTypes.tsx";

export function useChatAnimation(initialMessages: MessageType[] = [], name: string) {
    const [messages, setMessages] = useState<MessageType[]>(initialMessages);
    const [isTyping, setIsTyping] = useState(false);

    // Add a new message with animation
    const addMessage = (message: MessageType) => {
        setMessages((prev) => [...prev, { ...message, isNew: true }]);

        // Remove the "isNew" flag after animation completes
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg, i) =>
                    i === prev.length - 1 ? { ...msg, isNew: false } : msg
                )
            );
        }, 500);
    };

    // Simulate typing before adding a received message
    const simulateTyping = (message: MessageType, typingTime: number = 1500) => {
        setIsTyping(true);

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setIsTyping(false);
                addMessage(message);
                resolve();
            }, typingTime);
        });
    };

    // Start a demo conversation with predefined messages
    const startDemoConversation = async () => {
        // Clear any existing messages
        setMessages([]);

        // Add initial sent message
        setTimeout(() => {
            addMessage({
                id: "1",
                text: `Hi ${name}! Where to?`,
                sender: "other",
                timestamp: new Date(),
            });
        }, 1000);

        // TODO, display the enter place callback. Only show message input after they have selected a place

        // // Add a reply with typing indicator
        // setTimeout(() => {
        //     simulateTyping({
        //         id: "2",
        //         text: "This is the 2nd message",
        //         sender: "other",
        //         timestamp: new Date(),
        //     }, 2000);
        // }, 2500);

        // // Add another message from user
        // setTimeout(() => {
        //     addMessage({
        //         id: "3",
        //         text: "I'm great! Just checking out this new chat interface.",
        //         sender: "user",
        //         timestamp: new Date(),
        //     });
        // }, 6000);

        // // Add final reply
        // setTimeout(() => {
        //     simulateTyping({
        //         id: "4",
        //         text: "It looks awesome! I love the smooth animations.",
        //         sender: "other",
        //         timestamp: new Date(),
        //     }, 2000);
        // }, 8000);
    };

    return {
        messages,
        addMessage,
        isTyping,
        simulateTyping,
        startDemoConversation
    };
}
