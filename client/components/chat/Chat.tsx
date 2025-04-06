import React, { useEffect, useRef } from "react";
import { useChatAnimation } from "../../hooks/useChatAnimation.ts";
import MessageBubble from "./MessageBubble.tsx";
import OpeningMessageBubble from "./OpeningMessageBubble.tsx";
import { MessageType } from "./types/chatTypes.tsx";
import TypingIndicator from "./TypingIndicator.tsx";

type ChatProps = {
    googlePlace: google.maps.places.PlaceResult | undefined;
    setGooglePlace: React.Dispatch<React.SetStateAction<google.maps.places.PlaceResult | undefined>>;
}

const Chat: React.FC<ChatProps> = ({googlePlace, setGooglePlace}) => {

    // TODO: get user name from supabase
    // const supabase = getSupabaseClient();
    // const { data: userData, error: userError } = await supabase.auth.getUser();
    // if (userError) {
    //     console.log("Error fetching user:", userError);
    //     return;
    // }
    // const profileId = userData?.user?.user_metadata?.profile_id;


    const {
        messages,
        addMessage,
        isTyping,
        startDemoConversation
    } = useChatAnimation([{
        id: Date.now().toString(),
        text: "hey this is my dummy message",
        sender: "other",
        timestamp: new Date()
    }, {
        id: Date.now().toString(),
        text: "the message i wanted to say was this:",
        sender: "other",
        timestamp: new Date()
        }],
    "Danah");

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
    
    // TODO: retrieve from supabase.auth.user
    const name = 'User';
    const openingMessage = React.useMemo(() => ({
        id: "1",
        text: `Hi ${name}! Where to?`,
        sender: "other",
        timestamp: new Date(),
    } as MessageType), [name]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--chat-bg))]">
                <OpeningMessageBubble key={openingMessage.id} message={openingMessage}/>
                
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message}/>
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            {/* hide this behind a state variable of place selected */}
            {/* <MessageInput onSendMessage={handleSendMessage} /> */}
        </div>
    );
};

export default Chat;
