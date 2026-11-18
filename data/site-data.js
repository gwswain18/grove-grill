/*
  THE GROVE — site settings that only the web developer changes.

  The parts the owner looks after are NOT in this file. They live in the content/ folder and are
  edited through the owner admin (Pages CMS, set up in .pages.yml):
    content/menu.json       food menu and prices
    content/bar.json        cocktails, beer and prices
    content/favorites.json  the crowd favorites on the home page
    content/events.json     upcoming and past events
    content/visitors.json   the wall of fame
    content/hours.json      opening hours, happy hour and the "this week" board
*/
window.GROVE = {
  // Shows the "preview draft" ribbon at the top of every page. Set to false at launch.
  draft: true,

  name: "The Grove Grill & Sports Bar",
  phone: "(270) 605-9010",
  phoneHref: "tel:+12706059010",
  address: {
    street: "15153 Fort Campbell Blvd",
    cityLine: "Oak Grove, KY 42262",
    city: "Oak Grove",
    state: "KY",
    zip: "42262"
  },
  timezone: "America/Chicago",

  // Paste the online ordering link here (the "Menu URL" from the register's online ordering).
  // While it is empty, every Order button opens a "call to order" box instead.
  orderUrl: "",

  // Live Google reviews. Paste the widget ID from the review widget's Embed screen
  // (the part after "featurable-") and the reviews section shows the live widget.
  reviewsWidgetId: "",

  instagram: "https://www.instagram.com/thegrovegrillandsports/",
  facebook: "",

  links: {
    directions: "https://www.google.com/maps/dir/?api=1&destination=The+Grove+Grill+%26+Sports+Bar%2C+15153+Fort+Campbell+Blvd%2C+Oak+Grove%2C+KY+42262",
    reviews: "https://www.google.com/maps/search/?api=1&query=The+Grove+Grill+%26+Sports+Bar%2C+15153+Fort+Campbell+Blvd%2C+Oak+Grove%2C+KY+42262",
    mapEmbed: "https://www.google.com/maps?q=The+Grove+Grill+%26+Sports+Bar%2C+15153+Fort+Campbell+Blvd%2C+Oak+Grove%2C+KY+42262&output=embed"
  },

  // The big photo at the top of the home page. Each slide slowly pans, then fades to the next.
  // src = wide photo for computers, tall = upright photo for phones.
  // pan: "right", "left", "in" or "out". focus (optional) = which part of the photo to keep in view.
  heroSeconds: 6.5,
  heroSlides: [
    { src: "images/hero-smoker.jpg", tall: "images/hero-smoker-tall.jpg", alt: "Racks of ribs on the smoker", caption: "Ribs on the smoker", pan: "right" },
    { src: "images/hero-poboy.jpg", tall: "images/hero-poboy-tall.jpg", alt: "A shrimp po' boy piled with fried shrimp, lettuce and tomato", caption: "Shrimp po' boy", pan: "right", focus: "50% 100%" },
    { src: "images/hero-ribs-plate.jpg", tall: "images/hero-ribs-plate-tall.jpg", alt: "Sauced ribs with baked beans and fries", caption: "Ribs, beans and fries", pan: "in" },
    { src: "images/hero-wings.jpg", tall: "images/hero-wings-tall.jpg", alt: "Sauced wings with seasoned fries", caption: "Wings in six sauces", pan: "right" },
    { src: "images/hero-ribs.jpg", tall: "images/hero-tips-tall.jpg", alt: "Rib tips and racks of ribs on the grill", caption: "Fresh off the grill", pan: "left" }
  ],

  // From the Google listing, November 2026. Typed in by hand: it does not update on its own.
  rating: {
    score: "5.0",
    count: 333,
    mentions: [
      { dish: "Ribs", count: 63 },
      { dish: "Shrimp po' boy", count: 22 },
      { dish: "Collard greens", count: 20 },
      { dish: "Catfish", count: 15 }
    ],
    quote: "Great atmosphere, super friendly folks, and delicious food.",
    // What reviewers keep bringing up, summarised in our own words.
    themes: [
      { title: "The sides steal the show", text: "Collard greens, baked beans and mac and cheese get as much praise as the mains." },
      { title: "Fall-off-the-bone ribs", text: "Tender ribs and pork steak are what people come back for." },
      { title: "You're looked after", text: "Guests mention friendly staff who check in, and food that comes out hot and fast." }
    ],
    // Optional: paste favourite reviews here to show them as cards, for example
    // { text: "What the guest wrote.", name: "First name" }
    featured: []
  },

  services: ["Dine in", "Take out", "Curbside pickup", "Outdoor seating"],

  // The house song.
  // autoplay: true  = the song is on unless the visitor turns it off. Browsers hold all sound until
  //                   the visitor's first tap, click or key press, so that is when it starts.
  //                   Anyone who turns it off stays opted out on later visits.
  // autoplay: false = the song stays off until someone presses play.
  anthem: {
    title: "The Grove Grill Anthem",
    src: "audio/the-grove-grill-anthem.mp3",
    seconds: 139,
    autoplay: true
  },

  gallery: [
    { src: "images/hero-smoker.jpg", alt: "Racks of ribs on the smoker", size: "wide" },
    { src: "images/wings-fries-square.jpg", alt: "Wings and seasoned fries", size: "" },
    { src: "images/hero-poboy-tall.jpg", alt: "Shrimp po' boy", size: "tall" },
    { src: "images/cocktail.jpg", alt: "A cocktail with a sugared rim, cherries and lime", size: "" },
    { src: "images/catfish-fries.jpg", alt: "Fried catfish and fries", size: "" },
    { src: "images/collard-greens.jpg", alt: "Collard greens", size: "" },
    { src: "images/crew-grand-opening-tall.jpg", alt: "The Grove crew cutting the ribbon at the grand opening", size: "tall" },
    { src: "images/neon-ceiling.jpg", alt: "Green neon ceiling lights and team pennants over the bar", size: "wide" },
    { src: "images/mac-trays.jpg", alt: "Trays of baked macaroni and cheese", size: "" },
    { src: "images/cocktail-flame.jpg", alt: "A layered cocktail being lit at the bar", size: "" },
    { src: "images/fried-pickles.jpg", alt: "Fried pickle spears", size: "" },
    { src: "images/patio-spread.jpg", alt: "Ribs and sides on a table on the patio", size: "" }
  ]
};
