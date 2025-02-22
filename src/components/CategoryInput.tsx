
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryInputProps {
  textInput: string;
  isInputVisible: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onToggleVisibility: () => void;
}

const EXAMPLE_1 = `INSTRUMENT TYPE: STRING, WIND, PERCUSSION
CONTROL GESTURE: PLUCKING, BOWING, STRIKING
MATERIAL: WOOD, METAL, SYNTHETIC
MUSICAL CONTEXT: CLASSICAL, JAZZ, FOLK`;

const EXAMPLE_2 = `INSTRUMENT TYPE: ELECTRONIC, PERCUSSION, WIND
INTERACTION METHOD: HANDS, FEET, BODY MOVEMENT
POSTURE: SEATED, STANDING, MOVING
SOUND MODULATION: PITCH BENDING, VIBRATO, DYNAMICS CONTROL`;

const EXAMPLE_3 = `MATERIAL: WOOD, METAL, SYNTHETIC, MIXED
CONTROL GESTURE: PLUCKING, BOWING, STRIKING, BLOWING
SOUND MODULATION: FILTERING, VIBRATO, PITCH BENDING
MUSICAL CONTEXT: ELECTRONIC, ROCK, JAZZ, CLASSICAL`;

export const CategoryInput: React.FC<CategoryInputProps> = ({
  textInput,
  isInputVisible,
  onTextChange,
  onToggleVisibility,
}) => {
  const handleExampleClick = (example: string) => {
    // Create a synthetic event that mimics the textarea onChange event
    const syntheticEvent = {
      target: { value: example }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onTextChange(syntheticEvent);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories & Options</h2>
        <Button variant="outline" size="sm" onClick={onToggleVisibility}>
          {isInputVisible ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Hide Input
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Show Input
            </>
          )}
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(EXAMPLE_1)}
        >
          Example 1: Basic Instruments
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(EXAMPLE_2)}
        >
          Example 2: Interactive Design
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(EXAMPLE_3)}
        >
          Example 3: Modern Instruments
        </Button>
      </div>
      <AnimatePresence>
        {isInputVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div className="textarea-container">
              <textarea
                value={textInput}
                onChange={onTextChange}
                placeholder="Enter categories and options in the format:
CATEGORY 1: OPTION 1A, OPTION 1B, OPTION 1C
CATEGORY 2: OPTION 2A, OPTION 2B, OPTION 2C"
                className="min-h-[400px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
