#!/usr/bin/env node
// ============================================================
// Fetches World Cup 2026 matches + top scorers from
// football-data.org and writes data/results.json with team
// names mapped to the canonical ids used by the site.
//
// Requires env var FOOTBALL_DATA_TOKEN (free key from
// https://www.football-data.org/client/register).
// Run locally:  FOOTBALL_DATA_TOKEN=xxx node scripts/fetch-results.mjs
// ============================================================

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const API = "https://api.football-data.org/v4";
const TOKEN = process.env.FOOTBALL_DATA_TOKEN;

if (!TOKEN) {
  console.error("Missing FOOTBALL_DATA_TOKEN environment variable.");
  process.exit(1);
}

// ---- Load team aliases from data/teams.js (it's a browser file,
// so extract the array with a tiny eval shim) -------------------
const teamsSrc = readFileSync(join(ROOT, "data", "teams.js"), "utf8");
const sandbox = { window: {} };
new Function("window", teamsSrc)(sandbox.window);
const TEAMS = sandbox.window.WC_TEAMS;

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]/g, "");

const aliasMap = new Map();
for (const t of TEAMS) {
  aliasMap.set(normalize(t.name), t.id);
  for (const a of t.aliases || []) aliasMap.set(normalize(a), t.id);
}

const unmatched = new Set();
function teamId(apiName) {
  const id = aliasMap.get(normalize(apiName));
  if (!id && apiName) unmatched.add(apiName);
  return id || null;
}

async function get(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "X-Auth-Token": TOKEN },
  });
  if (!res.ok) {
    throw new Error(`API ${path} -> ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function mapWinner(score) {
  if (!score || !score.winner) return null;
  if (score.winner === "HOME_TEAM") return "home";
  if (score.winner === "AWAY_TEAM") return "away";
  if (score.winner === "DRAW") return "draw";
  return null;
}

// Goals exclude penalty-shootout kicks. In API v4, when duration is
// PENALTY_SHOOTOUT, fullTime can include shootout goals, so prefer
// regularTime + extraTime in that case.
function goals(score, side) {
  if (!score) return null;
  const ft = score.fullTime?.[side];
  if (score.duration === "PENALTY_SHOOTOUT") {
    const reg = score.regularTime?.[side];
    const ext = score.extraTime?.[side];
    if (reg != null) return reg + (ext ?? 0);
    // Fallback: strip shootout kicks out of fullTime if present
    const pens = score.penalties?.[side];
    if (ft != null && pens != null && ft >= pens) return ft - pens;
  }
  return ft ?? null;
}

async function main() {
  const matchData = await get("/competitions/WC/matches");

  const matches = (matchData.matches || []).map((m) => ({
    id: m.id,
    stage: m.stage,                 // GROUP_STAGE, LAST_32, LAST_16, QUARTER_FINALS, SEMI_FINALS, THIRD_PLACE, FINAL
    group: m.group || null,         // e.g. "GROUP_A"
    utcDate: m.utcDate,
    status: m.status,               // SCHEDULED, TIMED, IN_PLAY, PAUSED, FINISHED, ...
    home: { id: teamId(m.homeTeam?.name), name: m.homeTeam?.name || "TBD" },
    away: { id: teamId(m.awayTeam?.name), name: m.awayTeam?.name || "TBD" },
    winner: mapWinner(m.score),     // "home" | "away" | "draw" | null
    duration: m.score?.duration || null,
    goalsHome: goals(m.score, "home"),
    goalsAway: goals(m.score, "away"),
    penalties:
      m.score?.duration === "PENALTY_SHOOTOUT"
        ? { home: m.score.penalties?.home ?? null, away: m.score.penalties?.away ?? null }
        : null,
  }));

  // Top scorers — for the golden boot watch panel. Non-fatal if it fails.
  let scorers = [];
  try {
    const s = await get("/competitions/WC/scorers?limit=15");
    scorers = (s.scorers || []).map((row) => ({
      player: row.player?.name,
      team: row.team?.name,
      teamId: teamId(row.team?.name),
      goals: row.goals ?? 0,
      assists: row.assists ?? null,
    }));
  } catch (e) {
    console.warn("Scorers fetch failed (non-fatal):", e.message);
  }

  const out = {
    updatedAt: new Date().toISOString(),
    source: "football-data.org",
    matches,
    scorers,
    unmatchedTeams: [...unmatched],
  };

  writeFileSync(
    join(ROOT, "data", "results.json"),
    JSON.stringify(out, null, 2) + "\n"
  );

  console.log(
    `Wrote ${matches.length} matches, ${scorers.length} scorers.` +
      (unmatched.size ? ` Unmatched team names: ${[...unmatched].join(", ")}` : "")
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
