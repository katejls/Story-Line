export const config = { runtime: "edge" };

export default async function(req) {
  if (req.method !== "POST") {
    return new Response('{"ok":true}', { status: 200, headers: { "Content-Type": "application/json" } });
  }

  try {
    var formData = await req.formData();
    var dataStr = formData.get("data");
    if (!dataStr) {
      return new Response('{"error":"no data"}', { status: 400, headers: { "Content-Type": "application/json" } });
    }

    var data = JSON.parse(dataStr);
    var email = data.email;
    var type = data.type;

    if (!email) {
      return new Response('{"error":"no email"}', { status: 400, headers: { "Content-Type": "application/json" } });
    }

    var SUPABASE_URL = "https://ndqfqalcbfkzdzdkhxhh.supabase.co";
    var SUPABASE_KEY = process.env.SUPABASE_KEY;

    var res = await fetch(SUPABASE_URL + "/rest/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        status: "active",
        source: "kofi"
      })
    });

    return new Response('{"ok":true}', { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response('{"error":"' + e.message + '"}', { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
