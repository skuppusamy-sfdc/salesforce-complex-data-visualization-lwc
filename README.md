# Salesforce Complex Data Visualization LWC

A production-ready Lightning Web Component template for visualizing complex, multi-dimensional data — rates, pricing, schedules, fee structures — with multiple interactive views, inline editing, and color-coded change tracking.

## What This Is

A reference implementation showing how to build a comprehensive data dashboard in Salesforce LWC. The demo uses a **Health Insurance Fee Schedule** scenario (payer-provider rate agreements), but the patterns apply to any domain with multi-dimensional pricing data.

## Live Demo Components

| Component | Description | Demo |
|-----------|-------------|-------------|
| `feeScheduleOld` | **Before** — Legacy card-based layout (what you're replacing) | https://youtu.be/-zUFPonprJw |
| `feeScheduleDashboard` | **After** — Modern multi-view dashboard with all features | https://youtu.be/7dVFrCqrmFA |

Both use hardcoded sample data — no Apex or custom objects needed. Deploy to any org for instant visual comparison.

## Features Demonstrated

| Feature | Description |
|---------|-------------|
| **Multi-tab views** | Flat Table, Matrix View, By Hospital, By Status |
| **Matrix visualization** | Dimension A × Dimension B grid with color-coded cells |
| **Change tracking** | Green (New), Orange (Changed), Red (Deleted), Grey (Unchanged) |
| **Previous value display** | Shows old rate in parentheses on changed cells |
| **Global search** | Debounced search across all views |
| **Column sorting** | Click-to-sort on all datatable columns |
| **Category filters** | Combobox filters that cascade |
| **Inline editing** | Click a rate cell to edit directly in the table |
| **Color legend** | Compact dot-based legend below search |
| **Status cell styling** | Background color + white text via `cellAttributes.style` |
| **Detail popover** | SLDS popover showing all fields for a selected record |
| **Accordion grouping** | Expandable sections by dimension |

## Deployment

```bash
# Authenticate to your org
sf org login web -a my-org

# Deploy
sf project deploy start --source-dir force-app --target-org my-org
```

Then add the components to any page via Lightning App Builder.

## Architecture Patterns

### Performance: Getter Caching
```javascript
// Problem: allFlatRows recomputed 7× per render (1,400 enrichRow calls for 200 records)
// Solution: Reference-equality cache
_cachedFlatRows = null;
_cachedRawDataRef = null;

get allFlatRows() {
    if (this.rawData !== this._cachedRawDataRef) {
        this._cachedRawDataRef = this.rawData;
        this._cachedFlatRows = this.rawData.map(r => this.enrichRow(r));
    }
    return this._cachedFlatRows;
}
```

### Matrix View: Composite Row Keys
```javascript
// Problem: Same hospital with different tiers overwrites in Map
// Solution: Include all differentiating dimensions in the key
const rowKey = `${facility} (${tier})`;
```

### Status Color Coding via Inline Styles
```javascript
// cellAttributes.class doesn't work for cell backgrounds in lightning-datatable
// Use cellAttributes.style with fieldName binding instead
{ label: 'Status', fieldName: 'status', cellAttributes: { style: { fieldName: 'statusStyle' } } }
```

### Conditional Editing
```javascript
get flatColumns() {
    if (!this.isDraft) return BASE_COLUMNS; // read-only
    return BASE_COLUMNS.map(col =>
        col.fieldName === 'rate' ? { ...col, editable: true } : col
    );
}
```

## Memory Profile (200 records)

| Metric | Value |
|--------|-------|
| JS heap | ~1.3 MB |
| DOM nodes (all tabs) | ~10,400 |
| Total per instance | ~2.1 MB |
| Safe on 8GB RAM? | Yes (5.8 GB headroom) |

## Adapting to Your Domain

| This Template | Your Domain |
|---------------|-------------|
| Hospital | Store / Location / Region |
| Service Code | SKU / Product / Line Item |
| Rate ($) | Price / Cost / Premium |
| Provider Type | Category / Segment / Tier |
| Network Tier | Channel / Priority / Level |
| Agreement | Contract / Order / Plan |

## Articles

- [Building the Dashboard — Full Story](Article_Public_Generic.md)
- [Reusable Template & Prompt Cheat Sheet](Article_Reusable_Template.md)

## Built With

- Salesforce Lightning Web Components (API 62.0)
- SLDS (Salesforce Lightning Design System)
- Claude Code (AI pair-programming) — [claude.ai/code](https://claude.ai/code)

## License

MIT
