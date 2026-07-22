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
        file: "https://cm.grantpieterse.com/Handouts/3/Chalet Brantifax.webp",
      },
      {
        id: "grubnak",
        title: "Grubnak",
        file: "https://cm.grantpieterse.com/Handouts/3/Grubnak.webp",
      },
      {
        id: "hand-and-the-horn",
        title: "Hand and the Horn",
        file: "https://cm.grantpieterse.com/Handouts/3/Hand and the Horn.webp",
      },
      {
        id: "owlbear",
        title: "Owlbear",
        file: "https://cm.grantpieterse.com/Handouts/3/Owlbear.webp",
      },
      {
        id: "scorch-of-the-red-wyrm",
        title: "Scorch of the Red Wyrm",
        file: "https://cm.grantpieterse.com/Handouts/3/Scorch of the Red Wyrm.webp",
      },
      {
        id: "shadowfell",
        title: "Shadowfell",
        file: "https://cm.grantpieterse.com/Handouts/3/Shadowfell.webp",
      },
      {
        id: "threetree-hill",
        title: "Threetree Hill",
        file: "https://cm.grantpieterse.com/Handouts/3/Threetree Hill.webp",
      },
      {
        id: "wytchway-the-pig-king",
        title: "Wytchway - The Pig King",
        file: "https://cm.grantpieterse.com/handouts/images/session3/Wytchway - The Pig King.png",
      },
      {
        id: "wytchway-arrival",
        title: "Wytchway - Arrival",
        file: "https://cm.grantpieterse.com/Handouts/3/Wytchway - arrival.webp",
      },
      {
        id: "map",
        title: "Map",
        file: "https://cm.grantpieterse.com/Handouts/3/Wytchway Surrounds.jpg",
      },
      {
        id: "figurine",
        title: "Figurine",
        file: "https://cm.grantpieterse.com/Handouts/3/figurine.png",
      },
      {
        id: "the-meeting",
        title: "The Meeting",
        file: "https://cm.grantpieterse.com/Handouts/3/The Meeting.webp",
      },
      {
        id: "the-meeting-2",
        title: "The Meeting II",
        file: "https://cm.grantpieterse.com/Handouts/3/The Meeting2.webp",
      },
      {
        id: "sir-aldric",
        title: "Sir Aldric",
        file: "https://cm.grantpieterse.com/Handouts/3/Sir Aldric.webp",
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
        file: "https://cm.grantpieterse.com/Handouts/2/Brother Halven.webp",
      },
      {
        id: "korvala",
        title: "Korvala",
        file: "https://cm.grantpieterse.com/Handouts/2/Korvala.webp",
      },
      {
        id: "magister-ellion-thricefold",
        title: "Magister Ellion Thricefold",
        file: "https://cm.grantpieterse.com/Handouts/2/Magister Ellion Thricefold.webp",
      },
      {
        id: "rats",
        title: "Rats!",
        file: "https://cm.grantpieterse.com/Handouts/2/rats!.webp",
      },
      {
        id: "silas-vane",
        title: "Silas Vane",
        file: "https://cm.grantpieterse.com/Handouts/2/Silas Vane.webp",
      },
      {
        id: "valor",
        title: "Valor",
        file: "https://cm.grantpieterse.com/Handouts/2/Valor.webp",
      },
      {
        id: "yalerion-highscroll",
        title: "Yalerion Highscroll",
        file: "https://cm.grantpieterse.com/Handouts/2/Yalerion Highscroll.webp",
      },
      {
        id: "arrival-at-baldurs-gate",
        title: "Arrival at Baldur's Gate",
        file: "https://cm.grantpieterse.com/Handouts/2/Arrival at Baldurs Gate.webp",
      },
      {
        id: "mushika-attacks",
        title: "Mushika Attacks!",
        file: "https://cm.grantpieterse.com/Handouts/2/Mushika Attacks!.webp",
      },
      {
        id: "the-crooked-hearth",
        title: "The Crooked Hearth",
        file: "https://cm.grantpieterse.com/Handouts/2/The Crooked Hearth.webp",
      },
      {
        id: "the-wide",
        title: "The Wide",
        file: "https://cm.grantpieterse.com/Handouts/2/The Wide.webp",
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
        file: "https://cm.grantpieterse.com/Handouts/1/Gatewarden Kalan Strongbranch.webp",
      },
      {
        id: "matreous",
        title: "Matreous",
        file: "https://cm.grantpieterse.com/Handouts/1/Matreous.webp",
      },
    ],
  },
];
