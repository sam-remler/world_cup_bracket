/* ============================================================
   THE POOL '26 — scoring engine + rendering
   Reads: window.WC_TEAMS, window.POOL_PLAYERS, window.POOL_RULES,
          data/results.json, data/overrides.json
   ============================================================ */

(async function () {
  const TEAMS = window.WC_TEAMS;
  const PLAYERS = window.POOL_PLAYERS;
  const RULES = window.POOL_RULES;
  const teamById = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

  // ---------- load data ----------
  async function loadJSON(path, fallback) {
    try {
      const res = await fetch(path + "?t=" + Date.now()); // bust GH Pages cache
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch {
      return fallback;
    }
  }

  const results = await loadJSON("data/results.json", { matches: [], scorers: [], updatedAt: null });
  const overrides = await loadJSON("data/overrides.json", {});
  const placements = overrides.placements || {};
  const advancedOverride = new Set(overrides.advancedTeams || []);
  const excludeIds = new Set(overrides.excludeMatchIds || []);

  const allMatches = [
    ...(results.matches || []).filter((m) => !excludeIds.has(m.id)),
    ...(overrides.manualMatches || []),
  ];

  const norm = (s) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

  // ---------- team stats ----------
  function blankStats() {
    return { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, advanced: false, placement: null };
  }
  const stats = Object.fromEntries(TEAMS.map((t) => [t.id, blankStats()]));

  const finished = allMatches.filter((m) => m.status === "FINISHED");

  for (const m of finished) {
    const h = m.home?.id, a = m.away?.id;
    if (!h || !a || !stats[h] || !stats[a]) continue;
    const gh = m.goalsHome ?? 0, ga = m.goalsAway ?? 0;

    stats[h].p++; stats[a].p++;
    stats[h].gf += gh; stats[h].ga += ga;
    stats[a].gf += ga; stats[a].ga += gh;

    if (m.winner === "home") { stats[h].w++; stats[a].l++; }
    else if (m.winner === "away") { stats[a].w++; stats[h].l++; }
    else if (m.winner === "draw") { stats[h].d++; stats[a].d++; }

    // placements from the final & third-place game
    if (m.stage === "FINAL" && m.winner && m.winner !== "draw") {
      stats[m.winner === "home" ? h : a].placement ??= 1;
      stats[m.winner === "home" ? a : h].placement ??= 2;
    }
    if (m.stage === "THIRD_PLACE" && m.winner && m.winner !== "draw") {
      stats[m.winner === "home" ? h : a].placement ??= 3;
      stats[m.winner === "home" ? a : h].placement ??= 4;
    }
  }

  // past group stage: team appears in any knockout fixture (or is overridden)
  for (const m of allMatches) {
    if (m.stage && m.stage !== "GROUP_STAGE") {
      if (m.home?.id && stats[m.home.id]) stats[m.home.id].advanced = true;
      if (m.away?.id && stats[m.away.id]) stats[m.away.id].advanced = true;
    }
  }
  for (const id of advancedOverride) if (stats[id]) stats[id].advanced = true;

  // manual placements override the computed ones
  const placeKeys = { first: 1, second: 2, third: 3, fourth: 4 };
  for (const [k, n] of Object.entries(placeKeys)) {
    const id = placements[k];
    if (id && stats[id]) stats[id].placement = n;
  }

  // ---------- points ----------
  function teamPoints(id) {
    const s = stats[id];
    if (!s) return { total: 0, parts: {} };
    const parts = {
      wins: s.w * RULES.win,
      draws: s.d * RULES.draw,
      gf: s.gf * RULES.goalFor,
      ga: s.ga * RULES.goalAgainst,
      adv: s.advanced ? RULES.pastGroupStage : 0,
      place: s.placement ? (RULES.placements[s.placement] || 0) : 0,
    };
    return { total: Object.values(parts).reduce((x, y) => x + y, 0), parts };
  }

  const gbWinner = overrides.goldenBootWinner ? norm(overrides.goldenBootWinner) : null;

  const board = PLAYERS.map((p) => {
    const rows = p.teams.map((id) => ({ id, team: teamById[id], pts: teamPoints(id) }));
    const total = rows.reduce((sum, r) => sum + r.pts.total, 0);
    const gbHit = gbWinner && norm(p.goldenBoot) === gbWinner;

    // validate: exactly 2 picks per tier, all ids real
    const tierCount = {};
    let invalid = rows.some((r) => !r.team);
    for (const r of rows) if (r.team) tierCount[r.team.tier] = (tierCount[r.team.tier] || 0) + 1;
    if (!invalid) invalid = ![1, 2, 3, 4, 5].every((t) => tierCount[t] === 2) || rows.length !== 10;

    return { ...p, rows, total, gbHit, invalid };
  });

  board.sort((a, b) => b.total - a.total || (b.gbHit ? 1 : 0) - (a.gbHit ? 1 : 0) || a.name.localeCompare(b.name));

  // ---------- formatting helpers ----------
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  const signed = (n) => (n > 0 ? "+" + fmt(n) : fmt(n));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- header ----------
  const updatedEl = document.getElementById("updated-at");
  const anyLive = allMatches.some((m) => m.status === "IN_PLAY" || m.status === "PAUSED");
  if (results.updatedAt) {
    const d = new Date(results.updatedAt);
    updatedEl.innerHTML =
      (anyLive ? '<span class="live-dot"></span>LIVE · ' : "") +
      "updated " + d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } else {
    updatedEl.textContent = "awaiting first results";
  }

  // ---------- leaderboard ----------
  const lb = document.getElementById("leaderboard");
  if (finished.length === 0) document.getElementById("lb-empty").classList.remove("hidden");

  let rank = 0, prevTotal = null, prevGb = null;
  board.forEach((p, i) => {
    if (p.total !== prevTotal || p.gbHit !== prevGb) rank = i + 1;
    prevTotal = p.total; prevGb = p.gbHit;

    const li = document.createElement("li");
    li.className = "lb-row" + (i === 0 && finished.length ? " leader" : "");

    const squadRows = p.rows
      .slice()
      .sort((a, b) => b.pts.total - a.pts.total)
      .map((r) => {
        if (!r.team)
          return `<tr><td class="t-name">⚠️ unknown id “${esc(r.id)}”</td><td colspan="7"></td></tr>`;
        const s = stats[r.id];
        const bonus = [];
        if (s.advanced) bonus.push(`R32 ${signed(RULES.pastGroupStage)}`);
        if (s.placement) bonus.push(`${["", "1st", "2nd", "3rd", "4th"][s.placement]} ${signed(RULES.placements[s.placement])}`);
        return `<tr>
          <td class="t-name">${r.team.flag} ${esc(r.team.name)}<span class="tier-pip">T${r.team.tier}</span></td>
          <td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
          <td class="pos">${s.gf}</td><td class="neg">${s.ga}</td>
          <td>${bonus.length ? `<span class="bonus-tag">${bonus.join(" · ")}</span>` : "—"}</td>
          <td class="t-pts ${r.pts.total < 0 ? "neg" : ""}">${fmt(r.pts.total)}</td>
        </tr>`;
      })
      .join("");

    li.innerHTML = `
      <button class="lb-main" aria-expanded="false">
        <span class="lb-rank">${rank}</span>
        <span>
          <span class="lb-name">${esc(p.name)}
            ${p.gbHit ? '<span class="badge gb-win">👟 GOLDEN BOOT</span>' : ""}
            ${p.invalid ? '<span class="badge warn">CHECK PICKS</span>' : ""}
          </span>
          <span class="lb-flags">${p.rows.map((r) => r.team?.flag || "❓").join(" ")}</span>
        </span>
        <span class="lb-pts">${fmt(p.total)}<small>pts</small></span>
      </button>
      <div class="squad">
        <table>
          <thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>Bonus</th><th>Pts</th></tr></thead>
          <tbody>${squadRows}</tbody>
        </table>
      </div>`;

    li.querySelector(".lb-main").addEventListener("click", () => {
      const open = li.classList.toggle("open");
      li.querySelector(".lb-main").setAttribute("aria-expanded", open);
    });
    lb.appendChild(li);
  });

  // ---------- golden boot ----------
  const bootGrid = document.getElementById("boot-grid");
  bootGrid.innerHTML = board
    .map(
      (p) => `<div class="boot-card ${p.gbHit ? "hit" : ""}">
        <span class="pick">👟 ${esc(p.goldenBoot || "—")}</span>
        <span class="who">${esc(p.name)}</span>
      </div>`
    )
    .join("");

  const scorersEl = document.getElementById("scorers");
  const picksByPlayerName = new Map(PLAYERS.map((p) => [norm(p.goldenBoot), p.name]));
  if ((results.scorers || []).length) {
    scorersEl.innerHTML =
      "<h3>TOURNAMENT TOP SCORERS</h3>" +
      results.scorers
        .slice(0, 10)
        .map((s) => {
          const owner = picksByPlayerName.get(norm(s.player));
          return `<div class="scorer-row">
            <span>${esc(s.player)} <span class="who" style="color:var(--cream-dim)">· ${esc(s.team || "")}</span>
              ${owner ? `<span class="owned">→ ${esc(owner)}'s pick</span>` : ""}</span>
            <span class="g">${s.goals}</span>
          </div>`;
        })
        .join("");
  }

  // ---------- matches ----------
  const mxEl = document.getElementById("matches");
  const mxToggle = document.getElementById("matches-toggle");
  const playable = allMatches
    .filter((m) => ["FINISHED", "IN_PLAY", "PAUSED"].includes(m.status))
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  if (!playable.length) document.getElementById("mx-empty").classList.remove("hidden");

  const stageNames = {
    GROUP_STAGE: (m) => (m.group || "GROUP").replace("GROUP_", "GROUP "),
    LAST_32: () => "ROUND OF 32", LAST_16: () => "ROUND OF 16",
    QUARTER_FINALS: () => "QUARTERFINAL", SEMI_FINALS: () => "SEMIFINAL",
    THIRD_PLACE: () => "THIRD PLACE", FINAL: () => "FINAL",
  };

  function matchHTML(m) {
    const live = m.status !== "FINISHED";
    const stage = (stageNames[m.stage] || (() => m.stage || ""))(m);
    const date = new Date(m.utcDate).toLocaleDateString([], { month: "short", day: "numeric" });
    const pens = m.penalties ? ` (${m.penalties.home}–${m.penalties.away} pens)` : "";
    const hN = m.home?.id ? teamById[m.home.id] : null;
    const aN = m.away?.id ? teamById[m.away.id] : null;
    return `<li class="match ${live ? "live" : ""}">
      <span class="side ${m.winner === "home" ? "winner" : ""}">${hN?.flag || ""} <span class="nm">${esc(hN?.name || m.home?.name)}</span></span>
      <span class="score">${m.goalsHome ?? "–"} : ${m.goalsAway ?? "–"}</span>
      <span class="side away ${m.winner === "away" ? "winner" : ""}"><span class="nm">${esc(aN?.name || m.away?.name)}</span> ${aN?.flag || ""}</span>
      <span class="meta">${live ? "LIVE — points count when full-time" : stage + " · " + date + pens}</span>
    </li>`;
  }

  let showAllMatches = false;
  function renderMatches() {
    const list = showAllMatches ? playable : playable.slice(0, 10);
    mxEl.innerHTML = list.map(matchHTML).join("");
    if (playable.length > 10) {
      mxToggle.hidden = false;
      mxToggle.textContent = showAllMatches ? "Show recent" : `Show all ${playable.length}`;
    }
  }
  mxToggle.addEventListener("click", () => { showAllMatches = !showAllMatches; renderMatches(); });
  renderMatches();

  // ---------- draft board ----------
  const initials = (name) =>
    name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  const owners = {};
  for (const p of PLAYERS) for (const id of p.teams) (owners[id] ||= []).push(initials(p.name));

  const db = document.getElementById("draft-board");
  db.innerHTML = [1, 2, 3, 4, 5]
    .map((tier) => {
      const chips = TEAMS.filter((t) => t.tier === tier)
        .sort((a, b) => (teamPoints(b.id).total - teamPoints(a.id).total) || a.name.localeCompare(b.name))
        .map((t) => {
          const own = owners[t.id];
          return `<span class="team-chip ${own ? "" : "unowned"}">${t.flag} ${esc(t.name)}
            <span style="font-family:var(--mono);font-size:11px;color:var(--cream-dim)">${fmt(teamPoints(t.id).total)}</span>
            ${own ? `<span class="owners">${own.join("·")}</span>` : ""}</span>`;
        })
        .join("");
      return `<div class="tier-block"><h3>TIER ${tier}<span class="rail"></span></h3><div class="chip-grid">${chips}</div></div>`;
    })
    .join("");

  // ---------- rules ----------
  document.getElementById("rules").innerHTML = `
    <dl>
      <dt>${signed(RULES.win)}</dt><dd>per win — group or knockout; shootout wins count as wins</dd>
      <dt>${signed(RULES.draw)}</dt><dd>per draw</dd>
      <dt>${signed(RULES.goalFor)}</dt><dd>per goal scored (shootout kicks excluded)</dd>
      <dt>${signed(RULES.goalAgainst)}</dt><dd>per goal conceded</dd>
      <dt>${signed(RULES.pastGroupStage)}</dt><dd>team reaches the round of 32</dd>
      <dt>${signed(RULES.placements[1])} / ${signed(RULES.placements[2])} / ${signed(RULES.placements[3])} / ${signed(RULES.placements[4])}</dt>
      <dd>tournament finish: champion / runner-up / third / fourth</dd>
    </dl>
    <p class="fine">Every player drafts 2 teams from each of the 5 tiers (10 teams) plus one golden boot striker.
    Duplicate teams across players are allowed. Golden boot is the season-end tiebreaker:
    if players finish level on points, whoever picked the actual golden boot winner takes the higher spot.</p>`;
})();
