// The fixed parts of every prompt, and the pre-written scenarios behind the
// "What has Eric been up to?" question. The image model gets:
//   PREFIX + scene + SUFFIX
// PREFIX carries the LoRA trigger word and the look; SUFFIX pins the framing
// (the LoRA holds up best waist-up, face to camera). Scenes are 3 or 4 short
// sentences of nouns and simple actions that continue the prefix ("is ...").
// Adverbs, feelings, and place or brand names do nothing: the model draws what
// it has seen, not what it has heard of.
const PREFIX = "er1cshen, a tall chinese-american man late 20s with a handlebar mustache,";
const SUFFIX = "Waist up, candid, looking at the camera.";

const PACK = [
  "is standing on a small aluminum boat on gray water, holding up a wire crab pot with a large Dungeness crab inside. He wears orange rain bib overalls and a beanie. Forested shoreline behind him. Overcast light.",
  "is cooking in a home kitchen, lifting a whole red Dungeness crab out of a steaming stockpot with tongs. He wears a dark apron over a t-shirt. Warm light.",
  "is frying a fish fillet in a cast iron pan in a home kitchen, holding a pot lid up in front of his chest like a shield. Oil is spattering from the pan. He wears a dark apron over a t-shirt. Warm light.",
  "is on a turf soccer field at dusk with his hands on his knees and a soccer ball at his feet. He wears a plain gray jersey and shorts. A chain-link fence with a few people slumped against it is out of focus behind him. Orange sky.",
  "is sitting at a laptop in a small single-person office. A large window behind him looks out over a corporate parking lot and evergreen trees. He wears a wrinkled button-up shirt. Flat gray daylight.",
  "is sitting at a laptop in a small single-person office at night. A row of empty paper coffee cups lines the desk. The window behind him is dark with parking lot lamps below. Monitor glow on his face."
];

const assemble = (scene) => `${PREFIX} ${scene} ${SUFFIX}`;
const randomScene = () => PACK[Math.floor(Math.random() * PACK.length)];

module.exports = { PREFIX, SUFFIX, PACK, assemble, randomScene };
