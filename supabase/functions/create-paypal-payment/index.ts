import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting PayPal payment creation request...')
    
    const { transactionId, amount, currency, packageName, interpretations } = await req.json()
    console.log('Received payment data:', { transactionId, amount, currency, packageName, interpretations })
    
    if (!transactionId || !amount || !currency) {
      console.error('Missing required payment data')
      return new Response(
        JSON.stringify({ error: 'Missing required payment data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    
    if (!paypalClientId || !paypalClientSecret) {
      console.error('PayPal configuration not found')
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: transactionId,
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          description: `${packageName} - ${interpretations} dream interpretations`
        }]
      })
    })

    if (!orderResponse.ok) {
      throw new Error(`PayPal order creation failed: ${orderResponse.status}`)
    }

    const orderData = await orderResponse.json()
    console.log('PayPal order created:', orderData.id)

    return new Response(
      JSON.stringify({
        orderId: orderData.id,
        approvalUrl: orderData.links.find((link: any) => link.rel === 'approve')?.href
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-paypal-payment function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Payment creation failed',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 