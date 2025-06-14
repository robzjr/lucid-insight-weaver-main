
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
    console.log('Paymob webhook received')
    
    const webhookData = await req.json()
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2))
    
    const { obj } = webhookData
    
    if (!obj) {
      console.error('No obj field in webhook data')
      return new Response('No obj field', { status: 400 })
    }

    const {
      success,
      pending,
      amount_cents,
      currency,
      order,
      transaction_id
    } = obj

    const transactionId = order?.merchant_order_id
    
    if (!transactionId) {
      console.error('No transaction ID found in webhook')
      return new Response('No transaction ID', { status: 400 })
    }

    console.log(`Processing webhook for transaction: ${transactionId}`)
    console.log(`Payment status - success: ${success}, pending: ${pending}`)

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
    if (success) {
      status = 'completed'
    } else if (!pending) {
      status = 'failed'
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: status,
        paymob_transaction_id: transaction_id,
        payment_date: success ? new Date().toISOString() : null
      })
      .eq('id', transactionId)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return new Response('Update failed', { status: 500 })
    }

    console.log(`Transaction ${transactionId} updated to status: ${status}`)

    // If payment is successful, update user usage
    if (success) {
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
    console.error('Error in paymob-webhook function:', error)
    return new Response('Internal error', { status: 500 })
  }
})
