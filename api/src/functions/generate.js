// POST /api/generate {scene} → runs the fal workflow → {url, prompt}.
// FAL_KEY comes from the Static Web App's application settings, never the client.
const { app } = require('@azure/functions');

const WORKFLOW = 'https://fal.run/workflows/Yuncun/eric';
const MAX_SCENE = 200;

async function generate(request, context) {
  const key = process.env.FAL_KEY;
  if (!key) return { status: 500, body: 'FAL_KEY not configured' };

  let scene;
  try {
    ({ scene } = await request.json());
  } catch {
    return { status: 400, body: 'Expected JSON {scene}' };
  }
  scene = typeof scene === 'string' ? scene.trim() : '';
  if (!scene) return { status: 400, body: 'scene is required' };
  if (scene.length > MAX_SCENE) return { status: 400, body: `scene must be under ${MAX_SCENE} characters` };

  const r = await fetch(WORKFLOW, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ scene }),
  });
  if (!r.ok) {
    context.error(`fal ${r.status}: ${await r.text()}`);
    return { status: 502, body: 'Image service error' };
  }
  const data = await r.json();
  const url = data.images?.[0]?.url;
  if (!url) {
    context.error(`fal returned no image: ${JSON.stringify(data).slice(0, 500)}`);
    return { status: 502, body: 'No image returned' };
  }
  return { jsonBody: { url, prompt: data.prompt ?? '' } };
}

app.http('generate', { methods: ['POST'], authLevel: 'anonymous', handler: generate });
module.exports = { generate };
