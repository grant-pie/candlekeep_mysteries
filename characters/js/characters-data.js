// One entry per player character. `id` is used in the URL as character.html?id=<id> and must be unique.
// `image` is the path to the portrait inside characters/images/.
// `description` is physical appearance. `background` is a list of paragraphs/lines telling their story.
const CHARACTERS = [
  {
    id: "adarna",
    name: "Adarna",
    image: "https://cm.grantpieterse.com/Characters/Adarna.webp",
    tokens: ["https://cm.grantpieterse.com/Tokens/Adarna.webp", "https://cm.grantpieterse.com/Tokens/Adarna2.webp"],
    description: "Adarna is a tiefling with tanned skin, bright and mischievous amber eyes, dark brown curls she inherited from her mother and a nearly always unimpressed facial expression. She has ram-like horns, one broken to a scarred stump. Around her neck hangs a simple glowing amulet, a gift from her patron, the source of the eldritch magic that binds her as a warlock.",
    background: ["Everything Adarna does is for her younger sister, Corvina. When a strange 'sickness', what others know as Lycanthropy, swept through their village, it tore their lives apart. Adarna set out to find answers, hoping there's still a way to save what remains of her home and protect the only family she has left.", "The glowing amulet she wears is no ordinary trinket. It was gifted to her by a patron from whom she draws her magic, though she never mentions their name. The amulet is both an aid to help ground her power and a reminder of the bargain she made", "Years ago, Adarna was caught stealing from a group of nobles. They showed no mercy, beating her and leaving her to die. In her final moments, a voice offered her a choice: live in exchange for a binding pact. She accepted. The scar down the left side of her face, her shattered horn and the glowing amulet around her neck are the only physical reminders of that night, but the pact she made will follow her for the rest of her life."],
  },
  {
    id: "fungar-stonecap",
    name: "Fungar Stonecap",
    image: "https://cm.grantpieterse.com/Characters/Fungar Stonecap.webp",
    tokens: ["https://cm.grantpieterse.com/Tokens/Fungar Stonecap.webp", "https://cm.grantpieterse.com/Tokens/Fungar Stonecap2.webp"],
    description: "",
    background: [],
  },
  {
    id: "korrin-velthar",
    name: "Korrin Velthar",
    image: "https://cm.grantpieterse.com/Characters/Korrin Velthar.webp",
    tokens: ["https://cm.grantpieterse.com/Tokens/Korrin Velthar.webp", "https://cm.grantpieterse.com/Tokens/Korrin Velthar2.webp"],
    description: "With greyish brown fur and a nearly permanent smirk on his face. Korrin's ears have notches cut into them, a reminder of his peaceful past and the violence that broke that peace. He wears a wooden beaded necklace and dark orange robes. ",
    background: ["As Korrin adventured with his new party in search for a cure for lycanthopy (a curse he himself now has contracted) he has shared the following from his past. ", "Korrin was taken in as an orphan by a monastery in a place with rolling hills. He does not remember where his home was as they were a secretive bunch. ", "In his adolescence marauders raided his village and sold him into slavery. After a few years working for masters both kind and cruel, He found himself sold to a gladiatorial ring where he was first forced to clean the blood and grime off weapons and the arena until he was strong enough to fight.", "In his first match he was pitted against a stronger opponent who cut into his ear. After a grueling fight corrin was forced to kill his opponent. He hated it but loved the cheers that came after.", "He does not remember who it was after an encounter with a being who stole the memory yet the habit of cutting his ear after a tough fight and his love of showmanship remains.",  "After winning his freedom from the fighting ring he moved to a quiet village in hopes to return to his peaceful roots only for a curse to send him out again. This time however he could choose when and where to dispense his violence ", "Violence which deep down Korrin knows he enjoys."
    ],
  },
  {
    id: "whipplethorn-saltbone",
    name: "Whipplethorn Saltbone",
    image: "https://cm.grantpieterse.com/Characters/Whipplethorn Saltbone.webp",
    tokens: ["https://cm.grantpieterse.com/Tokens/Whipplethorn Saltbone.webp", "https://cm.grantpieterse.com/Tokens/Whipplethorn Saltbone2.webp"],
    description: "",
    background: [],
  },
];
