// ============================================================
// WORLD CUP 2026 — TEAMS & TIERS
// Edit the `tier` values to match your league's draft tiers.
// Each tier should have enough teams for everyone to pick 2.
// `aliases` are used by the fetch script to match API names —
// don't remove them unless you know the API uses another name.
// ============================================================

window.WC_TEAMS = [
  // ---------- GROUP A ----------
  { id: "mexico",      name: "Mexico",                 flag: "🇲🇽", group: "A", tier: 3, aliases: ["Mexico"] },
  { id: "southafrica", name: "South Africa",           flag: "🇿🇦", group: "A", tier: 5, aliases: ["South Africa"] },
  { id: "southkorea",  name: "South Korea",            flag: "🇰🇷", group: "A", tier: 5, aliases: ["Korea Republic", "South Korea", "Republic of Korea"] },
  { id: "czechia",     name: "Czechia",                flag: "🇨🇿", group: "A", tier: 4, aliases: ["Czechia", "Czech Republic"] },

  // ---------- GROUP B ----------
  { id: "canada",      name: "Canada",                 flag: "🇨🇦", group: "B", tier: 4, aliases: ["Canada"] },
  { id: "bosnia",      name: "Bosnia & Herzegovina",   flag: "🇧🇦", group: "B", tier: 4, aliases: ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia & Herzegovina"] },
  { id: "qatar",       name: "Qatar",                  flag: "🇶🇦", group: "B", tier: 5, aliases: ["Qatar"] },
  { id: "switzerland", name: "Switzerland",            flag: "🇨🇭", group: "B", tier: 3, aliases: ["Switzerland"] },

  // ---------- GROUP C ----------
  { id: "brazil",      name: "Brazil",                 flag: "🇧🇷", group: "C", tier: 1, aliases: ["Brazil"] },
  { id: "morocco",     name: "Morocco",                flag: "🇲🇦", group: "C", tier: 3, aliases: ["Morocco"] },
  { id: "haiti",       name: "Haiti",                  flag: "🇭🇹", group: "C", tier: 5, aliases: ["Haiti"] },
  { id: "scotland",    name: "Scotland",               flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", tier: 4, aliases: ["Scotland"] },

  // ---------- GROUP D ----------
  { id: "usa",         name: "United States",          flag: "🇺🇸", group: "D", tier: 3, aliases: ["United States", "USA", "United States of America"] },
  { id: "paraguay",    name: "Paraguay",               flag: "🇵🇾", group: "D", tier: 4, aliases: ["Paraguay"] },
  { id: "australia",   name: "Australia",              flag: "🇦🇺", group: "D", tier: 5, aliases: ["Australia"] },
  { id: "turkiye",     name: "Türkiye",                flag: "🇹🇷", group: "D", tier: 3, aliases: ["Türkiye", "Turkey", "Turkiye"] },

  // ---------- GROUP E ----------
  { id: "germany",     name: "Germany",                flag: "🇩🇪", group: "E", tier: 2, aliases: ["Germany"] },
  { id: "curacao",     name: "Curaçao",                flag: "🇨🇼", group: "E", tier: 5, aliases: ["Curaçao", "Curacao"] },
  { id: "ivorycoast",  name: "Ivory Coast",            flag: "🇨🇮", group: "E", tier: 4, aliases: ["Côte d'Ivoire", "Cote d'Ivoire", "Ivory Coast", "Côte d’Ivoire"] },
  { id: "ecuador",     name: "Ecuador",                flag: "🇪🇨", group: "E", tier: 4, aliases: ["Ecuador"] },

  // ---------- GROUP F ----------
  { id: "netherlands", name: "Netherlands",            flag: "🇳🇱", group: "F", tier: 2, aliases: ["Netherlands", "Holland"] },
  { id: "japan",       name: "Japan",                  flag: "🇯🇵", group: "F", tier: 2, aliases: ["Japan"] },
  { id: "sweden",      name: "Sweden",                 flag: "🇸🇪", group: "F", tier: 4, aliases: ["Sweden"] },
  { id: "tunisia",     name: "Tunisia",                flag: "🇹🇳", group: "F", tier: 5, aliases: ["Tunisia"] },

  // ---------- GROUP G ----------
  { id: "belgium",     name: "Belgium",                flag: "🇧🇪", group: "G", tier: 2, aliases: ["Belgium"] },
  { id: "egypt",       name: "Egypt",                  flag: "🇪🇬", group: "G", tier: 4, aliases: ["Egypt"] },
  { id: "iran",        name: "Iran",                   flag: "🇮🇷", group: "G", tier: 5, aliases: ["Iran", "IR Iran"] },
  { id: "newzealand",  name: "New Zealand",            flag: "🇳🇿", group: "G", tier: 5, aliases: ["New Zealand"] },

  // ---------- GROUP H ----------
  { id: "spain",       name: "Spain",                  flag: "🇪🇸", group: "H", tier: 1, aliases: ["Spain"] },
  { id: "capeverde",   name: "Cape Verde",             flag: "🇨🇻", group: "H", tier: 5, aliases: ["Cape Verde", "Cabo Verde", "Cape Verde Islands"] },
  { id: "saudiarabia", name: "Saudi Arabia",           flag: "🇸🇦", group: "H", tier: 5, aliases: ["Saudi Arabia"] },
  { id: "uruguay",     name: "Uruguay",                flag: "🇺🇾", group: "H", tier: 3, aliases: ["Uruguay"] },

  // ---------- GROUP I ----------
  { id: "france",      name: "France",                 flag: "🇫🇷", group: "I", tier: 1, aliases: ["France"] },
  { id: "senegal",     name: "Senegal",                flag: "🇸🇳", group: "I", tier: 4, aliases: ["Senegal"] },
  { id: "iraq",        name: "Iraq",                   flag: "🇮🇶", group: "I", tier: 5, aliases: ["Iraq"] },
  { id: "norway",      name: "Norway",                 flag: "🇳🇴", group: "I", tier: 2, aliases: ["Norway"] },

  // ---------- GROUP J ----------
  { id: "argentina",   name: "Argentina",              flag: "🇦🇷", group: "J", tier: 1, aliases: ["Argentina"] },
  { id: "algeria",     name: "Algeria",                flag: "🇩🇿", group: "J", tier: 4, aliases: ["Algeria"] },
  { id: "austria",     name: "Austria",                flag: "🇦🇹", group: "J", tier: 4, aliases: ["Austria"] },
  { id: "jordan",      name: "Jordan",                 flag: "🇯🇴", group: "J", tier: 5, aliases: ["Jordan"] },

  // ---------- GROUP K ----------
  { id: "portugal",    name: "Portugal",               flag: "🇵🇹", group: "K", tier: 1, aliases: ["Portugal"] },
  { id: "drcongo",     name: "DR Congo",               flag: "🇨🇩", group: "K", tier: 5, aliases: ["DR Congo", "Congo DR", "Democratic Republic of the Congo", "Congo, Democratic Republic"] },
  { id: "uzbekistan",  name: "Uzbekistan",             flag: "🇺🇿", group: "K", tier: 5, aliases: ["Uzbekistan"] },
  { id: "colombia",    name: "Colombia",               flag: "🇨🇴", group: "K", tier: 2, aliases: ["Colombia"] },

  // ---------- GROUP L ----------
  { id: "england",     name: "England",                flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁬󠁢󠁿", group: "L", tier: 1, aliases: ["England"] },
  { id: "croatia",     name: "Croatia",                flag: "🇭🇷", group: "L", tier: 3, aliases: ["Croatia"] },
  { id: "ghana",       name: "Ghana",                  flag: "🇬🇭", group: "L", tier: 4, aliases: ["Ghana"] },
  { id: "panama",      name: "Panama",                 flag: "🇵🇦", group: "L", tier: 5, aliases: ["Panama"] },
];
