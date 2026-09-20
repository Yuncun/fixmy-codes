// The fixed parts of every prompt, and the pre-written scenarios behind the
// "What has Eric been up to?" button. The image model gets:
//   PREFIX + scene + SUFFIX
// PREFIX carries the LoRA trigger word and the look; SUFFIX pins the framing
// (the LoRA only holds up at medium shot or closer). Scenes describe only what
// the camera sees, in sentences starting with "He". No place or brand names:
// the model draws what it has seen, not what it has heard of.
const PREFIX = 'er1cshen, a tall skinny chinese-american man in his mid 30s with a handlebar mustache and terrible posture.';
const SUFFIX = 'Medium shot or closer, eye level, candid photograph.';

const PACK = [
  "He is hauling a wire crab pot over the rail of a small aluminum boat on gray choppy water, one large Dungeness crab clinging to the mesh, wearing orange rain bib overalls and a beanie, back rounded and hunched under the weight, overcast flat light, forested shoreline blurred behind.",
  "He is in a cramped apartment kitchen lifting a whole bright red Dungeness crab out of a steaming stockpot with tongs, holding it at arm's length and leaning his whole upper body away from it, back rounded, steam fogging the air, warm overhead light.",
  "He is frying a fish fillet in a cast iron pan on a cramped apartment stove, hot oil spitting, holding a pot lid up in front of his chest like a shield and leaning far back from the pan, spatula extended at full arm's length, warm kitchen light.",
  "He is on a turf soccer field at dusk in a plain unbranded jersey and shorts, waist-up view, bent over with both hands on his knees gasping, a ball at his feet, other players far behind him and out of focus with their backs turned, a chain-link fence with a few figures slumped against it in the blurred background, orange sky over a city skyline.",
  "He is in a small single-person office hunched so far over his laptop that his nose almost touches the screen, back rounded like a shrimp, chin jutting forward, elbows splayed on the desk, an untouched ergonomic lumbar cushion on the floor beside the chair, a large picture window behind him overlooking a corporate parking lot and evergreen trees, flat gray daylight.",
  "He is in a small single-person office hunched so far over his laptop that his nose almost touches the screen, back rounded like a shrimp, chin jutting forward, elbows splayed on the desk, a row of empty paper coffee cups along the desk edge, a large picture window behind him dark with parking lot lamps glowing below, his face lit only by the monitor.",
];

const assemble = (scene) => `${PREFIX} ${scene} ${SUFFIX}`;
const randomScene = () => PACK[Math.floor(Math.random() * PACK.length)];

module.exports = { PREFIX, SUFFIX, PACK, assemble, randomScene };
