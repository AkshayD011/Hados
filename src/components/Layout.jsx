import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <main style={{ padding: '2rem', width: '100%' }}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
