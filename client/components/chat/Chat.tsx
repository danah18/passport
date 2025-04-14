import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useChatAnimation } from "../../hooks/useChatAnimation.ts";
import { getSupabaseClient } from "../../utils/supabase.ts";
import MessageBubble from "./MessageBubble.tsx";
import MessageInput from "./MessageInput.tsx";
import OpeningMessageBubble from "./OpeningMessageBubble.tsx";
import { MessageType } from "./types/chatTypes.tsx";
import TypingIndicator from "./TypingIndicator.tsx";

type ChatProps = {
    setSplitState: React.Dispatch<React.SetStateAction<boolean>>;
    onCapsuleAdded: () => void;
    onCapsuleUpdated: () => void;
}

const Chat: React.FC<ChatProps> = ({onCapsuleAdded, onCapsuleUpdated, setSplitState}) => {
    const {
        messages,
        addMessage,
        isTyping,
        startDemoConversation
    } = useChatAnimation([]);

    const [username, setUsername] = useState<string>();
    const [showMessageInput, setShowMessageInput] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Add a ref to track if we've already added a message for this place
    const processedPlaceRef = useRef<string | undefined>();

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Start demo conversation on component mount
    useEffect(() => {
        startDemoConversation();
    }, []);

    // Handle sending a new message
    const handleSendMessage = (text: string) => {
        // Add user message
        const newMessage: MessageType = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date()
        };

        addMessage(newMessage);

        // Simulate response
        setTimeout(() => {
            const responses = [
                "That's interesting!",
                "Tell me more about that.",
                "I see what you mean.",
                "Thanks for sharing that with me.",
                "How does that make you feel?",
                "What happened next?"
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const responseMessage: MessageType = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: "other",
                timestamp: new Date()
            };

            // i think this is the issue
            // useChatAnimation().simulateTyping(responseMessage); 
        }, 1000);
    };
    
    useEffect(() => {
        const supabase = getSupabaseClient();

        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log("Error fetching user:", error);
                return;
            }

            setUsername(data?.user.user_metadata.first_name || "");
        };

        fetchUser();

        // Subscribe to auth state changes.
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUsername(session?.user.user_metadata.first_name || "");
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const openingMessage = React.useMemo(() => ({
        id: "1",
        text: `Hi ${username}! Where to?`,
        sender: "other",
        timestamp: new Date(),
    } as MessageType), [username]);

    return (
        <View className="flex flex-col">
            <View className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--chat-bg))]">
                <OpeningMessageBubble 
                    key={openingMessage.id} message={openingMessage} onCapsuleAdded={onCapsuleAdded} onCapsuleUpdated={onCapsuleUpdated} setSplitState={setSplitState} setSetShowMessageInput={setShowMessageInput}/>
                
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message}/>
                ))}

                {isTyping && <TypingIndicator />}

                <View ref={messagesEndRef} />

                {showMessageInput && 
                    <MessageInput onSendMessage={handleSendMessage} />}
            </View>            
        </View>
    );
};

export default Chat;
