
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

const EXAMPLE_1 = `SUPPORT: WHEELS, TRACK, AIR CUSHION, SLIDES, PEDIPULATORS
PROPULSION: DRIVEN WHEELS, AIR THRUST, MOVING CABLE, LINEAR INDUCTION
POWER: ELECTRIC, PETROL, DIESEL, BOTTLED GAS, STEAM
TRANSMISSION: GEARS AND SHAFTS, BELTS, CHAINS, HYDRAULIC, FLEXIBLE CABLE
STEERING: TURNING WHEELS, AIR THRUST, RAILS
STOPPING: BRAKES, REVERSE THRUST, RATCHET
LIFTING: HYDRAULIC RAM, RACK AND PINION, SCREW, CHAIN OR ROPE HOIST
OPERATOR: SEATED AT FRONT, SEATED AT REAR, STANDING, WALKING, REMOTE CONTROL`;

const EXAMPLE_2 = `INSTRUMENT TYPE: STRING, WIND, PERCUSSION, ELECTRONIC  
CONTROL GESTURE: PLUCKING, BOWING, STRIKING, BLOWING, PRESSING  
POSTURE: SEATED, STANDING, MOVING, STATIC  
SOUND MODULATION: PITCH BENDING, VIBRATO, DYNAMICS CONTROL, FILTERING  
INTERACTION METHOD: HANDS, FEET, BODY MOVEMENT, BREATH, DIGITAL INTERFACE  
MATERIAL: WOOD, METAL, SYNTHETIC, MIXED  
MUSICAL CONTEXT: CLASSICAL, JAZZ, ROCK, ELECTRONIC, FOLK  `;

const EXAMPLE_3 = `INPUT: TEXT, IMAGE, AUDIO, VIDEO, SENSOR DATA, CODE, MULTIMODAL
MODEL: GPT, BERT, LLAMA, MIXTURE OF EXPERTS, CUSTOM FINE-TUNED, HYBRID MODELS
PROCESSING: FEW-SHOT LEARNING, ZERO-SHOT LEARNING, PROMPT ENGINEERING, EMBEDDING SEARCH, FINE-TUNING, REINFORCEMENT LEARNING
GENERATION MODE: TOKEN-BY-TOKEN, BATCH PROCESSING, PARALLEL GENERATION, CASCADE MODELS
OUTPUT: TEXT, IMAGE, AUDIO, VIDEO, CODE, STRUCTURED DATA, MULTIMODAL
DEPLOYMENT: CLOUD, EDGE, ON-PREMISE, HYBRID
INTERFACE: CHATBOT, API, DASHBOARD, MOBILE APP, BROWSER EXTENSION, EMBEDDED SYSTEM
PERSONALIZATION: STATIC PROMPTS, CONTEXT MEMORY, ADAPTIVE LEARNING, USER FINE-TUNING, PROFILE-BASED ADAPTATION
ETHICAL CONSTRAINTS: CONTENT FILTERING, BIAS MITIGATION, USER MONITORING, TRANSPARENCY REPORTING, HUMAN-IN-THE-LOOP
SECURITY: DATA ENCRYPTION, USER AUTHENTICATION, API RATE LIMITING, MODEL ACCESS CONTROL, AUDIT LOGS`;

export const CategoryInput: React.FC<CategoryInputProps> = ({
  textInput,
  isInputVisible,
  onTextChange,
  onToggleVisibility,
}) => {
  const handleExampleClick = (example: string) => {
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
                placeholder={`Enter categories and options in the format:
CATEGORY 1: OPTION 1A, OPTION 1B, OPTION 1C
CATEGORY 2: OPTION 2A, OPTION 2B, OPTION 2C`}
                className="min-h-[400px] w-full p-4 border rounded-md resize-y"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
