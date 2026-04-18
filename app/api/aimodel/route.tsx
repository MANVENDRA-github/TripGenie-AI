import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner assistant. You help users plan trips step by step.

STRICT RULES:
1. Ask ONLY ONE question per response.
2. Follow this EXACT order — skip any step that's already answered in the conversation:
   Step 1: Ask for source/origin city
   Step 2: Ask for destination city
   Step 3: Ask for group size (respond with ui:"groupSize")
   Step 4: Ask for budget level (respond with ui:"budget")
   Step 5: Ask for trip duration/days (respond with ui:"tripDuration")
   Step 6: Confirm all details and say you'll generate the trip (respond with ui:"final")

3. CRITICAL: Before asking a question, CHECK the full conversation history. If a detail was already provided, DO NOT ask for it again. Move to the next unanswered step.
4. NEVER show the same UI component twice. If groupSize was already selected, do NOT return ui:"groupSize" again. Same for budget and tripDuration.
5. After group size, budget, AND duration are all collected, go directly to step 6 (final).
6. Do NOT ask about interests or special preferences — skip them.
7. DO NOT explicitly ask "how many people". Just map the companion selection (Just me=1, A couple=2, Family=4-5, Friends=2-4) to group_size in the final stage.
8. Keep responses short and friendly.

ALWAYS return valid JSON in this exact format:
{
  "resp": "your message text",
  "ui": "groupSize" | "budget" | "tripDuration" | "final" | "none"
}

Only use "none" for steps 1 and 2 (text-based questions).
`;

const FINAL_PROMPT = `Generate a comprehensive travel plan based on the conversation. Include:
- 3-4 hotel recommendations with real names, addresses, approximate prices, geo coordinates, ratings, and descriptions
- Day-by-day itinerary with real place names, descriptions, geo coordinates, addresses, ticket pricing estimates, time to spend, and best time to visit

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no backticks, no explanations. Just the JSON object.
2. ALL prices MUST use the Indian Rupee currency symbol (₹). Do NOT use dollars or other currencies.

JSON Schema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string (e.g. '4 days')",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string (e.g. '$120')",
        "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
        "rating": 4.5,
        "description": "string (1-2 sentences)"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string (brief overview)",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string (2-3 sentences)",
            "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string (e.g. '2-3 hours')",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}`;

export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4.1-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...messages,
      ],
      max_tokens: isFinal ? 6000 : 800,
    });

    const message = completion.choices[0].message;
    const rawContent = message.content ?? '{}';

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          { error: 'AI returned malformed response' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error('AI API Error:', e);
    return NextResponse.json(
      { error: 'Failed to generate response', details: e.message },
      { status: 500 }
    );
  }
}