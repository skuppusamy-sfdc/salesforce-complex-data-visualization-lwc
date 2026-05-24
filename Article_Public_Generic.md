# Building a Multi-View Fee Schedule Dashboard in 4 Hours with AI Pair-Programming

*How one Salesforce developer used conversational AI to replace a legacy rate configurator with a modern, interactive LWC — without wireframes, PRDs, or a sprint plan.*

---

## The Business Problem

A regional health insurance payer manages provider network agreements with 50+ hospital systems. Each agreement contains hundreds of reimbursement rate lines — varying by hospital, service code (DRGs, CPT codes), provider type (Specialist, Primary Care, Surgeon), and network tier (Tier 1, Preferred, Standard).

**Pain points:**
1. **No consolidated view** — The existing UI was a card-based low-code configurator that showed rates one category at a time (Inpatient, Outpatient, Professional Services). Users had to scroll through cards and click "Load More" to see all rates. No way to compare across hospitals.
2. **No change visibility** — When agreements are renewed annually, rate renegotiations produce new rates, changed rates, and terminated service codes. The old UI showed all cards identically — no visual indication of what changed vs. what stayed the same.
3. **No cross-dimensional analysis** — Users couldn't see a Hospital × Service Code matrix to compare rates across the network. Each card was isolated.
4. **Slow edit workflow** — Changing a rate required navigating back to the Rate Builder (separate screen), finding the right record, editing, and returning.
5. **No bulk operations** — Terminating or reinstating service codes required one-by-one navigation.

**Business impact:** Network operations managers spent 20-30 minutes per agreement review. Rate errors during renewals went undetected until claims processing flagged them — sometimes months later.

---

## What the AI Was Given

### Session 1 — Converting the Legacy UI

The developer provided:
- **4 screenshots** of the existing card-based Fee Schedule UI showing:
  - Inpatient section with DRG-grouped cards (rate per procedure, delete icons)
  - Outpatient section with CPT-code grouped cards (rate per visit)
  - Professional Services section with specialty-grouped cards (rate per hour/unit)
  - "Load More" pagination links at the bottom of each section
- **Architecture explanation**: The legacy system used 4 nested low-code configurator cards (Summary → Hospital → ServiceType → RateLine)
- **Data model briefing**: How change tracking works — cloned agreements use soft-delete flags and a "Cloned_From" reference to compute status (New, Changed, Deleted, Unchanged)

From that, the AI built an initial LWC with 6 tab views as a 1:1 functional replacement.

### Session 2 — Iterative Refinement (This Article)

Starting with the functional but basic LWC, the developer refined it through **~60 conversational prompts** over 4-5 hours. No PRDs. No wireframes for the final state. Just:

> "Make this better."
> "That's confusing, try something else."
> "Can users edit rates inline?"
> "What about performance on 8GB machines?"

**The entire specification evolved through conversation.**

---

## The Build: Prompt by Prompt

### Phase 1: Quick Fixes (5 minutes)
> **Prompt:** "Rename 'By Hospital' as 'Hospital View'. The status view is not showing 'Unchanged'."

AI made 4 edits (controller, JS, CSS) and deployed. Established the pattern: edit → deploy → verify.

### Phase 2: Matrix View Enhancement (30 minutes)
> **Prompt:** "The Hospital field has Specialist, Primary Care etc and it's filtered with Service Code that also has the same grouping... can you add a filter? Also show the previous rate when there's a change."

AI couldn't implement from this alone. It:
1. **Researched** the data model to find the "Provider Type" field wasn't being queried
2. **Asked 2 questions**: Default filter to "All" or first type? Display old rate as "$New ($Old)" or "$Old → $New"?
3. **Planned** a 6-step implementation
4. **Built and deployed** — radio button filter + old rate in parentheses on changed cells

**Key insight:** The developer described the *problem*, not the solution. The AI had to discover the right field and design the interaction.

### Phase 3: Delete & Restore (20 minutes)
> **Prompt:** "Add delete and undelete. Check how the existing system does it first."

AI researched the legacy Integration Procedure, discovered the soft-delete vs hard-delete dual pattern, reported findings, then asked:
- Both types? → Yes
- UI style? → "Both per-row icon AND bulk checkbox buttons"

Built two controller methods + full UI in one pass.

### Phase 4: Rapid UX Iterations (15 minutes)
| Prompt | Result |
|--------|--------|
| "Don't want the dropdown, just show the icon" | Simplified per-row action |
| "Remove the accordion view — redundant" | Deleted entire tab |
| "Bring flat view to the front" | Reordered tabs |
| "Make it available on the page layout too" | Created inline panel component |
| "Add an expand button to open full modal" | Added expand icon + auto-refresh on close |

### Phase 5: Detail Popover (25 minutes, 4 iterations)
> **Prompt:** "Show all other attributes for each rate — fields that are not blank."

This took **4 design attempts**:
1. Detail panel below table → "Have to scroll too far"
2. Separate Details tab → "Put it top or bottom"
3. Full-screen modal → "Style is not great"
4. **SLDS popover** (hover card style) → "Perfect"

