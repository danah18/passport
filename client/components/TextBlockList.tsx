
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Save } from "lucide-react";
import { Button } from "./ui/Button.tsx";
import TextBlockComponent from "./TextBlockComponent.tsx";
import GooglePlaceAutofillComponent from "./GooglePlaceAutofillComponent.tsx";
import { TextInput } from "react-native";
import { Input } from "./ui/Input.tsx";

interface TextBlock {
  id: string;
  text: string;
  title: string;
}

const TextBlockList = () => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([{
    id: crypto.randomUUID(),
    text: "",
    title: ""
  }]);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(0);
  const [googlePlaceAutofillInputValue, setGooglePlaceAutofillInputValue] = useState("");
  const endOfPageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to the bottom when a new block is added
    if (endOfPageRef.current && textBlocks.length > 1 && textBlocks[textBlocks.length - 1].text === "") {
      endOfPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [textBlocks.length]);

  const handleTextChange = (index: number, newText: string) => {
    const newBlocks = [...textBlocks];
    newBlocks[index].text = newText;
    setTextBlocks(newBlocks);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const newBlocks = [...textBlocks];
    newBlocks[index].title = newTitle;
    setTextBlocks(newBlocks);
  };

  const addNewBlock = () => {
    setTextBlocks([...textBlocks, {
      id: crypto.randomUUID(),
      text: "",
      title: ""
    }]);
    setActiveBlockIndex(textBlocks.length);
  };

  const removeBlock = (index: number) => {
    if (textBlocks.length === 1) {
      setTextBlocks([{
        id: crypto.randomUUID(),
        text: "",
        title: ""
      }]);
      return;
    }
    
    const newBlocks = textBlocks.filter((_, i) => i !== index);
    setTextBlocks(newBlocks);
    
    if (activeBlockIndex >= index && activeBlockIndex > 0) {
      setActiveBlockIndex(activeBlockIndex - 1);
    }
  };

  const saveTextBlocks = () => {
    const nonEmptyBlocks = textBlocks.filter(block => block.text.trim().length > 0);
    
    if (nonEmptyBlocks.length === 0) {
      console.error("Nothing to save", {
        description: "Please add some text before saving"
      });
      return;
    }
    
    // Save to local storage
    localStorage.setItem("savedTextBlocks", JSON.stringify(nonEmptyBlocks));
    
    console.log("Text blocks saved", {
      description: `${nonEmptyBlocks.length} block${nonEmptyBlocks.length === 1 ? "" : "s"} saved successfully`
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
      <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-display font-medium tracking-tight text-white">Where to?</h2>
            <p className="text-muted-foreground text-white">Enter the city or country of interest</p>
            <Input
                value={'title'}
                onChange={(e) => {}}
                onBlur={() => {}}
                onKeyDown={()=>{}}
                placeholder="City or country of interest"
                autoFocus
                className="text-xs tracking-wide h-6 py-0 px-1"
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginTop: 5,
                }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-display font-medium tracking-tight text-white">Recommended by Friends</h2>
            <p className="text-muted-foreground text-white">Add each set of recs received from friends</p>
            {/* Add card, add input, handle in the way you were originally handling city input */}
          </div>
        </motion.div>
        
        <AnimatePresence>
          {textBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <TextBlockComponent
                text={block.text}
                title={block.title}
                index={index}
                isActive={activeBlockIndex === index}
                onTextChange={handleTextChange}
                onTitleChange={handleTitleChange}
                onFocus={() => setActiveBlockIndex(index)}
                onRemove={() => removeBlock(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <Button 
            onClick={addNewBlock} 
            className="mr-3 group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
            <span className="relative flex items-center justify-center text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New List
            </span>
          </Button>

          <Button 
            onClick={saveTextBlocks} 
            className="group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
            <span className="relative flex items-center justify-center text-white">
              <Check className="mr-2 h-4 w-4" /> Submit
            </span>
          </Button>
        </motion.div>
        
        <div ref={endOfPageRef} />
      </div>
    </div>
  );
};

export default TextBlockList;