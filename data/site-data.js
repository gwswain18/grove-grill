/*
  THE GROVE — everything that changes lives in this one file.
  Edit hours, specials, events, menu items and prices here; the pages rebuild
  themselves from it. Keep the quotes and commas as they are.
*/
window.GROVE = {
  // Shows the "preview draft" ribbon at the top of every page. Set to false at launch.
  draft: true,

  name: "The Grove Grill & Sports Bar",
  phone: "(270) 605-9010",
  phoneHref: "tel:+12706059010",
  address: {
    street: "15153 Fort Campbell Blvd",
    cityLine: "Oak Grove, KY 42262"
  },
  timezone: "America/Chicago",

  // Paste the online ordering link here (Toast, Square, DoorDash, etc.).
  // While it is empty, every Order button opens a "call to order" box instead.
  orderUrl: "",

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

  // From the Google listing, November 2026.
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

  // Sunday first. 24-hour times. Use closed: true for a closed day.
  // These match the Google listing; the football-season flyer shows later hours. CONFIRM WITH OWNER.
  hours: [
    { day: "Sunday", open: "12:00", close: "19:00" },
    { day: "Monday", open: "11:00", close: "19:00" },
    { day: "Tuesday", open: "11:00", close: "21:00" },
    { day: "Wednesday", open: "11:00", close: "21:00" },
    { day: "Thursday", open: "11:00", close: "21:00" },
    { day: "Friday", open: "11:00", close: "21:00" },
    { day: "Saturday", open: "12:00", close: "21:30" }
  ],

  services: ["Dine in", "Take out", "Curbside pickup", "Outdoor seating"],

  happyHour: {
    headline: "$2 domestic beers",
    detail: "Bud Light, Busch Light, Michelob Ultra and Coors Light, poured cold. Imports are $3 and happy hour wings are $10.",
    when: "Ask at the bar for today's happy hour times."
  },

  // Home page "crowd favorites". The first one gets the big card. Add img: "images/your-photo.jpg"
  // to any item to show a photo. Prices here are typed separately from the menu below, so change both.
  favorites: [
    {
      name: "Ribs off the grill",
      blurb: "The plate people drive in for. Get four bones for a taste, or commit to the full rack.",
      price: "4 bones $14.99 · Half rack + 2 sides $24.99 · Full rack $31.99",
      mentions: 63,
      img: "images/ribs-sliced.jpg",
      alt: "Sliced ribs glazed with barbecue sauce"
    },
    {
      name: "Pork Steak",
      blurb: "Off the grill and sauced, it's the regulars' other order. Have it on its own, as a plate with sides, or teamed up with ribs or chicken.",
      price: "Single $14.99 · Plate with 2 sides $20.99",
      tag: "Off the grill",
      img: "images/pork-steak.jpg",
      alt: "A sauced pork steak with toasted buns"
    },
    {
      name: "Shrimp Po' Boy",
      blurb: "Crispy fried shrimp piled on a toasted roll with lettuce, tomato and sauce. A Louisiana classic, Oak Grove style.",
      price: "$13.99",
      mentions: 22,
      img: "images/poboy.jpg",
      alt: "Shrimp po' boy piled with fried shrimp"
    },
    {
      name: "Fried Catfish",
      blurb: "Two golden fillets with your pick of side and a drink. Add six shrimp if you came hungry.",
      price: "$18.99 · with 6 shrimp $23.00",
      mentions: 15,
      img: "images/catfish-fries.jpg",
      alt: "Golden fried catfish with fries"
    },
    {
      name: "Wings",
      blurb: "Six sauces, including our in-house Raspberry Heat.",
      price: "5 for $9.99 · 10 for $15.99",
      tag: "House sauce",
      img: "images/wings-raspberry.jpg",
      alt: "Wings glazed in Raspberry Heat sauce"
    },
    {
      name: "Collard Greens",
      blurb: "The side with its own fan club. Order it next to anything.",
      price: "$3.99",
      mentions: 20,
      img: "images/collard-greens.jpg",
      alt: "A serving of collard greens"
    }
  ],

  // Home page "This week at The Grove". SAMPLE LINEUP — replace with the real schedule each week.
  weeklyIsSample: true,
  weekly: [
    { day: "Thu", title: "Thursday night football", note: "Sound on, wings up" },
    { day: "Sat", title: "College football Saturday", note: "Doors at noon" },
    { day: "Sun", title: "Pro football Sunday", note: "Doors at noon, every screen" },
    { day: "Daily", title: "Happy hour", note: "$2 domestic beers" }
  ],

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

  // Events. Add one line per event; the site sorts them into "Coming up" and "Past events"
  // by date, so an event moves to the past list on its own the day after it happens.
  //   date:    "YYYY-MM-DD"  (end: "YYYY-MM-DD" for an event that runs several days)
  //   ongoing: true          for something with no end date yet; it stays under "Coming up"
  //   when:    optional text shown instead of the date, e.g. "April 2026"
  //   img:     the flyer or a photo. Visitors can tap it to see it full size.
  //   cta:     optional button, e.g. { text: "Book a table", href: "catering.html#inquiry" }
  // Example:
  //   { date: "2027-02-14", time: "5 PM", title: "Big Game Watch Party", blurb: "Wings, ribs and every screen.", img: "images/events/your-flyer.jpg" },
  events: [
    {
      ongoing: true,
      badge: "Happening now · all season",
      title: "Football season at The Grove",
      blurb: "Catch the games on the big screens all season, with game day food and drink specials.",
      img: "images/events/football-season.jpg",
      alt: "Flyer: football season at The Grove, open 7 days a week",
      cta: { text: "Book a watch party", href: "catering.html#inquiry" }
    },
    {
      ongoing: true,
      badge: "Now booking",
      title: "Holiday catering",
      blurb: "Sides and trays for your family dinner. Send the date and headcount and we'll call you back.",
      img: "images/mac-trays.jpg",
      alt: "Trays of baked macaroni and cheese",
      cta: { text: "Start an order", href: "catering.html#inquiry" }
    },
    {
      date: "2026-11-14",
      time: "2–4 PM",
      title: "Free Food Tasting & Holiday Catering Showcase",
      blurb: "Free admission. Guests sampled menu favorites and previewed the holiday catering sides.",
      img: "images/events/holiday-catering-showcase.jpg",
      alt: "Flyer: Free Food Tasting and Holiday Catering Showcase, Saturday November 14, 2026"
    },
    {
      date: "2026-11-11",
      title: "Veterans Day Special",
      blurb: "15% off all orders, with an extra 15% off for military and veterans.",
      img: "images/events/veterans-day-special.jpg",
      alt: "Flyer: Veterans Day special, 15% off all orders"
    },
    {
      date: "2026-04-01",
      when: "April 2026",
      title: "Grand opening",
      blurb: "The crew cut the ribbon and opened the doors on Fort Campbell Boulevard.",
      img: "images/crew-grand-opening-tall.jpg",
      alt: "The Grove crew cutting the ribbon at the grand opening"
    }
  ],

  // Food menu. Prices are from the register's "Menu Item Detail" report of 17 Nov 2026.
  // One line per item:   { name: "Item", detail: "optional small print", price: "12.99" }
  // Add sub: true to tuck a line under the item above it (combos, sizes and add-ons).
  // Optional per section: img + imgAlt (photo), note (line under the title), nav (short name
  // for the row of section buttons), chips (a list of choices), footnote (small print).
  menu: [
    {
      id: "ribs",
      img: "images/ribs-bones.jpg",
      imgAlt: "Rib bones glazed with barbecue sauce",
      title: "Ribs",
      note: "The reason most folks walk in the door.",
      items: [
        { name: "4-Bone Ribs", detail: "ribs only", price: "14.99" },
        { sub: true, name: "Platter with 2 sides and a drink", price: "19.99" },
        { sub: true, name: "With 1 piece of catfish and 1 side", price: "21.99" },
        { name: "Half Rack", detail: "ribs only", price: "18.99" },
        { sub: true, name: "With 2 sides", price: "24.99" },
        { name: "Full Rack", detail: "ribs only", price: "31.99" },
        { sub: true, name: "With 2 sides", price: "37.99" },
        { name: "Fried Ribs", detail: "4 bones", price: "14.99" },
        { sub: true, name: "With 1 side and a drink", price: "17.99" },
        { name: "Rib Tips", detail: "with 1 side", price: "12.99" }
      ]
    },
    {
      id: "bbq-plates",
      img: "images/chicken-plate.jpg",
      imgAlt: "Chicken leg quarter with mac and cheese and yellow rice",
      title: "BBQ Plates",
      items: [
        { name: "Pork Steak", detail: "single", price: "14.99" },
        { sub: true, name: "Plate with 1 side", price: "17.99" },
        { sub: true, name: "Plate with 2 sides", price: "20.99" },
        { name: "Chicken Leg Quarter", detail: "single", price: "8.99" },
        { sub: true, name: "Plate with 2 sides", price: "15.99" },
        { name: "Pork Steak + 2 Rib Bones", detail: "2 sides and a drink", price: "24.99" },
        { name: "Pork Steak + Chicken Leg Quarter", detail: "2 sides and a drink", price: "22.99" },
        { name: "Chicken Leg Quarter + 2 Rib Bones", detail: "2 sides and a drink", price: "22.99" },
        { name: "Pulled Pork by the Pound", price: "21.00" }
      ]
    },
    {
      id: "sandwiches",
      title: "Sandwiches",
      items: [
        { name: "Rib Sandwich", price: "14.99" },
        { sub: true, name: "Combo with 1 side and a drink", price: "17.99" },
        { name: "Pork Steak Sandwich", detail: "with 1 side", price: "15.99" },
        { name: "Pulled Pork Sandwich", price: "11.99" },
        { sub: true, name: "With 1 side", price: "14.99" },
        { name: "Pulled Chicken Sandwich", price: "10.99" },
        { sub: true, name: "Combo with 1 side and a drink", price: "16.99" }
      ]
    },
    {
      id: "seafood",
      img: "images/catfish-shrimp-rings.jpg",
      imgAlt: "Fried catfish and shrimp with onion rings",
      title: "Seafood",
      items: [
        { name: "2 Catfish", detail: "1 side and a drink", price: "18.99" },
        { name: "2 Catfish + 6 Shrimp", detail: "1 side and a drink", price: "23.00" },
        { name: "Catfish + 4 Wings", detail: "1 side and a drink", price: "21.99" },
        { name: "10 Fried Shrimp", detail: "1 side and a drink", price: "16.99" },
        { name: "Catfish Po' Boy", price: "14.99" },
        { sub: true, name: "With fries and a drink", price: "18.99" },
        { sub: true, name: "With onion rings", price: "19.99" },
        { name: "Shrimp Po' Boy", price: "13.99" },
        { sub: true, name: "With fries and a drink", price: "17.99" },
        { sub: true, name: "With onion rings", price: "18.99" },
        { name: "Extra Catfish", detail: "1 piece", price: "8.99" },
        { name: "Extra Shrimp", detail: "6", price: "8.99" }
      ]
    },
    {
      id: "wings",
      img: "images/wings-fries.jpg",
      imgAlt: "Sauced wings with seasoned fries",
      title: "Wings & Chicken Strips",
      nav: "Wings",
      items: [
        { name: "5 Wings", price: "9.99" },
        { sub: true, name: "All flats", price: "10.99" },
        { name: "10 Wings", price: "15.99" },
        { sub: true, name: "All flats", price: "16.99" },
        { name: "3 Chicken Strips", price: "10.99" },
        { sub: true, name: "Combo with fries and a drink", price: "15.99" },
        { name: "5 Chicken Strips", price: "13.99" },
        { sub: true, name: "Combo with fries and a drink", price: "18.99" }
      ],
      chipsLabel: "Pick your sauce",
      chips: ["Hot Honey", "Barbecue", "Buffalo", "Garlic Parm", "Lemon Pepper", "Raspberry Heat"],
      footnote: "Extra Raspberry Heat sauce or blue cheese: 50¢ each."
    },
    {
      id: "burgers",
      img: "images/burger.jpg",
      imgAlt: "Cheeseburger with lettuce, tomato and pickles",
      title: "Burgers",
      items: [
        { name: "Standard Double Burger", detail: "two 4 oz patties", price: "12.99" },
        { sub: true, name: "Combo with fries and a drink", price: "16.99" },
        { sub: true, name: "Combo with onion rings and a drink", price: "17.99" },
        { name: "Brisket Blend Burger", detail: "8 oz", price: "14.99" },
        { sub: true, name: "Combo with fries", price: "18.99" },
        { sub: true, name: "Combo with onion rings", price: "19.99" },
        { name: "Monster Burger", detail: "two 8 oz brisket blend patties", price: "18.99" },
        { sub: true, name: "Combo with fries and a drink", price: "20.99" },
        { sub: true, name: "Combo with onion rings and a drink", price: "21.99" }
      ]
    },
    {
      id: "starters",
      img: "images/fried-pickles.jpg",
      imgAlt: "Fried pickle spears",
      title: "Starters",
      items: [
        { name: "Fried Pickle Spears", detail: "5", price: "8.00" },
        { name: "Mozzarella Sticks", detail: "6", price: "8.00" },
        { name: "Empanadas", detail: "3", price: "12.00" },
        { sub: true, name: "5 empanadas", price: "15.00" },
        { name: "Basket of Fries", price: "5.99" },
        { name: "Onion Rings Basket", price: "6.99" }
      ]
    },
    {
      id: "sides",
      img: "images/mac-cheese.jpg",
      imgAlt: "Macaroni and cheese",
      title: "Sides",
      items: [
        { name: "Collard Greens", price: "3.99" },
        { name: "Macaroni & Cheese", price: "3.99" },
        { name: "Baked Beans", price: "3.99" },
        { name: "Yellow Rice", price: "3.99" },
        { name: "Potato Salad", price: "3.50" },
        { name: "Fries", price: "3.25" },
        { name: "Onion Rings", price: "3.50" }
      ]
    },
    {
      id: "kids",
      title: "Kids Meals",
      nav: "Kids",
      items: [
        { name: "2 Chicken Strips", detail: "with fries and a drink", price: "9.99" },
        { name: "Kids Burger", detail: "with fries and a drink", price: "10.99" }
      ]
    },
    {
      id: "sweets",
      title: "Something Sweet",
      nav: "Sweets",
      items: [
        { name: "Cheesecake", price: "7.49" },
        { name: "Doughnut Holes", detail: "7, with cinnamon sugar and caramel sauce", price: "5.99" }
      ]
    },
    {
      id: "soft-drinks",
      title: "Drinks",
      items: [
        { name: "Fountain Drink", detail: "small, 12 oz", price: "2.29" },
        { sub: true, name: "Large", price: "2.99" },
        { name: "Bottled Water", price: "2.00" }
      ],
      plain: ["Sweet tea", "Lemonade"]
    }
  ],

  // Bar menu. The recipes are from the restaurant's printed drink menu; the prices are from the
  // same register report as the food. A drink with no price was not on that report.
  bar: {
    cocktailImg: "images/cocktail.jpg",
    cocktailImgAlt: "A cocktail with a sugared rim, cherries and lime",
    cocktailNote: "Mixed drinks $7 · top shelf $10.",
    beer: [
      { name: "Bud Light, Busch Light, Coors Light, Michelob Ultra", price: "3.75" },
      { name: "Corona Extra, Modelo Especial", price: "4.75" },
      { name: "New Belgium Voodoo Ranger IPA", price: "4.50" },
      { name: "White Claw", price: "4.50" },
      { name: "Straw-Ber-Rita", price: "3.00" },
      { name: "Mang-O-Rita", price: "7.50" },
      { name: "Carbliss", price: "6.00" },
      { name: "Beer Bucket Special", price: "18.00" }
    ],
    cocktails: [
      { name: "Groverita", tag: "House favorite", detail: "Tequila, orange liqueur and lime juice with a salted rim." },
      { name: "Rum Punch", price: "10.00", detail: "Light and dark rum, orange and pineapple juice, grenadine, fresh lime." },
      { name: "Lemon Drop", price: "8.00", detail: "Vodka, fresh lemon juice, simple syrup and triple sec with a sugar rim." },
      { name: "Moscow Mule", detail: "Vodka, fresh lime juice and ginger beer." },
      { name: "Cosmopolitan", price: "10.00", detail: "Citrus vodka, triple sec, fresh lime and cranberry juice." },
      { name: "Whiskey Sour", detail: "Whiskey or bourbon, lemon juice and simple syrup." },
      { name: "Tequila Sunrise", price: "8.00", detail: "Tequila, orange juice and grenadine." },
      { name: "Long Island Iced Tea", price: "10.00", detail: "Vodka, white rum, silver tequila, gin, triple sec, lemon and a splash of cola." }
    ]
  },

  // Wall of fame: well-known guests who stopped by. One line per photo, newest first.
  // Put the photo in images/visitors/ and add, for example:
  //   { img: "images/visitors/your-photo.jpg", name: "Who it is", note: "What folks know them for", when: "March 2027" },
  // While this list is empty the section stays hidden (the draft shows empty sample frames instead).
  // Only post a guest's photo with their OK.
  visitors: [],

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
