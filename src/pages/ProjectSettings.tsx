
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProjectSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-key');
      if (error) throw error;
      setHasApiKey(data.hasKey);
    } catch (error) {
      console.error('Error checking API key:', error);
      toast.error("Failed to check API key status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session }} = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase.functions.invoke('set-api-key', {
        body: { apiKey }
      });

      if (error) throw error;

      toast.success(isEditing ? "API key updated successfully!" : "API key saved successfully!");
      setApiKey("");
      setIsEditing(false);
      setHasApiKey(true);
    } catch (error) {
      console.error('Error setting API key:', error);
      toast.error("Failed to save API key");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.functions.invoke('set-api-key', {
        body: { apiKey: null }
      });

      if (error) throw error;

      toast.success("API key deleted successfully!");
      setHasApiKey(false);
      setIsEditing(false);
      setApiKey("");
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error("Failed to delete API key");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
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
        <div className="flex items-center justify-between">
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
          <Button 
            variant="outline" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">OpenAI API Key</h2>
            
            {hasApiKey && !isEditing && (
              <div className="space-y-4">
                <Alert className="bg-[#F2FCE2]">
                  <AlertDescription>
                    Your OpenAI API key is securely stored. You can edit or delete it using the buttons below.
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
                    Your API key is stored securely and used for AI elaboration features.
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
  );
};

export default ProjectSettings;
