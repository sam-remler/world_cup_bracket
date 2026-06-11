# The Pool '26 ⚽

A World Cup 2026 pool for friends. Static site, hosted free on GitHub Pages,
with scores updating automatically every 30 minutes.

## How it works

- **`index.html` + `app.js`** — the site. All scoring math runs in the browser.
- **`data/teams.js`** — all 48 teams, their groups, and the 5 draft tiers (editable).
- **`data/picks.js`** — your league's players, their 10 teams, golden boot picks, and the scoring rules (editable).
- **`data/results.json`** — match results. A GitHub Action refreshes this from football-data.org every 30 minutes. Never edit by hand.
- **`data/overrides.json`** — your manual control panel (corrections, final placements, golden boot winner).

## The rules

| Event | Points |
|---|---|
| Win (group or knockout — shootout wins count) | **+5** |
| Draw | **+2** |
| Goal scored (shootout kicks excluded) | **+1** |
| Goal conceded | **−0.5** |
| Reaching the round of 32 | **+3** |
| Tournament finish 1st / 2nd / 3rd / 4th | **+7 / +5 / +3 / +1** |

Each player drafts **2 teams from each of the 5 tiers** (10 total) plus one
**golden boot** striker. Duplicates allowed. Golden boot is the end-of-tournament
tiebreaker. Edit any of these numbers in `POOL_RULES` inside `data/picks.js`.

## Setup (~10 minutes)

### 1. Create the repo
1. Create a new **public** GitHub repository (e.g. `worldcup-pool`).
2. Upload everything in this folder to it (keep the folder structure,
   including the hidden `.github` folder).

### 2. Get a free API key
1. Register at https://www.football-data.org/client/register (free tier is enough).
2. You'll get a token by email.

### 3. Add the key as a repo secret
1. In your repo: **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `FOOTBALL_DATA_TOKEN`. Value: your token.

### 4. Turn on GitHub Pages
1. **Settings → Pages → Source: Deploy from a branch → `main` / root → Save.**
2. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### 5. First data pull
1. Go to the **Actions** tab → **Update World Cup results** → **Run workflow**.
2. After it finishes, `data/results.json` is populated and the site shows real scores.
3. From then on it refreshes itself every 30 minutes automatically.

### 6. Enter your league
Edit `data/picks.js`: replace the example players with your friends' names,
team picks (ids from `data/teams.js`), and golden boot picks. Adjust the
tier assignments in `data/teams.js` if your draft used different tiers —
the site flags any player whose picks don't match the 2-per-tier format.

## During & after the tournament

- **Manual corrections:** add API match ids to `excludeMatchIds` or hand-entered
  matches to `manualMatches` in `data/overrides.json`.
- **Round-of-32 bonus:** awarded automatically when a team appears in a knockout
  fixture. If the API is slow to publish the bracket, add team ids to
  `advancedTeams` to award it immediately.
- **Final placements:** detected automatically from the final and third-place
  match, or set them explicitly in `overrides.json` → `placements`.
- **Golden boot tiebreaker:** when FIFA awards the boot, set
  `goldenBootWinner` in `overrides.json` to the player's name (accents don't
  matter). Tied pool players are then ranked by who called it.

## Notes

- GitHub's cron can lag a few minutes during busy periods — normal.
- The free football-data.org tier allows 10 requests/minute; this setup uses
  2 per refresh, far under the limit.
- If a team name ever shows up in `unmatchedTeams` inside `results.json`,
  add it to that team's `aliases` in `data/teams.js`. 
