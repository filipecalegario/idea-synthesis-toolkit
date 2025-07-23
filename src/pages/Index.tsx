
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
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const { data, error } = await supabase
          .from('credits')
          .select('amount')
          .maybeSingle();
        
        if (error) throw error;
        console.log(data.amount)
        setCredits(data?.amount ?? 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
        toast.error("Failed to fetch credits");
      }
    };

    fetchCredits();
  }, []);

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

    if (credits !== null && credits < 1) {
      toast.error("You don't have enough credits to elaborate");
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

      // Call OpenAI directly from frontend
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that elaborates on creative combinations in 2-3 engaging sentences.'
            },
            {
              role: 'user',
              content: `Please elaborate on this creative combination: ${combination}`
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OpenAI API error:', data);
        throw new Error(data.error?.message || 'Failed to get elaboration from OpenAI');
      }

      // Update credits after successful elaboration
      const { error: updateError } = await supabase
        .from('credits')
        .update({ amount: (credits ?? 0) - 1 })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

      setCredits((prev) => (prev !== null ? prev - 1 : null));
      setElaboration(data.choices[0].message.content.trim());
      toast.success("Elaboration generated!");
    } catch (error) {
      console.error('Error elaborating combination:', error);
      toast.error("Failed to elaborate on combination");
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
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Credits: {credits ?? '...'}
              </div>
              <Link to="/project-settings">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
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
            credits={credits}
          />
        </motion.div>
      </div>
    </>
  );
};

export default Index;
