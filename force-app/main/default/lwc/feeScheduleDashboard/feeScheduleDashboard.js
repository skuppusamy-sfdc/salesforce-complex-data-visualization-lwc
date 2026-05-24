import { LightningElement } from 'lwc';

const SAMPLE_RATES = [
    { id: '1', category: 'Inpatient', serviceCode: 'DRG 470', facility: 'Mercy General Hospital', type: 'Specialist', rate: 4500, unit: 'per Procedure', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '2', category: 'Inpatient', serviceCode: 'DRG 470', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 4200, unit: 'per Procedure', tier: 'Tier 1', status: 'Changed', oldRate: 3900 },
    { id: '3', category: 'Inpatient', serviceCode: 'DRG 470', facility: 'Regional Health Partners', type: 'Primary Care', rate: 3800, unit: 'per Procedure', tier: 'Preferred', status: 'New', oldRate: null },
    { id: '4', category: 'Inpatient', serviceCode: 'DRG 291', facility: 'Mercy General Hospital', type: 'Specialist', rate: 3200, unit: 'per Procedure', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '5', category: 'Inpatient', serviceCode: 'DRG 291', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 3000, unit: 'per Procedure', tier: 'Preferred', status: 'Changed', oldRate: 2800 },
    { id: '6', category: 'Inpatient', serviceCode: 'DRG 392', facility: 'Mercy General Hospital', type: 'Primary Care', rate: 2100, unit: 'per Procedure', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '7', category: 'Inpatient', serviceCode: 'DRG 392', facility: 'Regional Health Partners', type: 'Primary Care', rate: 2000, unit: 'per Procedure', tier: 'Standard', status: 'Deleted', oldRate: 2000 },
    { id: '8', category: 'Inpatient', serviceCode: 'DRG 194', facility: 'Mercy General Hospital', type: 'Specialist', rate: 2800, unit: 'per Procedure', tier: 'Tier 1', status: 'New', oldRate: null },
    { id: '9', category: 'Outpatient', serviceCode: 'CPT 99213', facility: 'Mercy General Hospital', type: 'Primary Care', rate: 150, unit: 'per Visit', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '10', category: 'Outpatient', serviceCode: 'CPT 99213', facility: 'St. Luke Medical Center', type: 'Primary Care', rate: 145, unit: 'per Visit', tier: 'Preferred', status: 'Changed', oldRate: 130 },
    { id: '11', category: 'Outpatient', serviceCode: 'CPT 99213', facility: 'Regional Health Partners', type: 'Primary Care', rate: 140, unit: 'per Visit', tier: 'Standard', status: 'Unchanged', oldRate: null },
    { id: '12', category: 'Outpatient', serviceCode: 'CPT 99214', facility: 'Mercy General Hospital', type: 'Specialist', rate: 220, unit: 'per Visit', tier: 'Tier 1', status: 'New', oldRate: null },
    { id: '13', category: 'Outpatient', serviceCode: 'CPT 99214', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 210, unit: 'per Visit', tier: 'Preferred', status: 'Unchanged', oldRate: null },
    { id: '14', category: 'Outpatient', serviceCode: 'CPT 99214', facility: 'Regional Health Partners', type: 'Specialist', rate: 200, unit: 'per Visit', tier: 'Standard', status: 'Changed', oldRate: 180 },
    { id: '15', category: 'Outpatient', serviceCode: 'CPT 99215', facility: 'Mercy General Hospital', type: 'Specialist', rate: 320, unit: 'per Visit', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '16', category: 'Outpatient', serviceCode: 'CPT 99215', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 305, unit: 'per Visit', tier: 'Preferred', status: 'Deleted', oldRate: 305 },
    { id: '17', category: 'Professional', serviceCode: 'Emergency Med', facility: 'Mercy General Hospital', type: 'Surgeon', rate: 450, unit: 'per Hour', tier: 'Tier 1', status: 'Changed', oldRate: 400 },
    { id: '18', category: 'Professional', serviceCode: 'Emergency Med', facility: 'St. Luke Medical Center', type: 'Surgeon', rate: 425, unit: 'per Hour', tier: 'Preferred', status: 'Unchanged', oldRate: null },
    { id: '19', category: 'Professional', serviceCode: 'Emergency Med', facility: 'Regional Health Partners', type: 'Specialist', rate: 380, unit: 'per Hour', tier: 'Standard', status: 'New', oldRate: null },
    { id: '20', category: 'Professional', serviceCode: 'Radiology', facility: 'Mercy General Hospital', type: 'Specialist', rate: 350, unit: 'per Study', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '21', category: 'Professional', serviceCode: 'Radiology', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 340, unit: 'per Study', tier: 'Preferred', status: 'Changed', oldRate: 310 },
    { id: '22', category: 'Professional', serviceCode: 'Anesthesia', facility: 'Mercy General Hospital', type: 'Specialist', rate: 85, unit: 'per Unit', tier: 'Tier 1', status: 'Unchanged', oldRate: null },
    { id: '23', category: 'Professional', serviceCode: 'Anesthesia', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 80, unit: 'per Unit', tier: 'Preferred', status: 'New', oldRate: null },
    { id: '24', category: 'Professional', serviceCode: 'Anesthesia', facility: 'Regional Health Partners', type: 'Specialist', rate: 78, unit: 'per Unit', tier: 'Standard', status: 'Deleted', oldRate: 78 }
];

