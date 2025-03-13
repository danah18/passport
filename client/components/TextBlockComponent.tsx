import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "./ui/Button.tsx";
import { Textarea } from "./ui/Textarea.tsx";
import { Card, CardContent } from "./ui/Card.tsx";
import { Input } from "./ui/Input.tsx";

interface TextBlockComponentProps {
  text: string;
  index: number;
  title: string;
  isActive: boolean;
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
      <Card className={`border shadow-sm transition-all duration-300 ${
        isActive ? "ring-2 ring-primary/20" : "hover:shadow-md"
      }`}>
        <CardContent className="p-0">
          <div className="text-block-container relative rounded-lg p-4">
            <div className="absolute -top-3 right-3 flex space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10"
                onClick={onRemove}
                aria-label="Remove block"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center mb-2 ml-1">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => onTitleChange(index, e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  className="text-xs tracking-wide h-6 py-0 px-1"
                />
              ) : (
                <div 
                  className="text-xs text-muted-foreground font-medium tracking-wide uppercase flex items-center cursor-pointer hover:text-foreground"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <span>{title || `Block ${index + 1}`}</span>
                  <Pencil className="h-3 w-3 ml-1 opacity-50" />
                </div>
              )}
            </div>
            
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onTextChange(index, e.target.value)}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              placeholder="Enter your text here..."
              className="text-input min-h-[120px] resize-y border-0 bg-background/60 focus:ring-0 focus-visible:ring-offset-0 rounded-lg"
            />
            
            <div className="mt-3 text-xs text-right text-muted-foreground">
              {text.length} characters {text.trim().length > 0 ? `• ${text.trim().split(/\s+/).length} words` : ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TextBlockComponent;