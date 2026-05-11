const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationsApi = {
    getAll: async () => {
        await delay(500);
        return [
            { id: 1, text: 'Your lost item (Wallet) has been found!', time: '10m ago', unread: true },
            { id: 2, text: 'Placement: Google SWE Intern deadline approaching.', time: '1h ago', unread: true },
            { id: 3, text: 'Mailer Daemon posted a new announcement.', time: '2h ago', unread: false }
        ];
    }
};
