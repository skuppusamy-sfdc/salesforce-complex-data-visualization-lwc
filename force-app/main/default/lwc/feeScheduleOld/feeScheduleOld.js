import { LightningElement } from 'lwc';

const SAMPLE_DATA = {
    categories: [
        {
            name: 'Inpatient',
            groups: [
                {
                    label: 'DRG 470 - Major Joint Replacement',
                    rates: [
                        { id: '1', facility: 'Mercy General Hospital', type: 'Specialist', rate: 4500, unit: 'per Procedure', status: 'Unchanged', oldRate: null },
                        { id: '2', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 4200, unit: 'per Procedure', status: 'Changed', oldRate: 3900 },
                        { id: '3', facility: 'Regional Health Partners', type: 'Primary Care', rate: 3800, unit: 'per Procedure', status: 'New', oldRate: null }
                    ]
                },
                {
                    label: 'DRG 291 - Heart Failure',
                    rates: [
                        { id: '4', facility: 'Mercy General Hospital', type: 'Specialist', rate: 3200, unit: 'per Procedure', status: 'Unchanged', oldRate: null },
                        { id: '5', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 3000, unit: 'per Procedure', status: 'Changed', oldRate: 2800 }
                    ]
                },
                {
                    label: 'DRG 392 - Esophagitis',
                    rates: [
                        { id: '6', facility: 'Mercy General Hospital', type: 'Primary Care', rate: 2100, unit: 'per Procedure', status: 'Unchanged', oldRate: null },
                        { id: '7', facility: 'Regional Health Partners', type: 'Primary Care', rate: 2000, unit: 'per Procedure', status: 'Deleted', oldRate: 2000 },
                        { id: '8', facility: 'St. Luke Medical Center', type: 'Primary Care', rate: 1950, unit: 'per Procedure', status: 'Unchanged', oldRate: null }
                    ]
                },
                {
                    label: 'DRG 194 - Simple Pneumonia',
                    rates: [
                        { id: '9', facility: 'Mercy General Hospital', type: 'Specialist', rate: 2800, unit: 'per Procedure', status: 'New', oldRate: null },
                        { id: '10', facility: 'St. Luke Medical Center', type: 'Primary Care', rate: 2600, unit: 'per Procedure', status: 'Changed', oldRate: 2400 }
                    ]
                }
            ]
        },
        {
            name: 'Outpatient',
            groups: [
                {
                    label: 'CPT 99213 - Office Visit Level 3',
                    rates: [
                        { id: '11', facility: 'Mercy General Hospital', type: 'Primary Care', rate: 150, unit: 'per Visit', status: 'Unchanged', oldRate: null },
                        { id: '12', facility: 'St. Luke Medical Center', type: 'Primary Care', rate: 145, unit: 'per Visit', status: 'Changed', oldRate: 130 },
                        { id: '13', facility: 'Regional Health Partners', type: 'Primary Care', rate: 140, unit: 'per Visit', status: 'Unchanged', oldRate: null }
                    ]
                },
                {
                    label: 'CPT 99214 - Office Visit Level 4',
                    rates: [
                        { id: '14', facility: 'Mercy General Hospital', type: 'Specialist', rate: 220, unit: 'per Visit', status: 'New', oldRate: null },
                        { id: '15', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 210, unit: 'per Visit', status: 'Unchanged', oldRate: null },
                        { id: '16', facility: 'Regional Health Partners', type: 'Specialist', rate: 200, unit: 'per Visit', status: 'Changed', oldRate: 180 }
                    ]
                },
                {
                    label: 'CPT 99215 - Office Visit Level 5',
                    rates: [
                        { id: '17', facility: 'Mercy General Hospital', type: 'Specialist', rate: 320, unit: 'per Visit', status: 'Unchanged', oldRate: null },
                        { id: '18', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 305, unit: 'per Visit', status: 'Deleted', oldRate: 305 }
                    ]
                }
            ]
        },
        {
            name: 'Professional Services',
            groups: [
                {
                    label: 'Emergency Medicine',
                    rates: [
                        { id: '19', facility: 'Mercy General Hospital', type: 'Surgeon', rate: 450, unit: 'per Hour', status: 'Changed', oldRate: 400 },
                        { id: '20', facility: 'St. Luke Medical Center', type: 'Surgeon', rate: 425, unit: 'per Hour', status: 'Unchanged', oldRate: null },
                        { id: '21', facility: 'Regional Health Partners', type: 'Specialist', rate: 380, unit: 'per Hour', status: 'New', oldRate: null }
                    ]
                },
                {
                    label: 'Radiology',
                    rates: [
                        { id: '22', facility: 'Mercy General Hospital', type: 'Specialist', rate: 350, unit: 'per Study', status: 'Unchanged', oldRate: null },
                        { id: '23', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 340, unit: 'per Study', status: 'Changed', oldRate: 310 }
                    ]
                },
                {
                    label: 'Anesthesia',
                    rates: [
                        { id: '24', facility: 'Mercy General Hospital', type: 'Specialist', rate: 85, unit: 'per Unit', status: 'Unchanged', oldRate: null },
                        { id: '25', facility: 'St. Luke Medical Center', type: 'Specialist', rate: 80, unit: 'per Unit', status: 'New', oldRate: null },
                        { id: '26', facility: 'Regional Health Partners', type: 'Specialist', rate: 78, unit: 'per Unit', status: 'Deleted', oldRate: 78 }
                    ]
                }
            ]
        }
    ]
};

export default class FeeScheduleOld extends LightningElement {
    get categories() {
        return SAMPLE_DATA.categories.map(cat => ({
            ...cat,
            groups: cat.groups.map(g => ({
                ...g,
                rates: g.rates.map(r => ({
                    ...r,
                    cardClass: this.getCardClass(r.status),
                    isChanged: r.status === 'Changed',
                    isDeleted: r.status === 'Deleted',
                    isNew: r.status === 'New',
                    formattedRate: `$${r.rate.toLocaleString('en-US')} ${r.unit}`,
                    formattedOldRate: r.oldRate ? `$${r.oldRate.toLocaleString('en-US')} ${r.unit}` : ''
                }))
            }))
        }));
    }

    getCardClass(status) {
        switch (status) {
            case 'Changed': return 'rate-card card-changed';
            case 'Deleted': return 'rate-card card-deleted';
            case 'New': return 'rate-card card-new';
            default: return 'rate-card';
        }
    }
}
