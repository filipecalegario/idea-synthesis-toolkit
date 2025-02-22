
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '')
    
    // Get the user from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Get request body
    const { apiKey } = await req.json()
    if (!apiKey) {
      throw new Error('API key is required')
    }

    // Store the API key in the secrets table
    const { error: insertError } = await supabase
      .from('secrets')
      .upsert(
        { 
          user_id: user.id,
          key_name: 'OPENAI_API_KEY',
          key_value: apiKey
        },
        { 
          onConflict: 'user_id,key_name'
        }
      )

    if (insertError) {
      console.error('Error storing API key:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ message: 'API key saved successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in set-api-key function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
