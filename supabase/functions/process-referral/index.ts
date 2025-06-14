import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralPayload {
  referralCode: string;
  newUserId: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-REFERRAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { referralCode, newUserId } = await req.json() as ReferralPayload;

    if (!referralCode || !newUserId) {
      throw new Error("Missing referral code or new user ID");
    }

    logStep("Processing referral", { referralCode, newUserId });

    // Check if user has already been referred
    const { data: existingReferral } = await supabaseClient
      .from('referrals')
      .select('id')
      .eq('referred_id', newUserId)
      .single();

    if (existingReferral) {
      logStep("User already referred", { newUserId });
      return new Response(
        JSON.stringify({ error: "User has already been referred" }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Find referrer based on the referral code (first 8 chars of their user ID)
    const { data: referrerData, error: referrerError } = await supabaseClient
      .from('user_usage')
      .select('user_id')
      .eq('user_id', referralCode + '%')
      .neq('user_id', newUserId) // Prevent self-referral
      .single();

    if (referrerError || !referrerData) {
      logStep("Invalid referral code", { referralCode });
      return new Response(
        JSON.stringify({ error: "Invalid referral code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Start a transaction to update both users
    const { error: transactionError } = await supabaseClient.rpc('process_referral_transaction', {
      p_referrer_id: referrerData.user_id,
      p_referred_id: newUserId
    });

    if (transactionError) {
      throw transactionError;
    }

    logStep("Referral processed successfully", { 
      referrerId: referrerData.user_id,
      referredId: newUserId 
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Referral processed successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
