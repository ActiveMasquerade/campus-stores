(() => {
  const storageKey = "campus-stores.shift.v2";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      at: 945,
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      at: 1170,
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      at: 1980,
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  // Desk times as minutes from Friday midnight, so due times can be compared with the clock.
  const times = {
    "Fri 8 pm": 1200,
    "Sat 9 am": 1980,
    "Sat 10 am": 2040,
    "Sat noon": 2160,
  };
  const dueOptions = Object.keys(times);
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 2,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        holder: "Tara Shah",
        expected: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    draft: {},
    returning: "",
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const openFor = (req) => s.loans.filter((l) => l.req === req && !l.back);
  const late = (l) => !l.back && shifts[s.phase].at > times[l.due];
  const unitName = (a) => a.id + " · " + a.model + " · bin " + a.bin;
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list, selected = "") =>
    list
      .map(
        ([v, t]) =>
          '<option value="' +
          esc(v) +
          '"' +
          (v === selected ? " selected" : "") +
          ">" +
          esc(t) +
          "</option>",
      )
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right, cls = "") =>
    '<div class="row ' +
    cls +
    '"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, kind = "") =>
    '<span class="tag' + (kind ? " " + kind : "") + '">' + esc(t) + "</span>";
  const select = (label, key, options, selected = "", blank = "Select…", required = true) =>
    "<label><span>" +
    esc(label) +
    '</span><select name="' +
    key +
    '"' +
    (required ? " required" : "") +
    '><option value="">' +
    esc(blank) +
    "</option>" +
    opts(options, selected) +
    "</select></label>";
  const peopleOpts = people.map((p) => [p, p]);
  const dueOpts = dueOptions.map((d) => [d, d]);
  // Where a unit is now and when it is expected, kept on the slip itself.
  const whereabouts = (l) =>
    "With " +
    l.holder +
    (l.expected !== l.due
      ? " · expected " + l.expected + " · approved due " + l.due
      : " · due " + l.due);
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        esc(r.event) +
        "</h3><p>" +
        esc(r.club) +
        " · Filed by " +
        esc(r.owner) +
        "</p><p><b>Return by</b> " +
        esc(r.due) +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + esc(x) + "</li>").join("") +
        "</ul><p>" +
        esc(r.note) +
        "</p></div>";
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const l = out(a.id);
      const status = a.repair ? "In repair" : l ? "On loan" : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model +
          " · " +
          a.bin +
          (l ? " · " + l.req + " · " + whereabouts(l) : ""),
        l && late(l)
          ? badge("Overdue", "late")
          : badge(status, status === "On shelf" ? "good" : ""),
      );
    }
    return html;
  }
  // One form issues every approved item on a request; each unit still gets its own slip.
  function issueForm() {
    const d = s.draft;
    const r = getReq(d.req);
    let html =
      '<form data-issue><div class="form">' +
      '<label class="full"><span>Approved request</span><select name="req" data-draft required><option value="">Select…</option>' +
      opts(
        requests.map((x) => [x.id, x.id + " · " + x.club + " · " + x.event]),
        d.req || "",
      ) +
      "</select></label>";
    if (!r)
      return (
        html +
        '</div><p class="hint">Choose the request to see its approved items.</p></form>'
      );
    html +=
      select("Collected by", "who", peopleOpts, d.who || "") +
      select("Return by", "due", dueOpts, d.due || r.due) +
      "</div><p><b>Units leaving the desk</b> " +
      "<small>Check each label against the model before handing it over.</small></p>";
    r.items.forEach((type, i) => {
      const already = s.loans.find(
        (l) => l.req === r.id && !l.back && getAsset(l.asset).type === type,
      );
      if (already) {
        html += row(
          type,
          "Already out on slip L-" + already.num + " · " + already.asset,
          badge("On loan"),
          "unit",
        );
        return;
      }
      const free = assets.filter((a) => a.type === type && !a.repair && !out(a.id));
      html += free.length
        ? '<div class="row unit"><label class="pick"><span>' +
          esc(type) +
          '</span><select name="unit-' +
          i +
          '">' +
          opts(
            free.map((a) => [a.id, unitName(a)]).concat([["", "Not issuing now"]]),
            free[0].id,
          ) +
          "</select></label></div>"
        : row(type, "No unit is free to issue.", badge("Short", "late"), "unit");
    });
    return (
      html +
      '<button type="submit" class="primary">Save issue slips</button></form>'
    );
  }
  // Checklist for returning a kit. Everything starts ticked; staff untick what is not on the counter.
  function returnForm(req) {
    const open = openFor(req);
    const r = getReq(req);
    let html =
      '<form data-return><p><b>Return for ' +
      esc(r.id + " · " + r.club) +
      "</b> <small>Untick any unit that is not on the counter. Check the model on the label.</small></p>";
    for (const l of open) {
      const a = getAsset(l.asset);
      html +=
        '<label class="row unit check"><input type="checkbox" name="back" checked value="' +
        l.num +
        '"><span><strong>' +
        esc(a.type) +
        "</strong><small>" +
        esc("L-" + l.num + " · " + unitName(a) + " · " + whereabouts(l)) +
        "</small></span></label>";
    }
    return (
      html +
      '<div class="form">' +
      select("Returned by", "by", peopleOpts, open[0].holder) +
      '</div><div class="form" data-missing hidden><p class="full"><b>Not handed back</b> <small>Who has the unticked units now, and when are they expected?</small></p>' +
      select("Now with", "holder", peopleOpts, "", "Select…", false) +
      select("Expected back", "expected", dueOpts, "", "Select…", false) +
      '</div><button type="submit" class="primary">Save return</button> ' +
      btn("Cancel", "cancel") +
      "</form>"
    );
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit · grouped by request",
      s.editing || s.returning
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) return html + issueForm();
    if (s.returning) return html + returnForm(s.returning);
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans.filter((l) => !s.onlyOpen || !l.back);
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    const kits = [...new Set(shown.slice().reverse().map((l) => l.req))];
    for (const req of kits) {
      const r = getReq(req);
      const all = s.loans.filter((l) => l.req === req);
      const open = all.filter((l) => !l.back);
      html += row(
        r.id + " · " + r.club,
        (open.length
          ? open.length + " of " + all.length + " still out"
          : "All " + all.length + " returned") +
          " · collected by " +
          all[0].who,
        open.length ? btn("Record return", "returnkit", req) : badge("Closed", "good"),
        "kit",
      );
      for (const n of s.notes.filter((n) => n.req === req))
        html +=
          '<p class="kitnote"><small>' +
          esc(shifts[n.phase].time) +
          " · handover note</small> " +
          esc(n.text) +
          "</p>";
      for (const l of shown.filter((l) => l.req === req).reverse()) {
        const a = getAsset(l.asset);
        html += row(
          "L-" + l.num + " · " + a.id + " · " + a.type,
          a.model +
            " · " +
            (l.back
              ? "Returned by " + l.returnedBy + " · " + shifts[l.returnedAt].time
              : whereabouts(l)),
          l.back
            ? badge("Returned")
            : late(l)
              ? badge("Overdue since " + l.due, "late")
              : badge("Out"),
          "unit",
        );
      }
    }
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const open = s.loans.filter((l) => !l.back);
    html +=
      '<article class="record"><small>From the loan register · ' +
      esc(shifts[s.phase].time) +
      "</small><h3>Still out right now</h3>" +
      (open.length
        ? "<ul>" +
          open
            .map((l) => {
              const a = getAsset(l.asset);
              return (
                "<li>" +
                esc(
                  l.req +
                    " · " +
                    getReq(l.req).club +
                    ": " +
                    a.id +
                    " " +
                    a.type +
                    " (" +
                    a.model +
                    ") · " +
                    whereabouts(l),
                ) +
                (late(l) ? " " + badge("Overdue since " + l.due, "late") : "") +
                "</li>"
              );
            })
            .join("") +
          "</ul>"
        : "<p>Nothing is out.</p>") +
      "</article>";
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([
        shifts[n.phase].time,
        "Counter handover" +
          (n.req ? " · " + n.req + " " + getReq(n.req).club : ""),
        n.text,
      ]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label>' +
      '<label><span>About</span><select name="req"><option value="">General</option>' +
      opts(requests.map((r) => [r.id, r.id + " · " + r.club])) +
      '</select></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  // Show a problem without repainting, so the form keeps what staff entered.
  const fail = (msg) => {
    q("[data-status]").textContent = msg;
  };
  const closeForms = () => {
    s.editing = false;
    s.draft = {};
    s.returning = "";
  };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        closeForms();
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        closeForms();
        s.editing = true;
        break;
      case "cancel":
        closeForms();
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "returnkit":
        if (!openFor(v).length) return;
        closeForms();
        s.returning = v;
        break;
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
    // Ask where the missing units are only once something is unticked.
    if (e.target.matches('[data-return] input[name="back"]')) {
      const f = e.target.form;
      f.querySelector("[data-missing]").hidden = [
        ...f.querySelectorAll('input[name="back"]'),
      ].every((c) => c.checked);
      return;
    }
    if (e.target.matches("[data-draft]")) {
      const f = new FormData(e.target.form);
      s.draft = { req: e.target.value, who: f.get("who") || s.draft.who };
      commit();
    }
  });
  function issue(form) {
    const r = getReq(form.get("req"));
    const who = form.get("who");
    const due = form.get("due");
    if (!r) return fail("Choose an approved request.");
    if (!people.includes(who)) return fail("Choose who is collecting the kit.");
    if (!times[due]) return fail("Choose a return time.");
    const picked = r.items
      .map((type, i) => [type, form.get("unit-" + i)])
      .filter(([, id]) => id);
    if (!picked.length) return fail("Choose at least one unit to issue.");
    for (const [type, id] of picked) {
      const unit = getAsset(id);
      if (!unit || unit.type !== type)
        return fail("This equipment type is outside the approved request. Choose an approved unit.");
      if (unit.repair || out(id)) return fail(id + " is not on the shelf.");
      if (
        s.loans.some(
          (l) => l.req === r.id && !l.back && getAsset(l.asset).type === type,
        )
      )
        return fail("The approved quantity of this equipment type is already on loan.");
    }
    const first = Math.max(...s.loans.map((l) => l.num)) + 1;
    picked.forEach(([, asset], i) =>
      s.loans.push({
        num: first + i,
        req: r.id,
        asset,
        who,
        due,
        holder: who,
        expected: due,
        back: false,
      }),
    );
    const last = first + picked.length - 1;
    closeForms();
    commit(
      "Issued " +
        picked.map(([, id]) => id).join(", ") +
        " to " +
        who +
        " for " +
        r.id +
        " on " +
        (last === first ? "slip L-" + first : "slips L-" + first + " to L-" + last) +
        ".",
    );
  }
  function receive(form) {
    const req = s.returning;
    const open = openFor(req);
    const ticked = new Set(form.getAll("back").map(Number));
    const back = open.filter((l) => ticked.has(l.num));
    const missing = open.filter((l) => !ticked.has(l.num));
    const by = form.get("by");
    const holder = form.get("holder");
    const expected = form.get("expected");
    if (back.length && !people.includes(by))
      return fail("Choose who handed the units back.");
    if (missing.length && (!people.includes(holder) || !times[expected]))
      return fail(
        "Some units are not ticked. Say who has them now and when they are expected back.",
      );
    for (const l of back)
      Object.assign(l, { back: true, returnedBy: by, returnedAt: s.phase });
    for (const l of missing) Object.assign(l, { holder, expected });
    const parts = [];
    if (back.length)
      parts.push(back.map((l) => l.asset).join(", ") + " returned by " + by + ".");
    if (missing.length)
      parts.push(
        missing.map((l) => l.asset).join(", ") +
          " still out with " +
          holder +
          ", expected " +
          expected +
          ".",
      );
    else parts.push("Kit closed.");
    closeForms();
    commit(req + ": " + parts.join(" "));
  }
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      const req = getReq(form.get("req")) ? form.get("req") : "";
      s.notes.push({ phase: s.phase, text, req });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-issue]")) issue(form);
    if (f.matches("[data-return]")) receive(form);
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 2 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) =>
          n &&
          shifts[n.phase] &&
          typeof n.text === "string" &&
          (!n.req || getReq(n.req)),
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l &&
          getReq(l.req) &&
          getAsset(l.asset) &&
          Number.isInteger(l.num) &&
          people.includes(l.who) &&
          people.includes(l.holder) &&
          times[l.due] &&
          times[l.expected] &&
          (!l.back || (people.includes(l.returnedBy) && shifts[l.returnedAt])),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
      editing: false,
      draft: {},
      returning: "",
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