**What this shows:** AI doesn't nail UX on the first try. But each iteration was a 3-minute build-deploy-test cycle, not a week-long redesign.

### Phase 6: Service Code Reference Tab (15 minutes)
> **Prompt:** "How to show the service codes in this mix?"

After clarification ("it's integral reference data for the rates"), AI built a standalone tab querying service codes directly — with start/end dates, days, categories, and status tracking.

### Phase 7: Data Bug Fix (5 minutes)
> **Prompt:** "Agreement #4521 for Mercy General Specialists shows 8 rates but matrix only shows 4."

AI identified the bug without touching the database: the matrix row key was `Hospital` only. Same hospital with Tier 1 and Preferred rates for the same service code overwrote each other. Fix: composite key `Hospital (Tier)`.

### Phase 8: Inline Rate Editing (15 minutes)
> **Prompt:** "Can we make the rate inline editable?"

AI checked: any triggers blocking updates? Validation rules? Existing update methods? Found: nothing blocks it. Built inline editing with the datatable's built-in Save/Cancel bar.

### Phase 9: Access Control (10 minutes)
> **Prompt:** "Users should only edit when agreement status is Draft."

AI made Rate column conditionally editable, hid checkboxes on non-Draft agreements, and guarded all action buttons behind an `isDraft` check.

### Phase 10: Performance Assessment (10 minutes)
> **Prompt:** "Should I worry about performance? Users have 8GB RAM desktops."

AI analyzed: ~2.1 MB per instance, ~10K DOM nodes, comparable to a standard Salesforce list view. Found and fixed a getter recomputation issue (1,400 → 200 calls per render). **Verdict: safe, no action needed.**

---

## Patterns That Emerged

| Pattern | What It Means |
|---------|---------------|
| User gives intent, AI researches and implements | "Show the service codes" → AI discovers the object, proposes a tab |
| User gives evidence for bugs, AI reasons about data structures | "8 rates but shows 4" → Map key collision identified without querying the DB |
| User rejects, AI iterates fast | 4 attempts at detail view in 25 minutes total |
| AI asks before building complex features | Every planned feature had 1-2 clarifying questions first |
| Quick fixes skip planning entirely | "Rename X to Y" → direct edit, no questions |
| AI self-corrects on failures | Deploy errors fixed in the same turn (type mismatches, HTML syntax) |

---

## What AI Cannot Do Without You

- **UX judgment** — AI proposed 4 detail view approaches; only the human knew which "felt right"
- **Business domain knowledge** — "Service codes are integral to rates" wasn't discoverable from code
- **Priority calls** — Which tabs matter, which are redundant, what's "too heavy" styling
- **Real-world testing** — Human caught bugs AI couldn't see (matrix merging, blank screen on non-Draft)
- **Performance concerns** — AI didn't proactively flag the 8GB question; human asked

---

## Final Deliverable

| View | Purpose |
|------|---------|
| **Flat Table** | Searchable, sortable, filterable datatable. Inline rate editing. Bulk delete/restore. Detail popover. |
| **Service Codes** | Standalone reference table of all service codes with schedule details |
| **Matrix View** | Hospital × Service Code grid with color-coded cells (green/orange/red/grey), old rate display, provider type filter |
| **By Hospital** | Accordion grouped by hospital — all rates for one facility at a glance |
| **By Status** | Groups by Changed/New/Deleted/Unchanged with previous rate column |

---

## Stats

| Metric | Value |
|--------|-------|
| Total prompts | ~60 |
| Successful deployments | ~35 |
| Failed deploys (fixed same turn) | ~5 |
| Clarifying questions from AI | ~15 |
| Design iterations (rejected first attempt) | 8 |
| Total session time | ~4-5 hours |
| Traditional estimate (manual) | 8-10 weeks |
| Efficiency gain | ~90-95% |

---

## Performance Investigation & Solution

### The Question
> "We have 2,200+ provider agreements. Typical agreement has 50-100 rate lines, but 2% have 200+. Will this work on 8GB RAM desktops with Chrome/Edge?"

### The Investigation

Rather than guessing, the AI performed a full analysis of the component's runtime characteristics:

**Data Volume Research:**
| Metric | Value |
|--------|-------|
| Total agreements in system | 2,200+ |
| Typical rate lines per agreement | 50-100 |
| Worst-case rate lines (2% edge) | 200+ |
| Fields per rate line (wrapper) | 35 |
| Payload size for 200 records | ~280-320 KB |
| SOQL queries per page load | 3 (Agreement, Rate Lines, Service Codes) |
| Relationship traversals in SOQL | 6 nested lookups |

**JavaScript Computation Analysis:**

The AI discovered the real bottleneck wasn't data volume — it was **getter recomputation**:

