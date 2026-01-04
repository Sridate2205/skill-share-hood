import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a helpful assistant for SkillShare Connect, a neighborhood-based skill sharing platform. Your role is to help users understand how to use the app effectively.

About SkillShare Connect:
- It's a platform where neighbors can share skills and help each other
- Users can post "Skill Requests" when they need help with something
- Users can post "Skill Offers" to share their expertise
- The platform connects local community members

Key Features:
1. Dashboard: Shows all neighborhood requests and skill offers. Has a search bar to filter posts.
2. Creating Posts: Click "Post Request or Offer" button. Choose between Request Help or Offer Skill tabs.
3. Expressing Interest: Click on any post to view details, then "Express Interest" to connect with the poster.
4. Notifications: Bell icon shows notifications when someone is interested in your post.
5. About Page: Learn more about the platform and its mission.
6. Help Page: FAQs and this chatbot for assistance.

For Requests:
- Fill in title, description, category, location, and compensation
- Categories include Home Repair, Tutoring, Technology, Gardening, Cooking, Fitness, etc.

For Offers:
- Fill in title, description, category, location, rate, and availability
- Set your hourly/project rate and when you're available

Safety Tips:
- Meet in public places for initial meetings
- Verify identities before transactions
- Trust your instincts

Be friendly, concise, and helpful. If asked about something outside the app, politely redirect to app-related topics.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
