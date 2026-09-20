// POST /api/generate → {url}
//   {preset: true}  a random pre-written scenario, straight to the image model
//   {scene: "..."}  a visitor's idea, through the fal workflow (LLM rewrite → image)
// FAL_KEY and LORA_URL come from the Static Web App's application settings,
// never the client. The prompt is never returned: the joke is in the picture.
const { app } = require('@azure/functions');
const { PREFIX, SUFFIX, assemble, randomScene } = require('../prompt');

const WORKFLOW = 'https://fal.run/workflows/Yuncun/eric';
const MODEL = 'https://fal.run/fal-ai/krea-2/turbo/lora';
const MAX_SCENE = 200;

async function fal(url, key, body, context) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    context.error(`fal ${r.status}: ${await r.text()}`);
    return { status: 502, body: 'Image service error' };
  }
  const data = await r.json();
  const imageUrl = data.images?.[0]?.url;
  if (!imageUrl) {
    context.error(`fal returned no image: ${JSON.stringify(data).slice(0, 500)}`);
    return { status: 502, body: 'No image returned' };
  }
  return { jsonBody: { url: imageUrl } };
}

async function generate(request, context) {
  const key = process.env.FAL_KEY;
  const lora = process.env.LORA_URL;
  if (!key || !lora) return { status: 500, body: 'FAL_KEY or LORA_URL not configured' };

  let body;
  try {
    body = await request.json();
  } catch {
    return { status: 400, body: 'Expected JSON {scene} or {preset}' };
  }

  if (body.preset) {
    return fal(MODEL, key, {
      prompt: assemble(randomScene()),
      loras: [{ path: lora, scale: 1.0 }],
      image_size: 'portrait_4_3',
      num_images: 1,
    }, context);
  }

  const scene = typeof body.scene === 'string' ? body.scene.trim() : '';
  if (!scene) return { status: 400, body: 'scene is required' };
  if (scene.length > MAX_SCENE) return { status: 400, body: `scene must be under ${MAX_SCENE} characters` };
  return fal(WORKFLOW, key, { scene, prefix: PREFIX, suffix: SUFFIX }, context);
}

app.http('generate', { methods: ['POST'], authLevel: 'anonymous', handler: generate });
module.exports = { generate };
