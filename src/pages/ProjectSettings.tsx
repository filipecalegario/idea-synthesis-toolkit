
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectSettings = () => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/functions/v1/set-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) throw new Error('Failed to set API key');

      toast.success("API key saved successfully!");
      setApiKey("");
    } catch (error) {
      console.error('Error setting API key:', error);
      toast.error("Failed to save API key");
    }
  };

  return (
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
            <p className="text-muted-foreground">Configure your project settings</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">OpenAI API Key</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored securely and used for AI elaboration features.
                </p>
              </div>
              <Button type="submit">Save API Key</Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectSettings;
