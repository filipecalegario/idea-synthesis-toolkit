
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CombinationDisplayProps {
  combination: string;
  elaboration: string;
  isElaborating: boolean;
  hasApiKey: boolean | null;
  credits: number | null;
  onClear: () => void;
  onCopy: () => void;
  onElaborate: () => void;
}

export const CombinationDisplay: React.FC<CombinationDisplayProps> = ({
  combination,
  elaboration,
  isElaborating,
  hasApiKey,
  credits,
  onClear,
  onCopy,
  onElaborate,
}) => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generated Combination</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClear} size="sm">
            Clear Selection
          </Button>
          <Button variant="outline" onClick={onCopy} size="sm">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
      <p className="combination-text">{combination || "Select options to generate a combination"}</p>
      
      <div className="pt-4 border-t">
        {credits !== null && credits < 1 && (
          <Alert className="mb-4 bg-yellow-50">
            <AlertDescription>
              You have run out of credits. Please contact support to get more credits.
            </AlertDescription>
          </Alert>
        )}
        
        {credits !== null && credits <= 3 && credits > 0 && (
          <Alert className="mb-4 bg-yellow-50">
            <AlertDescription>
              You have {credits} credit{credits === 1 ? '' : 's'} remaining.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={onElaborate} 
          disabled={isElaborating || (credits !== null && credits < 1)} 
          className="w-full"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isElaborating ? "Elaborating..." : "Elaborate with AI"}
        </Button>
        
        {elaboration && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-secondary/50 rounded-lg"
          >
            <p className="text-base text-muted-foreground italic">{elaboration}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