const STATUS_STYLES = {
    New: 'background-color:#2e844a; color:white; font-weight:700; border-radius:4px; padding:2px 6px;',
    Changed: 'background-color:#e87400; color:white; font-weight:700; border-radius:4px; padding:2px 6px;',
    Deleted: 'background-color:#c23934; color:white; font-weight:700; border-radius:4px; padding:2px 6px;',
    Unchanged: 'background-color:#b0adab; color:white; font-weight:700; border-radius:4px; padding:2px 6px;'
};

const FLAT_COLUMNS = [
    { label: 'Category', fieldName: 'category', sortable: true },
    { label: 'Service Code', fieldName: 'serviceCode', sortable: true },
    { label: 'Hospital', fieldName: 'facility', sortable: true },
    { label: 'Rate', fieldName: 'rate', type: 'currency', sortable: true, editable: true, cellAttributes: { alignment: 'left' } },
    { label: 'Unit', fieldName: 'unit', sortable: true },
    { label: 'Provider Type', fieldName: 'type', sortable: true },
    { label: 'Network Tier', fieldName: 'tier', sortable: true },
    { label: 'Status', fieldName: 'status', sortable: true, cellAttributes: { style: { fieldName: 'statusStyle' } } }
];

const BADGE_CLASSES = {
    New: 'slds-badge badge-new',
    Changed: 'slds-badge badge-changed',
    Deleted: 'slds-badge slds-badge_inverse badge-deleted',
    Unchanged: 'slds-badge badge-unchanged'
};

export default class FeeScheduleDashboard extends LightningElement {
    globalSearch = '';
    filterCategory = '';
    sortedBy = 'category';
    sortedDirection = 'asc';
    _searchDebounce;
    selectedDetailRow = null;
    draftValues = [];

    get flatColumns() {
        return FLAT_COLUMNS;
    }

    get allRows() {
        return SAMPLE_RATES.map(r => ({
            ...r,
            formattedRate: `$${r.rate.toLocaleString('en-US')}`,
            statusStyle: STATUS_STYLES[r.status] || '',
            badgeClass: BADGE_CLASSES[r.status] || 'slds-badge'
        }));
    }

    get filteredRows() {
        let rows = this.allRows;
        if (this.globalSearch) {
            const term = this.globalSearch.toLowerCase();
            rows = rows.filter(r => {
                const fields = [r.category, r.serviceCode, r.facility, r.type, r.tier, r.status, String(r.rate), r.unit];
                return fields.some(f => f && f.toLowerCase().includes(term));
            });
        }
        if (this.filterCategory) {
            rows = rows.filter(r => r.category === this.filterCategory);
        }
        if (this.sortedBy) {
            const dir = this.sortedDirection === 'asc' ? 1 : -1;
            const field = this.sortedBy;
            rows = [...rows].sort((a, b) => {
                const aVal = a[field] ?? '';
                const bVal = b[field] ?? '';
                if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
                return String(aVal).localeCompare(String(bVal)) * dir;
            });
        }
        return rows;
    }

    get totalRecords() {
        return SAMPLE_RATES.length;
    }

    get filteredCount() {
        return this.filteredRows.length;
    }

    get hasData() {
        return this.totalRecords > 0;
    }

    get categoryOptions() {
        const cats = [...new Set(SAMPLE_RATES.map(r => r.category))];
        return [{ label: 'All Categories', value: '' }, ...cats.map(c => ({ label: c, value: c }))];
    }

