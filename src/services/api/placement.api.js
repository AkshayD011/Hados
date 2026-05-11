const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const placementApi = {
    getUpdates: async () => {
        await delay(900);
        return [
            { id: 1, company: 'Google', role: 'SWE Intern', deadline: 'Oct 15, 2026', ctc: 'Stipend: ₹1.5L/mo' },
            { id: 2, company: 'Microsoft', role: 'FTE SDE', deadline: 'Oct 20, 2026', ctc: '₹45 LPA' },
            { id: 3, company: 'TCS', role: 'Digital Profile', deadline: 'Nov 1, 2026', ctc: '₹7 LPA' }
        ];
    }
};
