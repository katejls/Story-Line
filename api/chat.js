export const config = { runtime: "edge" };

export default async function(req) {
  if (req.method !== "POST") {
    return new Response('{"error":"Method not allowed"}', { status: 405, headers: { "Content-Type": "application/json" } });
  }

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('{"error":"API key not configured"}', { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    var body = await req.json();
    var res = await fetch("https://api.anthropic.com/v1/messages", {
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

    var txt = await res.text();
    return new Response(txt, { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response('{"error":"' + e.message + '"}', { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
