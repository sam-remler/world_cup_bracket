// ============================================================
// THE POOL — PLAYERS & PICKS
// Each player picks exactly 2 teams from EACH of the 5 tiers
// (10 teams total) plus one golden boot striker.
// Team ids must match the `id` field in data/teams.js.
// Duplicates between players are allowed.
// ============================================================

window.POOL_PLAYERS = [
  {
    name: "Alex",
    teams: [
      "spain", "france",          // tier 1
      "germany", "belgium",       // tier 2
      "uruguay", "mexico",        // tier 3
      "ecuador", "czechia",       // tier 4
      "southkorea", "iran",       // tier 5
    ],
    goldenBoot: null, // TODO: add golden boot pick
  },
  {
    name: "Julian",
    teams: [
      "france", "portugal",
      "belgium", "norway",
      "uruguay", "croatia",
      "czechia", "canada",
      "southkorea", "saudiarabia",
    ],
    goldenBoot: null,
  },
  {
    name: "Jesse",
    teams: [
      "spain", "england",
      "colombia", "germany",
      "morocco", "croatia",
      "senegal", "egypt",
      "southkorea", "uzbekistan",
    ],
    goldenBoot: null,
  },
  {
    name: "Kellen",
    teams: [
      "france", "spain",
      "germany", "norway",
      "usa", "morocco",
      "scotland", "senegal",
      "southkorea", "iran",
    ],
    goldenBoot: null,
  },
  {
    name: "Jasper",
    teams: [
      "portugal", "spain",
      "germany", "netherlands",
      "usa", "mexico",
      "ghana", "canada",
      "iran", "uzbekistan",
    ],
    goldenBoot: null,
  },
  {
    name: "Nina",
    teams: [
      "spain", "france",
      "germany", "belgium",
      "mexico", "morocco",
      "senegal", "scotland",
      "iran", "southkorea",
    ],
    goldenBoot: null,
  },
  {
    name: "Sami",
    teams: [
      "portugal", "france",
      "germany", "netherlands",
      "switzerland", "morocco",
      "senegal", "austria",
      "southkorea", "australia",
    ],
    goldenBoot: null,
  },
  {
    name: "Andrew",
    teams: [
      "spain", "france",
      "germany", "japan",
      "mexico", "morocco",
      "ecuador", "canada",
      "southkorea", "capeverde",
    ],
    goldenBoot: null,
  },
  {
    name: "Sam",
    teams: [
      "portugal", "brazil",
      "germany", "netherlands",
      "croatia", "morocco",
      "ecuador", "senegal",
      "iran", "uzbekistan",
    ],
    goldenBoot: null,
  },
  {
    name: "Tal",
    teams: [
      "england", "spain",
      "norway", "netherlands",
      "usa", "morocco",
      "ecuador", "canada",
      "southkorea", "uzbekistan",
    ],
    goldenBoot: null,
  },
  {
    name: "Nate",
    teams: [
      "portugal", "spain",
      "germany", "belgium",
      "usa", "mexico",
      "ghana", "canada",
      "iran", "southkorea",
    ],
    goldenBoot: null,
  },
  {
    name: "Oliver",
    teams: [
      "france", "england",       // tier 1
      "germany", "colombia",     // tier 2
      "turkiye", "uruguay",      // tier 3
      "algeria", "scotland",     // tier 4
      "iran", "saudiarabia",     // tier 5
    ],
    goldenBoot: null,
  },
  {
    name: "Kinji",
    teams: [
      "spain", "france",          // tier 1
      "netherlands", "japan",     // tier 2
      "morocco", "croatia",       // tier 3
      "senegal", "scotland",      // tier 4
      "southkorea", "capeverde",  // tier 5
    ],
    goldenBoot: null,
  },
];
];

// ============================================================
// SCORING RULES — tweak the numbers, the engine reads these.
// ============================================================
window.POOL_RULES = {
  win: 5,              // any match win, group or knockout (shootout win = win)
  draw: 2,             // group stage draws
  goalFor: 1,          // per goal scored (shootout kicks don't count)
  goalAgainst: -0.5,   // per goal conceded
  pastGroupStage: 3,   // team reaches the round of 32
  placements: { 1: 7, 2: 5, 3: 3, 4: 1 }, // final tournament finish
  // Golden boot is the tiebreaker only — set the actual winner in
  // data/overrides.json when the tournament ends.
};
