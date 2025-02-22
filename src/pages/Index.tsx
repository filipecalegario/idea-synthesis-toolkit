
import React, { useState, useEffect } from "react";
import { CombinationTable } from "@/components/CombinationTable";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Copy, ChevronUp, ChevronDown, Wand2, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  name: string;
  options: string[];
}

const Index = () => {
  const [textInput, setTextInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isElaborating, setIsElaborating] = useState(false);
  const [elaboration, setElaboration] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const { data: { session }} = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No session found');
        }

        // Use Supabase functions.invoke instead of fetch
        const { data, error } = await supabase.functions.invoke('check-api-key');
        if (error) throw error;
        setHasApiKey(data.hasKey);
      } catch (error) {
        console.error('Error checking API key:', error);
        setHasApiKey(false);
      }
    };
    
    checkApiKey();
  }, []);

  const parseTextInput = (input: string) => {
    const lines = input.trim().split("\n");
    return lines
      .map((line) => {
        const [name, optionsStr] = line.split(":");
        if (!name || !optionsStr) return null;
        const options = optionsStr
          .split(",")
          .map((opt) => opt.trim())
          .filter((opt) => opt);
        return { name: name.trim(), options };
      })
      .filter((cat): cat is Category => cat !== null && cat.options.length > 0);
  };

  useEffect(() => {
    const newCategories = parseTextInput(textInput);
    setCategories(newCategories);
  }, [textInput]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleCategoryEdit = (index: number, newName: string) => {
    const newCategories = [...categories];
    newCategories[index].name = newName;
    setCategories(newCategories);
    updateTextArea(newCategories);
  };

  const handleOptionEdit = (categoryIndex: number, optionIndex: number, newValue: string) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].options[optionIndex] = newValue;
    setCategories(newCategories);
    updateTextArea(newCategories);
  };

  const updateTextArea = (cats: Category[]) => {
    const text = cats.map((cat) => `${cat.name}: ${cat.options.join(", ")}`).join("\n");
    setTextInput(text);
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

  const generateCombination = () => {
    return categories
      .map((cat, index) => {
        const selectedIndices = selectedOptions[index] || [];
        return selectedIndices.length > 0
          ? selectedIndices.map(idx => cat.options[idx]).join(" & ")
          : null;
      })
      .filter(Boolean)
      .join(" + ");
  };

  const handleClear = () => {
    setSelectedOptions({});
    toast.success("Selection cleared");
  };

  const handleCopy = () => {
    const combination = generateCombination();
    if (combination) {
      navigator.clipboard.writeText(combination);
      toast.success("Copied to clipboard");
    }
  };

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleElaborate = async () => {
    const combination = generateCombination();
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
      const response = await fetch('/functions/v1/elaborate-combination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ combination }),
      });

      if (!response.ok) throw new Error('Failed to get elaboration');

      const data = await response.json();
      setElaboration(data.elaboration);
      toast.success("Elaboration generated!");
    } catch (error) {
      console.error('Error elaborating combination:', error);
      toast.error("Failed to elaborate on combination");
    } finally {
      setIsElaborating(false);
    }
  };

  return (
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
            <Button variant="outline" size="icon" className="ml-4">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {hasApiKey === false && (
          <Alert className="mb-4">
            <AlertDescription>
              To use the AI elaboration feature, please set your OpenAI API key in the project settings.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Categories & Options</h2>
              <Button variant="outline" size="sm" onClick={toggleInputVisibility}>
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
                      onChange={handleTextChange}
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Combination Table</h2>
            <CombinationTable
              categories={categories}
              onCategoryEdit={handleCategoryEdit}
              onOptionEdit={handleOptionEdit}
              selectedOptions={selectedOptions}
              onOptionSelect={handleOptionSelect}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Combination</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleClear} size="sm">
                Clear Selection
              </Button>
              <Button variant="outline" onClick={handleCopy} size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
          <p className="combination-text">{generateCombination() || "Select options to generate a combination"}</p>
          
          <div className="pt-4 border-t">
            <Button 
              onClick={handleElaborate} 
              disabled={isElaborating} 
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
      </motion.div>
    </div>
  );
};

export default Index;
