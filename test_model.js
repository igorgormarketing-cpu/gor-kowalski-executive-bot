const API_KEY = 'AIzaSyCi737y1NejDeK-CgvxuvXXrucsmgoyuE8';

const candidateModels = [
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-2.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-2.5-pro'
];

async function run() {
  for (const m of candidateModels) {
    try {
      console.log('Testing model:', m);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'שלום קובלסקי, מי אתה ומה התפקיד שלך?' }] }]
        })
      });
      const data = await res.json();
      if (res.ok && data.candidates) {
        console.log(`\n========================================`);
        console.log(`>>> SUCCESS WITH MODEL: ${m}`);
        console.log('RESPONSE:', data.candidates[0].content.parts[0].text);
        console.log(`========================================\n`);
        return m;
      } else {
        console.log(`Failed for ${m}:`, res.status, JSON.stringify(data.error || data));
      }
    } catch (e) {
      console.log(`Error for ${m}:`, e.message);
    }
  }
}

run();
