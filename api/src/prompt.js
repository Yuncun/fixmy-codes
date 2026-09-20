// Prompts for the "What has Eric been up to?" question, and the fixed parts
// of the free-text path.
//
// PACK is a list of complete, hand-written prompts. They go to the image model
// exactly as written: no LLM, no prefix, no suffix. Write them the way the
// first one is written: 3 or 4 short sentences of nouns and simple actions,
// waist up, looking at the camera. Adverbs, feelings, and place or brand names
// do nothing; the model draws what it has seen, not what it has heard of.
//
// The free-text path gets PREFIX + LLM text + SUFFIX (assembled inside the fal
// workflow, which receives these two strings from the API).
const PREFIX = "er1cshen, a tall chinese-american man late 20s with a handlebar mustache,";
const SUFFIX = "Waist up, candid, looking at the camera.";

const PACK = [
  "er1cshen, a tall chinese-american man late 20s man with a handlebar mustache, is cooking in a home kitchen, stirring a pan on the stove. He wears a dark apron over a t-shirt. He is frying up some ginger scallion crab. A stockpot is on the burner, and on the counter are clams in a bowl. warm light, waist up, candid, looking at the camera.",
  "er1cshen, a tall chinese-american man late 20s with a handlebar mustache, is standing on a small aluminum boat on gray water, holding up a wire crab pot with a large Dungeness crab inside. He wears orange rain bib overalls and a beanie. Forested shoreline behind him. Overcast light. Waist up, candid, looking at the camera.",
  "er1cshen, a tall chinese-american man late 20s with a handlebar mustache, is frying a fish fillet in a cast iron pan in a home kitchen, holding a pot lid up in front of his chest like a shield. Oil is spattering from the pan. He wears a dark apron over a t-shirt. Warm light. Waist up, candid, looking at the camera.",
  "er1cshen, a tall chinese-american man late 20s with a handlebar mustache, is on a turf soccer field at dusk with his hands on his knees and a soccer ball at his feet. He wears a plain gray jersey and shorts. A chain-link fence with a few people slumped against it is out of focus behind him. Orange sky. Waist up, candid, looking at the camera.",
  "er1cshen, a tall chinese-american man late 20s with a handlebar mustache, is sitting at a laptop in a small single-person office. A large window behind him looks out over a corporate parking lot and evergreen trees. He wears a wrinkled button-up shirt. Flat gray daylight. Waist up, candid, looking at the camera.",
  "er1cshen, a tall chinese-american man late 20s with a handlebar mustache, is sitting at a laptop in a small single-person office at night. A row of empty paper coffee cups lines the desk. The window behind him is dark with parking lot lamps below. Monitor glow on his face. Waist up, candid, looking at the camera."
];

const randomPrompt = () => PACK[Math.floor(Math.random() * PACK.length)];

module.exports = { PREFIX, SUFFIX, PACK, randomPrompt };
