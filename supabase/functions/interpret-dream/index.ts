
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
    console.log('Starting dream interpretation request...')
    
    const { dreamText, userContext } = await req.json()
    console.log('Received dream text:', dreamText?.substring(0, 100) + '...')
    console.log('User context:', userContext)
    
    if (!dreamText) {
      console.error('No dream text provided')
      return new Response(
        JSON.stringify({ error: 'Dream text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const googleAiApiKey = Deno.env.get('GOOGLE_AI_API_KEY')
    console.log('Google AI API key present:', !!googleAiApiKey)
    
    if (!googleAiApiKey) {
      console.error('Google AI API key not configured')
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Detect if the dream text contains Arabic characters
    const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(dreamText)
    console.log('Detected Arabic text:', isArabic)

    // Build user context string for personalization
    let contextString = ""
    if (userContext) {
      const contextParts = []
      if (userContext.age) contextParts.push(`age ${userContext.age}`)
      if (userContext.gender) contextParts.push(`gender: ${userContext.gender}`)
      if (userContext.relationshipStatus) contextParts.push(`relationship status: ${userContext.relationshipStatus}`)
      if (userContext.displayName) contextParts.push(`name: ${userContext.displayName}`)
      
      if (contextParts.length > 0) {
        contextString = isArabic 
          ? `معلومات الشخص: ${contextParts.join(', ')}. `
          : `Person details: ${contextParts.join(', ')}. `
      }
    }

    console.log('Generating interpretations with user context...')
    
    // Create interpretations using Google AI Studio with Gemini 2.0 Flash Preview
    const interpretations = await Promise.all([
      generateInterpretation(dreamText, 'islamic', googleAiApiKey, isArabic, contextString),
      generateInterpretation(dreamText, 'spiritual', googleAiApiKey, isArabic, contextString),
      generateInterpretation(dreamText, 'psychological', googleAiApiKey, isArabic, contextString)
    ])

    console.log('All interpretations generated successfully')

    return new Response(
      JSON.stringify({
        interpretations: {
          islamic: interpretations[0],
          spiritual: interpretations[1],
          psychological: interpretations[2]
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in interpret-dream function:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateInterpretation(dreamText: string, perspective: string, apiKey: string, isArabic: boolean, contextString: string): Promise<string> {
  const prompts = {
    islamic: isArabic 
      ? `${contextString}كعالم إسلامي، قدم تفسيراً مدروساً وشخصياً لهذا الحلم وفقاً للتقاليد والتعاليم الإسلامية. ركز على الإرشاد الروحي والمراجع للمبادئ الإسلامية. خذ في الاعتبار تفاصيل الشخص لجعل التفسير أكثر دقة وصلة. اكتب الرد بدون أي رموز تزيينية مثل النجوم أو الشرطات. استخدم نصاً واضحاً وبسيطاً: "${dreamText}"`
      : `${contextString}As an Islamic scholar, provide a thoughtful and personalized interpretation of this dream according to Islamic tradition and teachings. Focus on spiritual guidance and references to Islamic principles. Consider the person's details to make the interpretation more accurate and relevant. Write your response without any decorative characters like asterisks or dashes. Use clear, simple text: "${dreamText}"`,
    spiritual: isArabic
      ? `${contextString}كمرشد روحي، قدم تفسيراً شخصياً لهذا الحلم من منظور روحي شامل، مع التركيز على النمو الشخصي والرمزية والحكمة الداخلية. خذ في الاعتبار تفاصيل الشخص لجعل التفسير أكثر دقة وصلة. اكتب الرد بدون أي رموز تزيينية مثل النجوم أو الشرطات. استخدم نصاً واضحاً وبسيطاً: "${dreamText}"`
      : `${contextString}As a spiritual guide, provide a personalized interpretation of this dream from a universal spiritual perspective, focusing on personal growth, symbolism, and inner wisdom. Consider the person's details to make the interpretation more accurate and relevant. Write your response without any decorative characters like asterisks or dashes. Use clear, simple text: "${dreamText}"`,
    psychological: isArabic
      ? `${contextString}كطبيب نفسي، قدم تفسيراً شخصياً لهذا الحلم من منظور نفسي، مع التركيز على العمليات اللاوعية والأنماط العاطفية والحالات الذهنية. خذ في الاعتبار تفاصيل الشخص مثل العمر والحالة الاجتماعية لجعل التفسير أكثر دقة وصلة. اكتب الرد بدون أي رموز تزيينية مثل النجوم أو الشرطات. استخدم نصاً واضحاً وبسيطاً: "${dreamText}"`
      : `${contextString}As a psychologist, provide a personalized interpretation of this dream from a psychological perspective, focusing on subconscious processes, emotional patterns, and mental states. Consider the person's details like age and relationship status to make the interpretation more accurate and relevant. Write your response without any decorative characters like asterisks or dashes. Use clear, simple text: "${dreamText}"`
  }

  console.log(`Generating ${perspective} interpretation (Arabic: ${isArabic})...`)

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompts[perspective as keyof typeof prompts]
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    console.log(`Google AI response status for ${perspective}:`, response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Google AI API error for ${perspective}:`, response.status, errorText)
      throw new Error(`Google AI API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log(`Generated ${perspective} interpretation successfully`)
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      let interpretation = data.candidates[0].content.parts[0].text
      
      // Clean up decorative characters more thoroughly
      interpretation = interpretation
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '') // Remove asterisks
        .replace(/--+/g, '-') // Replace multiple dashes with single dash
        .replace(/==+/g, '') // Remove equals signs
        .replace(/##/g, '') // Remove markdown headers
        .replace(/\[.*?\]/g, '') // Remove square brackets
        .replace(/_{2,}/g, '') // Remove multiple underscores
        .replace(/\~{2,}/g, '') // Remove tildes
        .trim()
      
      return interpretation
    }
    
    console.error(`Invalid response structure for ${perspective}:`, data)
    throw new Error(`Failed to generate ${perspective} interpretation: Invalid response structure`)
    
  } catch (error) {
    console.error(`Error generating ${perspective} interpretation:`, error)
    throw new Error(`Failed to generate ${perspective} interpretation: ${error.message}`)
  }
}
