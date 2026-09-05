const key = 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8';
const candidateModels = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.6-flash'
];

async function testFast() {
  for (const m of candidateModels) {
    const t0 = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'היי' }] }] }),
        signal: AbortSignal.timeout(8000)
      });
      const data = await res.json();
      const dt = Date.now() - t0;
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`🚀 [${m}] -> ${dt}ms: "${data.candidates[0].content.parts[0].text.trim()}"`);
      } else {
        console.log(`❌ [${m}] -> ${dt}ms: status=${res.status} ${JSON.stringify(data.error?.message || '')}`);
      }
    } catch (e) {
      console.log(`⚠️ [${m}] -> ${Date.now() - t0}ms: ${e.message}`);
    }
  }
}

testFast();
