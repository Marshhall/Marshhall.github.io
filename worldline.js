(() => {
  const NS = "http://www.w3.org/2000/svg";

  function init(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "true";

    const svg = root.querySelector("svg");
    const surface = root.querySelector(".wl-surface");
    const readout = root.querySelector(".wl-readout");
    const idle = readout.innerHTML;
    const now = Date.now();

    /* ───────────────────────── Geometry ───────────────────────── */

    const W = 1180;
    const X0 = 56; // left edge of the time scale
    const X1 = 1124; // right edge of the time scale
    const BAND_H = 38; // the year ruler in the middle
    const ROW = 40; // distance between branch rows
    const FIRST = 90; // band centre → first branch row
    const R = 22; // corner radius of a fork
    const LANE = 6; // line weight

    /*
     * ─── EDIT YOUR STORY HERE ─────────────────────────────────────────
     *
     * row       Which line the experience travels on. Positive rows sit
     *           above the year ruler (1 is closest), negative rows below.
     *           Rule of thumb for children: the one that starts LATEST
     *           goes closest to its parent, so no two lines ever cross.
     * offset    Vertical distance from the ruler; overrides row spacing.
     * parent    The experience this one forks from (default: the ruler).
     * No end    = ongoing.
     * milestone = a single moment instead of a duration.
     * planned   = dotted, future.
     * tag       = small gold badge after the title (e.g. a funder).
     * align     = "end" puts the label right-aligned to the line's end.
     *
     * FSMP's date is approximate: replace it with the actual date.
     */
    const events = [
      {
        id: "ub",
        label: "University of Barcelona",
        sub: "Mathematics & Physics · 2020-2025",
        start: "2020-09-01",
        end: "2025-07-01",
        row: 1,
        offset: -62,
        color: "#5db08e",
        href: "cv.html#cv-ub",
        detail:
          "The foundation. Two degrees, and three first encounters with research."
      },
      {
        id: "bsc",
        label: "BSC",
        sub: "Quantum computing · 2024-2025",
        start: "2024-11-01",
        end: "2025-07-01",
        parent: "ub",
        row: 2,
        offset: -116,
        color: "#35aeb2",
        href: "cv.html#cv-bsc",
        detail:
          "Exploring classical shadows and observable grouping with the Quantic group."
      },
      {
        id: "irb",
        label: "IRB Barcelona",
        sub: "Molecular modelling · 2024-2025",
        start: "2024-07-01",
        end: "2025-03-01",
        parent: "ub",
        row: 3,
        offset: -174,
        color: "#ee8683",
        href: "cv.html#cv-irb",
        detail:
          "Physics and mathematics meet biology: modelling DNA flexibility."
      },
      {
        id: "crm",
        label: "CRM",
        sub: "Complex dynamics · Summer 2023",
        start: "2023-06-01",
        end: "2023-09-01",
        parent: "ub",
        row: 4,
        offset: -100,
        color: "#e5a932",
        href: "cv.html#cv-crm",
        detail:
          "A first step into research, branching from the bachelor-s degrees."
      },
      {
        id: "fsmp",
        label: "FSMP scholarship",
        sub: "A turning point · 2025",
        date: "2025-06-01", // Replace with the actual award date.
        milestone: true,
        color: "#c9a24a",
        href: "cv.html#cv-fsmp",
        detail:
          "One award, several possibilities: enabling PSL and partly funding the MIT stay."
      },
      {
        id: "psl",
        label: "PSL · Mathematics",
        sub: "Master-s degree · 2025-present",
        start: "2025-09-01",
        row: -1,
        offset: 56,
        tag: "FSMP",
        color: "#8f74c8",
        href: "cv.html#cv-psl",
        detail:
          "Enabled by the FSMP scholarship. The parent branch for the planned MIT stay."
      },
      {
        id: "mit",
        label: "MIT",
        sub: "Visiting student · Apr-Oct 2027 · planned",
        start: "2027-04-01",
        end: "2027-11-01",
        parent: "psl",
        row: -2,
        offset: 110,
        planned: true,
        tag: "FSMP",
        align: "end",
        color: "#d46a8e",
        href: "cv.html#cv-mit",
        detail:
          "Planned research within the master-s path, with part of the funding from FSMP."
      },
      {
        id: "westinghouse",
        label: "Westinghouse Nuclear",
        sub: "Simulation modelling · 2025-present",
        start: "2025-07-01",
        row: -3,
        offset: 154,
        color: "#4f8fe4",
        href: "cv.html#cv-westinghouse",
        detail:
          "Developing software for nuclear simulations, alongside the academic path."
      }
    ];

    const relations = [
      { from: "fsmp", to: "psl", label: "enables", reverse: "Enabled by" },
      { from: "fsmp", to: "mit", label: "partly funds", reverse: "Partly funded by" }
    ];
    // ──────────────────────────────────────────────────────────────────

    const byId = new Map(events.map(e => [e.id, e]));
    const endDate = e => (e.end ? Date.parse(e.end) : now);

    const latest = Math.max(
      now,
      ...events.filter(e => !e.milestone).map(endDate)
    );
    const firstYear = 2020;
    const first = Date.UTC(firstYear, 0, 1);
    const lastYear = new Date(latest).getUTCFullYear() + 1;
    const last = Date.UTC(lastYear, 0, 1);

    const x = d => {
      const t = typeof d === "number" ? d : Date.parse(d);
      return X0 + ((t - first) / (last - first)) * (X1 - X0);
    };
    const todayX = x(now);

    // Vertical layout: FIRST also scales custom offsets.
    const lanes = events.filter(e => !e.milestone);

    const offset = e => {
      if (e.offset !== undefined) {
        // Shift each side outward without stretching its branches.
        return e.offset + Math.sign(e.offset) * (FIRST - 62);
      }

      return e.row > 0
        ? -FIRST - (e.row - 1) * ROW
        : FIRST + (-e.row - 1) * ROW;
    };

    const Yb = 54 + Math.max(0, ...lanes.map(e => -offset(e)));
    const H = Yb + Math.max(0, ...lanes.map(offset)) + 44;

    const laneY = e => Yb + offset(e);

    const bandTop = Yb - BAND_H / 2;
    const bandBottom = Yb + BAND_H / 2;

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("role", "group");

    /* ───────────────────────── Helpers ───────────────────────── */

    function add(tag, attrs = {}, parent = svg, text) {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (text !== undefined) el.textContent = text;
      parent.appendChild(el);
      return el;
    }

    const uid = "wl-" + Math.random().toString(36).slice(2, 8);
    const est = (str, size) => str.length * size * 0.6;

    // A fork: leaves the parent perpendicularly, then turns into its own row.
    function forkPath(x0, yFrom, yTo, xEnd, r) {
      const dir = Math.sign(yTo - yFrom) || -1;
      const cy = yTo - dir * r;
      const t = 0.62; // slightly squarer than a circle: a continuous corner
      return (
        `M${x0} ${yFrom} V${cy} ` +
        `C${x0} ${cy + dir * r * t} ${x0 + r * (1 - t)} ${yTo} ${x0 + r} ${yTo} ` +
        `H${xEnd}`
      );
    }

    // Wrapper groups carry the dim / active state, so they never fight
    // the entrance animations running on their children.
    const parts = new Map();
    function part(id, layer, cls = "") {
      const g = add(
        "g",
        { class: ("wl-part " + cls).trim(), style: `--c:${byId.get(id).color}` },
        layer
      );
      if (!parts.has(id)) parts.set(id, []);
      parts.get(id).push(g);
      return g;
    }

    add("title", {}, svg, "Events along the worldline");
    add(
      "desc",
      {},
      svg,
      "A branching timeline. A year ruler runs through the middle; experiences " +
        "fork from it above and below. A diamond marks a turning point, dotted " +
        "lines are planned, and fading lines are ongoing."
    );

    /* ───────────────────────── Definitions ───────────────────────── */

    const defs = add("defs");

    const hatch = add(
      "pattern",
      {
        id: uid + "-hatch",
        width: 10,
        height: 10,
        patternUnits: "userSpaceOnUse",
        patternTransform: "rotate(45)"
      },
      defs
    );
    add("line", { x1: 0, y1: 0, x2: 0, y2: 10, class: "wl-hatch" }, hatch);

    const gold = add(
      "linearGradient",
      { id: uid + "-gold", x1: 0, y1: 0, x2: 1, y2: 1 },
      defs
    );
    add("stop", { offset: 0, "stop-color": "#f3dc9c" }, gold);
    add("stop", { offset: 1, "stop-color": "#b8892b" }, gold);

    const arrow = add(
      "marker",
      {
        id: uid + "-arrow",
        viewBox: "0 0 10 10",
        refX: 6.5,
        refY: 5,
        markerWidth: 7,
        markerHeight: 7,
        orient: "auto"
      },
      defs
    );
    add(
      "path",
      {
        d: "M1.5 1.5 L8 5 L1.5 8.5",
        fill: "none",
        stroke: "#b08d3e",
        "stroke-width": 1.8,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      arrow
    );

    const bandClip = add("clipPath", { id: uid + "-band" }, defs);
    add(
      "rect",
      {
        x: X0 - 20,
        y: bandTop,
        width: X1 - X0 + 40,
        height: BAND_H,
        rx: BAND_H / 2
      },
      bandClip
    );

    /* ───────────────────────── Layers, back to front ───────────────────────── */

    const mk = cls => add("g", { class: "wl-layer " + cls });

    const bgLayer = mk("");
    const guideLayer = mk("");
    const todayLayer = mk("");
    const laneLayer = mk("");
    const bandLayer = mk("");
    const nodeLayer = mk("");
    const labelLayer = mk("");
    const arcLayer = mk("");
    const topLayer = mk("");
    const hitLayer = add("g", { class: "wl-hits" });

    /* ───────────────────────── Background ───────────────────────── */

    // The road ahead.
    add(
      "rect",
      {
        x: todayX,
        y: 35,
        width: Math.max(X1 + 24 - todayX, 0),
        height: H - 35 - 18,
        rx: 22,
        fill: `url(#${uid}-hatch)`
      },
      bgLayer
    );

    for (let year = firstYear; year <= lastYear; year++) {
      const px = x(Date.UTC(year, 0, 1));
      add(
        "line",
        { x1: px, x2: px, y1: 40, y2: H - 28, class: "wl-year-hair" },
        bgLayer
      );
    }

    // Focus guides (moved on hover).
    const guideA = add("line", { class: "wl-guide", y1: 40, y2: H - 24 }, guideLayer);
    const guideB = add("line", { class: "wl-guide", y1: 40, y2: H - 24 }, guideLayer);

    // Today.
    add(
      "line",
      { x1: todayX, x2: todayX, y1: 36, y2: H - 22, class: "wl-today-line" },
      todayLayer
    );

    /* ───────────────────────── The year ruler ───────────────────────── */

    add(
      "rect",
      {
        x: X0 - 20,
        y: bandTop,
        width: X1 - X0 + 40,
        height: BAND_H,
        rx: BAND_H / 2,
        class: "wl-band"
      },
      bandLayer
    );

    add(
      "rect",
      {
        x: todayX,
        y: bandTop,
        width: Math.max(X1 + 20 - todayX, 0),
        height: BAND_H,
        fill: `url(#${uid}-hatch)`,
        "clip-path": `url(#${uid}-band)`,
        class: "wl-band-future"
      },
      bandLayer
    );

    const span = add(
      "rect",
      {
        x: 0,
        y: Yb - 13,
        width: 0,
        height: 26,
        rx: 13,
        class: "wl-span"
      },
      bandLayer
    );

    const thisYear = new Date(now).getUTCFullYear();

    for (let year = firstYear; year < lastYear; year++) {
      const a = x(Date.UTC(year, 0, 1));
      const b = x(Date.UTC(year + 1, 0, 1));

      if (year > firstYear) {
        add(
          "line",
          { x1: a, x2: a, y1: Yb - 7, y2: Yb + 7, class: "wl-sep" },
          bandLayer
        );
      }

      add(
        "text",
        {
          x: (a + b) / 2,
          y: Yb + 4.2,
          "text-anchor": "middle",
          class:
            "wl-year" +
            (year === thisYear ? " is-now" : "") +
            (year > thisYear ? " is-future" : "")
        },
        bandLayer,
        String(year)
      );
    }

    add(
      "rect",
      {
        x: todayX - 2,
        y: bandTop - 6,
        width: 4,
        height: BAND_H + 12,
        rx: 2,
        class: "wl-scrub"
      },
      bandLayer
    );

    // Today label on top.
    add(
      "rect",
      { x: todayX - 30, y: 12, width: 60, height: 22, rx: 11, class: "wl-today-pill" },
      topLayer
    );
    add(
      "text",
      { x: todayX, y: 27, "text-anchor": "middle", class: "wl-today-text" },
      topLayer,
      "TODAY"
    );
    add(
      "text",
      { x: todayX + 42, y: 27, class: "wl-ahead" },
      topLayer,
      "AHEAD →"
    );

    /* ───────────────────────── Experiences ───────────────────────── */

    const order = events
      .map(e => ({ id: e.id, t: Date.parse(e.start || e.date) }))
      .sort((a, b) => a.t - b.t)
      .map(item => item.id);

    const geo = new Map(); // geometry we need again later (relations, hits)

    lanes.forEach(e => {
      const idx = order.indexOf(e.id);
      const delay = (0.25 + idx * 0.15).toFixed(2);
      const y = laneY(e);
      const up = e.row > 0;
      const parent = e.parent ? byId.get(e.parent) : null;
      const yFrom = parent ? laneY(parent) : up ? bandTop : bandBottom;

      const x0 = x(e.start);
      const ongoing = !e.end;
      const xEnd = ongoing ? todayX : x(e.end);
      const r = Math.min(R, Math.max(8, (xEnd - x0) * 0.45));
      const d = forkPath(x0, yFrom, y, xEnd, r);

      geo.set(e.id, { x0, xEnd, y, yFrom, up });

      // Stem colour flows from the parent into the branch.
      const gid = `${uid}-g-${e.id}`;
      const grad = add(
        "linearGradient",
        {
          id: gid,
          gradientUnits: "userSpaceOnUse",
          x1: 0,
          y1: yFrom,
          x2: 0,
          y2: y
        },
        defs
      );
      add("stop", { offset: 0, "stop-color": parent ? parent.color : e.color }, grad);
      add("stop", { offset: 1, "stop-color": e.color }, grad);

      // Draw-on mask: keeps dotted lines dotted while they animate.
      const mid = `${uid}-m-${e.id}`;
      const mask = add(
        "mask",
        {
          id: mid,
          maskUnits: "userSpaceOnUse",
          x: 0,
          y: 0,
          width: W,
          height: H
        },
        defs
      );
      const revealPath = add("path", {
        d, fill: "none", stroke: "#fff", "stroke-width": 44,
        "stroke-linecap": "butt", class: "wl-mask-draw",
        style: `--delay:${delay}s`
      }, mask);
      const pathLength = revealPath.getTotalLength() + 1;
      revealPath.style.setProperty("--wl-path-length", pathLength);

      /* — line — */
      const lg = part(e.id, laneLayer, e.planned ? "is-planned" : "");
      add(
        "path",
        { d, class: "wl-lane", stroke: `url(#${gid})`, mask: `url(#${mid})` },
        lg
      );

      if (ongoing) {
        const kids = events.filter(c => c.parent === e.id);
        const displayEnd = Math.max(now, ...kids.map(endDate));

        if (displayEnd > now) {
          add(
            "path",
            {
              d: `M${todayX} ${y} H${x(displayEnd)}`,
              class: "wl-proj wl-fade",
              style: `--delay:${(+delay + 1.25).toFixed(2)}s`
            },
            lg
          );
        } else {
          const fid = `${uid}-f-${e.id}`;
          const fade = add(
            "linearGradient",
            {
              id: fid,
              gradientUnits: "userSpaceOnUse",
              x1: todayX,
              y1: 0,
              x2: todayX + 110,
              y2: 0
            },
            defs
          );
          add("stop", { offset: 0, "stop-color": e.color, "stop-opacity": 1 }, fade);
          add("stop", { offset: 1, "stop-color": e.color, "stop-opacity": 0 }, fade);

          add(
            "path",
            {
              d: `M${todayX} ${y} H${todayX + 110}`,
              class: "wl-tail wl-fade",
              stroke: `url(#${fid})`,
              style: `--delay:${(+delay + 1.25).toFixed(2)}s`
            },
            lg
          );
        }
      }

      /* — nodes — */
      const ng = part(e.id, nodeLayer);

      add(
        "circle",
        {
          cx: x0,
          cy: yFrom,
          r: 4.6,
          class: "wl-ring wl-pop",
          style: `--delay:${delay}s`
        },
        ng
      );

      if (ongoing) {
        add("circle", { cx: todayX, cy: y, r: 9, class: "wl-live-ring" }, ng);
        add(
          "circle",
          {
            cx: todayX,
            cy: y,
            r: 5.2,
            class: "wl-live wl-pop",
            style: `--delay:${(+delay + 1.25).toFixed(2)}s`
          },
          ng
        );
      } else {
        add(
          "circle",
          {
            cx: xEnd,
            cy: y,
            r: 6.4,
            class: "wl-end wl-pop",
            style: `--delay:${(+delay + 1.2).toFixed(2)}s`
          },
          ng
        );
      }

      /* — label: always on the side away from the parent — */
      const lbl = part(e.id, labelLayer);
      const end = e.align === "end";
      const centered = e.id === "bsc";
      const lx = centered ? (x0 + r + xEnd) / 2 : end ? xEnd + 6 : x0 - 2;
      const anchor = centered ? "middle" : end ? "end" : "start";
      const ty = up ? y - 18 : y + 25;
      

      const title = add(
        "text",
        {
          x: lx,
          y: ty,
          class: "wl-label wl-rise",
          "text-anchor": anchor,
          style: `--delay:${(+delay + 0.7).toFixed(2)}s`
        },
        lbl,
        e.label
      );
      if (e.tag) add("tspan", { class: "wl-tag", dx: 9 }, title, "◆ " + e.tag);


      geo.get(e.id).label = {
        x: lx,
        anchor,
        w: est(e.label, 14.5) + (e.tag ? 62 : 0),
        up
      };
    });

    /* ───────────────────────── The milestone ───────────────────────── */

    events
      .filter(e => e.milestone)
      .forEach(e => {
        const idx = order.indexOf(e.id);
        const delay = (0.25 + idx * 0.15).toFixed(2);
        const fx = x(e.date);
        const fy = bandTop - 30;

        geo.set(e.id, { fx, fy });

        const lg = part(e.id, laneLayer);
        add(
          "line",
          {
            x1: fx,
            x2: fx,
            y1: bandTop,
            y2: fy + 8,
            class: "wl-pin wl-fade",
            style: `--delay:${delay}s`
          },
          lg
        );

        const ng = part(e.id, nodeLayer);
        add("circle", { cx: fx, cy: bandTop, r: 3.8, class: "wl-ring wl-pop", style: `--delay:${delay}s` }, ng);
        add("circle", { cx: fx, cy: fy, r: 21, class: "wl-halo wl-pop", style: `--delay:${delay}s` }, ng);
        add("circle", { cx: fx, cy: fy, r: 13, class: "wl-ping" }, ng);
        add(
          "path",
          {
            d: `M${fx} ${fy - 12} l12 12 -12 12 -12 -12Z`,
            class: "wl-diamond wl-pop",
            fill: `url(#${uid}-gold)`,
            style: `--delay:${(+delay + 0.1).toFixed(2)}s`
          },
          ng
        );
        add(
          "path",
          {
            d: `M${fx} ${fy - 4.5} l4.5 4.5 -4.5 4.5 -4.5 -4.5Z`,
            class: "wl-diamond-core wl-pop",
            style: `--delay:${(+delay + 0.1).toFixed(2)}s`
          },
          ng
        );

        const lbl = part(e.id, labelLayer);
        add(
          "text",
          {
            x: fx - 26,
            y: fy - 2,
            "text-anchor": "end",
            class: "wl-label wl-rise",
            style: `--delay:${(+delay + 0.3).toFixed(2)}s`
          },
          lbl,
          e.label
        );

        geo.get(e.id).label = { w: est(e.label, 14.5) };
      });

    /* ───────────────────────── Funding arcs (shown on hover) ───────────────────────── */

    const arcs = [];

    relations.forEach(rel => {
      const s = geo.get(rel.from);
      const t = geo.get(rel.to);

      const sx = s.fx + 14;
      const sy = s.fy;
      const tx = t.x0 + 40;
      const ty = t.y - 13;

      const c1 = [sx + 80, sy];
      const c2 = [tx, ty - 90];
      const d = `M${sx} ${sy} C${c1} ${c2} ${tx} ${ty}`;

      const bez = (a, b, c, e, p) =>
        (1 - p) ** 3 * a + 3 * (1 - p) ** 2 * p * b + 3 * (1 - p) * p ** 2 * c + p ** 3 * e;
      // Label near the arrowhead, well clear of the year ruler.
      const mx = bez(sx, c1[0], c2[0], tx, 0.86);
      const my = bez(sy, c1[1], c2[1], ty, 0.86);

      const g = add("g", { class: "wl-arc-group" }, arcLayer);
      add("path", { d, class: "wl-arc-halo" }, g);
      add("path", { d, class: "wl-arc", "marker-end": `url(#${uid}-arrow)` }, g);
      add("text", { x: mx + 12, y: my + 3, class: "wl-arc-label" }, g, rel.label);

      arcs.push({ rel, g });
    });

    /* ───────────────────────── Hit targets ───────────────────────── */

    const anchors = new Map();

    events.forEach(e => {
      const g = geo.get(e.id);
      const a = add(
        "a",
        {
          href: e.href,
          class: "wl-hit",
          "aria-label": `${e.label}: ${e.sub}. ${e.detail} View CV entry.`
        },
        hitLayer
      );
      anchors.set(e.id, a);

      let rx, ry, rw, rh;
      const L = g.label;

      if (e.milestone) {
        rw = L.w + 70;
        rx = g.fx - 26 - L.w - 10;
        ry = g.fy - 24;
        rh = 48;
        add("path", { d: `M${g.fx} ${bandTop} V${g.fy}`, class: "wl-hit-path" }, a);
      } else {
        rw = L.w + 12;
        rx = L.anchor === "middle" ? L.x - L.w / 2 - 6 : L.anchor === "end" ? L.x - L.w - 6 : L.x - 6;
        ry = L.up ? g.y - 48 : g.y - 8;
        rh = 56;
        add(
          "path",
          { d: forkPath(g.x0, g.yFrom, g.y, g.xEnd, Math.min(R, Math.max(8, (g.xEnd - g.x0) * 0.45))), class: "wl-hit-path" },
          a
        );
      }

      add("rect", { x: rx, y: ry, width: rw, height: rh, rx: 14, class: "wl-hit-rect" }, a);
    });

    /* ───────────────────────── Interaction ───────────────────────── */

    function showFocus(e) {
      if (!e) {
        span.classList.remove("on");
        guideA.classList.remove("on");
        guideB.classList.remove("on");
        return;
      }

      const from = x(e.milestone ? e.date : e.start);
      const to = e.milestone ? from : x(endDate(e));
      const width = Math.max(to - from, e.milestone ? 10 : 6);
      const left = e.milestone ? from - 5 : from;

      span.setAttribute("x", left);
      span.setAttribute("width", width);
      span.style.setProperty("--c", e.color);
      span.classList.add("on");

      [[guideA, from], [guideB, to]].forEach(([line, px]) => {
        line.setAttribute("x1", px);
        line.setAttribute("x2", px);
        line.style.setProperty("--c", e.color);
        line.classList.toggle("on", !e.milestone || line === guideA);
      });
    }

    function chip(text, color) {
      const c = document.createElement("span");
      c.className = "wl-chip";
      c.style.setProperty("--c", color);
      c.textContent = text;
      return c;
    }

    function highlight(id) {
      if (!id) {
        parts.forEach(list =>
          list.forEach(g => g.classList.remove("is-dim", "is-active"))
        );
        arcs.forEach(({ g }) => g.classList.remove("on"));
        showFocus(null);
        readout.innerHTML = idle;
        return;
      }

      const active = new Set([id]);

      const ancestors = e => {
        if (e.parent) {
          active.add(e.parent);
          ancestors(byId.get(e.parent));
        }
      };
      const descendants = pid =>
        events
          .filter(e => e.parent === pid)
          .forEach(e => {
            active.add(e.id);
            descendants(e.id);
          });

      ancestors(byId.get(id));
      descendants(id);
      relations.forEach(r => {
        if (r.from === id || r.to === id) {
          active.add(r.from);
          active.add(r.to);
          if (r.from === id) descendants(r.to);
        }
      });

      parts.forEach((list, key) =>
        list.forEach(g => {
          g.classList.toggle("is-dim", !active.has(key));
          g.classList.toggle("is-active", key === id);
        })
      );

      arcs.forEach(({ rel, g }) =>
        g.classList.toggle("on", active.has(rel.from) && active.has(rel.to))
      );

      const e = byId.get(id);
      showFocus(e);

      const card = document.createElement("span");
      card.className = "wl-card";

      const dot = document.createElement("span");
      dot.className = "wl-dot";
      dot.style.setProperty("--c", e.color);

      const title = document.createElement("strong");
      title.textContent = e.label;

      const meta = document.createElement("span");
      meta.className = "wl-meta";
      meta.textContent = e.sub;

      const text = document.createElement("span");
      text.className = "wl-text";
      text.textContent = e.detail;

      const chips = document.createElement("span");
      chips.className = "wl-chips";

      if (e.parent) {
        const p = byId.get(e.parent);
        chips.append(chip("Branches from " + p.label, p.color));
      }
      events
        .filter(c => c.parent === e.id)
        .forEach(c => chips.append(chip("Leads to " + c.label, c.color)));
      relations.forEach(r => {
        if (r.from === e.id) {
          const t = byId.get(r.to);
          chips.append(chip(r.label[0].toUpperCase() + r.label.slice(1) + " " + t.label, t.color));
        }
        if (r.to === e.id) {
          const s = byId.get(r.from);
          chips.append(chip(r.reverse + " " + s.label, s.color));
        }
      });

      card.append(dot, title, text);
      if (chips.childElementCount) card.append(chips);
      readout.replaceChildren(card);
    }

    anchors.forEach((a, id) => {
      a.addEventListener("pointerenter", () => highlight(id));
      a.addEventListener("pointerleave", () => {
        const focused = [...anchors].find(([, el]) => el === document.activeElement);
        highlight(focused ? focused[0] : null);
      });
      a.addEventListener("focus", () => highlight(id));
      a.addEventListener("blur", () => highlight(null));

      // Standalone preview: highlight instead of navigating.
      if (root.hasAttribute("data-preview")) {
        a.addEventListener("click", ev => {
          ev.preventDefault();
          highlight(id);
        });
      }
    });

    /* ───────────────────────── Phone layout: the same tree as a list ───────────────────────── */

    const list = document.createElement("div");
    list.className = "wl-list";

    const startOf = e => Date.parse(e.start || e.date);
    const childrenOf = id =>
      events.filter(e => e.parent === id).sort((a, b) => startOf(a) - startOf(b));

    function addItem(e, depth, parentEl) {
      const li = document.createElement("li");
      li.style.setProperty("--event", e.color);
      li.style.setProperty("--depth", depth);
      if (e.planned) li.classList.add("is-planned");
      if (e.milestone) li.classList.add("is-milestone");

      const link = document.createElement("a");
      link.href = e.href;

      const t = document.createElement("strong");
      t.textContent = e.label;
      const s = document.createElement("span");
      s.className = "wl-list-sub";
      s.textContent = e.sub;
      const d = document.createElement("span");
      d.className = "wl-list-text";
      d.textContent = e.detail;

      link.append(t, d);
      li.append(link);
      parentEl.append(li);

      childrenOf(e.id).forEach(c => addItem(c, depth + 1, parentEl));
    }

    const ol = document.createElement("ol");
    events
      .filter(e => !e.parent)
      .sort((a, b) => startOf(a) - startOf(b))
      .forEach(e => addItem(e, 0, ol));
    list.append(ol);

    surface.insertBefore(list, root.querySelector(".wl-footer"));

    /* ───────────────────────── Entrance ───────────────────────── */

    const reveal = () => root.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries.some(en => en.isIntersecting)) {
            reveal();
            observer.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      observer.observe(root);
    } else {
      reveal();
    }

    root.querySelector(".wl-replay").addEventListener("click", () => {
      root.classList.remove("is-visible");
      void svg.getBoundingClientRect();
      requestAnimationFrame(reveal);
    });
  }

  function start() {
    document.querySelectorAll("[data-worldline]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
