# Campus Stores

## My submission: record the kit as it is at the counter

**Would I keep this product? Yes, with one change.** I think the record model works well, and so does the inventory side that's built on it. Every unit gets its own slip, and every slip is checked against the approved request. When I tried to add a camera to the Film Society's request, it wouldn't let me. Where it falls apart is when a kit stops travelling together. The slip has no way of saying where a unit actually is, so the handover ends up as free text in a different tab, and whoever takes the morning shift has to piece the story back together from that text. That's the one thing I changed: the desk now records each unit as it really is at the counter, so the handover mostly writes itself.

My changes are in `app.js` and `styles.css`. To try them, open `index.html` and press **Restart sample shift**. I moved saved progress to a new storage key, so an older saved shift won't carry over.

### A moment it handles well

**Friday 3:45 pm, issuing the Film Society kit to Kabir.** I tried to put the digital camera (CA-03) on RQ-214, and the slip was refused: *"This equipment type is outside the approved request."* I then tried a second speaker for the same request, and that was refused too, as over the approved quantity. The projector sitting in the workshop (PR-06) never showed up as an option at all. So I couldn't hand out anything the Student Activities Office hadn't approved, or anything that was broken. That felt like the product doing its job well, so I left it exactly as it is.

### A moment I would change

**Friday 7:30 pm to Saturday 9 am: the partial return and the handover.**

At 7:30 pm Kabir brought back the projector and the speaker, and told me Leela had the adapter and would drop it off at 9. I recorded the two returns, but the adapter's slip still said *Kabir Sen · Due Fri 8 pm*. I had nowhere to put "Leela has it" or "back at 9 am". The only place for it was a free-text note in the Desk book.

Then I moved to 9 am and played the next shift. The register showed the adapter as `L-404 · AD-12` / `RQ-214 · Kabir Sen · Due Fri 8 pm`. It didn't say what the item was, which brand it was, or that it was now 13 hours overdue. The explanation was sitting in another tab. When Leela walked in, **Record return** closed the slip in one click and never asked which adapter she was actually holding.

Looking back, the problem starts at pickup. The issue form listed *"AD-12 · USB-C → HDMI adapter"* and *"AD-15 · USB-C → HDMI adapter"*, both in bin C4. The only thing that tells them apart (one is a Belkin, the other an Anker) is shown only on the Inventory tab. So I could easily pick AD-12 on screen while handing Kabir the other one, and nobody would notice the next morning. Issuing that one kit also took me three separate forms, with four dropdowns each.

### The change

It's one idea, and here's how it shows up on each screen:

- **I issue the kit in one go.** In the Loan register, **New issue slip** now starts from the approved request. I enter who's collecting once, and the return time comes from the request. Each approved item gets a suggested free unit labelled with its model and bin (*"AD-12 · Belkin AVC002 · bin C4"*), and I can switch it to the one I actually took or skip it. If nothing of a type is free, that item shows **Short** before the borrower leaves. Behind the scenes it still writes one slip per unit.
- **The register reads as kits.** Slips are grouped under their request (*"RQ-214 · Film Society · 1 of 3 still out"*). Each unit row says what it is and which model, and shows **Overdue since Fri 8 pm** once that time has passed.
- **Returns use a checklist.** **Record return** opens the kit with everything ticked, and I untick whatever isn't on the counter. As soon as something is unticked, the form asks who has it now and when it's coming back, and it won't save until I've answered both.
- **Each slip remembers where its unit is.** The slip keeps who has the unit and when it's expected, next to the approved due time. A promise never overwrites the approval. In the morning I see *"With Leela Das · expected Sat 9 am · approved due Fri 8 pm"* along with the overdue flag. The Inventory tab shows the same holder.
- **The handover mostly writes itself.** The Desk book now opens with **Still out right now**, built from the open slips. That leaves notes for the things records can't capture. I can link a note to a request, and it then shows up under that kit too.

### Walking through the same job with it

1. **3:45 pm, pickup.** I go to Loan register → **New issue slip** → RQ-214. I pick Kabir Sen as the collector; the return time is already set to Fri 8 pm. It suggests PR-04, SP-02 and AD-12, each with its model and bin. I check the label on the adapter I grabbed from the shelf and save. All three slips (L-402 to L-404) are created at once.
2. **7:30 pm, partial return.** I hit **Record return** on RQ-214. Everything is ticked, so I just untick the adapter. The form asks where it is: I say Leela Das, back Sat 9 am, and save. The kit now reads *1 of 3 still out*, and the adapter's slip names Leela. I didn't have to write a note at all.
3. **9 am, morning shift.** The first thing I see in the Desk book is **Still out right now**: the adapter, with Leela, expected 9 am, overdue since Fri 8 pm. In the register it's the only open unit on RQ-214, listed by brand. Leela hands it over, I check that it's the Belkin, and **Record return** (with Returned by already set to Leela) closes the kit.

### What I kept, and the trade-offs I made

- **One slip per physical unit.** I did think about loaning the whole kit as a single record, but the shift itself argues against it: by 7:30 pm that one kit has two people holding it and two different return times. So I treat the kit as a group of per-unit slips, not a replacement for them.
- **The approval checks** at issue time, the **Desk book** for club messages, and the existing layout, tabs and styling. I didn't want to redesign things that already worked.
- **Everything starts ticked.** That makes a full return a single click, but it also means a careless save closes everything. I went with speed, because most kits do come back whole.
- **The brand is shown, not enforced.** The checklist names the model, but it doesn't make anyone type or scan the ID. If the observation below shows people still mixing units up, scanning would be my next step.
- **Anyone on the people list can be recorded as holding a unit.** Before real use I'd want holders tied to the club that made the request.

### What I would watch at a real counter

On the morning after an overnight partial return, I'd watch whether the person on shift closes the right unit's slip **without asking anyone or opening the Desk book**. Then I'd compare that against the unit that actually went back on the shelf. If the change is working, those should match. And I'd expect evening notes that only repeat what's already in the register, like *"Leela has the adapter"*, to quietly stop being written.

---

## About the exercise

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.
