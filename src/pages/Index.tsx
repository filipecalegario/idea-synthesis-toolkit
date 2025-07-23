
import React, { useState, useEffect } from "react";
import { CombinationTable } from "@/components/CombinationTable";
import { CategoryInput } from "@/components/CategoryInput";
import { CombinationDisplay } from "@/components/CombinationDisplay";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/categories";
import { parseTextInput, generateCombination } from "@/utils/combinationUtils";

const Index = () => {
  const [textInput, setTextInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isElaborating, setIsElaborating] = useState(false);
  const [elaboration, setElaboration] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = () => {
      try {
        const storedApiKey = localStorage.getItem('openai-api-key');
        setHasApiKey(!!storedApiKey);
      } catch (error) {
        console.error('Error checking API key:', error);
        setHasApiKey(false);
      }
    };
    
    checkApiKey();
  }, []);

  useEffect(() => {
    const newCategories = parseTextInput(textInput);
    setCategories(newCategories);
  }, [textInput]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleOptionSelect = (categoryIndex: number, optionIndex: number) => {
    setSelectedOptions((prev) => {
      const newSelection = { ...prev };
      if (!newSelection[categoryIndex]) {
        newSelection[categoryIndex] = [];
      }
      
      const currentSelections = newSelection[categoryIndex];
      const selectionIndex = currentSelections.indexOf(optionIndex);
      
      if (selectionIndex === -1) {
        newSelection[categoryIndex] = [...currentSelections, optionIndex];
      } else {
        newSelection[categoryIndex] = currentSelections.filter(idx => idx !== optionIndex);
        if (newSelection[categoryIndex].length === 0) {
          delete newSelection[categoryIndex];
        }
      }
      
      return newSelection;
    });
  };

  const handleClear = () => {
    setSelectedOptions({});
    toast.success("Selection cleared");
  };

  const handleCopy = () => {
    const combination = generateCombination(categories, selectedOptions);
    if (combination) {
      navigator.clipboard.writeText(combination);
      toast.success("Copied to clipboard");
    }
  };

  const handleElaborate = async () => {
    const combination = generateCombination(categories, selectedOptions);
    if (!combination) {
      toast.error("Please select options to elaborate on");
      return;
    }

    if (!hasApiKey) {
      toast.error("Please set your OpenAI API key in the project settings first");
      return;
    }

    setIsElaborating(true);
    setElaboration("");

    try {
      const apiKey = localStorage.getItem('openai-api-key');
      if (!apiKey) {
        toast.error("OpenAI API key not found in local storage");
        setIsElaborating(false);
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a creative writing assistant that helps users elaborate on creative combinations. When given a combination of concepts, elements, or ideas, you should provide an insightful, imaginative, and detailed elaboration that explores the creative potential, synergies, and unique aspects of that combination. Your response should be engaging, thoughtful, and inspire further creative thinking.'
            },
            {
              role: 'user',
              content: `Please elaborate on this creative combination: ${combination}`
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const elaboratedText = data.choices[0]?.message?.content;

      if (!elaboratedText) {
        throw new Error('No elaboration received from OpenAI');
      }

      setElaboration(elaboratedText);
      toast.success("Elaboration generated!");
    } catch (error) {
      console.error('Error elaborating combination:', error);
      toast.error("Failed to elaborate on combination. Check console for details.");
    } finally {
      setIsElaborating(false);
    }
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold tracking-tight">Creative Combination Tool</h1>
              <p className="mt-2 text-muted-foreground">Create unique combinations from your categories and options</p>
            </div>
            <Link to="/project-settings">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {hasApiKey === false && (
            <div className="mb-4">
              <Alert className="bg-red-50">
                <AlertDescription>
                  To use the AI elaboration feature, please set your OpenAI API key in the project settings.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid gap-8">
            <CategoryInput
              textInput={textInput}
              isInputVisible={isInputVisible}
              onTextChange={handleTextChange}
              onToggleVisibility={() => setIsInputVisible(!isInputVisible)}
            />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Combination Table</h2>
              <CombinationTable
                categories={categories}
                selectedOptions={selectedOptions}
                onOptionSelect={handleOptionSelect}
              />
            </div>
          </div>

          <CombinationDisplay
            combination={generateCombination(categories, selectedOptions)}
            elaboration={elaboration}
            isElaborating={isElaborating}
            hasApiKey={hasApiKey}
            onClear={handleClear}
            onCopy={handleCopy}
            onElaborate={handleElaborate}
          />
        </motion.div>
      </div>
    </>
  );
};

export default Index;
