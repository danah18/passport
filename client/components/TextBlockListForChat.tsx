import { router } from "expo-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Check, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useCapsule } from "../app/(tabs)/portal.tsx";
import { handlePortalSubmission } from "../data/portalSubmissionHandler.tsx";
import TextBlockComponent from "./TextBlockComponent.tsx";
import { Button } from "./ui/Button.tsx";

export interface TextBlock {
    id: string;
    recs: string;
    friendName: string;
}

type TextBlockListProps = {
    place: google.maps.places.PlaceResult | null;
    onCapsuleAdded: () => void;
    onCapsuleUpdated: () => void;
    setSplitState: React.Dispatch<React.SetStateAction<boolean>>;
};

const TextBlockListForChat = (props: TextBlockListProps) => {
    const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
        {
            id: crypto.randomUUID(),
            recs: "",
            friendName: "",
        },
    ]);
    const [activeBlockIndex, setActiveBlockIndex] = useState<number>(0);
    const endOfPageRef = useRef<HTMLDivElement>(null);
    const capsule = useCapsule(); // Use the useCapsule hook to access the capsule data

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
        setTextBlocks([
            ...textBlocks,
            {
                id: crypto.randomUUID(),
                recs: "",
                friendName: "",
            },
        ]);
        setActiveBlockIndex(textBlocks.length);
    };

    const removeBlock = (index: number) => {
        if (textBlocks.length === 1) {
            setTextBlocks([
                {
                    id: crypto.randomUUID(),
                    recs: "",
                    friendName: "",
                },
            ]);
            return;
        }

        const newBlocks = textBlocks.filter((_, i) => i !== index);
        setTextBlocks(newBlocks);

        if (activeBlockIndex >= index && activeBlockIndex > 0) {
            setActiveBlockIndex(activeBlockIndex - 1);
        }
    };

    const saveTextBlocks = async () => {
        const nonEmptyBlocks = textBlocks.filter((block) => block.recs.trim().length > 0);

        if (nonEmptyBlocks.length === 0) {
            console.error("Nothing to save", {
                description: "Please add some text before saving",
            });
            return;
        }

        try {
            await handlePortalSubmission({
                capsule: capsule,
                textBlockList: textBlocks,
                place: props.place!,
                isCuratorMode: false,
            });
        } catch (error) {
            throw error;
        }

        console.log("Text blocks saved", {
            description: `${nonEmptyBlocks.length} block${nonEmptyBlocks.length === 1 ? "" : "s"} saved successfully`,
        });

        if (!capsule) {
            console.log("Capsule added");
            props.onCapsuleAdded();
        }
        props.onCapsuleUpdated();

        router.replace('./map');
    };

    return (
    <>
        <View className="flex flex-row justify-center">
            <View className="flex flex-row mt-3 overflow-y-hidden">
                <AnimatePresence> 
                    {textBlocks.map((block, index) => (
                        <motion.div
                            key={block.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="min-w-[300px] flex-shrink-0 mx-2 mb-2"
                        >
                            <TextBlockComponent
                                text={block.recs}
                                title={block.friendName}
                                index={index}
                                isActive={activeBlockIndex === index}
                                isCuratorMode={false}
                                onTextChange={handleRecsChange}
                                onTitleChange={handleFriendNameChange}
                                onFocus={() => setActiveBlockIndex(index)}
                                onRemove={() => removeBlock(index)}
                            />
                        </motion.div>
                    ))}
                    <div ref={endOfPageRef} />
                </AnimatePresence>
            </View>
            <Button
                onClick={addNewBlock}
                style={{ marginTop: '10%' }}
                className="group relative overflow-hidden rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
                    <span className="relative flex items-center justify-center text-white">
                    <Plus className="h-4 w-4"/>
                </span>
            </Button>
        </View>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-4"
        >
            <Button
                    onClick={saveTextBlocks}
                className="mr-3 group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
                <span className="relative flex items-center justify-center text-white">
                    <ArrowDown className="mr-2 h-4 w-4" /> Skip for Now
                </span>
            </Button>

            <Button
                onClick={saveTextBlocks}
                className="group relative overflow-hidden rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100"></span>
                <span className="relative flex items-center justify-center text-white">
                    <Check className="mr-2 h-4 w-4" /> Done
                </span>
            </Button>
        </motion.div>
    </>
    );
};

export default TextBlockListForChat;
