// POST /api/generate {scene} → {url}
// The fal workflow prepends the LoRA trigger and appends "Medium shot." itself.
// FAL_KEY comes from the Static Web App's application settings, never the client.
// The prompt is never returned.
const { app } = require('@azure/functions');

const WORKFLOW = 'https://fal.run/workflows/Yuncun/eric';
const MAX_SCENE = 400;

async function generate(request, context) {
  const key = process.env.FAL_KEY;
  if (!key) return { status: 500, body: 'FAL_KEY not configured' };

  let body;
  try {
    body = await request.json();
  } catch {
    return { status: 400, body: 'Expected JSON {scene}' };
  }
  let scene = typeof body.scene === 'string' ? body.scene.trim() : '';
  if (!scene) return { status: 400, body: 'scene is required' };
  if (scene.length > MAX_SCENE) return { status: 400, body: `scene must be under ${MAX_SCENE} characters` };
  if (!/[.!?]$/.test(scene)) scene += '.';

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
  return { jsonBody: { url } };
}

app.http('generate', { methods: ['POST'], authLevel: 'anonymous', handler: generate });
module.exports = { generate };
