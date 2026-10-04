const corsHeaders = {
  "Access-Control-Allow-Origin": "https://guyorlov.com",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
};

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function cleanWord(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 32);
}

function validWord(value) {
  return /^[A-Z]+(?: [A-Z]+){0,4}$/.test(value) && value.length <= 32;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (!env.SIGNMYWORD_TRENDS) {
      return Response.json({ error: "KV binding SIGNMYWORD_TRENDS is missing" }, { status: 500, headers: corsHeaders });
    }

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const word = cleanWord(body.word);
      const lang = body.lang === "asl" ? "asl" : "bsl";

      if (!validWord(word)) {
        return Response.json({ error: "Invalid word" }, { status: 400, headers: corsHeaders });
      }

      const key = `day:${dayKey()}`;
      const current = await env.SIGNMYWORD_TRENDS.get(key, "json") || {};
      const itemKey = `${lang}|${word}`;
      current[itemKey] = (Number(current[itemKey]) || 0) + 1;
      await env.SIGNMYWORD_TRENDS.put(key, JSON.stringify(current), { expirationTtl: 60 * 60 * 24 * 15 });

      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (request.method === "GET") {
      const totals = new Map();
      let total = 0;

      for (let offset = 0; offset < 7; offset += 1) {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - offset);
        const data = await env.SIGNMYWORD_TRENDS.get(`day:${dayKey(date)}`, "json") || {};

        Object.entries(data).forEach(([key, count]) => {
          const [lang, word] = key.split("|");
          const amount = Number(count) || 0;
          total += amount;
          const aggregateKey = `${lang}|${word}`;
          totals.set(aggregateKey, (totals.get(aggregateKey) || 0) + amount);
        });
      }

      const words = [...totals.entries()]
        .map(([key, count]) => {
          const [lang, word] = key.split("|");
          return { word, lang, count };
        })
        // Privacy guard: do not publish one-off searches.
        .filter((item) => item.count >= 3)
        .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
        .slice(0, 30);

      return Response.json({ words, total }, { headers: corsHeaders });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  },
};
