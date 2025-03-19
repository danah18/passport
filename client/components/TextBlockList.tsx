
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Save } from "lucide-react";
import { Button } from "./ui/Button.tsx";
import TextBlockComponent from "./TextBlockComponent.tsx";
import { Platform, Switch, Text, TextInput, View } from "react-native";
import { handlePortalSubmission } from "../data/portalSubmissionHandler.tsx";
import { router } from "expo-router";
import { PlaceAutocomplete } from "./PlaceAutocomplete.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ThemedView } from "./ThemedView.tsx";
import { AirplaneAnimation } from "./AirplaneAnimation.tsx";

export interface TextBlock {
  id: string;
  recs: string;
  friendName: string;
}

type TextBlockListProps = {
    setSplitState: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextBlockList = (props: TextBlockListProps) => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([{
    id: crypto.randomUUID(),
    recs: "",
    friendName: ""
  }]);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(0);
  const [googlePlaceAutocomplete, setGooglePlaceAutocomplete] = useState<google.maps.places.PlaceResult>();
  const [isCuratorMode, setIsCuratorMode] = useState(false);
  const endOfPageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to the bottom when a new block is added
    if (endOfPageRef.current && textBlocks.length > 1 && textBlocks[textBlocks.length - 1].text === "") {
      endOfPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [textBlocks.length]);

  const handleRecsChange = (index: number, newRecs: string) => {
    const newBlocks = [...textBlocks];
    newBlocks[index].recs = newRecs;
    setTextBlocks(newBlocks);
  };

  const handleFriendNameChange = (index: number, newFriendName: string) => {
    const newBlocks = [...textBlocks];
    newBlocks[index].friendName = newFriendName;
    setTextBlocks(newBlocks);
  };

  const addNewBlock = () => {
    setTextBlocks([...textBlocks, {
      id: crypto.randomUUID(),
      recs: "",
      friendName: ""
    }]);
    setActiveBlockIndex(textBlocks.length);
  };

  const removeBlock = (index: number) => {
    if (textBlocks.length === 1) {
      setTextBlocks([{
        id: crypto.randomUUID(),
        recs: "",
        friendName: ""
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
    const nonEmptyBlocks = textBlocks.filter(block => block.recs.trim().length > 0);
    
    if (nonEmptyBlocks.length === 0) {
      console.error("Nothing to save", {
        description: "Please add some text before saving"
      });
      return;
    }
    
    try 
    {
        handlePortalSubmission({textBlockList: textBlocks, place: googlePlaceAutocomplete!, isCuratorMode: isCuratorMode});
    }
    catch (error)
    {
        throw error;
    }

    // If there are no issues with portal submission, navigate to the map page
    props.setSplitState(true);
    
    console.log("Text blocks saved", {
      description: `${nonEmptyBlocks.length} block${nonEmptyBlocks.length === 1 ? "" : "s"} saved successfully`
    });
  };

  const toggleSwitch = () => {
    setIsCuratorMode(previousState => !previousState);
  }

  const handleAutocompletePlace = (place: google.maps.places.PlaceResult) => {
    setGooglePlaceAutocomplete(place);
    console.log(place?.geometry?.location?.lat());
    console.log(place?.geometry?.location?.lng());
  }

  return (
    <View className="min-h-screen flex flex-col">
      <View className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
      <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <View>
            <View style={{flexDirection: "row"}}>
              <AirplaneAnimation/>
              <Text className="ml-2 text-2xl font-display font-medium tracking-tight text-white">Where to?</Text>
            </View>
            <Text className="text-muted-foreground text-white">Enter the city or country of interest</Text>
            
            <APIProvider
                apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || ''}
                solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'>
                <PlaceAutocomplete onPlaceSelect={(place) => handleAutocompletePlace(place as google.maps.places.PlaceResult)}/>
            </APIProvider>
          </View>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <View>
            <Text className="text-2xl font-display font-medium tracking-tight text-white">
                {isCuratorMode ? `Recommended by You` : `Recommended by Friends`}
            </Text>
            <Text className="text-muted-foreground text-white">
                {isCuratorMode ? `Add the places you recommend for your friends` : `Add each set of recs received from friends`}
            </Text>

            <Switch 
                className="mt-2" 
                trackColor={{false: '#767577', true: '#81b0ff'}} 
                thumbColor={isCuratorMode ? '#2563eb' : '#f4f3f4'} 
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isCuratorMode}
                {...Platform.select({web: {
                    activeThumbColor: 'white'
                }})}
            />
         </View>

         
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
                text={block.recs}
                title={block.friendName}
                index={index}
                isActive={activeBlockIndex === index}
                isCuratorMode={isCuratorMode}
                onTextChange={handleRecsChange}
                onTitleChange={handleFriendNameChange}
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
            {isCuratorMode ? <></> :
                <Button 
                    onClick={addNewBlock} 
                    className="mr-3 group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
                    <span className="relative flex items-center justify-center text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add New List
                    </span>
                </Button>
            }
            
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
      </View>
    </View>
  );
};

export default TextBlockList;