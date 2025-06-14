
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
    console.log('Starting payment creation request...')
    
    const { transactionId, amount, currency, packageName, interpretations } = await req.json()
    console.log('Received payment data:', { transactionId, amount, currency, packageName, interpretations })
    
    if (!transactionId || !amount || !currency) {
      console.error('Missing required payment data')
      return new Response(
        JSON.stringify({ error: 'Missing required payment data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paymobApiKey = Deno.env.get('PAYMOB_API_KEY')
    const paymobIntegrationId = Deno.env.get('PAYMOB_INTEGRATION_ID')
    const paymobIframeId = Deno.env.get('PAYMOB_IFRAME_ID')
    
    console.log('Paymob config present:', {
      apiKey: !!paymobApiKey,
      integrationId: !!paymobIntegrationId,
      iframeId: !!paymobIframeId
    })
    
    if (!paymobApiKey || !paymobIntegrationId || !paymobIframeId) {
      console.error('Paymob configuration not found')
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating Paymob payment...')
    
    // Step 1: Authentication Request
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: paymobApiKey
      })
    })

    if (!authResponse.ok) {
      throw new Error(`Paymob auth failed: ${authResponse.status}`)
    }

    const authData = await authResponse.json()
    const authToken = authData.token
    console.log('Paymob auth successful')

    // Step 2: Order Registration
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100),
        currency: currency,
        merchant_order_id: transactionId,
        items: [{
          name: packageName,
          amount_cents: Math.round(amount * 100),
          description: `${interpretations} dream interpretations`,
          quantity: 1
        }]
      })
    })

    if (!orderResponse.ok) {
      throw new Error(`Paymob order creation failed: ${orderResponse.status}`)
    }

    const orderData = await orderResponse.json()
    console.log('Paymob order created:', orderData.id)

    // Step 3: Payment Key Request
    const paymentKeyResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(amount * 100),
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          apartment: "NA",
          email: "customer@example.com",
          floor: "NA",
          first_name: "Customer",
          street: "NA",
          building: "NA",
          phone_number: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "NA",
          last_name: "User",
          state: "NA"
        },
        currency: currency,
        integration_id: parseInt(paymobIntegrationId)
      })
    })

    if (!paymentKeyResponse.ok) {
      throw new Error(`Paymob payment key creation failed: ${paymentKeyResponse.status}`)
    }

    const paymentKeyData = await paymentKeyResponse.json()
    const paymentToken = paymentKeyData.token
    console.log('Paymob payment key created')

    // Generate payment URL
    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${paymobIframeId}?payment_token=${paymentToken}`

    console.log('Payment URL generated successfully')

    return new Response(
      JSON.stringify({
        paymentUrl,
        paymentToken,
        orderId: orderData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-payment function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Payment creation failed',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
