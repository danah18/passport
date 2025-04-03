import React from "react";

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start mb-4">
            <div className="bg-[hsl(var(--received-message))] rounded-2xl px-4 py-2 rounded-tl-none">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;