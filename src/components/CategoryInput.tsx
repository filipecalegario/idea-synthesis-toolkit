
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryInputProps {
  textInput: string;
  isInputVisible: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onToggleVisibility: () => void;
}

const EXAMPLE_1 = `Support: Wheels, Track, Air cushion, Slides, Pedipulators
Propulsion: Driven wheels, Air thrust, Moving cable, Linear induction
Power: Electric, Petrol, Diesel, Bottled gas, Steam
Transmission: Gears and shafts, Belts, Chains, Hydraulic, Flexible cable
Steering: Turning wheels, Air thrust, Rails
Stopping: Brakes, Reverse thrust, Ratchet
Lifting: Hydraulic ram, Rack and pinion, Screw, Chain or rope hoist
Operator: Seated at front, Seated at rear, Standing, Walking, Remote control`;

const EXAMPLE_2 = `Instrument type: String, Wind, Percussion, Electronic  
Control gesture: Plucking, Bowing, Striking, Blowing, Pressing  
Posture: Seated, Standing, Moving, Static  
Sound modulation: Pitch bending, Vibrato, Dynamics control, Filtering  
Interaction method: Hands, Feet, Body movement, Breath, Digital interface  
Material: Wood, Metal, Synthetic, Mixed  
Musical context: Classical, Jazz, Rock, Electronic, Folk  `;

const EXAMPLE_3 = `Input: Text, Image, Audio, Video, Sensor data, Code, Multimodal
Model: Gpt, Bert, Llama, Mixture of experts, Custom fine-tuned, Hybrid models
Processing: Few-shot learning, Zero-shot learning, Prompt engineering, Embedding search, Fine-tuning, Reinforcement learning
Generation mode: Token-by-token, Batch processing, Parallel generation, Cascade models
Output: Text, Image, Audio, Video, Code, Structured data, Multimodal
Deployment: Cloud, Edge, On-premise, Hybrid
Interface: Chatbot, Api, Dashboard, Mobile app, Browser extension, Embedded system
Personalization: Static prompts, Context memory, Adaptive learning, User fine-tuning, Profile-based adaptation
Ethical constraints: Content filtering, Bias mitigation, User monitoring, Transparency reporting, Human-in-the-loop
Security: Data encryption, User authentication, Api rate limiting, Model access control, Audit logs`;

export const CategoryInput: React.FC<CategoryInputProps> = ({
  textInput,
  isInputVisible,
  onTextChange,
  onToggleVisibility,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleExampleClick = (example: string) => {
    const syntheticEvent = {
      target: { value: example }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onTextChange(syntheticEvent);
  };

  const adjustTextAreaHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, [textInput, isInputVisible]);

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
          Example 1: Forklifts
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(EXAMPLE_2)}
        >
          Example 2: Musical Instruments
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(EXAMPLE_3)}
        >
          Example 3: LLM-based Apps
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
                ref={textAreaRef}
                value={textInput}
                onChange={(e) => {
                  onTextChange(e);
                  adjustTextAreaHeight();
                }}
                placeholder={`Enter categories and options in the format:
CATEGORY 1: OPTION 1A, OPTION 1B, OPTION 1C
CATEGORY 2: OPTION 2A, OPTION 2B, OPTION 2C`}
                className="min-h-[100px] w-full p-4 border rounded-md resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