```
Render cycle (before fix):
├─ groups getter         → allFlatRows (1st) → enrichRow × 200
├─ statusGroups getter   → allFlatRows (2nd) → enrichRow × 200
├─ facilityGroups getter → allFlatRows (3rd) → enrichRow × 200
├─ measureOptions getter → allFlatRows (4th) → enrichRow × 200
├─ facilityOptions getter→ allFlatRows (5th) → enrichRow × 200
├─ filteredFlatRows      → allFlatRows (6th) → enrichRow × 200
└─ globalMatchCount      → allFlatRows (7th) → enrichRow × 200

Total: 7 × 200 = 1,400 enrichRow() calls per render
```

Each getter independently recalculated `allFlatRows` from scratch because LWC getters have no built-in caching.

**DOM Analysis:**
| Tab | DOM Nodes (200 records) |
|-----|------------------------|
| Flat Table (datatable — virtualized) | ~200 visible |
| Matrix View | ~720 |
| By Hospital (accordion) | ~1,700 |
| By Status | ~1,600 |
| Service Codes | ~290 |
| **Total (all tabs in DOM)** | **~10,400** |

Note: `lightning-tab` renders ALL tabs into the DOM (hidden via CSS), not lazily.

**Memory Budget:**
| Layer | Size |
|-------|------|
| JS heap (data + caches + framework) | ~1.3 MB |
| DOM tree (6 tabs, 200 records) | ~0.8 MB |
| CSS/CSSOM | ~3 KB |
| **Total per component instance** | **~2.1 MB** |

**Comparison to Salesforce norms:**
| Component | DOM Nodes | Heap |
|-----------|-----------|------|
| Standard List View (200 records) | 8,000-12,000 | 2-3 MB |
| Report with 200 rows | 6,000-10,000 | 1.5-2.5 MB |
| **Our Fee Schedule Dashboard** | **10,400** | **2.1 MB** |
| OmniScript with 50 steps | 15,000-20,000 | 3-5 MB |

### The Solution: Getter Caching

**Before (1,400 enrichRow calls per render):**
```javascript
get allFlatRows() {
    // Recomputes from scratch every time ANY getter accesses it
    const rows = [];
    for (const g of this.rawData.groups) {
        for (const r of g.rates) {
            rows.push(this.enrichRow(r));
        }
    }
    return rows;
}
```

**After (200 enrichRow calls per render):**
```javascript
_cachedFlatRows = null;
_cachedRawDataRef = null;

get allFlatRows() {
    // Only recomputes when rawData actually changes (new object reference)
    if (this.rawData !== this._cachedRawDataRef) {
        this._cachedRawDataRef = this.rawData;
        const rows = [];
        for (const g of this.rawData.groups) {
            for (const r of g.rates) {
                rows.push(this.enrichRow(r));
            }
        }
        this._cachedFlatRows = rows;
    }
    return this._cachedFlatRows;
}
```

Same pattern for the `groups` getter (cached by composite key of `globalSearch` + filter state).

**Cache invalidation:** Clear all caches in `refreshData()` before fetching new data.

### What We Didn't Do (and Why)

| Optimization | Why Skipped |
|---|---|
| Pagination (25 records per page) | 200 records renders fine in `lightning-datatable` (virtualizes rows). Pagination adds UX complexity. |
| Virtual scrolling | Overkill for <500 records |
| Lazy tab rendering | Would reduce DOM by 80%, but not needed on 8GB machines. Available as future optimization. |
| SOQL splitting | 3 queries is well within governor limits |
| Server-side filtering | Client-side is faster for this volume — no round-trip latency on filter change |
| Web Workers | LWC Locker Service doesn't support them |

### Verdict

**SAFE for 8GB RAM + Chrome/Edge.** The component uses ~2.1 MB — comparable to a standard Salesforce list view. 5.8 GB of headroom remains. The getter caching reduced JS computation by 7× for the 2% edge case contracts.

---

## Reproduce It Yourself — Template Prompts

Want to build something similar for your own domain? Here are the prompts adapted as templates:

### Starting prompt (after providing screenshots of old UI):
> "Convert this [card-based/table/form] UI to a modern LWC. Keep the same data but add: tabbed views (flat table, matrix, grouped by [dimension]), global search, and color-coded status tracking."

### Adding a matrix view:
> "The [Column A] has multiple types like [X, Y, Z] and it's grouped with [Column B] that has the same categories. Add a radio button filter for [X/Y/Z] on the matrix view. Show the previous value when there's a change."

### Adding delete/restore:
> "Add delete and restore. Check how the existing system handles it first — tell me before building. Support both [soft-delete for renewals] and [hard-delete for new items]."

### Detail popover:
> "Show all non-blank fields for a selected record. Don't use a modal — use a lightweight popover like Salesforce's record hover card."

### Inline editing with guard:
> "Make [field] inline editable, but only when [status] is [Draft]. Remove checkboxes and action buttons on non-Draft records."

### Performance check:
> "Should I worry about performance? Users have [X] GB RAM. Typical record count is [Y], worst case is [Z]."

---

*Built with Claude Code (Opus 4.6) — an AI pair-programming tool that deploys directly to Salesforce orgs from the terminal.*
