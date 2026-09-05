const key = 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8';
const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

async function test() {
  for (const api of ['v1beta', 'v1']) {
    for (const m of models) {
      const t0 = Date.now();
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/${api}/models/${m}:generateContent?key=${key}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ contents: [{ parts: [{ text: 'שלום' }] }] }),
          signal: AbortSignal.timeout(25000)
        });
        const data = await res.json();
        const dt = Date.now() - t0;
        if (res.ok && data.candidates) {
          console.log(`✅ [${api}] ${m}: ${dt}ms -> ${data.candidates[0].content.parts[0].text.trim()}`);
        } else {
          console.log(`❌ [${api}] ${m}: ${dt}ms -> ${res.status} ${data.error?.message}`);
        }
      } catch(e) {
        console.log(`⚠️ [${api}] ${m}: ${e.message}`);
      }
    }
  }
}
test();
