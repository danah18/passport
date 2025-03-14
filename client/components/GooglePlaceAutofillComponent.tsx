import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "./ui/Button.tsx";
import { Textarea } from "./ui/Textarea.tsx";
import { Card, CardContent } from "./ui/Card.tsx";
import { Input } from "./ui/Input.tsx";
import { useThemeColor } from "../hooks/useThemeColor.ts";

interface GooglePlaceAutofillComponentProps {
  text: string;
  index: number;
  title: string;
  isActive: boolean;
  onTextChange: (index: number, newText: string) => void;
  onTitleChange: (index: number, newTitle: string) => void;
  onFocus: () => void;
  onRemove: () => void;
}

const GooglePlaceAutofillComponent: React.FC<GooglePlaceAutofillComponentProps> = ({
  text,
  index,
  title,
  isActive,
  onTextChange,
  onTitleChange,
  onFocus,
  onRemove,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      if (text.length === 0) {
        textareaRef.current.focus();
      }
    }
  }, [isActive, text.length]);

  const backgroundColor = useThemeColor({}, 'background');

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert tab at cursor position
      const newText = text.substring(0, start) + "    " + text.substring(end);
      onTextChange(index, newText);
      
      // Move cursor after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="text-block relative group"
    >
      <Card 
        style={{ backgroundColor: '#f8fafc' }}
        className={`border shadow-sm transition-all duration-300 ${
        isActive ? "ring-2 ring-primary/20" : "hover:shadow-md"
      }`}>
        <CardContent className="p-0">
          <div className="text-block-container relative rounded-lg p-4">
            <div className="flex items-center mb-2 ml-1">
            <Input
                value={title}
                onChange={(e) => onTitleChange(index, e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={handleTitleKeyDown}
                placeholder="City or country of interest"
                autoFocus
                className="text-xs tracking-wide h-6 py-0 px-1"
            />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GooglePlaceAutofillComponent;