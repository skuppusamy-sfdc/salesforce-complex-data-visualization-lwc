# Reusable Template: Building Complex Data-Grid UIs with AI Pair-Programming

*A step-by-step recipe for converting any legacy card/form-based pricing UI to a modern multi-view dashboard using conversational AI.*

---

## Who This Is For

- Salesforce developers converting OmniStudio/FlexCard/Visualforce UIs to LWC
- Teams with complex pricing/rate/schedule data that needs multiple viewing angles
- Anyone wanting to demonstrate AI pair-programming productivity gains

---

## Prerequisites

- Claude Code CLI authenticated to your Salesforce org
- Existing data model (doesn't need to be perfect — AI will explore it)
- Screenshots of the current UI you want to replace
- 3-5 hours of uninterrupted time

---

## The Recipe

### Step 1: Show the AI What Exists (10 minutes)

Provide:
1. Screenshots of the current UI (2-4 images showing different sections)
2. A brief explanation of the data hierarchy (what objects, what relationships)
3. Key business logic (how is "changed" vs "new" determined? soft-delete vs hard-delete?)

**Example prompt:**
> "Here are screenshots of our current [Rate/Pricing/Schedule] UI. It's built with [FlexCards/Visualforce/custom pages]. The data model is: [Parent] has many [Groups], each group has many [Line Items]. Line items have a [Cloned_From] field for tracking changes between [contract versions/plan years/renewals]. Convert this to an LWC with multiple tab views."

### Step 2: First Build — Get Something Working (20 minutes)

The AI will build an initial LWC. It won't be perfect. That's fine. The goal is a functional foundation.

**What you'll get:**
- An Apex controller querying your data
- A modal or card component with basic tab views
- A flat table, some grouping, maybe a matrix attempt

**What to look for:**
- Does it load data correctly?
- Are the core fields showing?
- Is the basic structure sound?

### Step 3: Iterative Refinement — The Core Loop (2-3 hours)

This is where the real value happens. Use these prompt categories:

#### Category A: "Make X Better"
```
"The matrix view is good but [problem]. Can you [desired outcome]?"
"The [tab name] is not showing [field/status/grouping]."
"I like [feature] but it needs [enhancement]."
```

#### Category B: "Add Feature Y"
```
"Add [delete/edit/export/filter] capability to the [Flat Table]."
"Show [reference data] as a standalone tab."
"Add inline editing for [field] — but only when [condition]."
```

#### Category C: "Fix Bug Z" (Give Evidence)
```
"Record [ID] for [specific filter values] shows [X] but should show [Y]."
"The [component] is not showing on [page type] for [condition]."
"After [action], the data doesn't refresh."
```

#### Category D: "This UX Doesn't Work"
```
"Too much scrolling — try a different layout."
"The dropdown is pointless since there's only one option per row."
"Users will be confused by [behavior] — show feedback."
```

#### Category E: "Guard Rails"
```
"Only allow [action] when [status] is [value]."
"Don't allow partial failures — show a clear error."
"Should I worry about performance for [X] records on [Y] RAM?"
```

### Step 4: Polish & Consistency (30 minutes)

Once features are complete:
```
"Make the status labels consistent across all views."
"Add a color legend — don't take too much space."
"Show [Account Name / Start Date / Status] in the modal title."
"Add color coding to the Status column in all datatables."
```

### Step 5: Access Control (15 minutes)

Add late — don't over-architect early:
```
"Users should only be able to [edit/delete/restore] when [status] is [Draft]."
"Remove checkboxes on non-[editable] records."
"Make the [Rate] column read-only when [condition]."
```

---

## Common Pitfalls & How to Avoid Them

| Pitfall | How to Avoid |
|---------|-------------|
| AI builds the wrong UX on first try | Expected. Budget 2-4 iterations for complex interactions. Each takes 3-5 minutes. |
| Deploy fails with type mismatches | AI fixes these immediately. Don't panic. |
| Component doesn't appear on record page | Add `<objects><object>YourObject</object></objects>` to meta XML |
| Data doesn't refresh after save | Remove `cacheable=true` from Apex, add `lightning/refresh` handler |
| Matrix merges rows that should be separate | Check what dimensions create unique records — all must be in the row key |
| Status labels inconsistent across views | Do a global search for the old term at the end — rename everywhere in one pass |
| Performance concerns | Ask the AI to assess. Usually fine for <500 records. Cache getters if recomputed multiple times. |

---

## What You'll End Up With

After ~60 prompts across 4-5 hours:

| Component | Description |
|-----------|-------------|
| Inline panel | Embedded on record page, auto-refreshes on page events |
| Full-screen modal | Launched from panel's expand button, all features |
| Flat Table | Sortable, filterable datatable with inline edit + bulk actions |
| Matrix View | Dimension A × Dimension B grid with color-coded cells + old values |
| Grouped View | Accordion by primary dimension |
| Status View | Grouped by change type (New/Changed/Deleted/Unchanged) |
| Detail Popover | Click any row to see all non-blank fields in a lightweight popup |
| Reference Tab | Standalone table for supporting data |

---

## Metrics to Expect

| Metric | Typical Range |
|--------|---------------|
| Total prompts | 40-80 |
| Deployments | 25-40 |
| Session time | 3-5 hours |
| Traditional estimate | 6-12 weeks |
| Lines of Apex | 200-400 |
| Lines of JS per component | 500-800 |
| Design iterations on complex UX | 2-4 per feature |
| Clarifying questions from AI | 10-20 |

---

## Prompt Cheat Sheet

| Goal | Prompt Template |
|------|----------------|
| Add a tab | "Show [data type] as a new tab between [Tab A] and [Tab B]" |
| Add a filter | "The [field] has values like [X, Y, Z] — add a [combobox/radio button] filter" |
| Add inline edit | "Make [field] inline editable in the Flat Table. Only when [condition]." |
| Add bulk action | "Add a [Delete/Export/Assign] button that works on selected rows" |
| Show old values | "When [status] is Changed, show the previous [value] in parentheses" |
| Add color coding | "Color-code the [Status] column — [green for New, orange for Changed, red for Deleted]" |
| Fix a merge bug | "[Specific record] shows [X] but has [Y] in the data. You're merging rows." |
| Add a popup | "Show all details for a row in a popup when clicking [icon]. Use Salesforce hover card style." |
| Guard an action | "Only allow [action] when [field] is [value]. Hide [buttons/checkboxes] otherwise." |
| Check performance | "Will this work on [X]GB RAM with [Y] records? Assess and tell me." |

---

*Adapt these templates to your domain: swap "Rate" for "Price", "Hospital" for "Store", "Service Code" for "SKU", "Agreement" for "Contract". The pattern works for any multi-dimensional data grid.*
