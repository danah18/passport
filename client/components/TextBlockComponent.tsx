import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor.ts";
import { Button } from "./ui/Button.tsx";
import { Card, CardContent } from "./ui/Card.tsx";
import { Input } from "./ui/Input.tsx";
import { Textarea } from "./ui/Textarea.tsx";

interface TextBlockComponentProps {
  text: string;
  index: number;
  title: string;
  isActive: boolean;
  isCuratorMode: boolean;
  onTextChange: (index: number, newText: string) => void;
  onTitleChange: (index: number, newTitle: string) => void;
  onFocus: () => void;
  onRemove: () => void;
}

const TextBlockComponent: React.FC<TextBlockComponentProps> = ({
  text,
  index,
  title,
  isActive,
  isCuratorMode,
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
          <View className="text-block-container relative rounded-lg p-4">
            <View className="flex items-center mb-2 ml-1">

            {isCuratorMode ? <></> :
                <Input
                    value={title}
                    onChange={(e) => onTitleChange(index, e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={handleTitleKeyDown}
                    placeholder=" Who are these recs from?"
                    autoFocus
                    className="text-xs tracking-wide h-6 py-0 px-1"
                />
            }
            </View>
            
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onTextChange(index, e.target.value)}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              placeholder="Paste list of recs here..."
              className="text-input min-h-[200px] resize-y border-0 bg-background/60 focus:ring-0 focus-visible:ring-offset-0 rounded-lg"
            />

            <View className="group flex-row items-center justify-between w-full mt-1">
              <View className="duration-200 flex">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10"
                  onClick={onRemove}
                  aria-label="Remove block"
                >
                  <Trash2 className="h-4 w-4" style={{ color: backgroundColor }} />
                </Button>
              </View>

              <Text className="text-xs text-right text-muted-foreground">
                {text.length} characters
                {text.trim().length > 0
                  ? ` • ${text.trim().split(/\s+/).length} words`
                  : ''}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TextBlockComponent;