export const config = {
  runtime: "edge",
  maxDuration: 30
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    var body = await req.json();
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: body.max_tokens || 3000,
        system: body.system,
        messages: body.messages
      })
    });

    var responseText = await response.text();
    
    try {
      var data = JSON.parse(responseText);
      return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (parseErr) {
      return new Response(JSON.stringify({ error: "API returned invalid response: " + responseText.substring(0, 200) }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed: " + error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