    get matrixGroups() {
        const categories = [...new Set(SAMPLE_RATES.map(r => r.category))];
        return categories.map(cat => {
            const catRates = this.allRows.filter(r => r.category === cat);
            if (!this.globalSearch || catRates.some(r => this.matchSearch(r))) {
                const rates = this.globalSearch ? catRates.filter(r => this.matchSearch(r)) : catRates;
                const columns = [...new Set(rates.map(r => r.serviceCode))].sort();
                const facilityMap = new Map();
                for (const r of rates) {
                    const key = `${r.facility} (${r.tier})`;
                    if (!facilityMap.has(key)) facilityMap.set(key, new Map());
                    facilityMap.get(key).set(r.serviceCode, r);
                }
                const rows = [...facilityMap.keys()].sort().map(fac => {
                    const cellMap = facilityMap.get(fac);
                    const cells = columns.map(col => {
                        const r = cellMap.get(col);
                        const cellClass = r ? `cell-${r.status.toLowerCase()}` : 'no-value';
                        const displayRate = r ? `$${r.rate.toLocaleString('en-US')}` : '—';
                        const displayOldRate = (r && r.status === 'Changed' && r.oldRate) ? `$${r.oldRate.toLocaleString('en-US')}` : '';
                        return { key: `${fac}-${col}`, displayRate, displayOldRate, unit: r ? r.unit : '', cellClass };
                    });
                    return { facility: fac, cells };
                });
                return { category: cat, columns, rows, count: rates.length };
            }
            return null;
        }).filter(g => g && g.count > 0);
    }

    get statusGroups() {
        const order = ['Changed', 'New', 'Deleted', 'Unchanged'];
        const rows = this.globalSearch ? this.allRows.filter(r => this.matchSearch(r)) : this.allRows;
        const map = new Map();
        for (const r of rows) {
            if (!map.has(r.status)) map.set(r.status, []);
            map.get(r.status).push(r);
        }
        return order.filter(s => map.has(s)).map(s => ({
            status: s,
            count: map.get(s).length,
            badgeClass: BADGE_CLASSES[s],
            showOldRate: s === 'Changed' || s === 'Deleted',
            rates: map.get(s).map(r => ({
                ...r,
                formattedOldRate: r.oldRate ? `$${r.oldRate.toLocaleString('en-US')}` : '—'
            }))
        }));
    }

    get facilityGroups() {
        const rows = this.globalSearch ? this.allRows.filter(r => this.matchSearch(r)) : this.allRows;
        const map = new Map();
        for (const r of rows) {
            if (!map.has(r.facility)) map.set(r.facility, []);
            map.get(r.facility).push(r);
        }
        return [...map.keys()].sort().map(f => ({
            facility: f,
            label: `${f} (${map.get(f).length})`,
            rates: map.get(f)
        }));
    }

    get hasDetailRow() {
        return this.selectedDetailRow != null;
    }

    get detailTitle() {
        if (!this.selectedDetailRow) return '';
        return `${this.selectedDetailRow.category} — ${this.selectedDetailRow.serviceCode} — ${this.selectedDetailRow.facility}`;
    }

    get detailFields() {
        if (!this.selectedDetailRow) return [];
        const r = this.selectedDetailRow;
        const fields = [
            { key: 'category', label: 'Category', value: r.category },
            { key: 'serviceCode', label: 'Service Code', value: r.serviceCode },
            { key: 'facility', label: 'Hospital', value: r.facility },
            { key: 'type', label: 'Provider Type', value: r.type },
            { key: 'tier', label: 'Network Tier', value: r.tier },
            { key: 'rate', label: 'Current Rate', value: `$${r.rate.toLocaleString('en-US')} ${r.unit}` },
            { key: 'status', label: 'Status', value: r.status }
        ];
        if (r.oldRate) fields.push({ key: 'oldRate', label: 'Previous Rate', value: `$${r.oldRate.toLocaleString('en-US')} ${r.unit}` });
        return fields.filter(f => f.value);
    }

    matchSearch(r) {
        if (!this.globalSearch) return true;
        const term = this.globalSearch.toLowerCase();
        const fields = [r.category, r.serviceCode, r.facility, r.type, r.tier, r.status, String(r.rate), r.unit];
        return fields.some(f => f && f.toLowerCase().includes(term));
    }

    handleGlobalSearch(event) {
        clearTimeout(this._searchDebounce);
        const val = event.target.value;
        this._searchDebounce = setTimeout(() => { this.globalSearch = val; }, 250);
    }

    handleCategoryFilter(event) {
        this.filterCategory = event.detail.value;
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
    }

    handleRowAction(event) {
        this.selectedDetailRow = event.detail.row;
    }

    handleCloseDetail() {
        this.selectedDetailRow = null;
    }

    handlePopupClick(event) {
        event.stopPropagation();
    }

    handleSave(event) {
        this.draftValues = [];
    }
}
