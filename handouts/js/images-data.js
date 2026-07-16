// Add one session per game session, newest session at the top of this array.
// Each session has an `id` (used as its folder name under images/ and as its
// Firebase reveal namespace), a display `title`, and a list of images.
// Image `id` only needs to be unique within its own session.
// `file` is the path to the image inside the images/<session id>/ folder.
// `caption` is optional flavor text/notes shown under the image.
const SESSIONS = [
  {
    id: "session3",
    title: "Session 3",
    images: [
      {
        id: "chalet-brantifax",
        title: "Chalet Brantifax",
        file: "images/session3/Chalet Brantifax.png",
      },
      {
        id: "grubnak",
        title: "Grubnak",
        file: "images/session3/Grubnak.png",
      },
      {
        id: "hand-and-the-horn",
        title: "Hand and the Horn",
        file: "images/session3/Hand and the Horn.png",
      },
      {
        id: "owlbear",
        title: "Owlbear",
        file: "images/session3/Owlbear.png",
      },
      {
        id: "scorch-of-the-red-wyrm",
        title: "Scorch of the Red Wyrm",
        file: "images/session3/Scorch of the Red Wyrm.png",
      },
      {
        id: "shadowfell",
        title: "Shadowfell",
        file: "images/session3/Shadowfell.png",
      },
      {
        id: "threetree-hill",
        title: "Threetree Hill",
        file: "images/session3/Threetree Hill.png",
      },
      {
        id: "wooden-bridge",
        title: "Wooden Bridge",
        file: "images/session3/Wooden Bridge.png",
      },
      {
        id: "wytchway-the-boar-king",
        title: "Wytchway - The Boar King",
        file: "images/session3/Wytchway - The Boar King.png",
      },
      {
        id: "wytchway-arrival",
        title: "Wytchway - Arrival",
        file: "images/session3/Wytchway - arrival.png",
      },
      {
        id: "map",
        title: "Map",
        file: "images/session3/Wytchway Surrounds.jpg",
      },
      {
        id: "figurine",
        title: "Figurine",
        file: "images/session3/Figurine.png",
      },
      {
        id: "book3",
        title: "Book of the Raven",
        file: "images/session3/book3.png",
      },
    ],
  },
  {
    id: "session2",
    title: "Session 2",
    images: [
      {
        id: "brother-halven",
        title: "Brother Halven",
        file: "images/session2/Brother Halven.png",
      },
      {
        id: "korvala",
        title: "Korvala",
        file: "images/session2/Korvala.png",
      },
      {
        id: "korvala-hybrid",
        title: "Korvala (Hybrid)",
        file: "images/session2/Korvala(Hybrid).png",
      },
      {
        id: "magister-ellion-thricefold",
        title: "Magister Ellion Thricefold",
        file: "images/session2/Magister Ellion Thricefold.png",
      },
      {
        id: "mara-hestwick",
        title: "Mara Hestwick",
        file: "images/session2/Mara Hestwick.png",
      },
      {
        id: "mushika",
        title: "Mushika",
        file: "images/session2/Mushika.png",
      },
      {
        id: "mushika-human",
        title: "Mushika (Human)",
        file: "images/session2/Mushika(Human).png",
      },
      {
        id: "rats",
        title: "Rats!",
        file: "images/session2/Rats!.jpeg",
      },
      {
        id: "silas-vane",
        title: "Silas Vane",
        file: "images/session2/Silas Vane.png",
      },
      {
        id: "valor",
        title: "Valor",
        file: "images/session2/Valor.png",
      },
      {
        id: "yalerion-highscroll",
        title: "Yalerion Highscroll",
        file: "images/session2/Yalerion Highscroll.png",
      },
    ],
  },
  {
    id: "session1",
    title: "Session 1",
    images: [
      {
        id: "gatewarden-kalan-strongbranch",
        title: "Gatewarden Kalan Strongbranch",
        file: "images/session1/Gatewarden Kalan Strongbranch.png",
      },
      {
        id: "matreous",
        title: "Matreous",
        file: "images/session1/Matreous.png",
      },
    ],
  },
];
