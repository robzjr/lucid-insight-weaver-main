import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('PayPal webhook received')
    
    const webhookData = await req.json()
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2))
    
    // Verify webhook signature
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID')
    
    if (!paypalClientId || !paypalClientSecret || !webhookId) {
      throw new Error('PayPal configuration not found')
    }

    // Get PayPal access token
    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!authResponse.ok) {
      throw new Error(`PayPal auth failed: ${authResponse.status}`)
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Verify webhook signature
    const verifyResponse = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        auth_algo: req.headers.get('paypal-auth-algo'),
        cert_url: req.headers.get('paypal-cert-url'),
        transmission_id: req.headers.get('paypal-transmission-id'),
        transmission_sig: req.headers.get('paypal-transmission-sig'),
        transmission_time: req.headers.get('paypal-transmission-time'),
        webhook_id: webhookId,
        webhook_event: webhookData
      })
    })

    if (!verifyResponse.ok) {
      throw new Error('Invalid webhook signature')
    }

    const { resource } = webhookData
    if (!resource) {
      throw new Error('No resource in webhook data')
    }

    const transactionId = resource.purchase_units?.[0]?.reference_id
    if (!transactionId) {
      throw new Error('No transaction ID found in webhook')
    }

    console.log(`Processing webhook for transaction: ${transactionId}`)
    console.log(`Payment status: ${resource.status}`)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the transaction record
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (fetchError || !transaction) {
      console.error('Transaction not found:', fetchError)
      return new Response('Transaction not found', { status: 404 })
    }

    console.log('Found transaction:', transaction)

    let status = 'pending'
    if (resource.status === 'COMPLETED') {
      status = 'completed'
    } else if (resource.status === 'VOIDED' || resource.status === 'CANCELLED') {
      status = 'failed'
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: status,
        paypal_order_id: resource.id,
        payment_date: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', transactionId)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return new Response('Update failed', { status: 500 })
    }

    console.log(`Transaction ${transactionId} updated to status: ${status}`)

    // If payment is successful, update user usage
    if (status === 'completed') {
      console.log('Payment successful, updating user usage...')
      
      // Get current user usage
      const { data: currentUsage, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', transaction.user_id)
        .single()

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error fetching user usage:', usageError)
      }

      const newPaidInterpretations = (currentUsage?.paid_interpretations_remaining || 0) + transaction.interpretations_granted

      if (currentUsage) {
        // Update existing usage record
        const { error: updateUsageError } = await supabase
          .from('user_usage')
          .update({
            paid_interpretations_remaining: newPaidInterpretations,
            last_payment_date: new Date().toISOString()
          })
          .eq('user_id', transaction.user_id)

        if (updateUsageError) {
          console.error('Error updating user usage:', updateUsageError)
        } else {
          console.log(`Added ${transaction.interpretations_granted} interpretations to user ${transaction.user_id}`)
        }
      } else {
        // Create new usage record
        const { error: insertUsageError } = await supabase
          .from('user_usage')
          .insert({
            user_id: transaction.user_id,
            free_interpretations_used: 0,
            paid_interpretations_remaining: transaction.interpretations_granted,
            last_payment_date: new Date().toISOString()
          })

        if (insertUsageError) {
          console.error('Error creating user usage:', insertUsageError)
        } else {
          console.log(`Created usage record with ${transaction.interpretations_granted} interpretations for user ${transaction.user_id}`)
        }
      }
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Error in paypal-webhook function:', error)
    return new Response('Internal error', { status: 500 })
  }
}) 