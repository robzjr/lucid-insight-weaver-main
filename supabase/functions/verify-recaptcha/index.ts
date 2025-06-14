
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'reCAPTCHA token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const secretKey = Deno.env.get('GOOGLE_RECAPTCHA_SECRET_KEY');
    if (!secretKey) {
      console.error('GOOGLE_RECAPTCHA_SECRET_KEY not found');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the reCAPTCHA token with Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyData = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyData,
    });

    const result = await response.json();
    
    console.log('reCAPTCHA verification result:', result);

    return new Response(
      JSON.stringify({ 
        success: result.success,
        score: result.score || null,
        action: result.action || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Verification failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
