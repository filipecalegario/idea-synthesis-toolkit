
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProjectSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = () => {
    try {
      const storedApiKey = localStorage.getItem('openai-api-key');
      setHasApiKey(!!storedApiKey);
    } catch (error) {
      console.error('Error checking API key:', error);
      toast.error("Failed to check API key status");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!apiKey.trim()) {
        toast.error("API key cannot be empty");
        return;
      }

      localStorage.setItem('openai-api-key', apiKey);
      toast.success(isEditing ? "API key updated successfully!" : "API key saved successfully!");
      setApiKey("");
      setIsEditing(false);
      setHasApiKey(true);
    } catch (error) {
      console.error('Error setting API key:', error);
      toast.error("Failed to save API key");
    }
  };

  const handleDelete = () => {
    try {
      localStorage.removeItem('openai-api-key');
      toast.success("API key deleted successfully!");
      setHasApiKey(false);
      setIsEditing(false);
      setApiKey("");
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error("Failed to delete API key");
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
              <p className="text-muted-foreground">
                Manage your project configuration
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">OpenAI API Key</h2>
              
              {hasApiKey && !isEditing && (
                <div className="space-y-4">
                  <Alert className="bg-[#F2FCE2]">
                    <AlertDescription>
                      Your OpenAI API key is stored in your browser's local storage. You can edit or delete it using the buttons below.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit API Key
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete API Key
                    </Button>
                  </div>
                </div>
              )}

              {(!hasApiKey || isEditing) && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Enter your OpenAI API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your API key is stored in your browser's local storage and used for AI elaboration features.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {isEditing ? "Update API Key" : "Save API Key"}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={() => {
                        setIsEditing(false);
                        setApiKey("");
                      }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProjectSettings;
